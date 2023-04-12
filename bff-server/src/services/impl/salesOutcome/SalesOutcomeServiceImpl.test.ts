import 'reflect-metadata';
import { container } from '../../../ioc';
import { SalesOutcomeService } from '../../interfaces/SalesOutcomeService';
import { RequestContext } from '../../../server';
import { Dependencies } from '../../../Dependencies';

describe('Test Sales Outcome', () => {
  const context = new RequestContext(
    {
      userId: '1a3ad1e4-f36c-4f9a-975c-ddf931520616',
      tenantId: '5b08cbc3-7393-4794-8857-a13b3b08761f',
      firstName: 'Lissy',
      lastName: 'Moverley',
    },
    'test'
  );

  const service = container.get<SalesOutcomeService>(
    Dependencies.SalesOutcomeService
  );

  it('Should return > 0 for no of deals', async () => {
    const deals = await service.getNoOfDeals(
      new Date('2020-01-01'),
      new Date(),
      '',
      context
    );
    expect(deals).toBeDefined();
    expect(deals).toBeGreaterThan(0);
  });

  it('Should return > 0 for total sales closed', async () => {
    const deals = await service.getTotalSalesClosed(
      new Date('2020-01-01'),
      new Date(),
      '',
      context
    );
    expect(deals).toBeDefined();
    expect(deals).toBeGreaterThan(0);
  });

  it('Should return > 0 for total sales forecast', async () => {
    const forecast = await service.getTotalSalesForecast(
      new Date('2020-01-01'),
      new Date(),
      context
    );
    expect(forecast).toBeDefined();
    expect(forecast).toBeGreaterThan(0);
  });

  it('Should return > 0 for portfolio presented', async () => {
    const portfolioPresented = await service.getPortfolioPresented(
      new Date('2020-01-01'),
      new Date(),
      context
    );
    expect(portfolioPresented).toBeDefined();
    expect(portfolioPresented).toBeGreaterThan(0);
  });

  it('Should return some penetration in products', async () => {
    const penetration = await service.getProductPenetration(
      new Date('2020-01-01'),
      new Date(),
      context
    );
    expect(penetration).toBeDefined();
    expect(penetration.length).toBeGreaterThan(0);
  });

  it('Should return > 0 for quota attained', async () => {
    const attainment = await service.getQuotaAttainment(
      new Date('2020-01-01'),
      new Date(),
      '',
      context
    );
    expect(attainment).toBeDefined();
    expect(attainment).toBeGreaterThan(0);
  });

  it('Should return > 0 for win rate', async () => {
    const winRate = await service.getWinRate(
      new Date('2020-01-01'),
      new Date(),
      '',
      context
    );
    expect(winRate).toBeDefined();
    expect(winRate).toBeGreaterThan(0);
  });

  it('Should return some top contributors', async () => {
    const topContributors = await service.getTopProductContributors(
      new Date('2020-01-01'),
      new Date(),
      context
    );
    expect(topContributors).toBeDefined();
    expect(topContributors.length).toBeGreaterThan(0);
  });
});
