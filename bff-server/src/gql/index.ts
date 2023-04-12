import { IncomingMessage, Server, ServerResponse } from 'http';

import { FastifyInstance } from 'fastify';
import { graphql } from 'graphql';
import {
  loadFilesSync,
  makeExecutableSchema,
  Maybe,
  mergeResolvers,
} from 'graphql-tools';

import { dashboardResolvers } from './dashboard/dashboard.resolver';
import { deeperInsightResolvers } from './deeperInsights/deeperInsights.resolver';
import { keyDriversResolvers } from './keyDrivers/keyDrivers.resolver';
import { leaderBoardResolvers } from './leaderboard/leaderboard.resolver';
import { learningResolvers } from './learning/learning.resolver';
import { peopleActivityResolvers } from './peopleActivities/peopleActivities.resolver';
import { peopleDriverResolvers } from './peopleDrivers/peopleDrivers.resolver';
import { productResolvers } from './product/product.resolver';
import { productPortfolioGrossMarginResolvers } from './productPortfolioGrossMargin/productPortfolioGrossMargin.resolver';
import { repDashboardResolvers } from './repDashboard/repDashboard.resolver';
import { reportResolvers } from './report/report.resolver';
import { salesOutcomeResolvers } from './salesOutcome/salesOutcome.resolvers';
import { userResolvers } from './user/user.resolver';

const resolvers = mergeResolvers([
  dashboardResolvers,
  productResolvers,
  salesOutcomeResolvers,
  userResolvers,
  peopleDriverResolvers,
  learningResolvers,
  peopleActivityResolvers,
  deeperInsightResolvers,
  leaderBoardResolvers,
  keyDriversResolvers,
  productPortfolioGrossMarginResolvers,
  reportResolvers,
  repDashboardResolvers,
]);

const typesArray = loadFilesSync(`${__dirname}/**/*.graphql`);
const schema = makeExecutableSchema({
  typeDefs: typesArray.join('\n'),
  resolvers,
});

type GraphQLRequest = {
  readonly query: string;
  readonly operationName?: string;
  readonly variables?: Maybe<{ readonly [key: string]: any }>;
};

export const registerGQLRoute = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>
) => {
  server.post('/api/gql', async (request) => {
    const q = request.body as GraphQLRequest;
    return graphql(
      schema,
      q.query,
      resolvers,
      { requestContext: request.requestContext },
      q.variables
    );
  });
};
