import { Dependencies } from '../../Dependencies';
import { container } from '../../ioc';
import { ProductPortfolioGrossMarginService } from '../../services/interfaces/ProductPortfolioGrossMarginService';

const getProductPortfolioGrossMarginService = () =>
  container.get<ProductPortfolioGrossMarginService>(
    Dependencies.ProductPortfolioGrossMarginService
  );

export const productPortfolioGrossMarginResolvers = {
  Query: {
    portfolioGrossMargin: (_, { dashboardInput }, { requestContext }) => {
      return getProductPortfolioGrossMarginService().getProductPortfolioGrossMargin(
        new Date(dashboardInput.startDate),
        new Date(dashboardInput.endDate),
        requestContext
      );
    },
  },
};
