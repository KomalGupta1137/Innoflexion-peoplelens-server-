import { RequestContext } from '../../server';

export type KeyDriversOutput = {
  graphValues: GraphValues[];
  demoMode: DemoMode;
};

export type DemoMode = {
  isDemoMode: boolean;
}

type SeriesType = {
  y: number;
  label: string;
  x?: number;
};
export type GraphValues = {
  label: string;
  title1: string;
  title2: string;
  legend1: string;
  legend2: string;
  series1Data: SeriesType[] | number[];
  series2Data: SeriesType[] | number[];
};

export type KeyDriversService = {
  getKeyDriversData(
    startDate: Date,
    endDate: Date,
    productId: string,
    context: RequestContext
  ): Promise<KeyDriversOutput>;
};
