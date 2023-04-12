import { RequestContext } from '../../server';

export type RangeData = {
  readonly userId: string;
  readonly metricValue: string;
};

export type LeaderBoardData = {
  readonly rangeCount: RangeCount[];
  readonly minMetricVal: number;
  readonly maxMetricVal: number;
  readonly avgMetricVal: number;
  readonly metricDimension: string;
  readonly totBuckets: number;
};

export type RangeCount = {
  readonly bucketNo: number;
  readonly bucketCount: number;
  readonly minRangeVal: number;
  readonly maxRangeVal: number;
  readonly avgRangeVal: number;
};

export type BattleCardOutput = {
  readonly battleCardData: BattleCardData[];
  battleCardType: string;
  title: string;
  readonly battleCardActions: BattleCardActions[];
};

export type BattleCardData = {
  readonly name: string;
  value: number;
  readonly valueType: string;
  title: string;
};

export type BattleCardActions = {
  actionName: string;
  course: string;
  rec_id: string;
};

export type LeaderBoardService = {
  getQuotaAttainmentCounts(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<LeaderBoardData>;

  getQuotaAttainmentData(
    startDate: Date,
    endDate: Date,
    range: number,
    context: RequestContext
  ): Promise<Array<RangeData>>;

  getWinRateCounts(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<LeaderBoardData>;

  getWinRateData(
    startDate: Date,
    endDate: Date,
    range: number,
    context: RequestContext
  ): Promise<Array<RangeData>>;

  getDealSizeCounts(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<LeaderBoardData>;

  getDealSizeData(
    startDate: Date,
    endDate: Date,
    range: number,
    context: RequestContext
  ): Promise<Array<RangeData>>;

  getSalesCycleCounts(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<LeaderBoardData>;

  getSalesCycleData(
    startDate: Date,
    endDate: Date,
    range: number,
    context: RequestContext
  ): Promise<Array<RangeData>>;

  getBattleCards(
    startDate: Date,
    endDate: Date,
    outcomeType: string,
    userId: string,
    battleCardType: string,
    context: RequestContext
  ): Promise<Array<BattleCardOutput>>;

  getBattleCardsDS(
    userId: string,
    startDate: Date,
    endDate: Date,
    driver: string,
    name: string,
    battleCardType: string,
    context: RequestContext
  ): Promise<Array<BattleCardOutput>>;
};
