/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable functional/no-class */
import { inject, injectable } from 'inversify';
import moment from 'moment';
// import { config } from 'node-config-ts';

import { Dependencies } from '../../../Dependencies';
import { RequestContext } from '../../../server';
import { Database } from '../../interfaces/Database';
import {
  OKRSummaryOutput,
  RepDashboardService,
} from '../../interfaces/RepDashboardService';

@injectable()
export class RepDashboardServiceImpl implements RepDashboardService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  async getRewards(
    _startDate: Date,
    _endDate: Date,
    context: RequestContext
  ): Promise<{
    readonly commissionStructure: readonly {
      readonly threshold: number;
      readonly rate: number;
      readonly value: number;
    }[];
    readonly commissionCases: {
      readonly myDeals: readonly {
        readonly name: string;
        readonly label: string;
      }[];
      readonly jointSelling: readonly {
        readonly name: string;
        readonly label: string;
      }[];
    };
  }> {
    const response = await this.db.runQueryFromFile(
      'repDashboard/commissionStructure.sql',
      [context.user.tenantId],
      context
    );

    const resultObj = response.map((r) => ({
      threshold: r.threshold,
      rate: r.rate,
      value: r.value,
    }));

    const myDealsObbj = [
      {
        name: 'Workday (Q4 Week 6)',
        label: 'In Progress',
      },
      {
        name: 'Agora (Q3 Week 13)',
        label: 'Paid',
      },
    ];

    const jointSellingObj = [
      {
        name: 'Twilio (Q4 Week 6) ',
        label: 'In Progress',
      },
      {
        name: 'Okta (Q3 Week 12)',
        label: 'Paid',
      },
    ];

    return {
      commissionStructure: resultObj,
      commissionCases: {
        myDeals: myDealsObbj,
        jointSelling: jointSellingObj,
      },
    };
  }

  async getEarnings(
    startDate: Date,
    endDate: Date,
    thresholdValue: number,
    context: RequestContext
  ): Promise<{
    readonly equity: {
      readonly vestedAmount: number;
      readonly vestedShares: number;
      readonly remainingAmount: number;
      readonly remainingShares: number;
    };
    readonly annualComp: {
      readonly base: number;
      readonly commission: number;
      readonly vestedEquity: number;
      readonly rate: number;
      readonly rank: number;
    };
    readonly myScenarios: {
      readonly daysToClose: number;
    };
    readonly demoMode: {
      isDemoMode: boolean;
    };
  }> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = await this.db.runQueryFromFile(
      'repDashboard/equity.sql',
      [context.user.tenantId, context.user.userId, endDate],
      context
    );

    const response1 = await this.db.runQueryFromFile(
      'repDashboard/annualComp.sql',
      values,
      context
    );

    const response2 = (await this.db.runQueryFromFile(
      'repDashboard/getCommissionAndRate.sql',
      [context.user.tenantId],
      context
    )) as ReadonlyArray<{
      readonly rate: string;
      readonly threshold: string;
    }>;

    let commission = 0;
    let rate = 0;

    let previousRate = 0;

    if (response2.length > 0 && response1.length > 0) {
      for (const element of response2) {
        if (
          parseInt(response1[0].totalSalesClosed) >=
          parseInt(element.threshold) / thresholdValue
        ) {
          commission =
            (previousRate / 100) * parseInt(response1[0].totalSalesClosed);
          rate = previousRate;
          break;
        } else {
          previousRate = parseInt(element.rate);
        }
      }
    }
    let resultObj;
    if (response.length > 0) {
      resultObj = {
        vestedAmount: response[0].vestedAmount ? response[0].vestedAmount : 0,
        vestedShares: response[0].vestedShares,
        remainingAmount: response[0].remainingAmount,
        remainingShares: response[0].remainingShares,
      };
    } else {
      resultObj = {
        vestedAmount: 0,
        vestedShares: 0,
        remainingAmount: 0,
        remainingShares: 0,
      };
    }

    let annualCompResultObj;
    if (response1.length > 0) {
      annualCompResultObj = {
        base: response1[0].base,
        commission: commission,
        vestedEquity: resultObj.vestedAmount,
        rate: rate,
        rank: 3,
      };
    } else {
      annualCompResultObj = {
        base: 0,
        commission: 0,
        vestedEquity: 0,
        rate: 0,
        rank: 0,
      };
    }

    return {
      equity: resultObj,
      annualComp: annualCompResultObj,
      myScenarios: {
        daysToClose: 21,
      },
      demoMode: {
        isDemoMode: false,
      },
    };
  }

  async getMyLearning(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<
    readonly {
      readonly course: string;
      readonly assessmentScore: number;
      readonly courseDate: string;
      readonly courseStatus: string;
    }[]
  > {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = (await this.db.runQueryFromFile(
      'repDashboard/myLearningCompletedCourses.sql',
      values,
      context
    )) as ReadonlyArray<{
      readonly course: string;
      readonly assessmentScore: number;
      readonly courseDate: Date;
    }>;
    const response1 = (await this.db.runQueryFromFile(
      'repDashboard/myLearningUpcomingCourses.sql',
      values,
      context
    )) as ReadonlyArray<{
      readonly course: string;
      readonly courseDate: Date;
    }>;

    const data = [
      {
        course: '',
        assessmentScore: 0,
        courseDate: '',
        courseStatus: 'completed',
      },
      {
        course: '',
        assessmentScore: 0,
        courseDate: '',
        courseStatus: 'completed',
      },
      {
        course: '',
        assessmentScore: 0,
        courseDate: '',
        courseStatus: 'upcoming',
      },
      {
        course: '',
        assessmentScore: 0,
        courseDate: '',
        courseStatus: 'upcoming',
      },
    ];

    response.forEach((r, index) => {
      data[index].course = r.course;
      data[index].assessmentScore = r.assessmentScore ? r.assessmentScore : 0;
      data[index].courseDate = moment(r.courseDate).utc().format('MMM D, YYYY');
    });
    response1.forEach((r, index) => {
      data[index + 2].course = r.course;
      data[index + 2].assessmentScore = 0;
      data[index + 2].courseDate = moment(r.courseDate)
        .utc()
        .format('MMM D, YYYY');
    });
    return data.map((r) => ({
      course: r.course,
      assessmentScore: r.assessmentScore ? r.assessmentScore : 0,
      courseDate: r.courseDate,
      courseStatus: r.courseStatus,
    }));
  }

  async getPipeline(
    startDate: Date,
    endDate: Date,
    _context?: RequestContext
  ): Promise<
    ReadonlyArray<{
      readonly customer: string;
      readonly opportunity: number;
      readonly closedDate: Date;
      readonly status: string;
      readonly relationship: string;
      readonly decisionMaker: string;
      readonly myNextStep: string;
    }>
  > {
    const startDateOfPreviousYear = new Date(startDate.getTime());

    startDateOfPreviousYear.setMonth(startDateOfPreviousYear.getMonth() - 12);

    const endDateOfPreviousYear = new Date(startDate);
    endDateOfPreviousYear.setSeconds(endDateOfPreviousYear.getSeconds() - 1);

    const values = [
      startDate,
      endDate,
    ];
    const response = await this.db.runQuery(
      'meeting/newPipeline.sql',
      values
    );

    return response.map((r) => ({
      customer: r.customer,
      // opportunity: r.amount ? r.amount : 0,
      opportunity: r.opportunity ? r.opportunity : 0,
      closedDate: r.closedDate,
      status: r.status,
      relationship: r.relationship,
      decisionMaker: r.decisionMaker,
      myNextStep: r.myNextStep,
    }));
  }

  async getSalesOKR(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{
      readonly title: string;
      readonly value: ReadonlyArray<{
        readonly title: string;
        readonly value: string;
      }>;
    }>
  > {

    let newStartDate = new Date(startDate);
    let newEndDate = new Date(endDate);

    newStartDate.setFullYear(newStartDate.getFullYear() - 1);
    newEndDate.setFullYear(newEndDate.getFullYear() - 1);

    let values = [
      newStartDate,
      newEndDate,
      context.user.tenantId,
      context.user.userId
    ];

    let response = (await this.db.runQueryFromFile(
      'salesOutcome/totalSalesClosed.sql',
      values,
      context
    )) as ReadonlyArray<{
      readonly totalSalesClosed: number;
      readonly existingTotalSalesClosed: number;
    }>;

    // if (response[0].totalSalesClosed == null) {
    //   let getMonth = startDate.getMonth();


    //   if (getMonth <= 2) {
    //     startDate.setFullYear(startDate.getFullYear() - 1);
    //     endDate.setFullYear(endDate.getFullYear() - 1);

    //     startDate.setMonth(9);
    //     endDate.setMonth(12);
    //   } else if (getMonth => 3 && getMonth <= 5) {
    //     console.log("3 to 5")
    //     startDate.setMonth(0);
    //     endDate.setMonth(3);
    //   } else if (getMonth => 6 && getMonth <= 8) {
    //     startDate.setMonth(3);
    //     endDate.setMonth(6);
    //   } else if (getMonth => 9 && getMonth <= 11) {
    //     startDate.setMonth(6);
    //     endDate.setMonth(9);
    //   }

    //   values = [
    //     startDate,
    //     endDate,
    //     context.user.tenantId,
    //     context.user.userId
    //   ];

    //   response = (await this.db.runQueryFromFile(
    //     'salesOutcome/totalSalesClosed.sql',
    //     values,
    //     context
    //   )) as ReadonlyArray<{
    //     readonly totalSalesClosed: number;
    //     readonly existingTotalSalesClosed: number;
    //   }>;

    // }
    values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId
    ];

    response = (await this.db.runQueryFromFile(
      'salesOutcome/totalSalesClosed.sql',
      values,
      context
    )) as ReadonlyArray<{
      readonly totalSalesClosed: number;
      readonly existingTotalSalesClosed: number;
    }>;



    let booking: any = 0.1 * (response[0].totalSalesClosed);  //calculating 10% of value
    // booking = (booking + response[0].totalSalesClosed)
    // booking = booking == 0 ? '990' : Math.ceil(booking);
    booking = '1,000';

    // To be pulled for a system / file in the future
    const okrName = [
      { title: 'Activity', value: [{ title: 'Activity', value: '75%' }] },
      {
        title: 'Effectiveness',
        value: [
          { title: 'Win Rate', value: '25%' },
          { title: 'Quota Attainment', value: '75%' },
          { title: 'Sales Cycle (Days)', value: '180' },
          { title: 'Portfolio Presented', value: '75%' },
        ],
      },
      {
        title: 'Customer',
        value: [
          { title: 'New Logo', value: '5' },
          { title: 'Customer Retention', value: '90%' },
          { title: 'NPS', value: '75' },
        ],
      },
      { title: 'Outcome', value: [{ title: 'Bookings ($ 000)', value: `${booking}` }] },
    ];
    return okrName;
  }

  async getOKRSummary(
    _: Date,
    __: Date,
    context: RequestContext
  ): Promise<OKRSummaryOutput> {
    const values = [context.user.userId, context.user.tenantId];
    const response = (await this.db.runQueryFromFile(
      'peopleDrivers/competencies.sql',
      values,
      context
    )) as ReadonlyArray<{
      readonly competency: string;
      readonly score: string;
      readonly mgrScore: string;
    }>;
    let cyValues = response.map((r) => ({
      title: r.competency,
      selfScore: r.score ? parseFloat(r.score) : 0,
      managerScore: r.mgrScore ? parseFloat(r.mgrScore) : 0,
    }));
    cyValues = this.sortSpecial(cyValues);

    const res = {
      rating: 4,
      competency: [
        {
          name: 'Competency',
          values: cyValues,
        },
        {
          name: 'Development Needs',
          values: [
            { title: 'Domain Expertise', managerScore: 2, selfScore: 2.5 },
            { title: 'Problem Solving', managerScore: 2, selfScore: 2.5 },
          ],
        },
      ],
    };

    return res;
  }
  sortSpecial(arr) {
    var presetOrder = ['Technical Skills', 'Strategy', 'Communication', 'Closing Skills', 'Product Knowledge'];
    var result = [],
      i, j;
    for (i = 0; i < presetOrder.length; i++)
      while (-1 != (j = arr.map(e => e.title).indexOf(presetOrder[i])))
        result.push(arr.splice(j, 1)[0]);
    return result.concat(arr);
  }
}
