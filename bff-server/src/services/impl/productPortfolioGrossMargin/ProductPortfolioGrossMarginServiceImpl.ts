/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable functional/no-class */
import { injectable } from 'inversify';

// import { salesOutcomeResolvers } from '../../../gql/salesOutcome/salesOutcome.resolvers';
import { RequestContext } from '../../../server';
import {
  MarginData,
  MarginOutput,
  ProductPortfolioGrossMarginService,
} from '../../interfaces/ProductPortfolioGrossMarginService';

@injectable()
export class ProductPortfolioGrossMarginServiceImpl implements ProductPortfolioGrossMarginService {
  constructor() //@inject(Dependencies.Database.toString()) private readonly db: Database
  { }
  async getProductPortfolioGrossMargin(
    _startDate: Date,
    _endDate: Date,
    _contex: RequestContext
  ): Promise<MarginOutput> {

    const productPortfolioGrossMarginData: Array<MarginData> = [
      {
        productName: 'Prod1',
        productPercentage: 60
      },
      {
        productName: 'Prod2',
        productPercentage: 70,
      },
      {
        productName: 'Prod3',
        productPercentage: 80
      },
      // {
      //   productName: 'Prod4',
      //   productPercentage: 50
      // },
      // {
      //   productName: 'Prod5',
      //   productPercentage: 20
      // },
    ];
    return Promise.resolve({ grossMarginData: productPortfolioGrossMarginData });
  }
}
