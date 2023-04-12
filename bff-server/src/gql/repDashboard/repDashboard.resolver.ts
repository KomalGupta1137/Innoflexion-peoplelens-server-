import { Dependencies } from '../../Dependencies';
import { container } from '../../ioc';
import { RepDashboardService } from '../../services/interfaces/RepDashboardService';

const getRepDashboardService = () =>
  container.get<RepDashboardService>(Dependencies.RepDashboardService);

export const repDashboardResolvers = {
  Query: {
    RepDashboardData: (_, { repDashboardInput }, { requestContext }) => {
      return {
        repDashboardInput: {
          startDate: new Date(repDashboardInput.startDate),
          endDate: new Date(repDashboardInput.endDate),
          thresholdValue: repDashboardInput.thresholdValue,
        },
        requestContext,
      };
    },
  },
  RepDashboardOutput: {
    pipeline: async ({ repDashboardInput, requestContext }) => {
      return getRepDashboardService().getPipeline(
        repDashboardInput.startDate,
        repDashboardInput.endDate,
        requestContext
      );
    },
    myLearning: async ({ repDashboardInput, requestContext }) => {
      return getRepDashboardService().getMyLearning(
        repDashboardInput.startDate,
        repDashboardInput.endDate,
        requestContext
      );
    },
    okrName: async ({ repDashboardInput, requestContext }) => {
      return getRepDashboardService().getSalesOKR(
        repDashboardInput.startDate,
        repDashboardInput.endDate,
        requestContext
      );
    },
    okrSummary: async ({ repDashboardInput, requestContext }) => {
      return getRepDashboardService().getOKRSummary(
        repDashboardInput.startDate,
        repDashboardInput.endDate,
        requestContext
      );
    },

    earnings: async ({ repDashboardInput, requestContext }) => {
      return getRepDashboardService().getEarnings(
        repDashboardInput.startDate,
        repDashboardInput.endDate,
        repDashboardInput.thresholdValue,
        requestContext
      );
    },
    rewards: async ({ repDashboardInput, requestContext }) => {
      return getRepDashboardService().getRewards(
        repDashboardInput.startDate,
        repDashboardInput.endDate,
        requestContext
      );
    },
  },
};
