import {container} from '../../ioc';
import {Dependencies} from '../../Dependencies';
import {ProductService} from '../../services/interfaces/ProductService';

const getProductService = () => (container.get<ProductService>(Dependencies.ProductService));

export const productResolvers = {
  Query: {
    product: async (_, {productId}, {requestContext}) => {
      return getProductService().getProductById(productId, requestContext);
    },
    products: async (_, {productIds}, {requestContext}) => {
      return getProductService().getProductsByIds(productIds, requestContext);
    },
    allProducts: async (_, __, {requestContext}) => {
      return getProductService().getAllProducts(requestContext);
    }
  }
};
