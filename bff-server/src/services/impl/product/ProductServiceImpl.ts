import { Product, ProductService } from '../../interfaces/ProductService';
import { RequestContext } from '../../../server';
import { inject, injectable } from 'inversify';
import { Dependencies } from '../../../Dependencies';
import { Database } from '../../interfaces/Database';

@injectable()
export class ProductServiceImpl implements ProductService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) {}

  getProductById(id: string, context: RequestContext): Promise<Product> {
    return new Promise<Product>((resolve, reject) => {
      this.getProduct(context.user.tenantId, id)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private async getProduct(tenantId: string, id: string): Promise<Product> {
    const values = [tenantId, id];
    const response = await this.db.runQuery('product/getProduct.sql', values);
    return response[0];
  }

  getProductsByIds(
    ids: Array<string>,
    context: RequestContext
  ): Promise<Array<Product>> {
    return new Promise<Array<Product>>((resolve, reject) => {
      this.getProducts(context.user.tenantId, ids)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private async getProducts(
    tenantId: string,
    ids: string[]
  ): Promise<Product[]> {
    const values = [tenantId, ids];
    const response = await this.db.runQuery('product/getProducts.sql', values);
    return response[0];
  }

  getAllProducts(context: RequestContext): Promise<Array<Product>> {
    return new Promise<Array<Product>>((resolve, reject) => {
      this.getAllProductsFromDb(context.user.tenantId)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getAllProductsByTenantId(tenantId: string): Promise<Array<Product>> {
    return new Promise<Array<Product>>((resolve, reject) => {
      this.getAllProductsFromDb(tenantId)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private async getAllProductsFromDb(tenantId: string): Promise<Product[]> {
    const values = [tenantId];
    const response = await this.db.runQuery(
      'product/getAllProducts.sql',
      values
    );
    return response;
  }
}
