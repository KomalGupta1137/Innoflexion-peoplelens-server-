/* eslint-disable import/order */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-this-expression */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable functional/no-class */
/* eslint-disable functional/prefer-type-literal */
/* eslint-disable functional/prefer-readonly-type */

import { IncomingMessage, Server, ServerResponse } from 'http';

import fastRedact from 'fast-redact';
import fastify, { FastifyError, FastifyInstance } from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyJWT from 'fastify-jwt';
import metricsPlugin from 'fastify-metrics';
import { isEmpty } from 'lodash';
import { config } from 'node-config-ts';
import { Logger } from 'winston';

import { readFileSync } from 'fs';
import { Dependencies } from './Dependencies';
import { registerGQLRoute } from './gql';
import { container } from './ioc';
import { createLogger } from './logger';
import { AdminService } from './services/interfaces/AdminService';
import { AuthApiService } from './services/interfaces/AuthApiService';
import {
  BattleCardOutput,
  LeaderBoardService,
} from './services/interfaces/LeaderBoardService';
import { MeetingService } from './services/interfaces/MeetingService';
import { NotificationService } from './services/interfaces/NotificationService';
import { PeopleActivityService } from './services/interfaces/PeopleActivitiesService';
import { ProductService } from './services/interfaces/ProductService';
import {
  Recommendation,
  RecommendationService,
} from './services/interfaces/RecommendationService';
import { SMTPEmailSenderService } from './services/interfaces/SMTPEmailSenderService';
import { UserService } from './services/interfaces/UserService';

const fs = require('fs');
const { pipeline } = require('stream');
const util = require('util');
const pump = util.promisify(pipeline);

export interface LoggedInUser {
  tenantId: string;
  userId: string;
  firstName: string;
  lastName: string;
}

export class RequestContext {
  public readonly logger: Logger;
  public readonly managerMock: boolean;
  public readonly repMock: boolean;

  constructor(
    public readonly user: LoggedInUser,
    public readonly requestId: string
  ) {
    this.logger = createLogger(requestId);
    this.managerMock = false;
    this.repMock = true;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    requestContext: RequestContext;
  }
}
const redact = fastRedact({
  paths: ['headers.authorization', 'headers.referer'],
});

export function createServer(): FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> {
  const server: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
  > = fastify({
    bodyLimit: 500 * 1024 * 1024,
    logger: {
      level: config.logLevel,
      prettyPrint: false,
      serializers: {
        res(reply: any) {
          return redact({
            statusCode: reply.statusCode,
            statusMessage: reply.statusMessage,
            headers: reply.getHeaders(),
          });
        },
        err(err: FastifyError) {
          return {
            type: err.name,
            message: err.message,
            stack: err.stack,
            code: err.code,
            statusCode: err.statusCode,
          };
        },
      },
    },
  });
  server.register(require('fastify-multipart'));
  server.register(metricsPlugin, { endpoint: '/metrics' });
  server.register(fastifyJWT, {
    secret: readFileSync(config.jwt.publicKey).toString('utf8').trim(),
    verify: {
      algorithms: ['RS256'],
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
    },
    formatUser: (user: any) => {
      const l: LoggedInUser = {
        tenantId: user.tenantId,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        userId: user.user.userId,
      };
      return l;
    },
  });
  server.register(require('fastify-print-routes'));
  server.addHook('onRequest', (request: any, reply, done) => {
    if (request.method === 'GET' && request.url === '/check') {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/getBattleCards'
    ) {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/setNotification'
    ) {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/getActiveNotifications'
    ) {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/getPastNotifications'
    ) {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/getProducts'
    ) {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/getMeetings'
    ) {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/getPipelineData'
    ) {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/getManagers'
    ) {
      done();
    } else if (
      request.method === 'POST' &&
      request.url === '/api/getTimeAllocation'
    ) {
      done();
    } else if (request.method === 'POST' && request.url === '/api/getUsers') {
      done();
    } else if (request.method === 'GET' && request.url === '/api/hello') {
      done();
    } else if (
      request.method === 'OPTIONS' ||
      request.url.startsWith('/api/unauth') ||
      request.url === '/api/token'
    ) {
      done();
    } else if (
      process.env.NODE_ENV !== 'production' &&
      request.url.startsWith('/api/gql') &&
      (request.query as any).i !== undefined
    ) {
      done();
    } else if (
      request.method == 'POST' &&
      request.url === '/api/getUserSetting'
    ) {
      done();
    } else if (
      request.method == 'POST' &&
      request.url === '/api/updateUserSetting'
    ) {
      done();
    } else if (request.method == 'POST' && request.url === '/api/getOutcomes') {
      done();
    } else if (
      request.method == 'GET' &&
      request.url === '/api/getSalesOutcomeScale'
    ) {
      done();
    } else if (
      request.method == 'POST' &&
      request.url === '/api/setSalesOutcomeScale'
    ) {
      done();
    } else if (
      request.method == 'GET' &&
      request.url === '/api/setDefaultSalesOutcomeScale'
    ) {
      done();
    } else if (
      request.method == 'GET' &&
      request.url === '/api/getUploadedSystems'
    ) {
      done();
    } else if (request.method == 'POST' && request.url === '/api/uploadFile') {
      done();
    } 
    else if(request.method == 'POST' && request.url === 'api/insertAdminUsersList'){
      done()
    }
    else if(request.method == 'POST' && request.url === 'api/insertAdminUsers'){
      done()
    }
    else {
      request
        .jwtVerify()
        .then(() => {
          done();
        })
        .catch((e) => reply.send(e));
    }
  });
  server.get('/check', (_, reply) => {
    reply.send({});
  });

  server.get('/api/token', (request, reply) => {
    const token = (request.headers.authorization || '')
      .substr('Bearer '.length)
      .trim();
    if (isEmpty(token)) {
      reply.code(403).send({
        message: 'Authorization header missing',
      });
      return;
    }
    getToken(token)
      .then((res) => {
        reply.send({
          jwtToken: res.jwtToken,
        });
      })
      .catch((error) => {
        reply.code(500).send({
          message: error.message,
        });
      });
  });

  function getToken(token: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        authApiService()
          .getToken(token)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (e) {
        console.log('error', e);
      }
    });
  }

  const getLeaderBoardService = () =>
    container.get<LeaderBoardService>(Dependencies.LeaderBoardService);

  const authApiService = () =>
    container.get<AuthApiService>(Dependencies.AuthApiService);

  const recommendationService = () =>
    container.get<RecommendationService>(Dependencies.RecommendationService);

  const getProductService = () =>
    container.get<ProductService>(Dependencies.ProductService);

  const getMeetingService = () =>
    container.get<MeetingService>(Dependencies.MeetingService);

  const getNotificationService = () =>
    container.get<NotificationService>(Dependencies.NotificationService);

  const getUserService = () =>
    container.get<UserService>(Dependencies.UserService);

  const getEmailService = () =>
    container.get<SMTPEmailSenderService>(Dependencies.SMTPEmailSenderService);

  const getPeopleActivitiesService = () =>
    container.get<PeopleActivityService>(Dependencies.PeopleActivityService);

  const getAdminService = () =>
    container.get<AdminService>(Dependencies.AdminService);

   

    server.post('/api/insertAdminUsers', async (req, reply) => {
      const string = JSON.stringify(req.body);
      const objectValue = JSON.parse(string);
      const userName = objectValue['userName'];
      const email = objectValue['email']
       getAdminService()
        .InsertAdminUsers(userName,email)
        .then((res) => {
          reply.send(res);
        });
    }); 

    server.post('/api/insertAdminUsersList', async (req, reply) => {
      const data = await (req as any).file();
      const filePath = `File_Uploads/${data.filename}`
      await pump(data.file, fs.createWriteStream(`../${filePath}`));
      getAdminService()
        .InsertAdminUsersList(filePath)
        .then((res) => {
          reply.send(res);
        })
        .catch((err) => reply.send(err));
    });

    

  server.post('/api/getProducts', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const tenantId = objectValue['tenantId'];
    getProductService()
      .getAllProductsByTenantId(tenantId)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/getTimeAllocation', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const userId = objectValue['userId'];
    const startDate = objectValue['startDate'];
    const endDate = objectValue['endDate'];
    const week = objectValue['week'];
    getPeopleActivitiesService()
      .getTimeAllocation(userId, startDate, endDate, week)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/getPipelineData', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const startDate = objectValue['startDate'];
    const endDate = objectValue['endDate'];
    getMeetingService()
      .getPipelineData(startDate, endDate)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/getMeetings', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const tenantId = objectValue['tenantId'];
    const userId = objectValue['userId'];
    const startDate = objectValue['startDate'];
    const endDate = objectValue['endDate'];
    getMeetingService()
      .getAllMeetings(tenantId, userId, startDate, endDate)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/getManagers', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const userId = objectValue['userId'];
    getUserService()
      .getManagers(userId)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/getActiveNotifications', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const tenantId = objectValue['tenantId'];
    const userId = objectValue['userId'];
    getNotificationService()
      .getActiveNotifications(tenantId, userId)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/getPastNotifications', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const tenantId = objectValue['tenantId'];
    const userId = objectValue['userId'];
    getNotificationService()
      .getPastNotifications(tenantId, userId)
      .then((res) => {
        reply.send(res);
      });
  });

  const actionMap = new Map();
  actionMap.set('default', 'to focus your nudges')
  actionMap.set('Sales Activities', 'to focus on cadence with your "Activities"')
  actionMap.set('Meet with Customers', 'to meet with customers and multi thread deals')
  actionMap.set('Meet with Product Teams', 'to meet with Product Managers / Technical marketing Engineers')
  actionMap.set('Pipeline Discipline', 'to focus on cadence with their "Pipeline"')
  actionMap.set('Follow Up Ratio', 'to focus on their "Follow Up Ratio with Customers"')
  actionMap.set('Build "Strategic Skills"', 'to build Strategy skills by Shadowing manager / Role plays')
  actionMap.set('Practice "Sales Techniques"', 'to practice sales techniques with Role plays / Shadowing')
  actionMap.set('Practice "Communication" with Manager', 'to practice Communication with Manager / Role plays')
  actionMap.set('"Technical Skills" - Course', 'to take the "Technical Skills - Advanced" course')

  const getAction = (action) => actionMap.get(action) ?? actionMap.get('default');

  server.post('/api/setNotification', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const tenantId = objectValue['tenantId'];
    const parentId = objectValue['parentId'];
    const data = objectValue['data'];
    const userId = data['userId'];
    const course = data['course'];
    const rec_id = data['recId'];
    const action = course['name'];
    const actionCompleteDate = course['compleDate'];

    getNotificationService()
      .setNotification(
        tenantId,
        userId,
        parentId,
        action,
        actionCompleteDate,
        rec_id
      )
      .then((res) => {
        reply.send(res);
        getNotificationService()
          .getNotificationById(tenantId, userId, res[0].id)
          .then((result) => {
            const message = `${result[0].managerName +
              ' has requested you' +
              ' ' +
              getAction(result[0].action) +
              ' and complete by ' +
              new Date(result[0].actionCompleteDate).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )
              }.`;
            getEmailService().sendEmail(
              result[0].email,
              message,
              result[0].action,
              result[0].actionCompleteDate
            );
          });
      });
  });

  server.post('/api/getOutcomes', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const tenantId = objectValue['tenantId'];
    const userId = objectValue['userId'];
    getNotificationService()
      .getOutcomeTrackerByUserId(tenantId, userId)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/getUsers', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const parentId = objectValue['parentId'];
    const tenantId = objectValue['tenantId'];
    const userId = objectValue['userId'];
    const startDate = objectValue['startDate'];
    const endDate = objectValue['endDate'];
    getUserService()
      .getUsersByParentId(parentId, tenantId, userId, startDate, endDate)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/getBattleCards', async (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const startDate = objectValue['startDate'];
    const endDate = objectValue['endDate'];
    let quarter = objectValue['quarter'];
    const outcome = objectValue['outcome'];
    const product = objectValue['product'];
    const userId1 = objectValue['userId1'];
    const userId2 = objectValue['userId2'];

    const battleCardType = '';
    let battleCards: BattleCardOutput[] = [];
    quarter == 0 ? (quarter = 5) : quarter;
    let res = await callFastAPI(userId1, userId2, outcome);
    console.log("Rs +", res);

    getRecommendation(userId1, outcome, product, quarter)
      .then((_response: any) => {
        const jsonObject = res;
        const driver = jsonObject.most_dominant_driver.trim();
        let driver2 = jsonObject.dominant_driver_2.trim();
        let driver3 = jsonObject.dominant_driver_3.trim();
        const rec_id = jsonObject.id;

        getLeaderBoardService()
          .getBattleCardsDS(
            userId1,
            startDate,
            endDate,
            driver,
            jsonObject.poor_rep,
            battleCardType,
            null
          )
          .then((value) => {
            battleCards = value;
            driver2 = driver2.trimEnd();
            if (driver2 == 'Sales Techniques - Closing Skills') {
              battleCards[0].battleCardData[1] = {
                title: 'Competencies',
                name: 'Sales Techniques',
                value: jsonObject.X_poor_2,
                valueType: 'continuous',
              };
            } else if (driver2 == 'Pipeline Discipline') {
              battleCards[0].battleCardData[1] = {
                title: 'Activity',
                name: 'Pipeline Discipline',
                value: jsonObject.X_poor_2,
                valueType: 'continuous',
              };
            } else if (driver2 == 'Product Knowledge') {
              battleCards[0].battleCardData[1] = {
                title: 'Learning',
                name: 'Product Knowledge',
                value: jsonObject.X_poor_2,
                valueType: 'discrete',
              };
            } else if (driver2 == 'Follow-Up') {
              battleCards[0].battleCardData[1] = {
                title: 'Activity',
                name: 'Follow-Up with Customers',
                value: jsonObject.X_poor_2,
                valueType: 'discrete',
              };
            } else if (driver2 == 'Coachability') {
              battleCards[0].battleCardData[1] = {
                title: 'Professional Skills',
                name: 'Coachability',
                value: jsonObject.X_poor_2,
                valueType: 'discrete',
              };
            } else if (driver2 == 'Communication') {
              battleCards[0].battleCardData[1] = {
                title: 'Competencies',
                name: 'Communication Skill',
                value: jsonObject.X_poor_2,
                valueType: 'discrete',
              };
            } else if (driver2 == 'Strategy') {
              battleCards[0].battleCardData[1] = {
                title: 'Competencies',
                name: 'Strategy Skill',
                value: jsonObject.X_poor_2,
                valueType: 'discrete',
              };
            } else if (driver2 == 'Technical Skills') {
              battleCards[0].battleCardData[1] = {
                title: 'Learning',
                name: 'Technical Skills',
                value: jsonObject.X_poor_2,
                valueType: 'discrete',
              };
            } else if (driver2 == 'Activity Score') {
              battleCards[0].battleCardData[1] = {
                title: 'Activity',
                name: 'Total Activity',
                value: jsonObject.X_poor_2,
                valueType: 'continuous',
              };
            } else if (driver2 == 'Sales Techniques - Closing skills') {
              battleCards[0].battleCardData[1] = {
                title: 'Competencies',
                name: 'Sales Techniques',
                value: jsonObject.X_poor_2,
                valueType: 'continuous',
              };
            } else if (driver2 == 'Time With Customers') {
              battleCards[0].battleCardData[1] = {
                title: 'Time Allocation',
                name: 'With Customers',
                value: jsonObject.X_poor_2,
                valueType: 'continuous',
              };
            } else if (driver2 == 'Time With Product Team') {
              battleCards[0].battleCardData[1] = {
                title: 'Time Allocation',
                name: 'With Product Team',
                value: jsonObject.X_poor_2,
                valueType: 'continuous',
              };
            }
            driver3 = driver3.trimEnd();
            if (driver3 == 'Sales Techniques - Closing Skills') {
              battleCards[0].battleCardData[2] = {
                title: 'Competencies',
                name: 'Sales Techniques',
                value: jsonObject.X_poor_2,
                valueType: 'continuous',
              };
            } else if (driver3 == 'Pipeline Discipline') {
              battleCards[0].battleCardData[2] = {
                title: 'Activity',
                name: 'Pipeline Discipline',
                value: jsonObject.X_poor_3,
                valueType: 'continuous',
              };
            } else if (driver3 == 'Product Knowledge') {
              battleCards[0].battleCardData[2] = {
                title: 'Learning',
                name: 'Product Knowledge',
                value: jsonObject.X_poor_3,
                valueType: 'discrete',
              };
            } else if (driver3 == 'Follow-Up') {
              battleCards[0].battleCardData[2] = {
                title: 'Activity',
                name: 'Follow-Up with Customers',
                value: jsonObject.X_poor_3,
                valueType: 'discrete',
              };
            } else if (driver3 == 'Coachability') {
              battleCards[0].battleCardData[2] = {
                title: 'Professional Skills',
                name: 'Coachability',
                value: jsonObject.X_poor_3,
                valueType: 'discrete',
              };
            } else if (driver3 == 'Communication') {
              battleCards[0].battleCardData[2] = {
                title: 'Competencies',
                name: 'Communication Skill',
                value: jsonObject.X_poor_3,
                valueType: 'discrete',
              };
            } else if (driver3 == 'Strategy') {
              battleCards[0].battleCardData[2] = {
                title: 'Competencies',
                name: 'Strategy Skill',
                value: jsonObject.X_poor_3,
                valueType: 'discrete',
              };
            } else if (driver3 == 'Technical Skills') {
              battleCards[0].battleCardData[2] = {
                title: 'Learning',
                name: 'Technical Skills',
                value: jsonObject.X_poor_3,
                valueType: 'discrete',
              };
            } else if (driver3 == 'Activity Score') {
              battleCards[0].battleCardData[2] = {
                title: 'Activity',
                name: 'Total Activity',
                value: jsonObject.X_poor_3,
                valueType: 'continuous',
              };
            } else if (driver3 == 'Sales Techniques - Closing skills') {
              battleCards[0].battleCardData[2] = {
                title: 'Competencies',
                name: 'Sales Techniques',
                value: jsonObject.X_poor_3,
                valueType: 'continuous',
              };
            } else if (driver3 == 'Time With Customers') {
              battleCards[0].battleCardData[2] = {
                title: 'Time Allocation',
                name: 'With Customers',
                value: jsonObject.X_poor_3,
                valueType: 'continuous',
              };
            } else if (driver3 == 'Time With Product Team') {
              battleCards[0].battleCardData[2] = {
                title: 'Time Allocation',
                name: 'With Product Team',
                value: jsonObject.X_poor_3,
                valueType: 'continuous',
              };
            }

            let action: string = battleCards[0].battleCardActions[0].actionName;
            let course: string = battleCards[0].battleCardActions[0].course;
            let title: string = battleCards[0].title;

            if (driver == 'Product Knowledge') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
              action = action.replace('ProductName', product);
              course = course.replace('ProductName', product);
              title = title.replace('ProductName', product);
              battleCards[0].battleCardData.map((item) => {
                if (item.title.includes('ProductName'))
                  item.title = item.title.replace('ProductName', product);
              });
            } else if (driver == 'Communication') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
            } else if (driver == 'Sales Techniques - Closing skills') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
            } else if (driver == 'Coachability') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
            } else if (driver == 'Follow-Up') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
            } else if (driver == 'Negotiation Skills') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
            } else if (driver == 'Dealing with complexity') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
            } else if (driver == 'Strategy') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
            } else if (driver == 'Technical Skills') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
            } else if (driver == 'Activity Score') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
            } else if (driver == 'Sales Techniques - Closing skills') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
              action = action.replace('X', jsonObject.X_poor);
              action = action.replace('Y', jsonObject.Y_poor);
            } else if (driver == 'Time With Customers') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
            } else if (driver == 'Time With Product Team') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
            } else if (driver == 'Pipeline Discipline') {
              battleCards[0].battleCardData[0].value = jsonObject.X_poor;
              action = action.replace(
                '...',
                '<b>' + jsonObject.poor_rep + '</b>'
              );
            }

            battleCards[0].battleCardActions[0].actionName = action;
            battleCards[0].battleCardActions[0].course = course;
            battleCards[0].battleCardActions[0].rec_id = rec_id;

            battleCards[0].title = title;
            //reuse same battlecard of poor_rep for the good_rep, change values!
            const goodRepData = JSON.parse(JSON.stringify(battleCards[0]));
            goodRepData.battleCardActions = [];
            goodRepData.userId = jsonObject.good_rep;
            goodRepData.name = jsonObject.good_rep;
            goodRepData.battleCardData[0].value = jsonObject.X_good;
            goodRepData.battleCardData[1].value = jsonObject.X_good_2;
            goodRepData.battleCardData[2].value = jsonObject.X_good_3;
            battleCards[1] = goodRepData;
          })
          .finally(() => reply.send({ battleCard: battleCards }));
      })
      .catch((error) => {
        console.log(error);
      });
  });

  function getRecommendation(
    user_id: string,
    outcome: string,
    product: string,
    quarter: string
  ) {
    return new Promise<Recommendation>(function (resolve, reject) {
      try {
        recommendationService()
          .getRecommendation(user_id, outcome, product, quarter)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (e) {
        console.log('error', e);
      }
    });
  }

  let outcomeMap = new Map();
  outcomeMap.set('Quota Attainment', 'qa');
  outcomeMap.set('Deal Size', 'ds');
  outcomeMap.set('Win Rate', 'wr');
  outcomeMap.set('Sales Cycle', 'sc');

  const { GoogleAuth } = require('google-auth-library');
  const auth = new GoogleAuth();
  const targetAudience = 'https://fastapi-service1-l3aktg5oca-uw.a.run.app';

  async function callFastAPI(user_id_1, user_id_2, outcome) {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './config/env/peoplelens-pov-1-0-5f793a19cc03.json';
    const client = await auth.getIdTokenClient(targetAudience);
    let url = 'https://fastapi-service1-l3aktg5oca-uw.a.run.app/compare?';
    outcome = outcomeMap.get(outcome);
    url = url + `user_id1=${user_id_1}&user_id2=${user_id_2}&quarer=2020_Q1&outcome=${outcome}`
    const res = await client.request({ url });
    return res.data;
  }

  server.post('/api/getUserSetting', (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const userId = objectValue['userId'];
    getUserService()
      .getUserSettingByUserId(userId)
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/updateUserSetting', (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    const userId = objectValue['userId'];
    const fullName = objectValue['fullName'];
    const jobTitle = objectValue['jobTitle'];
    const notification = objectValue['notification'];
    const calendar = objectValue['calendar'];
    const timeline = objectValue['timeline'];
    const overview = objectValue['overview'];
    const leaderboard = objectValue['leaderboard'];
    const reports = objectValue['reports'];
    const people = objectValue['people'];
    const customer = objectValue['customer'];
    getUserService()
      .updateUserSettingByUserId(
        userId,
        notification,
        calendar,
        timeline,
        overview,
        leaderboard,
        reports,
        fullName,
        jobTitle,
        people,
        customer
      )
      .then((res) => {
        reply.send(res);
      });
  });

  server.get('/api/getSalesOutcomeScale', (_, reply) => {
    getUserService()
      .getSalseOutcomeScale()
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/setSalesOutcomeScale', (req, reply) => {
    const string = JSON.stringify(req.body);
    const objectValue = JSON.parse(string);
    getUserService()
      .setSalesOutcomeScale(objectValue.data)
      .then((res) => {
        reply.send(res);
      });
  });

  server.get('/api/setDefaultSalesOutcomeScale', (_, reply) => {
    getUserService()
      .setDefaultSalesOutcomeScale()
      .then((res) => {
        reply.send(res);
      });
  });

  server.post('/api/uploadFile', async (req, reply) => {
    const data = await (req as any).file();
    const filePath = `File_Uploads/${data.filename}`
    await pump(data.file, fs.createWriteStream(`../${filePath}`));
    const system = data.fields.system.value;
    const sub_system = data.fields.sub_system.value;
    const reportName = data.fields.reportName.value;
    const startDate = data.fields.startDate.value;
    const endDate = data.fields.endDate.value;
    getAdminService()
      .uploadFile(system, sub_system, reportName, startDate, endDate, filePath)
      .then((res) => {
        reply.send(res);
      })
      .catch((err) => reply.send(err));
  });

  server.get('/api/getUploadedSystems', async (_, reply) => {
    getAdminService().getUploadedSystems().then((res) => (reply.send(res)));
  });

  server.get('/api/hello', (_, res) => {
    res.send({ express: 'Hello From Express' });
  });

  server.register(fastifyCors, {
    origin:
      process.env.NODE_ENV !== 'production'
        ? true
        : [
          'https://dev-api.peoplelens.ai',
          'https://dev-api.peoplelens.io',
          'https://app.peoplelens.ai',
          'https://app.peoplelens.io',
          'https://www.app.peoplelens.ai',
          'https://www.app.peoplelens.io',
        ],
  });
  registerGQLRoute(server);

  server.decorateRequest('requestContext', () => ({}));
  server.addHook('preHandler', (req: any, res, next) => {
    const loggedInUser = req.user as LoggedInUser;
    if (!isEmpty(loggedInUser)) {
      req.requestContext = new RequestContext(loggedInUser, req.id);
    }
    const allowedPaths = ["/api/uploadFile"];
    if (allowedPaths.includes(req.routerPath)) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST");
      res.header("Access-Control-Allow-Headers", "*");
    }
    next();
  });

  server.setErrorHandler((error, req, reply) => {
    req.log.error(error);
    reply.send(error);
  });
  return server;
}
