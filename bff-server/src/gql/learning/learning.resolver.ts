import { Dependencies } from '../../Dependencies';
import { container } from '../../ioc';
import { LearningService } from '../../services/interfaces/LearningService';

const getLearningService = () =>
  container.get<LearningService>(Dependencies.LearningService);

export const learningResolvers = {
  Query: {
    getLearningData: (_, { learningInput }, { requestContext }) => ({
      learningInput: {
        startDate: new Date(learningInput.startDate),
        endDate: new Date(learningInput.endDate),
        productId: learningInput.productId,
      },
      requestContext,
    }),
  },
  LearningOutput: {
    learningParticipation: async ({ learningInput, requestContext }) => {
      return getLearningService().getLearningParticipation(
        learningInput.startDate,
        learningInput.endDate,
        learningInput.productId,
        requestContext
      );
    },
    learnerAssessments: async ({ learningInput, requestContext }) => {
      return getLearningService().getLearnerAssessments(
        learningInput.startDate,
        learningInput.endDate,
        learningInput.productId,
        requestContext
      );
    },
    learnerSatisfaction: async ({ learningInput, requestContext }) => {
      return getLearningService().getLearnerSatisfaction(
        learningInput.startDate,
        learningInput.endDate,
        learningInput.productId,
        requestContext
      );
    },
  },
};
