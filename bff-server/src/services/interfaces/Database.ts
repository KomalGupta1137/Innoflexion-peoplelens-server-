import { RequestContext } from '../../server';

export interface Database {
  runQueryFromFile(filePath: string, values: any[], context: RequestContext, useCache?: boolean): Promise<Array<any>>;
  runQuery(filePath: string, values: any[], useCache?: boolean): Promise<Array<any>>;
}

