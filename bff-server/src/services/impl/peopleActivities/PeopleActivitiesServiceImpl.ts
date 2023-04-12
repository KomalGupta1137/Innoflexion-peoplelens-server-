/* eslint-disable functional/no-let */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import { inject, injectable } from 'inversify';
import { dealfunnelData } from './dealFunnelData';
import { Dependencies } from '../../../Dependencies';
import { RequestContext } from '../../../server';
import { Database } from '../../interfaces/Database';
import {
  ObjectiveScore,
  TimeAllocationScore,
  PipelineDisciplineScore,
  FollowThrough,
  PeopleActivitiesService,
  AccountCoverage,
  untouchedOpps,
  // RepTimeAllocation,
  DealFunnel,
  DemoMode,
} from '../../interfaces/PeopleActivitiesService';
import { config } from 'node-config-ts';
// import * as faker from 'faker';

@injectable()
export class PeopleActivitiesServiceImpl implements PeopleActivitiesService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  async getObjectiveScore(
    startDate: Date,
    endDate: Date,
    userId: string,
    persona: string,
    context: RequestContext
  ): Promise<ObjectiveScore> {
    let personaValues = [];
    if (persona === '') {
      let response1 = await this.db.runQueryFromFile(
        'peopleDrivers/userHierarchyCount.sql',
        [context.user.userId, context.user.tenantId],
        context
      );
      personaValues = this.getPersonaValues(response1);
    } else {
      personaValues.push(persona);
    }

    const currentValues = [
      startDate,
      endDate,
      userId ? userId : context.user.userId,
      context.user.tenantId,
      // personaValues,
    ];

    const startDateOfSameQuarterInPreviousYear = new Date(startDate.getTime());
    startDateOfSameQuarterInPreviousYear.setFullYear(
      startDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const endDateOfSameQuarterInPreviousYear = new Date(endDate.getTime());
    endDateOfSameQuarterInPreviousYear.setFullYear(
      endDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const previousValues = [
      startDateOfSameQuarterInPreviousYear,
      endDateOfSameQuarterInPreviousYear,
      userId ? userId : context.user.userId,
      context.user.tenantId,
      // personaValues,
    ];

    let response = await this.db.runQueryFromFile(
      'peopleActivities/objectiveScore.sql',
      currentValues,
      context
    );

    const currentValue = this.calculateObjectiveOrTimeAllocationScore(
      response,
      'objective'
    );

    response = await this.db.runQueryFromFile(
      'peopleActivities/objectiveScore.sql',
      previousValues,
      context
    );

    const previousValue = this.calculateObjectiveOrTimeAllocationScore(
      response,
      'objective'
    );

    const benchMark = config.objectiveScore.benchMark;

    let objectiveScore = {
      curQuarterVal: currentValue ? currentValue.toFixed(2).toString() : '0',
      prevQuarterVal: previousValue ? previousValue.toFixed(2).toString() : '0',
      benchMark,
    };

    return objectiveScore;
  }

  async getTimeAllocationScore(
    startDate: Date,
    endDate: Date,
    userId: string,
    persona: string,
    context: RequestContext
  ): Promise<TimeAllocationScore> {
    let personaValues = [];
    if (persona == undefined) {
      let response1 = await this.db.runQueryFromFile(
        'peopleDrivers/userHierarchyCount.sql',
        [context.user.userId, context.user.tenantId],
        context
      );
      personaValues = this.getPersonaValues(response1);
    } else {
      personaValues.push(persona);
    }

    const currentValues = [
      startDate,
      endDate,
      userId ? userId : context.user.userId,
      context.user.tenantId,
      // personaValues,
    ];

    const startDateOfSameQuarterInPreviousYear = new Date(startDate.getTime());
    startDateOfSameQuarterInPreviousYear.setFullYear(
      startDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const endDateOfSameQuarterInPreviousYear = new Date(endDate.getTime());
    endDateOfSameQuarterInPreviousYear.setFullYear(
      endDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const previousValues = [
      startDateOfSameQuarterInPreviousYear,
      endDateOfSameQuarterInPreviousYear,
      userId ? userId : context.user.userId,
      context.user.tenantId,
      // personaValues,
    ];

    let response = await this.db.runQueryFromFile(
      'peopleActivities/objectiveScore.sql',
      currentValues,
      context
    );

    const currentValue = this.calculateObjectiveOrTimeAllocationScore(
      response,
      'time'
    );

    response = await this.db.runQueryFromFile(
      'peopleActivities/objectiveScore.sql',
      previousValues,
      context
    );

    const previousValue = this.calculateObjectiveOrTimeAllocationScore(
      response,
      'time'
    );

    const benchMark = config.timeAllocation.benchMark;

    let timeAllocationScore = {
      curQuarterVal: currentValue ? currentValue.toFixed(2).toString() : '0',
      prevQuarterVal: previousValue ? previousValue.toFixed(2).toString() : '0',
      benchMark,
    };

    return timeAllocationScore;
  }

  async getPipelineDisciplineScore(
    startDate: Date,
    endDate: Date,
    userId: string,
    persona: string,
    context: RequestContext
  ): Promise<PipelineDisciplineScore> {
    let personaValues = [];
    if (persona === '') {
      let response1 = await this.db.runQueryFromFile(
        'peopleDrivers/userHierarchyCount.sql',
        [context.user.userId, context.user.tenantId],
        context
      );
      personaValues = this.getPersonaValues(response1);
    } else {
      personaValues.push(persona);
    }
    let user_id = userId ? userId : context.user.userId
    let pdCurrentValue = 0;
    let pdPreviousValue = 0;
    let curQuarterVal = await this.getTimeAllocationScore(startDate, endDate, user_id, persona, context);
    console.log(curQuarterVal.curQuarterVal);
    let opps = await this.db.runQueryFromFile(
      'peopleActivities/getTotalOpps.sql',
      [
        startDate,
        endDate,
        context.user.tenantId,
        userId ? userId : context.user.userId,
      ],
      context
    );
    opps[0].avg == null ? 30 : opps[0].avg;
    pdCurrentValue = (parseInt(curQuarterVal.curQuarterVal) / parseInt(opps[0].avg)) * 100;

    const startDateOfSameQuarterInPreviousYear = new Date(startDate.getTime());
    startDateOfSameQuarterInPreviousYear.setFullYear(
      startDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const endDateOfSameQuarterInPreviousYear = new Date(endDate.getTime());
    endDateOfSameQuarterInPreviousYear.setFullYear(
      endDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    let prevQuarterVal = await this.getTimeAllocationScore(startDateOfSameQuarterInPreviousYear, endDateOfSameQuarterInPreviousYear, user_id, persona, context);
    opps = await this.db.runQueryFromFile(
      'peopleActivities/getTotalOpps.sql',
      [
        startDateOfSameQuarterInPreviousYear,
        endDateOfSameQuarterInPreviousYear,
        context.user.tenantId,
        userId ? userId : context.user.userId,
      ],
      context
    );
    opps[0].avg == null ? 30 : opps[0].avg;
    pdPreviousValue = (parseInt((prevQuarterVal).prevQuarterVal) / parseInt(opps[0].avg)) * 100;

    const benchMark = config.pipelineDiscipline.benchMark;

    let pipelineScore = {
      curQuarterVal: pdCurrentValue
        ? pdCurrentValue.toFixed(2).toString()
        : '0',
      prevQuarterVal: pdPreviousValue
        ? pdPreviousValue.toFixed(2).toString()
        : '0',
      benchMark,
    };
    return pipelineScore;
  }

  getPersonaValues(personaDataArray: any[]) {
    let personaValues = [];
    personaDataArray.forEach(function (arrayItem) {
      personaValues.push(arrayItem.persona);
    });

    return personaValues;
  }

  calculateObjectiveOrTimeAllocationScore(
    array: any[],
    objectiveOrTimeAllocation: string
  ) {
    if (array.length == 0) {
      return 0;
    }

    let totalCount = 0;
    let weightedCount = 0;

    if (objectiveOrTimeAllocation === 'objective') {
      array.forEach(function (arrayItem) {
        const count = parseInt(arrayItem.activity_count);
        const activity = arrayItem.activity_type;
        switch (activity) {
          case 'task':
            weightedCount = weightedCount + config.objectiveScore.task * count;
            totalCount = totalCount + count;
            break;
          case 'email':
            weightedCount = weightedCount + config.objectiveScore.email * count;
            totalCount = totalCount + count;
            break;
          case 'calls':
            weightedCount = weightedCount + config.objectiveScore.call * count;
            totalCount = totalCount + count;
            break;
          case 'customer_meeting_demo':
          case 'customer_meeting_decisionmaker':
          case 'customer_meeting_discovery':
            weightedCount =
              weightedCount + config.objectiveScore.customer_meeting * count;
            totalCount = totalCount + count;
            break;
          case 'internal_meeting':
            weightedCount =
              weightedCount + config.objectiveScore.internal_meeting * count;
            totalCount = totalCount + count;
            break;
          case 'product_meeting':
            weightedCount =
              weightedCount + config.objectiveScore.product_meeting * count;
            totalCount = totalCount + count;
            break;
        }
      });
    } else {
      array.forEach(function (arrayItem) {
        const count = parseInt(arrayItem.activity_count);
        const activity = arrayItem.activity_type;
        switch (activity) {
          case 'task':
            weightedCount = weightedCount + config.objectiveScore.task * count;
            totalCount = totalCount + count;
            break;
          case 'email':
            weightedCount = weightedCount + config.objectiveScore.email * count;
            totalCount = totalCount + count;
            break;
          case 'calls':
            weightedCount = weightedCount + config.objectiveScore.call * count;
            totalCount = totalCount + count;
            break;
          case 'customer_meeting_demo':
          case 'customer_meeting_decisionmaker':
          case 'customer_meeting_discovery':
            weightedCount =
              weightedCount + config.timeAllocation.customer_meeting * count;
            totalCount = totalCount + count;
            break;
        }
      });
    }

    if (totalCount > 0) {
      return (weightedCount / totalCount) * 100;
    } else {
      return 0;
    }
  }

  async getFollowThrough(
    startDate: Date,
    endDate: Date,
    userId: string,
    persona: string,
    context: RequestContext
  ): Promise<FollowThrough> {
    let personaValues = [];
    if (persona === '') {
      let response1 = await this.db.runQueryFromFile(
        'peopleDrivers/userHierarchyCount.sql',
        [context.user.userId, context.user.tenantId],
        context
      );
      personaValues = this.getPersonaValues(response1);
    } else {
      personaValues.push(persona);
    }

    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      userId ? userId : context.user.userId,
    ];

    const currResponse = (await this.db.runQueryFromFile(
      'peopleActivities/followThrough.sql',
      values,
      context
    ));

    const startDateOfSameQuarterInPreviousYear = new Date(startDate.getTime());

    startDateOfSameQuarterInPreviousYear.setFullYear(
      startDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const endDateOfSameQuarterInPreviousYear = new Date(endDate.getTime());
    endDateOfSameQuarterInPreviousYear.setFullYear(
      endDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const valuesNew = [
      startDateOfSameQuarterInPreviousYear,
      endDateOfSameQuarterInPreviousYear,
      context.user.tenantId,
      userId ? userId : context.user.userId,
    ];

    const prevResponse = (await this.db.runQueryFromFile(
      'peopleActivities/followThrough.sql',
      valuesNew,
      context
    ));

    const benchMark = config.followThroughPriority.benchMark;
    let followThrough = {
      curQuarterVal: currResponse[0].fur ? parseInt(currResponse[0].fur).toFixed(2) : '0',
      prevQuarterVal: prevResponse[0].fur ? parseInt(prevResponse[0].fur).toFixed(2) : '0',
      benchMark,
    };

    return followThrough;
  }

  async getAccountCoverage(
    startDate: Date,
    endDate: Date,
    rootUser: string,
    context: RequestContext
  ): Promise<AccountCoverage> {
    const values = [startDate, endDate, rootUser, context.user.tenantId];
    const currResponse = (await this.db.runQueryFromFile(
      'peopleActivities/accountCoverage.sql',
      values,
      context
    ));

    let accCvg = 0;
    let okrAC = 0;
    startDate.getMonth() == 0 && endDate.getMonth() == 12 ? okrAC = 80 : (startDate.getMonth() == 0 && endDate.getMonth() == 11 || endDate.getMonth() == 0) ? okrAC = 80 : okrAC = 20;
    accCvg =
      (currResponse[0] && currResponse[0].coverage / okrAC) * 100;

    const benchMark = config.accountCoverage.benchMark;

    const accountCoverage = {
      curQuarterVal: accCvg,
      prevQuarterVal: accCvg,
      benchMark,
    };

    return accountCoverage;
  }

  async getUntouchedOpps(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<untouchedOpps> {
    const currentValues = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];

    const startDateOfSameWeekInPreviousYear = new Date(startDate.getTime());
    startDateOfSameWeekInPreviousYear.setFullYear(
      startDateOfSameWeekInPreviousYear.getFullYear() - 1
    );

    const endDateOfSameWeekInPreviousYear = new Date(endDate.getTime());
    endDateOfSameWeekInPreviousYear.setFullYear(
      endDateOfSameWeekInPreviousYear.getFullYear() - 1
    );

    const previousValues = [
      startDateOfSameWeekInPreviousYear,
      endDateOfSameWeekInPreviousYear,
      context.user.tenantId,
      context.user.userId,
    ];
    const currentValue = await this.db.runQueryFromFile(
      'peopleActivities/untouchedOpps.sql',
      currentValues,
      context
    );

    const previousValue = await this.db.runQueryFromFile(
      'peopleActivities/untouchedOpps.sql',
      previousValues,
      context
    );

    const benchMark = config.untouchedOpps.benchMark;

    let untouchedOppsObject = {
      curVal: currentValue[0].untouchedopportunities
        ? parseFloat(currentValue[0].untouchedopportunities)
          .toFixed(2)
          .toString()
        : '0',
      prevVal: previousValue[0].untouchedopportunities
        ? parseFloat(previousValue[0].untouchedopportunities)
          .toFixed(2)
          .toString()
        : '0',
      benchMark,
    };

    // mock forrepLens
    // if (context.repMock) {
    //   untouchedOppsObject = {
    //     curVal: faker.datatype
    //       .number({
    //         min: 4,
    //         max: 7,
    //       })
    //       .toString(),
    //     prevVal: '3',
    //     benchMark,
    //   };
    // }

    return untouchedOppsObject;
  }

  async getTimeAllocation(
    userId: string,
    startDate: Date,
    endDate: Date,
    week: number
  ): Promise<any> {
    console.log(userId);
    let resObj = {
      customerMeetings: 0,
      productMeetings: 0,
      internalTeamMeetings: 0,
    };
    let res = await this.getRepTimeAllocation(startDate, endDate);
    const promises = res.map(async (r) => {
      if (r.type == 'Customer')
        resObj.customerMeetings = resObj.customerMeetings + parseFloat(r.duration);
      else if (r.type == 'Internal Team') {
        let values = [...new Set(r.attendees.map((item) => item.id))];
        let isSameTeam = await this.db.runQuery(
          'peopleActivities/isSameTeam.sql',
          [values]
        );
        isSameTeam[0].same_team
          ? (resObj.internalTeamMeetings =
            resObj.internalTeamMeetings + parseFloat(r.duration))
          : (resObj.productMeetings = resObj.productMeetings + parseFloat(r.duration));
      }
    });
    await Promise.all(promises);
    let resultObj = {};
    if (week == 1) {
      resultObj = {
        customerMeetings: 24,
        productMeetings: 8,
        internalTeamMeetings: 4,
        total: 40,
      };
    }
    if (week == 2) {
      resultObj = {
        customerMeetings: 24.4,
        productMeetings: 7.6,
        internalTeamMeetings: 4.4,
        total: 40,
      };
    }
    if (week == 3) {
      resultObj = {
        customerMeetings: 24.8,
        productMeetings: 7.2,
        internalTeamMeetings: 4.8,
        total: 40,
      };
    }
    if (week == 4) {
      resultObj = {
        customerMeetings: 25.2,
        productMeetings: 6.8,
        internalTeamMeetings: 5.2,
        total: 40,
      };
    }
    if (week == 5) {
      resultObj = {
        customerMeetings: 25.6,
        productMeetings: 6.4,
        internalTeamMeetings: 3.6,
        total: 40,
      };
    }
    if (week == 6) {
      resultObj = {
        customerMeetings: 26,
        productMeetings: 6,
        internalTeamMeetings: 3.2,
        total: 40,
      };
    }
    if (week == 7) {
      resultObj = {
        customerMeetings: 26.4,
        productMeetings: 5.6,
        internalTeamMeetings: 2.8,
        total: 40,
      };
    }
    if (week == 8) {
      resultObj = {
        customerMeetings: 26.8,
        productMeetings: 5.2,
        internalTeamMeetings: 2.8,
        total: 40,
      };
    }
    if (week == 9) {
      resultObj = {
        customerMeetings: 27.2,
        productMeetings: 4.8,
        internalTeamMeetings: 3.2,
        total: 40,
      };
    }
    if (week == 10) {
      resultObj = {
        customerMeetings: 27.6,
        productMeetings: 4.4,
        internalTeamMeetings: 3.6,
        total: 40,
      };
    }
    if (week == 11) {
      resultObj = {
        customerMeetings: 28,
        productMeetings: 4,
        internalTeamMeetings: 4,
        total: 40,
      };
    }
    if (week == 12) {
      resultObj = {
        customerMeetings: 23.2,
        productMeetings: 8.8,
        internalTeamMeetings: 4.4,
        total: 40,
      };
    }
    if (week == 13) {
      resultObj = {
        customerMeetings: 23.6,
        productMeetings: 8.4,
        internalTeamMeetings: 4.8,
        total: 40,
      };
    }
    // var resultObj = {
    //   customerMeetings: parseInt(resObj.customerMeetings.toFixed()),
    //   productMeetings: parseInt(resObj.productMeetings.toFixed()),
    //   internalTeamMeetings: parseInt(resObj.internalTeamMeetings.toFixed()),
    //   total: 40,
    // };
    return resultObj;
  }

  async getRepTimeAllocation(startDate: Date, endDate: Date): Promise<any[]> {
    const values = [startDate, endDate];
    const response = await this.db.runQuery(
      'peopleActivities/repTimeAllocation.sql',
      values
    );
    let result = [];
    if (response.length > 0) {
      let meeting_ids = [...new Set(response.map((item) => item.meeting_guid))];
      meeting_ids.forEach(async (id) => {
        let obj = {
          meeting_guid: id,
          attendees: [],
          duration: 0,
          type: '',
        };
        response.map((item) => {
          if (item.meeting_guid == id) {
            obj.attendees.push({ email: item.attendee, id: item.user_id });
            obj.duration = item.duration;
          }
        });
        let email_ids = [...new Set(obj.attendees.map((item) => item.email))];
        let domains = [];
        email_ids.forEach((id: string) => {
          id = id.split('@').pop();
          domains.push(id);
        });
        const allEqual = (arr) => arr.every((v) => v === arr[0]);
        allEqual(domains)
          ? (obj.type = 'Internal Team')
          : (obj.type = 'Customer');
        result.push(obj);
      });
    }
    return result;
  }

  async isDemoMode(): Promise<DemoMode> {
    const result = {
      isDemoMode: config.demoMode.keyDriversWidget,
    };
    return result;
  }

  async getDealFunnel(
    startDate: Date,
    endDate: Date,
    quarter: number,
    week: number,
    context: RequestContext
  ): Promise<DealFunnel> {
    const values = [
      startDate,
      endDate,
      context.user.userId,
      context.user.tenantId,
    ];
    if (quarter == undefined && week == undefined) {
      const response = await this.db.runQueryFromFile(
        'peopleActivities/dealFunnel.sql',
        values,
        context
      );
      const resultObj = {
        opps: response[0].opps ? response[0].opps : 0,
        meetings: response[0].meetings ? response[0].meetings : 0,
        proposals: response[0].proposals ? response[0].proposals : 0,
        deals: response[0].deals ? response[0].deals : 0,
        activeNegotiations: response[0]?.activenegotiations
          ? response[0].activenegotiations
          : 0,
      };
      return resultObj;
    }
    else {
      let resultObj: any = {};
      let quarterData = 'q' + quarter;
      week = week == 0 ? 1 : week;
      let weekData = 'w' + week;
      if (quarter == 0) {
        const q1 = dealfunnelData['q1'][weekData];
        const q2 = dealfunnelData['q2'][weekData];
        const q3 = dealfunnelData['q3'][weekData];
        const q4 = dealfunnelData['q4'][weekData];
        resultObj = {
          opps: q1.opps && q2.opps && q3.opps && q4.opps ? q1.opps + q2.opps + q3.opps + q4.opps : 0,
          meetings: q1.meetings && q2.meetings && q3.meetings && q4.meetings ? q1.meetings + q2.meetings + q3.meetings + q4.meetings : 0,
          proposals: q1.proposals && q2.proposals && q3.proposals && q4.proposals ? q1.proposals + q2.proposals + q3.proposals + q4.proposals : 0,
          deals: q1.deals && q2.deals && q3.deals && q4.meetings ? q1.deals + q2.deals + q3.deals + q4.deals : 0,
          activeNegotiations: q1.activeNegotiations && q2.activeNegotiations && q3.activeNegotiations && q4.activeNegotiations ? q1.activeNegotiations + q2.activeNegotiations + q3.activeNegotiations + q4.activeNegotiations : 0,
        };
      }
      else {
        const response = dealfunnelData[quarterData][weekData];
        resultObj = {
          opps: response.opps ? response.opps : 0,
          meetings: response.meetings ? response.meetings : 0,
          proposals: response.proposals ? response.proposals : 0,
          deals: response.deals ? response.deals : 0,
          activeNegotiations: response?.activeNegotiations
            ? response.activeNegotiations
            : 0,
        };
      }
      return resultObj;
    }
  }
}
