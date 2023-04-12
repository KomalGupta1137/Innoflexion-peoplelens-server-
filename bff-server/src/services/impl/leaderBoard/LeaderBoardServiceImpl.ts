import { inject, injectable } from 'inversify';

import { Dependencies } from '../../../Dependencies';
import { RequestContext } from '../../../server';
import { Database } from '../../interfaces/Database';
import {
  LeaderBoardService,
  LeaderBoardData,
  RangeData,
  BattleCardOutput,
} from '../../interfaces/LeaderBoardService';

@injectable()
export class LeaderBoardServiceImpl implements LeaderBoardService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  async getQuotaAttainmentData(
    startDate: Date,
    endDate: Date,
    range: number,
    context: RequestContext
  ): Promise<RangeData[]> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
      range,
    ];
    const response = await this.db.runQueryFromFile(
      'leaderBoard/quotaAttainmentWithRange.sql',
      values,
      context
    );

    return response.map((r) => ({
      userId: r.userId,
      metricValue: r.metricValue,
    }));
  }

  async getQuotaAttainmentCounts(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<LeaderBoardData> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = await this.db.runQueryFromFile(
      'leaderBoard/quotaAttainment.sql',
      values,
      context
    );

    const rangeCount = response.map((r) => ({
      bucketNo: parseInt(r.rangeNo),
      bucketCount: parseInt(r.rangeCount),
      minRangeVal: parseFloat(r.minRangeVal),
      maxRangeVal: parseFloat(r.maxRangeVal),
      avgRangeVal: parseFloat(r.avgRangeVal),
    }));

    return {
      rangeCount: rangeCount,
      minMetricVal: response[0] && parseFloat(response[0].minMetricVal),
      maxMetricVal: response[0] && parseFloat(response[0].maxMetricVal),
      avgMetricVal: response[0] && parseFloat(response[0].avgMetricVal), //change back to this when data is accurate
      // avgMetricVal:
      //   response[0] &&
      //   parseInt(response[0].minMetricVal) +
      //     parseInt(response[0].maxMetricVal) / 2,
      metricDimension: '%',
      totBuckets: 11,
    };
  }

  async getWinRateData(
    startDate: Date,
    endDate: Date,
    range: number,
    context: RequestContext
  ): Promise<RangeData[]> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
      range,
    ];
    const response = await this.db.runQueryFromFile(
      'leaderBoard/winRateWithRange.sql',
      values,
      context
    );

    return response.map((r) => ({
      userId: r.userId,
      metricValue: r.metricValue,
    }));
  }

  async getWinRateCounts(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<LeaderBoardData> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = await this.db.runQueryFromFile(
      'leaderBoard/winRate.sql',
      values,
      context
    );

    const rangeCount = response.map((r) => ({
      bucketNo: parseInt(r.rangeNo),
      bucketCount: parseInt(r.rangeCount),
      minRangeVal: parseFloat(r.minRangeVal),
      maxRangeVal: parseFloat(r.maxRangeVal),
      avgRangeVal: parseFloat(r.avgRangeVal),
    }));

    return {
      rangeCount: rangeCount,
      minMetricVal: response[0] && parseFloat(response[0].minMetricVal),
      maxMetricVal: response[0] && parseFloat(response[0].maxMetricVal),
      avgMetricVal: response[0] && parseFloat(response[0].avgMetricVal),
      metricDimension: '%',
      totBuckets: 11,
    };
  }

  async getDealSizeData(
    startDate: Date,
    endDate: Date,
    range: number,
    context: RequestContext
  ): Promise<RangeData[]> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
      range,
    ];
    const response = await this.db.runQueryFromFile(
      'leaderBoard/dealSizeWithRange.sql',
      values,
      context
    );

    return response.map((r) => ({
      userId: r.userId,
      metricValue: r.metricValue,
    }));
  }

  async getDealSizeCounts(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<LeaderBoardData> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = await this.db.runQueryFromFile(
      'leaderBoard/dealSize.sql',
      values,
      context
    );

    var rangeCount = response.map((r) => ({
      bucketNo: parseInt(r.rangeNo),
      bucketCount: parseInt(r.rangeCount),
      minRangeVal: parseFloat(r.minRangeVal),
      maxRangeVal: parseFloat(r.maxRangeVal),
      avgRangeVal: parseFloat(r.avgRangeVal),
    }));

    rangeCount = rangeCount.filter(e => e.bucketNo != 60 && e.bucketNo != 20); //To be removed later!

    return {
      rangeCount: rangeCount,
      minMetricVal: response[0] && parseFloat(response[0].minMetricVal),
      maxMetricVal: response[0] && parseFloat(response[0].maxMetricVal),
      avgMetricVal: response[0] && parseFloat(response[0].avgMetricVal),
      metricDimension: 'Amount',
      totBuckets: rangeCount.length,
    };
  }

  async getSalesCycleData(
    startDate: Date,
    endDate: Date,
    range: number,
    context: RequestContext
  ): Promise<RangeData[]> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
      range,
    ];
    const response = await this.db.runQueryFromFile(
      'leaderBoard/salesCycleWithRange.sql',
      values,
      context
    );

    return response.map((r) => ({
      userId: r.userId,
      metricValue: r.metricValue,
    }));
  }

  async getSalesCycleCounts(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<LeaderBoardData> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = await this.db.runQueryFromFile(
      'leaderBoard/salesCycle.sql',
      values,
      context
    );

    const rangeCount = response.map((r) => ({
      bucketNo: parseInt(r.rangeNo),
      bucketCount: parseInt(r.rangeCount),
      minRangeVal: parseFloat(r.minRangeVal),
      maxRangeVal: parseFloat(r.maxRangeVal),
      avgRangeVal: parseFloat(r.avgRangeVal),
    }));

    return {
      rangeCount: rangeCount,
      minMetricVal: response[0] && parseFloat(response[0].minMetricVal),
      maxMetricVal: response[0] && parseFloat(response[0].maxMetricVal),
      avgMetricVal: response[0] && parseFloat(response[0].avgMetricVal),
      metricDimension: 'Days',
      totBuckets: 11,
    };
  }

  async getBattleCards(
    startDate: Date,
    endDate: Date,
    outcomeType: string,
    userId: string,
    battleCardType: string,
    context: RequestContext
  ): Promise<BattleCardOutput[]> {
    let result: Promise<BattleCardOutput[]>;
    console.log(
      startDate +
      ' ' +
      endDate +
      outcomeType +
      userId +
      battleCardType +
      context
    );
    const learningBattleCardData = [
      {
        name: 'Product Knowledge',
        value: 0,
        valueType: 'discrete',
        title: 'ProductName Skills',
      },
    ];

    const communicationSkillsBattleCardData = [
      {
        name: 'Communication Skills',
        value: 0,
        valueType: 'discrete',
        title: 'Professional Skills',
      },
    ];

    const salesTechniquesBattleCardData = [
      {
        name: 'Sales Techniques',
        value: 0,
        valueType: 'discrete',
        title: 'Selling Skills',
      },
    ];

    const coachabilityBattleCardData = [
      {
        name: 'Coachability',
        value: 0,
        valueType: 'discrete',
        title: 'Professional Skills',
      },
    ];

    const pipelineDisciplineBattleCardData = [
      {
        name: 'Followup with Customers',
        value: 0,
        valueType: 'discrete',
        title: 'Followup Ratio',
      },
    ];

    const negotiationSkillsBattleCardData = [
      {
        name: 'Negotiation Skills',
        value: 0,
        valueType: 'discrete',
        title: '',
      },
    ];

    const dealingWithComplexityBattleCardData = [
      {
        name: 'Dealing with complexity',
        value: 0,
        valueType: 'discrete',
        title: '',
      },
    ];

    const learningBattleCardData1 = [
      {
        name: 'Product Knowledge',
        value: 0,
        valueType: 'discrete',
        title: 'ProductName Skills',
      },
    ];

    const communicationSkillsBattleCardData1 = [
      {
        name: 'Communication Skills',
        value: 0,
        valueType: 'discrete',
        title: 'Professional Skills',
      },
    ];

    const salesTechniquesBattleCardData1 = [
      {
        name: 'Sales Techniques',
        value: 0,
        valueType: 'discrete',
        title: 'Selling Skills',
      },
    ];

    const coachabilityBattleCardData1 = [
      {
        name: 'Coachability',
        value: 0,
        valueType: 'discrete',
        title: 'Professional Skills',
      },
    ];

    const pipelineDisciplineBattleCardData1 = [
      {
        name: 'Followup with Customers',
        value: 0,
        valueType: 'discrete',
        title: 'Followup Ratio',
      },
    ];

    const negotiationSkillsBattleCardData1 = [
      {
        name: 'Negotiation Skills',
        value: 0,
        valueType: 'discrete',
        title: '',
      },
    ];

    const dealingWithComplexityBattleCardData1 = [
      {
        name: 'Dealing with complexity',
        value: 0,
        valueType: 'discrete',
        title: '',
      },
    ];

    const battleCardOutput = [
      {
        userId: userId ? userId : context.user.userId,
        battleCardData: learningBattleCardData,
        battleCardActions: [
          {
            actionName:
              'Encourage ...  to take the "ProductName" course and enhance score from "X" to "Y"',
          },
        ],
        title: 'ProductName Skills',
        battleCardType: 'Learning Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: communicationSkillsBattleCardData,
        battleCardActions: [
          {
            actionName:
              'Encourage ... to practice Communication with Manager / Role plays, enhance score from "X" to"Y"',
          },
        ],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: salesTechniquesBattleCardData,
        battleCardActions: [
          {
            actionName:
              'Encourage ... to practice sales techniques with Role plays / Shadowing, enhance score from "X" to "Y"',
          },
        ],
        title: 'Selling Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: coachabilityBattleCardData,
        battleCardActions: [
          {
            actionName: 'Encourage ... ',
          },
        ],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: pipelineDisciplineBattleCardData,
        battleCardActions: [
          {
            actionName:
              'Encourage ... to focus on their "Follow Up Ratio with Customers"',
          },
        ],
        title: 'Followup Ratio',
        battleCardType: 'Pipeline Discipline Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: negotiationSkillsBattleCardData,
        battleCardActions: [
          {
            actionName:
              'Encourage ... to practice negotiating and closing via Role plays, enhance score from "X" to "Y"',
          },
        ],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: dealingWithComplexityBattleCardData,
        battleCardActions: [
          {
            actionName:
              'Encourage ... to practice dealing with complexity by shadowing, enhance score from "X" to "Y"',
          },
        ],
        title: 'Selling Skills',
        battleCardType: 'Competencies Battlecards',
      },
    ];

    const battleCardOutputWithType = [
      {
        userId: userId ? userId : context.user.userId,
        battleCardData: learningBattleCardData1,
        battleCardActions: [],
        title: 'ProductName Skills',
        battleCardType: 'Learning Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: communicationSkillsBattleCardData1,
        battleCardActions: [],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: salesTechniquesBattleCardData1,
        battleCardActions: [],
        title: 'Selling Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: coachabilityBattleCardData1,
        battleCardActions: [],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: pipelineDisciplineBattleCardData1,
        battleCardActions: [],
        title: 'Followup Ratio',
        battleCardType: 'Pipeline Discipline Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: negotiationSkillsBattleCardData1,
        battleCardActions: [],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: dealingWithComplexityBattleCardData1,
        battleCardActions: [],
        title: 'Selling Skills',
        battleCardType: 'Competencies Battlecards',
      },
    ];

    switch (outcomeType) {
      case 'Sales techniques':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[2]])
          : Promise.resolve([battleCardOutput[2]]);
        break;
      case 'twpt':
      case 'twc':
      case 'two':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[1]])
          : Promise.resolve([battleCardOutput[1]]);
        break;
      case 'pkp':
      case 'pk':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[0]])
          : Promise.resolve([battleCardOutput[0]]);
        break;
    }
    return result;
  }

  async getBattleCardsDS(
    userId: string,
    _startDate: Date,
    _endDate: Date,
    driver: string,
    name: string,
    battleCardType: string,
    context: RequestContext
  ): Promise<BattleCardOutput[]> {
    let result: Promise<BattleCardOutput[]>;

    const learningBattleCardData = [
      {
        title: 'Learning',
        name: 'Product Knowledge',
        value: 0,
        valueType: 'discrete',
      },
    ];

    const communicationSkillsBattleCardData = [
      {
        title: 'Competencies',
        name: 'Communication Skills',
        value: 0,
        valueType: 'discrete',
      },
    ];

    const salesTechniquesBattleCardData = [
      {
        title: 'Competencies',
        name: 'Sales Techniques',
        value: 0,
        valueType: 'continuous',
      },
    ];

    const coachabilityBattleCardData = [
      {
        name: 'Coachability',
        value: 0,
        valueType: 'discrete',
        title: 'Professional Skills',
      },
    ];

    const pipelineDisciplineBattleCardData = [
      {
        title: 'Activity',
        name: 'Pipeline Discipline',
        value: 0,
        valueType: 'continuous',
      },
    ];

    const followUpBattleCardData = [
      {
        title: 'Sales',
        name: 'Follow-Up with Customer',
        value: 0,
        valueType: 'discrete',
      },
    ];

    const negotiationSkillsBattleCardData = [
      {
        name: 'Negotiation Skills',
        value: 0,
        valueType: 'discrete',
        title: '',
      },
    ];

    const dealingWithComplexityBattleCardData = [
      {
        name: 'Dealing with complexity',
        value: 0,
        valueType: 'discrete',
        title: '',
      },
    ];

    const strategySkillBattleCardData = [
      {
        title: 'Competencies',
        name: 'Strategy Skills',
        value: 0,
        valueType: 'discrete',
      },
    ]

    const technicalSkillBattleCardData = [
      {
        title: 'Learning',
        name: 'Technical Skills',
        value: 0,
        valueType: 'discrete',
      }
    ]

    const activityScoreBattleCardData = [
      {
        title: 'Activity',
        name: 'Total Activity',
        value: 0,
        valueType: 'continuous',
      }
    ]

    const salesTechniquesClosingSkillsBattleCardData = [
      {
        title: 'Competencies',
        name: 'Sales Techniques',
        value: 0,
        valueType: 'discrete',
      }
    ]

    const timeAllocationBattleCardData = [
      {
        name: 'With Customers',
        value: 0,
        valueType: 'continuous',
        title: 'Time Allocation'
      }
    ]

    const timeAllocationPTBattleCardData = [
      {
        title: 'Time Allocation',
        name: 'With Product Team',
        value: 0,
        valueType: 'continuous',
      }
    ]

    const learningBattleCardData1 = [
      {
        name: 'Product Knowledge',
        value: 0,
        valueType: 'discrete',
        title: 'ProductName Skills',
      },
    ];

    const communicationSkillsBattleCardData1 = [
      {
        name: 'Communication Skills',
        value: 0,
        valueType: 'discrete',
        title: 'Professional Skills',
      },
    ];

    const salesTechniquesBattleCardData1 = [
      {
        name: 'Sales Techniques',
        value: 0,
        valueType: 'discrete',
        title: 'Selling Skills',
      },
    ];

    const coachabilityBattleCardData1 = [
      {
        name: 'Coachability',
        value: 0,
        valueType: 'discrete',
        title: 'Professional Skills',
      },
    ];

    const pipelineDisciplineBattleCardData1 = [
      {
        name: 'Followup with Customers',
        value: 0,
        valueType: 'discrete',
        title: 'Followup Ratio',
      },
    ];

    const negotiationSkillsBattleCardData1 = [
      {
        name: 'Negotiation Skills',
        value: 0,
        valueType: 'discrete',
        title: '',
      },
    ];

    const dealingWithComplexityBattleCardData1 = [
      {
        name: 'Dealing with complexity',
        value: 0,
        valueType: 'discrete',
        title: '',
      },
    ];

    const timeAllocationBattleCardData1 = [
      {
        name: 'With Customers',
        value: 0,
        valueType: 'discrete',
        title: ''
      }
    ]

    const battleCardOutput = [
      //0
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: learningBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team to take next course',
            actionName:
              'Encourage ... to take the "Technical Skills - Advanced" course and enhance score from "X" to "Y"',
            course: '"Technical Skills - Advanced" - Course',
          },
        ],
        title: 'Learning',
        battleCardType: 'Learning Battlecards',
      },
      //1
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: communicationSkillsBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team',
            actionName:
              'Encourage ... to practice Communication with Manager / Role plays, enhance score from "X" to"Y"',
            course: 'Practice "Communication" with Manager',
          },
        ],
        title: 'Competencies',
        battleCardType: 'Competencies Battlecards',
      },
      //2
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: salesTechniquesBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team',
            actionName:
              'Encourage ... to practice sales techniques with Role plays / Shadowing, enhance score from "X" to "Y"',
            course: 'Practice "Sales Techniques"',
          },
        ],
        title: 'Competencies',
        battleCardType: 'Competencies Battlecards',
      },
      //3
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: coachabilityBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge to be brought up in Manager 1:1',
            actionName: 'Encourage ...',
            course: 'Manager 1:1 agenda topic ',
          },
        ],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },
      //4
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: followUpBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team to focus on sales activities that matter',
            actionName:
              'Encourage ... to focus on their "Follow Up Ratio with Customers"',
            course: 'Follow Up Ratio',
          },
        ],
        title: 'Followup Ratio',
        battleCardType: 'Activity Battlecards',
      },
      //5
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: negotiationSkillsBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team',
            actionName:
              'Encourage ... to practice negotiating and closing via Role plays, enhance score from "X" to "Y"',
            course: 'Practice "Negotiation" ',
          },
        ],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },
      //6
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: dealingWithComplexityBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team',
            actionName:
              'Encourage ... to practice dealing with complexity by shadowing, enhance score from "X" to "Y"',
            course: 'Practice "Dealing with Complexity" ',
          },
        ],
        title: 'Selling Skills',
        battleCardType: 'Competencies Battlecards',
      },
      //7
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: strategySkillBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team - Competencies',
            actionName:
              'Encourage ... to build Strategy skills by Shadowing manager / Role plays, enhance score from "X" to"Y"',
            course: 'Build "Strategic Skills"',
          },
        ],
        title: 'Competencies',
        battleCardType: 'Competencies Battlecards',
      },
      //8
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: technicalSkillBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team to take next course',
            actionName:
              'Encourage ...  to take the "Technical Skills - Advanced" course and enhance score from "X" to "Y"',
            course: '"Technical Skills" - Course',
          },
        ],
        title: 'Learning',
        battleCardType: 'Learning Battlecards',
      },
      //9
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: activityScoreBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team to focus on activities that matter',
            actionName:
              'Encourage ... to focus on cadence with their "Activities"',
            course: 'Total Activity',
          },
        ],
        title: 'Activity',
        battleCardType: 'Activity Battlecards',
      },
      //10
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: salesTechniquesClosingSkillsBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team',
            actionName:
              'Encourage ... to practice closing by shadowing manager/ Role plays, enhance score from "X" to "Y"',
            course: 'Practice "Sales Techniques"',
          },
        ],
        title: 'Competencies',
        battleCardType: 'Competencies Battlecards',
      },
      //11
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: timeAllocationBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team to spend more time with customers',
            actionName:
              'Add a reminder for ... to meet with customers and multi thread deals',
            course: 'Meet with Customers',
          },
        ],
        title: 'Time Allocation',
        battleCardType: 'Time Allocation Battlecards',
      },
      //12
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: timeAllocationPTBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team to spend more time with product teams',
            actionName:
              'Add a reminder for ... to meet with Product Managers / Technical marketing Engineers',
            course: 'Meet with Product Teams',
          },
        ],
        title: 'Time Allocation',
        battleCardType: 'Time Allocation Battlecards',
      },
      //13
      {
        name: name,
        userId: userId ? userId : context.user.userId,
        battleCardData: pipelineDisciplineBattleCardData,
        battleCardActions: [
          {
            header: 'Nudge your team to focus on activities that matter',
            actionName:
              'Encourage ... to focus on cadence with their "Pipeline"',
            course: 'Pipeline Discipline',
          },
        ],
        title: 'Activity',
        battleCardType: 'Activity Battlecards',
      },
    ];

    const battleCardOutputWithType = [
      {
        userId: userId ? userId : context.user.userId,
        battleCardData: learningBattleCardData1,
        battleCardActions: [],
        title: 'ProductName Skills',
        battleCardType: 'Learning Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: communicationSkillsBattleCardData1,
        battleCardActions: [],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: salesTechniquesBattleCardData1,
        battleCardActions: [],
        title: 'Selling Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: coachabilityBattleCardData1,
        battleCardActions: [],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: pipelineDisciplineBattleCardData1,
        battleCardActions: [],
        title: 'Followup Ratio',
        battleCardType: 'Pipeline Discipline Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: negotiationSkillsBattleCardData1,
        battleCardActions: [],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: dealingWithComplexityBattleCardData1,
        battleCardActions: [],
        title: 'Selling Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: strategySkillBattleCardData,
        battleCardActions: [],
        title: 'Professional Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: technicalSkillBattleCardData,
        battleCardActions: [],
        title: 'Technical Skills',
        battleCardType: 'Learning Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: activityScoreBattleCardData,
        battleCardActions: [],
        title: 'Activity',
        battleCardType: 'Pipeline Discipline Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: salesTechniquesClosingSkillsBattleCardData,
        battleCardActions: [],
        title: 'Selling Skills',
        battleCardType: 'Competencies Battlecards',
      },

      {
        userId: userId ? userId : context.user.userId,
        battleCardData: timeAllocationBattleCardData1,
        battleCardActions: [],
        title: 'Time Allocation',
        battleCardType: 'Time Allocation Battlecards',
      },
    ];
    //Add 3 new drivers
    switch (driver.toLowerCase().trimEnd()) {
      case 'product knowledge':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[0]])
          : Promise.resolve([battleCardOutput[0]]);
        break;
      case 'technical skills':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[8]])
          : Promise.resolve([battleCardOutput[8]]);
        break;
      case 'communication':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[1]])
          : Promise.resolve([battleCardOutput[1]]);
        break;
      case 'sales techniques - closing skills':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[10]])
          : Promise.resolve([battleCardOutput[10]]);
        break;
      case 'strategy':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[7]])
          : Promise.resolve([battleCardOutput[7]]);
        break;
      case 'follow-up':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[4]])
          : Promise.resolve([battleCardOutput[4]]);
        break;
      case 'activity score':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[9]])
          : Promise.resolve([battleCardOutput[9]]);
        break;
      case 'pipeline discipline':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[13]])
          : Promise.resolve([battleCardOutput[13]]);
        break;
      case 'time with product team':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[12]])
          : Promise.resolve([battleCardOutput[12]]);
        break;
      case 'time with customers':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[11]])
          : Promise.resolve([battleCardOutput[11]]);
        break;
      case 'sales techniques':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[2]])
          : Promise.resolve([battleCardOutput[2]]);
        break;
      case 'coachability':
        result = battleCardType
          ? Promise.resolve([battleCardOutputWithType[3]])
          : Promise.resolve([battleCardOutput[3]]);
        break;
    }
    return result;
  }
}
