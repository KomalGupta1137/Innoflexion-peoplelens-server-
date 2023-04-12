import { RequestContext } from '../../server';

export interface PeopleActivityService {
  getTimeAllocation(userId, startDate, endDate, week): Promise<any[]>;
}

export type ObjectiveScore = {
  readonly curQuarterVal: string;
  readonly prevQuarterVal: string;
  readonly benchMark: number;
};

export type TimeAllocationScore = {
  readonly curQuarterVal: string;
  readonly prevQuarterVal: string;
  readonly benchMark: number;
};

export type PipelineDisciplineScore = {
  readonly curQuarterVal: string;
  readonly prevQuarterVal: string;
  readonly benchMark: number;
};

export type FollowThrough = {
  readonly curQuarterVal: string;
  readonly prevQuarterVal: string;
  readonly benchMark: number;
};

export type AccountCoverage = {
  readonly curQuarterVal: number;
  readonly prevQuarterVal: number;
  readonly benchMark: number;
};

export type untouchedOpps = {
  readonly curVal: string;
  readonly prevVal: string;
  readonly benchMark: number;
};

export type RepTimeAllocation = {
  readonly customerMeetings: number;
  readonly productMeetings: number;
  readonly internalTeamMeetings: number;
  readonly total: number;
};

export type DealFunnel = {
  readonly opps: number;
  readonly meetings: number;
  readonly proposals: number;
  readonly deals: number;
  readonly activeNegotiations: number;
};

export type DemoMode = { readonly isDemoMode: boolean };

export type PeopleActivitiesService = {
  getObjectiveScore(
    startDate: Date,
    endDate: Date,
    userId: string,
    persona: string,
    context: RequestContext
  ): Promise<ObjectiveScore>;

  getTimeAllocationScore(
    startDate: Date,
    endDate: Date,
    userId: string,
    persona: string,
    context: RequestContext
  ): Promise<TimeAllocationScore>;

  getPipelineDisciplineScore(
    startDate: Date,
    endDate: Date,
    userId: string,
    persona: string,
    context: RequestContext
  ): Promise<PipelineDisciplineScore>;

  getFollowThrough(
    startDate: Date,
    endDate: Date,
    userId: string,
    persona: string,
    context: RequestContext
  ): Promise<FollowThrough>;

  getAccountCoverage(
    startDate: Date,
    endDate: Date,
    rootUser: string,
    context: RequestContext
  ): Promise<AccountCoverage>;

  getUntouchedOpps(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<untouchedOpps>;

  // getRepTimeAllocation(
  //   startDate: Date,
  //   endDate: Date,
  //   context: RequestContext
  // ): Promise<RepTimeAllocation>;

  getDealFunnel(
    startDate: Date,
    endDate: Date,
    quarter: number,
    week: number,
    context: RequestContext
  ): Promise<DealFunnel>;

  isDemoMode(): Promise<DemoMode>;
};
