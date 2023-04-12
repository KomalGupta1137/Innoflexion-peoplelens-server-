import { Dependencies } from '../../Dependencies';
import { container } from '../../ioc';
import { SalesOutcomeService } from '../../services/interfaces/SalesOutcomeService';

const getSalesOutcomeService = () =>
  container.get<SalesOutcomeService>(Dependencies.SalesOutcomeService);

export const dashboardResolvers = {
  Query: {
    getDashboardData: (_, { dashboardInput }, { requestContext }) => {
      return {
        dashboardInput: {
          startDate: new Date(dashboardInput.startDate),
          endDate: new Date(dashboardInput.endDate),
          userId: dashboardInput.userId,
        },
        requestContext,
      };
    },
  },
  DashboardOutput: {
    salesOutcome: ({ dashboardInput, requestContext }) => ({
      dashboardInput,
      requestContext,
    }),
    peopleDrivers: ({ dashboardInput, requestContext }) => ({
      dashboardInput,
      requestContext,
    }),
    productColorMap: () => {
      return getSalesOutcomeService().getProductColorMap();
    },
  },
};
