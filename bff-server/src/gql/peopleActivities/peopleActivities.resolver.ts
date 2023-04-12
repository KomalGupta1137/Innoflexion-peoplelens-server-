import { Dependencies } from '../../Dependencies';
import { container } from '../../ioc';
import { PeopleActivitiesService } from '../../services/interfaces/PeopleActivitiesService';

const getPeopleActivitiesService = () =>
  container.get<PeopleActivitiesService>(Dependencies.PeopleActivitiesService);

export const peopleActivityResolvers = {
  Query: {
    peopleActivities: (_, { dashboardInput, persona }, { requestContext }) => ({
      peopleActivityInput: {
        startDate: new Date(dashboardInput.startDate),
        endDate: new Date(dashboardInput.endDate),
        quarter: dashboardInput.quarter,
        week: dashboardInput.week,
        userId: dashboardInput.userId
          ? dashboardInput.userId
          : requestContext.user.userId,
        persona: persona,
      },
      requestContext,
    }),
  },
  PeopleActivityOutput: {
    objectiveScore: async ({ peopleActivityInput, requestContext }) => {
      return getPeopleActivitiesService().getObjectiveScore(
        peopleActivityInput.startDate,
        peopleActivityInput.endDate,
        peopleActivityInput.userId,
        peopleActivityInput.persona,
        requestContext
      );
    },
    timeAllocationScore: async ({ peopleActivityInput, requestContext }) => {
      return getPeopleActivitiesService().getTimeAllocationScore(
        peopleActivityInput.startDate,
        peopleActivityInput.endDate,
        peopleActivityInput.userId,
        peopleActivityInput.persona,
        requestContext
      );
    },
    pipelineDisciplineScore: async ({
      peopleActivityInput,
      requestContext,
    }) => {
      return getPeopleActivitiesService().getPipelineDisciplineScore(
        peopleActivityInput.startDate,
        peopleActivityInput.endDate,
        peopleActivityInput.userId,
        peopleActivityInput.persona,
        requestContext
      );
    },
    followThrough: async ({ peopleActivityInput, requestContext }) => {
      return getPeopleActivitiesService().getFollowThrough(
        peopleActivityInput.startDate,
        peopleActivityInput.endDate,
        peopleActivityInput.userId,
        peopleActivityInput.persona,
        requestContext
      );
    },
    accountCoverage: async ({ peopleActivityInput, requestContext }) => {
      return getPeopleActivitiesService().getAccountCoverage(
        peopleActivityInput.startDate,
        peopleActivityInput.endDate,
        peopleActivityInput.userId,
        requestContext);
    },
    untouchedOpps: async ({ peopleActivityInput, requestContext }) => {
      return getPeopleActivitiesService().getUntouchedOpps(
        peopleActivityInput.startDate,
        peopleActivityInput.endDate,
        requestContext
      );
    },
    dealFunnel: async ({ peopleActivityInput, requestContext }) => {
      return getPeopleActivitiesService().getDealFunnel(
        peopleActivityInput.startDate,
        peopleActivityInput.endDate,
        peopleActivityInput.quarter,
        peopleActivityInput.week,
        requestContext
      );
    },
    demoMode: async ({ }) => {
      return getPeopleActivitiesService().isDemoMode();
    },
  },
};
