import { RequestContext } from '../../server';

export interface SalesOutcomeService {
  getTotalSalesClosed(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<{
    overallTotalSalesClosed: number;
    existingTotalSalesClosed: number;
  }>;

  getTotalSalesForecast(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<number>;

  getNoOfDeals(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<number>;

  getWinRate(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<number>;

  getQuotaAttainment(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<number>;

  getPortfolioPresented(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<number>;

  getProductPenetration(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<Array<{ productId: string; dealCount: number }>>;

  getTotalSalesCycle(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{ readonly productId: string; readonly productCycle: number }>
  >;

  getTopProductContributors(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<Array<{ productId: string; totalAmount: number }>>;

  getProductColorMap(): Promise<Array<{ productName: string; color: string }>>;
}
