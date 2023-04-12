import 'reflect-metadata';
import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { container } from './ioc';
import { Dependencies } from './Dependencies';

beforeAll(async () => {
  const server = container.get<
    FastifyInstance<Server, IncomingMessage, ServerResponse>
  >(Dependencies.Server);
  await server.ready();
});
describe('Server', () => {
  it('Should return server instance', async () => {
    const server = container.get<
      FastifyInstance<Server, IncomingMessage, ServerResponse>
    >(Dependencies.Server);
    expect(server).toBeDefined();
  });

  it('Should return a token', async () => {
    const server = container.get<
      FastifyInstance<Server, IncomingMessage, ServerResponse>
    >(Dependencies.Server);
    expect(server).toBeDefined();

    const response = await server.inject({
      method: 'GET',
      url: '/api/unauth/testToken',
      query: {
        email: 'pigud@humro.navy',
      },
    });
    const json = response.json<{ jwtToken: string }>();
    expect(json).toBeDefined();
    expect(json.jwtToken).toBeDefined();
  });
});
