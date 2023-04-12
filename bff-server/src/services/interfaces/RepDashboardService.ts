/* eslint-disable functional/no-method-signature */
import { RequestContext } from '../../server';
import { DemoMode } from './DeeperInsightsService';
export type OKRSummaryOutput= {
  readonly rating: number,
  readonly competency: readonly CompetencyOutput[]
}
type CompetencyOutput= {
  readonly name: string,
  readonly values: readonly Score[]
}
type Score= {
  readonly title: string,
  readonly managerScore: number,
  readonly selfScore: number
}
export type RepDashboardService = {
  getPipeline(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{
      readonly customer: string;
      readonly opportunity: number;
      readonly closedDate: Date;
      readonly status: string;
      readonly relationship: string;
      readonly decisionMaker: string;
      readonly myNextStep: string;
    }>
  >;

  getMyLearning(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{
      readonly course: string;
      readonly assessmentScore: number;
      readonly courseDate: string;
      readonly courseStatus: string;
    }>
  >;

  getSalesOKR(
     startDate: Date,
     endDate: Date,
     contex: RequestContext
  ):Promise < ReadonlyArray<{
      readonly title: string;
      readonly value:ReadonlyArray<{
        readonly title: string;
        readonly value: string;

      }>
    }>
  >;
  getOKRSummary(
    startDate: Date,
    endDate: Date,
    contex: RequestContext

  ):Promise<OKRSummaryOutput>


  getEarnings(
    startDate: Date,
    endDate: Date,
    thresholdValue: number,
    context: RequestContext
  ): Promise<{
    readonly equity: {
      readonly vestedAmount: number;
      readonly vestedShares: number;
      readonly remainingAmount: number;
      readonly remainingShares: number;
    };
    readonly annualComp: {
      readonly base: number;
      readonly commission: number;
      readonly vestedEquity: number;
      readonly rate: number;
      readonly rank: number;
    };
    readonly myScenarios: {
      readonly daysToClose: number;
    };
    readonly demoMode : DemoMode;
  }>;

  getRewards(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<{
    readonly commissionStructure: ReadonlyArray<{
      readonly threshold: number;
      readonly rate: number;
      readonly value: number;
    }>;
    readonly commissionCases: {
      readonly myDeals: ReadonlyArray<{
        readonly name: string;
        readonly label: string;
      }>;
      readonly jointSelling: ReadonlyArray<{
        readonly name: string;
        readonly label: string;
      }>;
    };
  }>;
};

    

  


