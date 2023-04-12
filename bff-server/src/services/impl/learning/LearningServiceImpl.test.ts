import 'reflect-metadata';
import { container } from '../../../ioc';
import { LearningService } from '../../interfaces/LearningService';
import { RequestContext } from '../../../server';
import { Dependencies } from '../../../Dependencies';

describe('Test Learning Query', () => {
  const context = new RequestContext(
    {
      userId: '1a3ad1e4-f36c-4f9a-975c-ddf931520616',
      tenantId: '5b08cbc3-7393-4794-8857-a13b3b08761f',
      firstName: 'Lissy',
      lastName: 'Moverley',
    },
    'test'
  );

  const service = container.get<LearningService>(Dependencies.LearningService);

  it('learningParticipation return defined', async () => {
    const response = await service.getLearningParticipation(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      'd2b7f513-df28-45b8-a356-d56e1eb40587',
      context
    );
    expect(response[0].value).toBeDefined();
    expect(response[1].value).toBeDefined();
    expect(response[2].value).toBeDefined();
  });

  it('learningParticipation return defined without product id', async () => {
    const response = await service.getLearningParticipation(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      null,
      context
    );
    expect(response[0].value).toBeDefined();
    expect(response[1].value).toBeDefined();
    expect(response[2].value).toBeDefined();
  });

  it('learningAssessment return defined', async () => {
    const response = await service.getLearningParticipation(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      'd2b7f513-df28-45b8-a356-d56e1eb40587',
      context
    );
    expect(response[0].value).toBeDefined();
    expect(response[1].value).toBeDefined();
    expect(response[2].value).toBeDefined();
  });

  it('learningAssessment return defined without product id', async () => {
    const response = await service.getLearningParticipation(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      null,
      context
    );
    expect(response[0].value).toBeDefined();
    expect(response[1].value).toBeDefined();
    expect(response[2].value).toBeDefined();
  });

  it('learningSatisfaction return defined', async () => {
    const response = await service.getLearningParticipation(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      'd2b7f513-df28-45b8-a356-d56e1eb40587',
      context
    );
    expect(response[0].value).toBeDefined();
    expect(response[1].value).toBeDefined();
    expect(response[2].value).toBeDefined();
  });

  it('learningSatisfaction return defined without productid', async () => {
    const response = await service.getLearningParticipation(
      new Date('2020-01-01'),
      new Date('2021-12-31'),
      null,
      context
    );
    expect(response[0].value).toBeDefined();
    expect(response[1].value).toBeDefined();
    expect(response[2].value).toBeDefined();
  });
});
