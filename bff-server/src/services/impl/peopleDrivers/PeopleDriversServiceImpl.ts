/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import { inject, injectable } from 'inversify';

import { Dependencies } from '../../../Dependencies';
import { RequestContext } from '../../../server';
import { Database } from '../../interfaces/Database';
import {
  PeopleDriversService,
  RequisitionStage,
} from '../../interfaces/PeopleDriversService';

@injectable()
export class PeopleDriversServiceImpl implements PeopleDriversService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  async getRequisitionInfo(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{
      readonly requisitionStage: RequisitionStage;
      readonly noOfCandidates: number;
    }>
  > {
    const values = [
      context.user.tenantId,
      context.user.userId,
      startDate,
      endDate,
    ];
    const response = (await this.db.runQueryFromFile(
      'peopleDrivers/requisitionInfo.sql',
      values,
      context
    )) as ReadonlyArray<{
      readonly requisitionStage: string;
      readonly noOfCandidates: string;
    }>;
    return response.map(({ requisitionStage, noOfCandidates }) => ({
      requisitionStage: RequisitionStage[requisitionStage.trimRight().toUpperCase()],
      noOfCandidates: parseInt(noOfCandidates),
    }));
  }

  async getRequiredCandidates(
    _: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<number> {
    const values = [context.user.tenantId, context.user.userId, endDate];
    const response = (await this.db.runQueryFromFile(
      'peopleDrivers/totalRequisitions.sql',
      values,
      context
    )) as ReadonlyArray<{ readonly totalReqs: string }>;

    return Promise.resolve(parseInt(response[0].totalReqs));
  }

  async getCompetenciesInfo(
    _: Date,
    __: Date,
    userId: string,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{ readonly ratingName: string; readonly ratingValue: number }>
  > {
    const values = [
      userId === '' ? context.user.userId : userId,
      context.user.tenantId,
    ];
    const response = (await this.db.runQueryFromFile(
      'peopleDrivers/competencies.sql',
      values,
      context
    )) as ReadonlyArray<{
      readonly competency: string;
      readonly score: string;
      readonly mgrScore: string;
    }>;
    var res = response.map((r) => ({
      ratingName: r.competency,
      ratingValue: r.mgrScore ? parseFloat(r.mgrScore) : 0,
    }));
    res = this.sortSpecial(res);
    return res;
  }

  sortSpecial(arr) {
    var presetOrder = ['Technical Skills', 'Strategy', 'Communication', 'Closing Skills', 'Product Knowledge'];
    var result = [],
      i, j;
    for (i = 0; i < presetOrder.length; i++)
      while (-1 != (j = arr.map(e => e.ratingName).indexOf(presetOrder[i])))
        result.push(arr.splice(j, 1)[0]);
    return result.concat(arr);
  }

  async getAttrition(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<{
    readonly rateInCurrentQuarter: number;
    readonly rateInSameQuarterPreviousYear: number;
  }> {
    const startDateOfSameQuarterInPreviousYear = new Date(startDate.getTime());
    startDateOfSameQuarterInPreviousYear.setFullYear(
      startDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );
    const endDateOfSameQuarterInPreviousYear = new Date(endDate.getTime());
    endDateOfSameQuarterInPreviousYear.setFullYear(
      endDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const values = [
      startDate,
      endDate,
      startDateOfSameQuarterInPreviousYear,
      endDateOfSameQuarterInPreviousYear,
      context.user.tenantId,
      context.user.userId,
    ];

    const response = await this.db.runQueryFromFile(
      'peopleDrivers/attritionRate.sql',
      values,
      context
    );
    const returnValue = {
      rateInCurrentQuarter: 0,
      rateInSameQuarterPreviousYear: 0,
    };

    if (response && response.length) {
      const {
        termedUsersInCurrentMonth,
        activeUsersInCurrentMonth,
        termedUsersInPreviousMonth,
        activeUsersInPreviousMonth,
      } = response[0];

      if (
        !isNaN(termedUsersInCurrentMonth) &&
        !isNaN(activeUsersInCurrentMonth) &&
        parseInt(activeUsersInCurrentMonth) > 0
      ) {
        returnValue.rateInCurrentQuarter =
          (parseInt(termedUsersInCurrentMonth) /
            (parseInt(activeUsersInCurrentMonth) +
              parseInt(termedUsersInCurrentMonth))) *
          100;
      }
      if (
        !isNaN(termedUsersInPreviousMonth) &&
        !isNaN(activeUsersInPreviousMonth) &&
        parseInt(activeUsersInPreviousMonth) > 0
      ) {
        returnValue.rateInSameQuarterPreviousYear =
          (parseInt(termedUsersInPreviousMonth) /
            (parseInt(activeUsersInPreviousMonth) +
              parseInt(termedUsersInPreviousMonth))) *
          100;
      }
    }
    return returnValue;
  }

  async getAvgTimeToHire(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<number> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = await this.db.runQueryFromFile(
      'peopleDrivers/avgTimeToHire.sql',
      values,
      context
    );
    return response && response.length && response[0].avgTimeToHire
      ? parseInt(response[0].avgTimeToHire, 10)
      : 0;
  }

  async getDiversity(
    endDate: Date,
    context: RequestContext
  ): Promise<{
    readonly noOfMale: number;
    readonly noOfFemale: number;
    readonly total: number;
    readonly targetYear: number;
    readonly targetCount: number;
  }> {
    const values = [endDate, context.user.tenantId];
    const response = await this.db.runQueryFromFile(
      'peopleDrivers/diversity.sql',
      values,
      context
    );
    if (response && response.length) {
      return {
        noOfFemale: response[0].noOfFemale
          ? parseInt(response[0].noOfFemale)
          : 0,
        noOfMale: response[0].noOfMale ? parseInt(response[0].noOfMale) : 0,
        targetCount: 45,
        targetYear: new Date().getFullYear() + 1,
        total: response[0].total ? parseInt(response[0].total) : 0,
      };
    } else {
      return Promise.reject('Database returned no rows');
    }
  }

  async getSpanLevel(
    endDate: Date,
    context: RequestContext
  ): Promise<{ readonly span: number; readonly level: number }> {
    const values = [context.user.userId, context.user.tenantId, endDate];
    const response = await this.db.runQueryFromFile(
      'peopleDrivers/spanLevel.sql',
      values,
      context
    );
    let span = 0;
    let level = 0;
    if (response[0].span) {
      span = parseInt(response[0].span);
    }
    if (response[0].level) {
      level = parseInt(response[0].level);
    }
    return {
      span,
      level,
    };
  }

  async getMyTeam(
    context: RequestContext
  ): Promise<{
    readonly userId: string;
    readonly personaCount: ReadonlyArray<{
      readonly persona: string;
      readonly count: number;
    }>;
  }> {
    const response = await this.db.runQueryFromFile(
      'peopleDrivers/userHierarchyCount.sql',
      [context.user.userId, context.user.tenantId],
      context
    );

    if (response && response.length) {
      return {
        userId: context.user.userId,
        personaCount: response,
      };
    } else {
      return Promise.reject('Database returned no rows');
    }
  }
}
