import { RequestContext } from '../../server';

export enum RequisitionStage {
  FILED = 'filed',
  HIRED = 'hired',
  REJECTED = 'rejected',
  INTERVIEWING = 'interviewing',
}

export type PeopleDriversService = {
  getRequisitionInfo(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{
      readonly requisitionStage: RequisitionStage;
      readonly noOfCandidates: number;
    }>
  >;

  getRequiredCandidates(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<number>;

  getCompetenciesInfo(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{ readonly ratingName: string; readonly ratingValue: number }>
  >;

  getAttrition(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<{
    readonly rateInCurrentQuarter: number;
    readonly rateInSameQuarterPreviousYear: number;
  }>;

  getAvgTimeToHire(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<number>;

  getDiversity(
    endDate: Date,
    context: RequestContext
  ): Promise<{
    readonly noOfMale: number;
    readonly noOfFemale: number;
    readonly total: number;
    readonly targetYear: number;
    readonly targetCount: number;
  }>;

  getSpanLevel(
    endDate: Date,
    context: RequestContext
  ): Promise<{ readonly span: number; readonly level: number }>;

  getMyTeam(
    context: RequestContext
  ): Promise<{
    readonly userId: string;
    readonly personaCount: ReadonlyArray<{
      readonly persona: string;
      readonly count: number;
    }>;
  }>;
};
