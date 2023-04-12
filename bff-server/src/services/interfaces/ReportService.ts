import { RequestContext } from '../../server';

export type SalesClosed = {
  // readonly totalSalesClosed: number;
  readonly maxSalesClosed: number;
  readonly minSalesClosed: number;
  readonly avgSalesClosed: number;
};

export type DealsClosed = {
  // readonly totalDealsClosed: number;
  readonly maxDealsClosed: number;
  readonly minDealsClosed: number;
  readonly avgDealsClosed: number;
};

export type SalesCycle = {
  readonly totalSalesCycle: number;
  readonly maxSalesCycle: number;
  readonly minSalesCycle: number;
  readonly avgSalesCycle: number;
};

export type QuotaAttainment = {
  readonly maxQuotaAttainment: number;
  readonly minQuotaAttainment: number;
  readonly avgQuotaAttainment: number;
};

export type WinRate = {
  readonly maxWinRate: number;
  readonly minWinRate: number;
  readonly avgWinRate: number;
};
export type DealSize = {
  readonly maxDealSize: number;
  readonly minDealSize: number;
};

export type ReportOutput = {
  readonly salesClosed: SalesClosed;
  readonly dealsClosed: DealsClosed;
  readonly quotaAttainment: QuotaAttainment;
  readonly winRate: WinRate;
  readonly dealSize: DealSize;
  readonly salesCylce: SalesCycle;
};

export type ReportService = {
  getReportData(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<ReportOutput>;
  getSalesClosed(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<SalesClosed>;
  getDealsClosed(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<DealsClosed>;
  getSalesCycle(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<SalesCycle>;
  getQuotaAttainment(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<QuotaAttainment>;
  getWinRate(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<WinRate>;
  getDealSize(context: RequestContext): Promise<DealSize>;
};
// import { RequestContext } from '../../server';

// export interface ReportService {
//   getSalesClosed(
//     startDate: Date,
//     endDate: Date,
//     userId: string,
//     context: RequestContext
//   ): Promise<{
//     totalSalesClosed: number;
//     maxSalesClosed: number;
//     avgSalesClosed: number;
//   }>;
// }
