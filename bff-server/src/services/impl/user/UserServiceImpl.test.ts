import 'reflect-metadata';
import { container } from '../../../ioc';
import { RequestContext } from '../../../server';
import { Dependencies } from '../../../Dependencies';
import { UserService } from '../../interfaces/UserService';

describe('Test User Service', () => {

  const context = new RequestContext({
    userId: '1a3ad1e4-f36c-4f9a-975c-ddf931520616',
    tenantId: '5b08cbc3-7393-4794-8857-a13b3b08761f',
    firstName: 'Lissy',
    lastName: 'Moverley'
  }, 'test');

  const service = container.get<UserService>(Dependencies.UserService);

  it('Should return a user', async () => {
    const p = await service.getUserById('6ef93c01-5ba6-42d7-9184-bbec5f37ca20', context);
    expect(p).toBeDefined();
    expect(p.firstName).toBe('Cally');
    expect(p.lastName).toBe('Jales');
  });

  it('Should return multiple users', async () => {
    const ps = await service.getUsersByIds(['6ef93c01-5ba6-42d7-9184-bbec5f37ca20', '88145fa6-f577-4b6f-82c1-2e2e629e9d0a'], context);
    expect(ps).toBeDefined();
    expect(ps.length).toBe(2);
    expect(ps[0].firstName).toBe('Cally');
    expect(ps[0].lastName).toBe('Jales');
    expect(ps[1].firstName).toBe('Rubin');
    expect(ps[1].lastName).toBe('Mulroy');
  });
});

