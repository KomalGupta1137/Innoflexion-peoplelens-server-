import 'reflect-metadata';
import { container } from '../../../ioc';
import { PeopleActivitiesService } from '../../interfaces/PeopleActivitiesService';
import { RequestContext } from '../../../server';
import { Dependencies } from '../../../Dependencies';

describe('Test People Activities', () => {
  const context = new RequestContext(
    {
      userId: '1a3ad1e4-f36c-4f9a-975c-ddf931520616',
      tenantId: '5b08cbc3-7393-4794-8857-a13b3b08761f',
      firstName: 'Lissy',
      lastName: 'Moverley',
    },
    'test'
  );

  const persona = 'AE';

  const service = container.get<PeopleActivitiesService>(
    Dependencies.PeopleActivitiesService
  );

  it('Should return > 0 for objective score', async () => {
    const objectiveScore = await service.getObjectiveScore(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context.user.userId,
      persona,
      context
    );
    expect(objectiveScore.benchMark).toBeDefined();
    expect(objectiveScore.curQuarterVal).toBeDefined();
    expect(objectiveScore.prevQuarterVal).toBeDefined();
    expect(objectiveScore.benchMark).toBeGreaterThan(0);
    expect(Number(objectiveScore.curQuarterVal)).toBeGreaterThan(0);
    expect(Number(objectiveScore.prevQuarterVal)).toBeGreaterThan(0);
  });

  it('Should return > 0 for time allocation score', async () => {
    const timeAllocationScore = await service.getTimeAllocationScore(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context.user.userId,
      persona,
      context
    );
    expect(timeAllocationScore.benchMark).toBeDefined();
    expect(timeAllocationScore.curQuarterVal).toBeDefined();
    expect(timeAllocationScore.prevQuarterVal).toBeDefined();
    expect(timeAllocationScore.benchMark).toBeGreaterThan(0);
    expect(Number(timeAllocationScore.curQuarterVal)).toBeGreaterThan(0);
    expect(Number(timeAllocationScore.prevQuarterVal)).toBeGreaterThan(0);
  });

  it('Should return > 0 for pipeline discipline', async () => {
    const pipelineDisciplineScore = await service.getPipelineDisciplineScore(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context.user.userId,
      persona,
      context
    );
    expect(pipelineDisciplineScore.benchMark).toBeDefined();
    expect(pipelineDisciplineScore.curQuarterVal).toBeDefined();
    expect(pipelineDisciplineScore.prevQuarterVal).toBeDefined();
    expect(pipelineDisciplineScore.benchMark).toBeGreaterThan(0);
    expect(Number(pipelineDisciplineScore.curQuarterVal)).toBeGreaterThan(0);
    expect(Number(pipelineDisciplineScore.prevQuarterVal)).toBeGreaterThan(0);
  });

  it('Should return > 0 for ft avg', async () => {
    const ftScore = await service.getFollowThrough(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context.user.userId,
      persona,
      context
    );
    expect(ftScore.benchMark).toBeDefined();
    expect(ftScore.curQuarterVal).toBeDefined();
    expect(ftScore.prevQuarterVal).toBeDefined();
    expect(ftScore.benchMark).toBeGreaterThan(0);
    expect(Number(ftScore.curQuarterVal)).toBeGreaterThan(0);
    expect(Number(ftScore.prevQuarterVal)).toBeGreaterThan(0);
  });

  it('Should return valid value for act cvg', async () => {
    const acCoverage = await service.getAccountCoverage(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      context.user.userId, context);
    expect(acCoverage.benchMark).toBeDefined();
    expect(acCoverage.curQuarterVal).toBeDefined();
    expect(acCoverage.prevQuarterVal).toBeDefined();
  });
});
