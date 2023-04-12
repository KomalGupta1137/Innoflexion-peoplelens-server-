import 'reflect-metadata';

import { IncomingMessage, Server, ServerResponse } from 'http';

import { FastifyInstance } from 'fastify';
import { Container } from 'inversify';

import { Dependencies } from './Dependencies';
import { createServer } from './server';
import { DatabaseImpl } from './services/impl/DatabaseImpl';
import { DeeperInsightServiceImpl } from './services/impl/deeperInsight/DeeperInsightServiceImpl';
import { LeaderBoardServiceImpl } from './services/impl/leaderBoard/LeaderBoardServiceImpl';
import { LearningServiceImpl } from './services/impl/learning/LearningServiceImpl';
import { PeopleActivitiesServiceImpl } from './services/impl/peopleActivities/PeopleActivitiesServiceImpl';
import { PeopleDriversServiceImpl } from './services/impl/peopleDrivers/PeopleDriversServiceImpl';
import { ProductServiceImpl } from './services/impl/product/ProductServiceImpl';
import { SalesOutcomeServiceImpl } from './services/impl/salesOutcome/SalesOutcomeServiceImpl';
import { UserServiceImpl } from './services/impl/user/UserServiceImpl';
import { Database } from './services/interfaces/Database';
import { DeeperInsightsService } from './services/interfaces/DeeperInsightsService';
import { LeaderBoardService } from './services/interfaces/LeaderBoardService';
import { LearningService } from './services/interfaces/LearningService';
import { PeopleActivitiesService } from './services/interfaces/PeopleActivitiesService';
import { PeopleDriversService } from './services/interfaces/PeopleDriversService';
import { ProductService } from './services/interfaces/ProductService';
import { SalesOutcomeService } from './services/interfaces/SalesOutcomeService';
import { UserService } from './services/interfaces/UserService';
import { KeyDriversService } from './services/interfaces/KeyDriversService';
import { KeyDriversServiceImpl } from './services/impl/keyDrivers/KeyDriversServiceImpl';
import { ProductPortfolioGrossMarginServiceImpl } from './services/impl/productPortfolioGrossMargin/ProductPortfolioGrossMarginServiceImpl';
import { ProductPortfolioGrossMarginService } from './services/interfaces/ProductPortfolioGrossMarginService';

import { ReportService } from './services/interfaces/ReportService';
import { ReportServiceImpl } from './services/impl/report/ReportServiceImpl';

import { RepDashboardServiceImpl } from './services/impl/repDashboard/repDashboardServiceImpl';
import { RepDashboardService } from './services/interfaces/RepDashboardService';
import { AuthApiServiceImpl } from './services/impl/AuthApiServiceImpl';
import { AuthApiService } from './services/interfaces/AuthApiService';
import { RecommendationServiceImpl } from './services/impl/recommendation/RecommendationServiceImpl';
import { RecommendationService } from './services/interfaces/RecommendationService';
import { MeetingService } from './services/interfaces/MeetingService';
import { MeetingServiceImpl } from './services/impl/meeting/MeetingServiceImpl';
import { NotificationService } from './services/interfaces/NotificationService';
import { NotificationServiceImpl } from './services/impl/notification/NotificationServiceImpl';
import { SMTPEmailSenderImpl } from './services/impl/SMTPEmailSender';
import { SMTPEmailSenderService } from './services/interfaces/SMTPEmailSenderService';
import { PeopleActivityService } from './services/interfaces/PeopleActivitiesService';
import { AdminService } from './services/interfaces/AdminService';
import { AdminServiceImpl } from './services/impl/admin/AdminServiceImpl';

const server = createServer();
const container = new Container();
container
  .bind<Database>(Dependencies.Database)
  .to(DatabaseImpl)
  .inSingletonScope();
container
  .bind<AuthApiService>(Dependencies.AuthApiService)
  .to(AuthApiServiceImpl)
  .inSingletonScope();
container
  .bind<RecommendationService>(Dependencies.RecommendationService)
  .to(RecommendationServiceImpl)
  .inSingletonScope();
container
  .bind<SalesOutcomeService>(Dependencies.SalesOutcomeService)
  .to(SalesOutcomeServiceImpl)
  .inSingletonScope();
container
  .bind<FastifyInstance<Server, IncomingMessage, ServerResponse>>(
    Dependencies.Server
  )
  .toConstantValue(server);
container
  .bind<ProductService>(Dependencies.ProductService)
  .to(ProductServiceImpl)
  .inSingletonScope();
container
  .bind<SMTPEmailSenderService>(Dependencies.SMTPEmailSenderService)
  .to(SMTPEmailSenderImpl)
  .inSingletonScope();
container
  .bind<MeetingService>(Dependencies.MeetingService)
  .to(MeetingServiceImpl)
  .inSingletonScope();
container
  .bind<NotificationService>(Dependencies.NotificationService)
  .to(NotificationServiceImpl)
  .inSingletonScope();
container
  .bind<UserService>(Dependencies.UserService)
  .to(UserServiceImpl)
  .inSingletonScope();
container
  .bind<PeopleDriversService>(Dependencies.PeopleDriversService)
  .to(PeopleDriversServiceImpl)
  .inSingletonScope();
container
  .bind<LearningService>(Dependencies.LearningService)
  .to(LearningServiceImpl)
  .inSingletonScope();
container
  .bind<PeopleActivityService>(Dependencies.PeopleActivityService)
  .to(PeopleActivitiesServiceImpl)
  .inSingletonScope();
container
  .bind<PeopleActivitiesService>(Dependencies.PeopleActivitiesService)
  .to(PeopleActivitiesServiceImpl);
container
  .bind<DeeperInsightsService>(Dependencies.DeeperInsightsService)
  .to(DeeperInsightServiceImpl);

container
  .bind<LeaderBoardService>(Dependencies.LeaderBoardService)
  .to(LeaderBoardServiceImpl);

container
  .bind<KeyDriversService>(Dependencies.KeyDriversService)
  .to(KeyDriversServiceImpl);

container
  .bind<ProductPortfolioGrossMarginService>(
    Dependencies.ProductPortfolioGrossMarginService
  )
  .to(ProductPortfolioGrossMarginServiceImpl);

container.bind<ReportService>(Dependencies.ReportService).to(ReportServiceImpl);
// container
//   .bind<SalesOKRService>(Dependencies.SalesOKRService)
//   .to(SalesOKRServiceImpl);
container
  .bind<RepDashboardService>(Dependencies.RepDashboardService)
  .to(RepDashboardServiceImpl);
container
  .bind<AdminService>(Dependencies.AdminService)
  .to(AdminServiceImpl);

export { container };
