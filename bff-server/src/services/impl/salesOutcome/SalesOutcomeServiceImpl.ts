/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-let */
/* eslint-disable no-var */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-class */
// import { parseSelectionSet } from '@graphql-tools/utils';
import { inject, injectable } from 'inversify';
import { config } from 'node-config-ts';
import { Dependencies } from '../../../Dependencies';
import { RequestContext } from '../../../server';
import { Database } from '../../interfaces/Database';
import { SalesOutcomeService } from '../../interfaces/SalesOutcomeService';

@injectable()
export class SalesOutcomeServiceImpl implements SalesOutcomeService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  async getNoOfDeals(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<number> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      userId === '' ? context.user.userId : userId,
    ];
    const response = await this.db.runQueryFromFile(
      'salesOutcome/noOfDeals.sql',
      values,
      context
    );
    if (response[0].noOfDeals) {
      return parseFloat(response[0].noOfDeals);
    } else {
      return 0;
    }
  }

  async getPortfolioPresented(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<number> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = await this.db.runQueryFromFile(
      'salesOutcome/portfolioPresented.sql',
      values,
      context
    );
    if (response[0].portfolioPresented) {
      return parseFloat(response[0].portfolioPresented);
    } else {
      return 0;
    }
  }

  async getProductPenetration(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<Array<{ productId: string; dealCount: number }>> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = (await this.db.runQueryFromFile(
      'salesOutcome/productPenetration.sql',
      values,
      context
    )) as Array<{ productId: string; dealCount: string }>;
    return response.map((r) => ({
      productId: r.productId,
      dealCount: r.dealCount ? parseFloat(r.dealCount) : 0,
    }));
  }

  async getTotalSalesCycle(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<
    ReadonlyArray<{ readonly productId: string; readonly productCycle: number }>
  > {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];

    const response = (await this.db.runQueryFromFile(
      'salesOutcome/salesCycle.sql',
      values,
      context
    )) as ReadonlyArray<{
      readonly productId: string;
      readonly productCycle: string;
    }>;

    const res = response.map((r) => ({
      productId: r.productId,
      productCycle: r.productCycle ? parseFloat(r.productCycle) : 0,
    }));

    return res;
  }

  async getQuotaAttainment(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<number> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      userId === '' ? context.user.userId : userId,
    ];
    const response = await this.db.runQueryFromFile(
      'salesOutcome/quotaAttainment.sql',
      values,
      context
    );
    return response[0].quotaAttainment
      ? parseFloat(response[0].quotaAttainment)
      : 0;
  }

  async getTopProductContributors(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<Array<{ productId: string; totalAmount: number }>> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = (await this.db.runQueryFromFile(
      'salesOutcome/topContributors.sql',
      values,
      context
    )) as Array<{ productId: string; totalAmount: string }>;
    return response.map((r) => ({
      productId: r.productId,
      totalAmount: r.totalAmount ? parseFloat(r.totalAmount) : 0,
    }));
  }

  async getTotalSalesClosed(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<{
    overallTotalSalesClosed: number;
    existingTotalSalesClosed: number;
  }> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      userId === '' ? context.user.userId : userId,
    ];
    const response = await this.db.runQueryFromFile(
      'salesOutcome/totalSalesClosed.sql',
      values,
      context
    );
    const startDateOfSameQuarterInPreviousYear = new Date(startDate.getTime());
    startDateOfSameQuarterInPreviousYear.setFullYear(
      startDateOfSameQuarterInPreviousYear.getFullYear() - 1
    );

    const startDateOfPreviousYear = new Date(startDate.getTime());
    startDateOfPreviousYear.setMonth(startDateOfPreviousYear.getMonth() - 12);

    const endDateOfPreviousYear = new Date(startDate);
    endDateOfPreviousYear.setSeconds(endDateOfPreviousYear.getSeconds() - 1);

    const previousYearValues = [
      startDateOfPreviousYear,
      endDateOfPreviousYear,
      context.user.tenantId,
      userId === '' ? context.user.userId : userId,
    ];
    const existinAccountsResponse = await this.db.runQueryFromFile(
      'salesOutcome/existingAccounts.sql',
      previousYearValues,
      context
    );
    const exisitngAccountIds = this.getExisitingAccounts(
      existinAccountsResponse
    );
    const existingAccountSalesClosed = [
      startDate,
      endDate,
      context.user.tenantId,
      userId === '' ? context.user.userId : userId,
      exisitngAccountIds,
    ];
    const existingAccountsTotalSalesClosedResponse = await this.db.runQueryFromFile(
      'salesOutcome/exisitngAccountsSalesClosed.sql',
      existingAccountSalesClosed,
      context
    );

    let overallTotalSalesClosed = 0;
    let existingTotalSalesClosed = 0;
    if (response[0].totalSalesClosed) {
      overallTotalSalesClosed = parseInt(response[0].totalSalesClosed);
    }
    if (existingAccountsTotalSalesClosedResponse[0].totalSalesClosed) {
      existingTotalSalesClosed = parseInt(
        existingAccountsTotalSalesClosedResponse[0].totalSalesClosed
      );
    }
    else
      existingTotalSalesClosed = response[0].existingTotalSalesClosed;

    return {
      overallTotalSalesClosed,
      existingTotalSalesClosed,
    };
  }

  getExisitingAccounts(existingAccountsArray: any[]) {
    var exisitngAccountIds = [];
    existingAccountsArray.forEach(function (arrayItem) {
      exisitngAccountIds.push(arrayItem.exisitng_account_ids);
    });

    return exisitngAccountIds;
  }

  async getTotalSalesForecast(
    startDate: Date,
    endDate: Date,
    context: RequestContext
  ): Promise<number> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      context.user.userId,
    ];
    const response = await this.db.runQueryFromFile(
      'salesOutcome/totalSalesForecast.sql',
      values,
      context
    );
    return response[0].totalSalesForecast
      ? parseFloat(response[0].totalSalesForecast)
      : 0;
  }

  async getWinRate(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<number> {
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      userId === '' ? context.user.userId : userId,
    ];
    const response = await this.db.runQueryFromFile(
      'salesOutcome/winRate.sql',
      values,
      context
    );
    return response[0].winRate ? parseFloat(response[0].winRate) : 0;
  }

  async getProductColorMap(): Promise<
    Array<{ productName: string; color: string }>
  > {
    return config.productColorMap;
  }
}
