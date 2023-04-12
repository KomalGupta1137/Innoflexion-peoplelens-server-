import { Dependencies } from '../../Dependencies';
import { container } from '../../ioc';
import { ProductService } from '../../services/interfaces/ProductService';
import { SalesOutcomeService } from '../../services/interfaces/SalesOutcomeService';

const getSalesOutcomeService = () =>
  container.get<SalesOutcomeService>(Dependencies.SalesOutcomeService);
const getProductService = () =>
  container.get<ProductService>(Dependencies.ProductService);

export const salesOutcomeResolvers = {
  SalesOutcome: {
    totalSalesClosed: async ({ dashboardInput, requestContext }) => {
      return getSalesOutcomeService().getTotalSalesClosed(
        dashboardInput.startDate,
        dashboardInput.endDate,
        dashboardInput.userId,
        requestContext
      );
    },
    totalSalesForecast: async ({ dashboardInput, requestContext }) => {
      return getSalesOutcomeService().getTotalSalesForecast(
        dashboardInput.startDate,
        dashboardInput.endDate,
        requestContext
      );
    },
    noOfDeals: async ({ dashboardInput, requestContext }) => {
      return getSalesOutcomeService().getNoOfDeals(
        dashboardInput.startDate,
        dashboardInput.endDate,
        dashboardInput.userId,
        requestContext
      );
    },
    winRate: async ({ dashboardInput, requestContext }) => {
      return getSalesOutcomeService().getWinRate(
        dashboardInput.startDate,
        dashboardInput.endDate,
        dashboardInput.userId,
        requestContext
      );
    },
    quotaAttainment: async ({ dashboardInput, requestContext }) => {
      return getSalesOutcomeService().getQuotaAttainment(
        dashboardInput.startDate,
        dashboardInput.endDate,
        dashboardInput.userId,
        requestContext
      );
    },
    portfolioPresented: async ({ dashboardInput, requestContext }) => {
      return getSalesOutcomeService().getPortfolioPresented(
        dashboardInput.startDate,
        dashboardInput.endDate,
        requestContext
      );
    },
    /* Product portfolio query  */
    topProductContributors: async ({ dashboardInput, requestContext }) => {
      return getSalesOutcomeService().getTopProductContributors(
        dashboardInput.startDate,
        dashboardInput.endDate,
        requestContext
      );
    },

    productPenetration: async (
      { dashboardInput, requestContext }
    ) => {
      return getSalesOutcomeService().getProductPenetration(dashboardInput.startDate, dashboardInput.endDate, requestContext);
    },
    totalSalesCycle: async (
      { dashboardInput, requestContext }
    ) => {
      return getSalesOutcomeService().getTotalSalesCycle(dashboardInput.startDate, dashboardInput.endDate, requestContext);
    }
  },
  TopProductContributor: {
    product: async ({ productId }, _, { requestContext }) => {
      return getProductService().getProductById(productId, requestContext);
    },
  },

  ProductPenetration: {
    product: async ({ productId }, _, { requestContext }) => {
      return getProductService().getProductById(productId, requestContext);
    }
  },
  TotalSalesCycle: {
    product: async ({ productId }, _, { requestContext }) => {
      return getProductService().getProductById(productId, requestContext);
    }
  },


};
