import { RequestContext } from '../../server';

export type MarginOutput =  {
    readonly grossMarginData: readonly MarginData []
    }
  export type MarginData = {
    readonly productName: string
    readonly productPercentage: number
   
  }
    
  export  type ProductPortfolioGrossMarginService = {
    getProductPortfolioGrossMargin(startDate:Date, endDate:Date,contex:RequestContext):Promise<MarginOutput>;

  }

