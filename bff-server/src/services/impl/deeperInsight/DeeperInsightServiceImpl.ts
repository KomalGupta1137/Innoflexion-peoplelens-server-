/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable functional/no-class */
import { injectable } from 'inversify';

// import { salesOutcomeResolvers } from '../../../gql/salesOutcome/salesOutcome.resolvers';
import { RequestContext } from '../../../server';
import {
  DeeperInsightOutput,
  DeeperInsightsService,
} from '../../interfaces/DeeperInsightsService';
import { config } from 'node-config-ts';

@injectable()
export class DeeperInsightServiceImpl implements DeeperInsightsService {
  constructor() //@inject(Dependencies.Database.toString()) private readonly db: Database
  { }
  async getDeeperInsight(
    _startDate: Date,
    _endDate: Date,
    _contex: RequestContext
  ): Promise<DeeperInsightOutput> {
    var demoMode = config.demoMode.keyDriversWidget;

    const graphData = [
      {
        title1: 'Product Knowledge',
        title2: 'Quota Attainment',
        series: [
          [2.3, 46],
          [2.8, 47],
          [3.3, 49],
          [3.8, 51],
          [4.3, 55],
          [4.6, 56],
          [4.8, 58]

        ],
        lineSeries: [
          [2.1, 45],
          [4.9, 57],
        ],
      },


      {


        title1: 'Portfolio Presented',
        title2: 'Quota Attainment',
        series: [
          [45, 44],
          [55, 46],
          [60, 49],
          [65, 51],
          [71, 56],
          [74, 57],
          [78, 59]
        ],
        lineSeries: [
          [45, 44.4],
          [80, 58.5],

        ],
      },
      {
        title1: 'Time with Product Teams',
        title2: 'Deal Size',
        series: [
          [11, 251],
          [13, 340],
          [18, 330],
          [19, 355],
          [20, 445],
          [21, 400],
          [31, 449],
          [38, 510],
          [38.5, 449.5]
        ],
        lineSeries: [
          [11.5, 251.5],
          [39, 503],
        ]
      },
      {
        title1: 'Portfolio Presented',
        title2: 'Deal Size',
        series: [
          [19, 339],
          [28, 410],
          [30.3, 440],
          [31, 451],
          [40.5, 449],
          [42, 501],
          [49, 510]

        ],
        lineSeries: [
          [18.5, 339.5],
          [50, 509.5],
        ],
      },
      {
        title1: 'Followup Ratio',
        title2: 'Win Rate',
        series: [
          [30, 19],
          [45, 25.5],
          [60, 21],
          [75, 31],
          [90, 37],


        ],
        lineSeries: [
          [34, 18.5],
          [92, 38.5],
        ],
      },

    ];
    return Promise.resolve({ graphData: graphData, demoMode: { isDemoMode: demoMode } });
  }
}
