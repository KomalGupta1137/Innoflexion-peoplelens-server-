import { RequestContext } from '../../server';

export interface Product {
  id: string;
  name: string;
}

export interface ProductService {
  getProductById(id: string, context: RequestContext): Promise<Product>;

  getProductsByIds(
    ids: Array<string>,
    context: RequestContext
  ): Promise<Array<Product>>;

  getAllProducts(context: RequestContext): Promise<Array<Product>>;

  getAllProductsByTenantId(tenantId: string): Promise<Array<Product>>;
}
