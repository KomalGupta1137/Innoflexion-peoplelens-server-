import 'reflect-metadata';
import { container } from '../../../ioc';
import { LeaderBoardService } from '../../interfaces/LeaderBoardService';
import { RequestContext } from '../../../server';
import { Dependencies } from '../../../Dependencies';

describe('Test Leader Board', () => {
  const context = new RequestContext(
    {
      userId: '1a3ad1e4-f36c-4f9a-975c-ddf931520616',
      tenantId: '5b08cbc3-7393-4794-8857-a13b3b08761f',
      firstName: 'Lissy',
      lastName: 'Moverley',
    },
    'test'
  );

  const service = container.get<LeaderBoardService>(
    Dependencies.LeaderBoardService
  );

  it('Should return all bucket info for Quota Attainment', async () => {
    const quoteCounts = await service.getQuotaAttainmentCounts(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context
    );
    expect(quoteCounts.avgMetricVal).toBeDefined();
    expect(quoteCounts.maxMetricVal).toBeDefined();
    expect(quoteCounts.metricDimension).toBeDefined();
    expect(quoteCounts.minMetricVal).toBeDefined();
    expect(quoteCounts.avgMetricVal).toBeDefined();
    expect(quoteCounts.totBuckets).toBeDefined();
    expect(quoteCounts.rangeCount).toBeDefined();
    expect(quoteCounts.rangeCount.length).toBeGreaterThanOrEqual(0);
  });

  it('Should return a perticular bucket info for Quota Attainment', async () => {
    const quoteBucketData = await service.getQuotaAttainmentData(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      0,
      context
    );
    expect(quoteBucketData.length).toBeGreaterThanOrEqual(0);
  });

  it('Should return all bucket info for Win Rate', async () => {
    const winRateCounts = await service.getWinRateCounts(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context
    );
    expect(winRateCounts.avgMetricVal).toBeDefined();
    expect(winRateCounts.maxMetricVal).toBeDefined();
    expect(winRateCounts.metricDimension).toBeDefined();
    expect(winRateCounts.minMetricVal).toBeDefined();
    expect(winRateCounts.avgMetricVal).toBeDefined();
    expect(winRateCounts.totBuckets).toBeDefined();
    expect(winRateCounts.rangeCount).toBeDefined();
    expect(winRateCounts.rangeCount.length).toBeGreaterThanOrEqual(0);
  });

  it('Should return a perticular bucket info for Win Rate', async () => {
    const winRateBucketData = await service.getWinRateData(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      0,
      context
    );
    expect(winRateBucketData.length).toBeGreaterThanOrEqual(0);
  });

  it('Should return all bucket info for Deal Size', async () => {
    const dealSizeCounts = await service.getDealSizeCounts(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context
    );
    expect(dealSizeCounts.avgMetricVal).toBeDefined();
    expect(dealSizeCounts.maxMetricVal).toBeDefined();
    expect(dealSizeCounts.metricDimension).toBeDefined();
    expect(dealSizeCounts.minMetricVal).toBeDefined();
    expect(dealSizeCounts.avgMetricVal).toBeDefined();
    expect(dealSizeCounts.totBuckets).toBeDefined();
    expect(dealSizeCounts.rangeCount).toBeDefined();
    expect(dealSizeCounts.rangeCount.length).toBeGreaterThanOrEqual(0);
  });

  it('Should return a perticular bucket info for Deal Size', async () => {
    const dealSizeBucketData = await service.getDealSizeData(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      0,
      context
    );
    expect(dealSizeBucketData.length).toBeGreaterThanOrEqual(0);
  });

  it('Should return all bucket info for Sales Cycle', async () => {
    const salesCycleCounts = await service.getSalesCycleCounts(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context
    );
    expect(salesCycleCounts.avgMetricVal).toBeDefined();
    expect(salesCycleCounts.maxMetricVal).toBeDefined();
    expect(salesCycleCounts.metricDimension).toBeDefined();
    expect(salesCycleCounts.minMetricVal).toBeDefined();
    expect(salesCycleCounts.avgMetricVal).toBeDefined();
    expect(salesCycleCounts.totBuckets).toBeDefined();
    expect(salesCycleCounts.rangeCount).toBeDefined();
    expect(salesCycleCounts.rangeCount.length).toBeGreaterThanOrEqual(0);
  });

  it('Should return a perticular bucket info for Sales Cycle', async () => {
    const salesCycleBucketData = await service.getSalesCycleData(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      0,
      context
    );
    expect(salesCycleBucketData.length).toBeGreaterThanOrEqual(0);
  });

  describe('Test Leader Board Battle Cards', () => {
    it('Should return all battle cards for Sales Cycle', async () => {
      const allBattleCardsForUser = await service.getBattleCards(
        new Date('2020-01-01'),
        new Date('2021-12-31'),
        'Sales Cycle',
        context.user.userId,
        '',
        context
      );
      expect(allBattleCardsForUser.length).toBeGreaterThanOrEqual(0);
    });

    it('Should return a battle cards with a type for Sales Cycle', async () => {
      const battleCardWithType = await service.getBattleCards(
        new Date('2020-01-01'),
        new Date('2021-12-31'),
        'Sales Cycle',
        context.user.userId,
        'Learning Battlecard',
        context
      );
      expect(battleCardWithType.length).toBeGreaterThanOrEqual(0);
    });

    it('Should return all battle cards for Win Rate', async () => {
      const allBattleCardsForUser = await service.getBattleCards(
        new Date('2020-01-01'),
        new Date('2021-12-31'),
        'Win Rate',
        context.user.userId,
        '',
        context
      );
      expect(allBattleCardsForUser.length).toBeGreaterThanOrEqual(0);
    });

    it('Should return a battle cards with a type for Win Rate', async () => {
      const battleCardWithType = await service.getBattleCards(
        new Date('2020-01-01'),
        new Date('2021-12-31'),
        'Win Rate',
        context.user.userId,
        'Learning Battlecard',
        context
      );
      expect(battleCardWithType.length).toBeGreaterThanOrEqual(0);
    });

    it('Should return all battle cards for Deal Size', async () => {
      const allBattleCardsForUser = await service.getBattleCards(
        new Date('2020-01-01'),
        new Date('2021-12-31'),
        'Deal Size',
        context.user.userId,
        '',
        context
      );
      expect(allBattleCardsForUser.length).toBeGreaterThanOrEqual(0);
    });

    it('Should return a battle cards with a type for Deal Size', async () => {
      const battleCardWithType = await service.getBattleCards(
        new Date('2020-01-01'),
        new Date('2021-12-31'),
        'Deal Size',
        context.user.userId,
        'Learning Battlecard',
        context
      );
      expect(battleCardWithType.length).toBeGreaterThanOrEqual(0);
    });

    it('Should return all battle cards for Quota Attainment', async () => {
      const allBattleCardsForUser = await service.getBattleCards(
        new Date('2020-01-01'),
        new Date('2021-12-31'),
        'Quota Attainment',
        context.user.userId,
        '',
        context
      );
      expect(allBattleCardsForUser.length).toBeGreaterThanOrEqual(0);
    });

    it('Should return a battle cards with a type for Quota Attainment', async () => {
      const battleCardWithType = await service.getBattleCards(
        new Date('2020-01-01'),
        new Date('2021-12-31'),
        'Quota Attainment',
        context.user.userId,
        'Learning Battlecard',
        context
      );
      expect(battleCardWithType.length).toBeGreaterThanOrEqual(0);
    });
  });
});
