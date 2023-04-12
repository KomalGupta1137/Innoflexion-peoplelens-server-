import 'reflect-metadata';
import { container } from '../../../ioc';
import { RequestContext } from '../../../server';
import { Dependencies } from '../../../Dependencies';
import { ProductService } from '../../interfaces/ProductService';

describe('Test Product Service', () => {

  const context = new RequestContext({
    userId: '1a3ad1e4-f36c-4f9a-975c-ddf931520616',
    tenantId: '5b08cbc3-7393-4794-8857-a13b3b08761f',
    firstName: 'Lissy',
    lastName: 'Moverley'
  }, 'test');

  const service = container.get<ProductService>(Dependencies.ProductService);

  it('Should return a product', async () => {
    const p = await service.getProductById('8b760504-6e1a-47b5-97fb-f748e7353d9f', context);
    expect(p).toBeDefined();
    expect(p.name).toBe('Salesforce CRM');
  });

  it('Should return multiple products', async () => {
    const ps = await service.getProductsByIds(['8b760504-6e1a-47b5-97fb-f748e7353d9f', '3c6e2dc2-cf9d-40bf-a321-1f1f65f7aaa7'], context);
    expect(ps).toBeDefined();
    expect(ps.length).toBe(2);
    expect(ps[0].name).toBe('Salesforce CRM');
    expect(ps[1].name).toBe('Salesforce CPQ');
  });
});

