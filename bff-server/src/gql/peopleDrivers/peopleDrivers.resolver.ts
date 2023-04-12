import { container } from '../../ioc';
import { Dependencies } from '../../Dependencies';
import { PeopleDriversService } from '../../services/interfaces/PeopleDriversService';
import { UserService } from '../../services/interfaces/UserService';

const getPeopleDriversService = () =>
  container.get<PeopleDriversService>(Dependencies.PeopleDriversService);
const getUserService = () =>
  container.get<UserService>(Dependencies.UserService);

export const peopleDriverResolvers = {
  PeopleDrivers: {
    requisitionInfo: async ({ dashboardInput, requestContext }) => {
      return getPeopleDriversService().getRequisitionInfo(
        dashboardInput.startDate,
        dashboardInput.endDate,
        requestContext
      );
    },
    requiredCandidates: async ({ dashboardInput, requestContext }) => {
      return getPeopleDriversService().getRequiredCandidates(
        dashboardInput.startDate,
        dashboardInput.endDate,
        requestContext
      );
    },
    competencies: async ({ dashboardInput, requestContext }) => {
      return getPeopleDriversService().getCompetenciesInfo(
        dashboardInput.startDate,
        dashboardInput.endDate,
        dashboardInput.userId,
        requestContext
      );
    },

    attrition: async ({ dashboardInput, requestContext }) => {
      return getPeopleDriversService().getAttrition(
        dashboardInput.startDate,
        dashboardInput.endDate,
        requestContext
      );
    },
    avgTimeToHire: async ({ dashboardInput, requestContext }) => {
      return getPeopleDriversService().getAvgTimeToHire(
        dashboardInput.startDate,
        dashboardInput.endDate,
        requestContext
      );
    },

    diversity: async ({ dashboardInput, requestContext }) => {
      return getPeopleDriversService().getDiversity(
        dashboardInput.endDate,
        requestContext
      );
    },

    spanLevel: async ({ dashboardInput, requestContext }) => {
      return getPeopleDriversService().getSpanLevel(
        dashboardInput.endDate,
        requestContext
      );
    },

    myTeam: async ({ requestContext }) => {
      return await getPeopleDriversService().getMyTeam(requestContext);
    },
  },
  MyTeam: {
    user: async (_, __, { requestContext }) => {
      return getUserService().getUserById(
        requestContext.user.userId,
        requestContext
      );
    },
    // personaCount: async (myTeam: Array<{ persona: string; count: number }>) => {
    //   return myTeam;
    // },
  },
};
