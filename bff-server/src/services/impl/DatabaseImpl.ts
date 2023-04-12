import { Database } from '../interfaces/Database';
import pgPromise, {
  IInitOptions,
  PreparedStatement,
  QueryFile,
} from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { config } from 'node-config-ts';
import { injectable } from 'inversify';
import { RequestContext } from '../../server';
import { existsSync } from 'fs';
import md5 from 'md5';
import redis, { RedisClient } from 'redis';
import { globalLogger } from '../../logger';

@injectable()
export class DatabaseImpl implements Database {
  private db: pgPromise.IDatabase<{}, pg.IClient> & {};
  private pathToQueryFile = new Map<string, QueryFile>();
  private redisClient: RedisClient;

  constructor() {
    const initOptions: IInitOptions = {};
    this.db = pgPromise(initOptions)({
      connectionString: config.dbConnectionString,
    });
    this.redisClient = redis.createClient({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    });

    this.redisClient.on('error', function (error) {
      globalLogger.error('Redis encountered an error', error);
    });
  }

  async runQuery(filePath: string, values: any[], useCache = true): Promise<Array<any>> {
    const absoluteFilePath = `${__dirname}/${filePath}`;
    if (!existsSync(absoluteFilePath)) {
      throw `File ${absoluteFilePath} not found`;
    }
    if (!this.pathToQueryFile.has(filePath)) {
      this.pathToQueryFile.set(filePath, new QueryFile(absoluteFilePath));
    }
    try {
      const ps = new PreparedStatement({
        name: filePath,
        text: this.pathToQueryFile.get(filePath),
        values,
      });
      const queryWithParams = pgPromise.as.format(ps.text, values);
      const cachedQueryResult = await this.getResultFromCacheWithoutContext(
        queryWithParams
      );
      if (cachedQueryResult && useCache) {
        if (!absoluteFilePath.toLowerCase().includes('usersetting') && !absoluteFilePath.toLowerCase().includes('salesoutcome')
          && !absoluteFilePath.toLowerCase().includes('uploadedsystems'))
          return cachedQueryResult;
      }
      const res = await this.db.any(ps, values);
      await this.setResultInCacheWithoutContext(queryWithParams, res);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async runQueryFromFile(
    filePath: string,
    values: any[],
    context: RequestContext,
    useCache: boolean = true
  ): Promise<Array<any>> {
    const absoluteFilePath = `${__dirname}/${filePath}`;
    if (!existsSync(absoluteFilePath)) {
      throw `File ${absoluteFilePath} not found`;
    }
    if (!this.pathToQueryFile.has(filePath)) {
      this.pathToQueryFile.set(filePath, new QueryFile(absoluteFilePath));
    }
    let queryWithParams = '';
    try {
      const ps = new PreparedStatement({
        name: filePath,
        text: this.pathToQueryFile.get(filePath),
        values,
      });
      queryWithParams = pgPromise.as.format(ps.text, values);
      const cachedQueryResult = await this.getResultFromCache(
        queryWithParams,
        context
      );
      if (cachedQueryResult && useCache) {
        if (!absoluteFilePath.toLowerCase().includes('usersetting') && !absoluteFilePath.toLowerCase().includes('salesoutcome')
          && !absoluteFilePath.toLowerCase().includes('uploadedsystems'))
          return cachedQueryResult;
      }
      const res = await this.db.any(ps, values);
      await this.setResultInCache(queryWithParams, res, context);
      return res;
    } catch (err) {
      context.logger.error(
        `Query Could not execute query from file ${filePath}. Message [${err}], ${queryWithParams}`,
        err
      );
      throw err;
    }
  }

  private async getResultFromCache(
    query: string,
    context: RequestContext
  ): Promise<any | null> {
    const hash = md5(query);
    const key = `${context.user.tenantId}-${hash}`;
    return new Promise<string>((resolve, reject) => {
      this.redisClient.get(key, (err, str) => {
        if (err) {
          reject(err);
        } else {
          if (str) {
            resolve(JSON.parse(str));
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  private async getResultFromCacheWithoutContext(
    query: string
  ): Promise<any | null> {
    const hash = md5(query);
    const key = `${hash}`;
    return new Promise<string>((resolve, reject) => {
      this.redisClient.get(key, (err, str) => {
        if (err) {
          reject(err);
        } else {
          if (str) {
            resolve(JSON.parse(str));
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  private async setResultInCache(
    query: string,
    result: any,
    context: RequestContext
  ): Promise<boolean> {
    const hash = md5(query);
    const key = `${context.user.tenantId}-${hash}`;
    return new Promise<boolean>((resolve, reject) => {
      this.redisClient.set(key, JSON.stringify(result), (err, str) => {
        if (err) {
          reject(err);
        } else {
          resolve(str === 'OK');
        }
      });
    });
  }

  private async setResultInCacheWithoutContext(
    query: string,
    result: any
  ): Promise<boolean> {
    const hash = md5(query);
    const key = `${hash}`;
    return new Promise<boolean>((resolve, reject) => {
      this.redisClient.set(key, JSON.stringify(result), (err, str) => {
        if (err) {
          reject(err);
        } else {
          resolve(str === 'OK');
        }
      });
    });
  }
}
