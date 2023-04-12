import { RequestContext } from '../../server';

export interface LearningService {
  getLearningParticipation(
    startDate: Date,
    endDate: Date,
    productId: String,
    context: RequestContext
  ): Promise<Array<{ name: String; value: number }>>;
  getLearnerAssessments(
    startDate: Date,
    endDate: Date,
    productId: String,
    context: RequestContext
  ): Promise<Array<{ name: String; value: number }>>;
  getLearnerSatisfaction(
    startDate: Date,
    endDate: Date,
    productId: String,
    context: RequestContext
  ): Promise<Array<{ name: String; value: number }>>;
}
