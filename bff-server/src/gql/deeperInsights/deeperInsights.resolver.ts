import { Dependencies } from '../../Dependencies';
import { container } from '../../ioc';
import { DeeperInsightsService } from '../../services/interfaces/DeeperInsightsService';

const getDeeperInsightService = () =>
  container.get<DeeperInsightsService>(Dependencies.DeeperInsightsService);

export const deeperInsightResolvers = {
  Query: {
    deeperInsight: (_, { dashboardInput }, { requestContext }) => {
      return  getDeeperInsightService().getDeeperInsight(    
             new Date(dashboardInput.startDate),
         new Date(dashboardInput.endDate),
        requestContext,
      )
      }
      }
};
