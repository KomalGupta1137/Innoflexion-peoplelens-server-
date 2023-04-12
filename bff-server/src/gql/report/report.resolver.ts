import { container } from '../../ioc';
import { ReportService } from '../../services/interfaces/ReportService';
import { Dependencies } from '../../Dependencies';

const getReportService = () =>
  container.get<ReportService>(Dependencies.ReportService);

export const reportResolvers = {
  Query: {
    report: (_, { dashboardInput }, { requestContext }) => {
      return getReportService().getReportData(
        dashboardInput.startDate,
        dashboardInput.endDate,
        dashboardInput.userId,
        requestContext
      );
    },
  },
};
