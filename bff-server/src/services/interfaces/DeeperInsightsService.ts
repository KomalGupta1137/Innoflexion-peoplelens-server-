import { RequestContext } from '../../server';

export type DeeperInsightOutput = {
    readonly graphData: readonly GraphData[]
    readonly demoMode: DemoMode;
    }

export type DemoMode = {
    isDemoMode: boolean;
  }

  export type GraphData={
    readonly title1:string
    readonly title2:string
    readonly series:  readonly (readonly number[])[]
    readonly lineSeries:  readonly (readonly number[])[]
  }
    
  export  type DeeperInsightsService = {
    getDeeperInsight(startDate:Date, endDate:Date,contex:RequestContext):Promise<DeeperInsightOutput>;

  }

  