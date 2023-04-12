import {
  GraphValues,
  KeyDriversOutput,
  KeyDriversService
} from '../../interfaces/KeyDriversService';
import { injectable } from 'inversify';
import { RequestContext } from '../../../server';
import { config } from 'node-config-ts';

@injectable()
export class KeyDriversServiceImpl implements KeyDriversService {

  async getKeyDriversData(
    startDate: Date,
    endDate: Date,
    productId: string,
    context: RequestContext
  ): Promise<KeyDriversOutput> {
    console.log(
      startDate + ' , ' + endDate + ' , ' + productId + ' , ' + context
    );
    var demoMode = config.demoMode.keyDriversWidget;
    const json: GraphValues[] = [
      {
        label: 'Graph1',
        title1: 'Product Knowledge',
        title2: 'Quota Attainment',
        legend1: 'Assessment Score',
        legend2: 'Quota Attainment',
        // series1Data: [2.0, 3.0, 4.0, 5.0],
        series1Data: [
          {
            y: 2.0,
            label: '2.0',
            x: 0
          },
          {
            y: 3.0,
            label: '3.0',
            x: 1
          },
          {
            y: 4.0,
            label: '3.5',
            x: 2
          },
          {
            y: 5.0,
            label: '4.5',
            x: 3
          }
        ],
        // series2Data: [4.0, 4.6, 5.3, 6.0],
        series2Data: [
          {
            y: 4.0,
            label: '40.0%',
            x: 0
          },
          {
            y: 4.6,
            label: '50.0%',
            x: 1
          },
          {
            y: 5.0,
            label: '55.0%',
            x: 2
          },
          {
            y: 7,
            label: '80.0%',
            x: 3
          }
        ]
      },
      {
        label: 'Graph2',
        title1: 'Time Allocation',
        title2: 'Deal Size',
        legend1: 'Time w/ Product Teams',
        legend2: 'Deal Size',
        // series1Data: [2.0, 3.0, 4.0, 4.0],
        // series2Data: [2.5, 2.5, 3.0, 4.0],
        series1Data: [
          {
            y: 2.0,
            x: 0,
            label: '50.0%'
          },
          {
            y: 3.0,
            x: 1,
            label: '60.0%'
          },
          {
            y: 4.0,
            x: 2,
            label: '80.0%'
          },
          {
            y: 4.0,
            x: 3,
            label: '80.0%'
          }
        ],
        // series2Data: [4.0, 4.6, 5.3, 6.0],
        series2Data: [
          {
            y: 2.5,
            x: 0,
            label: '$130.0K'
          },
          {
            y: 2.7,
            x: 1,
            label: '$140.0K'
          },
          {
            y: 3.0,
            x: 2,
            label: '$145.0K'
          },
          {
            y: 4.0,
            x: 3,
            label: '$175.0K'
          }
        ]
      },
      {
        label: 'Graph3',
        title1: 'Pipeline Discipline',
        title2: 'Win Rate',
        legend1: 'Product Demos',
        legend2: 'Win Rate',
        // series1Data: [2.0, 3.0, 3.7, 3.6],
        // series2Data: [4.0, 4.0, 5.0, 8.0],
        series1Data: [
          {
            y: 2.0,
            label: '10',
            x: 0
          },
          {
            y: 3.0,
            label: '15',
            x: 1
          },
          {
            y: 3.7,
            label: '20',
            x: 2
          },
          {
            y: 3.6,
            label: '20',
            x: 3
          }
        ],
        // series2Data: [4.0, 4.6, 5.3, 6.0],
        series2Data: [
          {
            y: 4.0,
            label: '15.0%',
            x: 0
          },
          {
            y: 4.2,
            label: '18.0%',
            x: 1
          },
          {
            y: 5.0,
            label: '20.0%',
            x: 2
          },
          {
            y: 8.0,
            label: '27.0%',
            x: 3
          }
        ]
      }
    ];

    return Promise.resolve({ graphValues: json, demoMode: { isDemoMode: demoMode } });
  }
}
