import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Dependencies } from './Dependencies';
import { config } from 'node-config-ts';
import { container } from './ioc';

const server = container.get<FastifyInstance<Server, IncomingMessage, ServerResponse>>(Dependencies.Server);
server
  .listen({
    host: config.server.host,
    port: config.server.port
  })
  .then(_ => {
    console.log('----- SERVER STARTED -----');
  });

