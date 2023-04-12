import { inject, injectable } from 'inversify';

import { Dependencies } from '../../../Dependencies';
import { RequestContext } from '../../../server';
import { Database } from '../../interfaces/Database';
import {
  DealsClosed,
  DealSize,
  QuotaAttainment,
  ReportOutput,
  ReportService,
  SalesClosed,
  SalesCycle,
  WinRate
} from '../../interfaces/ReportService';

@injectable()
export class ReportServiceImpl implements ReportService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) {
  }

  async getReportData(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<ReportOutput> {
    return {
      salesClosed: await this.getSalesClosed(
        startDate,
        endDate,
        userId,
        context
      ),
      dealsClosed: await this.getDealsClosed(
        startDate,
        endDate,
        userId,
        context
      ),
      dealSize: await this.getDealSize(context),
      quotaAttainment: await this.getQuotaAttainment(
        startDate,
        endDate,
        userId,
        context
      ),
      winRate: await this.getWinRate(startDate, endDate, userId, context),
      salesCylce: await this.getSalesCycle(startDate, endDate, userId, context)
    };
  }

  async getSalesClosed(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<SalesClosed> {
    console.log(userId);
    const values = [startDate, endDate, context.user.tenantId];
    const response = await this.db.runQueryFromFile(
      'report/salesClosed.sql',
      values,
      context
    );
    const response1 = await this.db.runQueryFromFile(
      'report/getSalesOutcomeScale.sql',
      [],
      context
    );
    const obj = response1.find((ele) => ele.outcome == 'SalesClosed');
    return {
      // totalSalesClosed: parseInt(response[0].totalSalesClosed),
      maxSalesClosed: parseInt(obj.maximum) * 1000,
      minSalesClosed: parseInt(obj.minimum) * 1000,
      avgSalesClosed: parseInt(response[0].avgSalesClosed),

    };
    // }
  }

  async getDealsClosed(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<DealsClosed> {
    console.log(userId);
    let values = [startDate, endDate, context.user.tenantId];

    let response = await this.db.runQueryFromFile(
      'report/avgDealsClosed.sql',
      values,
      context
    );
    const avgDealsClosed = parseInt(response[0].avgDealsClosed);
    values = [startDate, endDate, context.user.tenantId];

    response = await this.db.runQueryFromFile(
      'report/maxDealsClosed.sql',
      values,
      context
    );
    const response1 = await this.db.runQueryFromFile(
      'report/getSalesOutcomeScale.sql',
      [],
      context
    );
    const obj = response1.find((ele) => ele.outcome == 'DealsClosed');
    return {
      // maxDealsClosed: parseInt(response[0].maxDealsClosed),
      maxDealsClosed: parseInt(obj.maximum),
      minDealsClosed: parseInt(obj.minimum),
      avgDealsClosed: avgDealsClosed
    };
    // }
  }

  async getSalesCycle(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<SalesCycle> {
    console.log(userId);
    const values = [
      startDate,
      endDate,
      context.user.tenantId,
      userId ? userId :context.user.userId
    ];
    const response = await this.db.runQueryFromFile(
      'report/totalSalesCycle.sql',
      values,
      context
    );
    const values1 = [startDate, endDate, context.user.tenantId];
    const response1 = await this.db.runQueryFromFile(
      'report/salesCycle.sql',
      values1,
      context
    );
    const response2 = await this.db.runQueryFromFile(
      'report/getSalesOutcomeScale.sql',
      [],
      context
    );
    const obj = response2.find((ele) => ele.outcome == 'SalesCycle');
    return {
      totalSalesCycle: parseInt(response[0].totalSalesCycle),
      maxSalesCycle: parseInt(obj.maximum),
      minSalesCycle: parseInt(obj.minimum),
      avgSalesCycle: parseInt(response1[0].avgSalesCycle)
    };
  }

  async getQuotaAttainment(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<QuotaAttainment> {
    console.log(userId);
    const values = [startDate, endDate, context.user.tenantId];
    const response = await this.db.runQueryFromFile(
      'report/quotaAttainment.sql',
      values,
      context
    );
    const response1 = await this.db.runQueryFromFile(
      'report/getSalesOutcomeScale.sql',
      [],
      context
    );
    const obj = response1.find((ele) => ele.outcome == 'QuotaAttainment');

    return {
      // maxQuotaAttainment: parseInt(response[0].maxQuotaAttainment),
      maxQuotaAttainment: parseInt(obj.maximum),
      minQuotaAttainment: parseInt(obj.minimum),
      avgQuotaAttainment: parseInt(response[0].avgQuotaAttainment)
    };
    // }
  }

  async getWinRate(
    startDate: Date,
    endDate: Date,
    userId: string,
    context: RequestContext
  ): Promise<WinRate> {
    console.log(userId);
    const values = [startDate, endDate, context.user.tenantId];
    const response = await this.db.runQueryFromFile(
      'report/winRate.sql',
      values,
      context
    );
    // if (context.managerMock === true) {
    //   return {
    //     maxWinRate: 100,
    //     avgWinRate: 24,
    //   };
    // } else {
    const response1 = await this.db.runQueryFromFile(
      'report/getSalesOutcomeScale.sql',
      [],
      context
    );
    const obj = response1.find((ele) => ele.outcome == 'WinRate');
    return {
      // maxWinRate: parseInt(response[0].maxWinRate),
      maxWinRate: parseInt(obj.maximum),
      minWinRate: parseInt(obj.minimum),
      avgWinRate: parseInt(response[0].avgWinRate)
    };
    // }
  }

  async getDealSize(
    context: RequestContext
  ): Promise<DealSize> {
    const response1 = await this.db.runQueryFromFile(
      'report/getSalesOutcomeScale.sql',
      [],
      context
    );
    const obj = response1.find((ele) => ele.outcome == 'DealSize');
    return {
      // maxWinRate: parseInt(response[0].maxWinRate),
      maxDealSize: parseInt(obj.maximum) * 1000,
      minDealSize: parseInt(obj.minimum) * 1000,
    };
    // }
  }
}
