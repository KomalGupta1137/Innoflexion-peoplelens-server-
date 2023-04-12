import { inject, injectable } from 'inversify';

import { Dependencies } from '../../../Dependencies';
// import { salesOutcomeResolvers } from '../../../gql/salesOutcome/salesOutcome.resolvers';
import { RequestContext } from '../../../server';
import { Database } from '../../interfaces/Database';
import { LearningService } from '../../interfaces/LearningService';

@injectable()
export class LearningServiceImpl implements LearningService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) {}
  async getLearningParticipation(
    startDate: Date,
    endDate: Date,
    productId: String,
    context: RequestContext
  ): Promise<{ name: String; value: number }[]> {
    const values =
      productId === null
        ? [startDate, endDate, context.user.tenantId, context.user.userId]
        : [
            startDate,
            endDate,
            context.user.tenantId,
            context.user.userId,
            productId,
          ];
    const response = await this.db.runQueryFromFile(
      productId === null
        ? 'learning/learningParticipation.sql'
        : 'learning/learningParticipationWithProduct.sql',
      values,
      context
    );
    const output = [];
    output.push({ name: 'Not Started', value: response[0].not_started });
    output.push({ name: 'In Progess', value: response[0].in_progress });
    output.push({ name: 'Completed', value: response[0].completed });
    return output;
  }
  async getLearnerAssessments(
    startDate: Date,
    endDate: Date,
    productId: String,
    context: RequestContext
  ): Promise<{ name: String; value: number }[]> {
    const values =
      productId === null
        ? [startDate, endDate, context.user.tenantId, context.user.userId]
        : [
            startDate,
            endDate,
            context.user.tenantId,
            context.user.userId,
            productId,
          ];

    const response = await this.db.runQueryFromFile(
      productId === null
        ? 'learning/learnerAssessment.sql'
        : 'learning/learnerAssessmentWithProduct.sql',
      values,
      context
    );
    const output = [];

    const responseData = response;
    let low = 0;
    let medium = 0;
    let high = 0;
    for (const score of responseData) {
      if (score.scores === 'low') {
        low++;
      }
      if (score.scores === 'medium') {
        medium++;
      }
      if (score.scores === 'high') {
        high++;
      }
    }
    output.push({ name: '> 4', value: high });
    output.push({ name: '2 - 4', value: medium });
    output.push({ name: '< 2', value: low });
    return output;
  }
  async getLearnerSatisfaction(
    startDate: Date,
    endDate: Date,
    productId: String,
    context: RequestContext
  ): Promise<{ name: String; value: number }[]> {
    const values =
      productId === null
        ? [startDate, endDate, context.user.tenantId, context.user.userId]
        : [
            startDate,
            endDate,
            context.user.tenantId,
            context.user.userId,
            productId,
          ];
    const response = await this.db.runQueryFromFile(
      productId === null
        ? 'learning/learnerSatisfaction.sql'
        : 'learning/learnerSatisfactionWithProduct.sql',
      values,
      context
    );
    const output = [];
    if (productId === null) {
      output.push({ name: '> 4', value: response[0].high });
      output.push({ name: '2 - 4', value: response[0].medium });
      output.push({ name: '< 2', value: response[0].low });
    } else {
      let low = 0;
      let medium = 0;
      let high = 0;
      for (const score of response) {
        if (score.scores === 'low') {
          low++;
        }
        if (score.scores === 'medium') {
          medium++;
        }
        if (score.scores === 'high') {
          high++;
        }
      }
      output.push({ name: '> 4', value: high });
      output.push({ name: '2 - 4', value: medium });
      output.push({ name: '< 2', value: low });
    }

    return output;
  }
}
