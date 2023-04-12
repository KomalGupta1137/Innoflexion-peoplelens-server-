import { readFileSync } from 'fs';
import { inject, injectable } from 'inversify';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import JwksRsa from 'jwks-rsa';
import { isEmpty } from 'lodash';
import { config } from 'node-config-ts';
import { Dependencies } from '../../Dependencies';
import { AuthApiService } from '../interfaces/AuthApiService';
import { Database } from '../interfaces/Database';

@injectable()
export class AuthApiServiceImpl implements AuthApiService {
  private readonly auth0JWKSClient: JwksRsa.JwksClient;
  private readonly auth0JWTVerifyOptions: VerifyOptions;
  private readonly privateKey: string;

  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) {
    this.auth0JWKSClient = JwksRsa({
      cache: true,
      cacheMaxEntries: 20,
      rateLimit: true,
      jwksRequestsPerMinute: 20,
      jwksUri: `${config.auth0.issuer}.well-known/jwks.json`,
    });

    this.auth0JWTVerifyOptions = {
      audience: config.auth0.audience,
      issuer: config.auth0.issuer,
      algorithms: ['RS256'],
    };

    this.privateKey = readFileSync(config.jwt.privateKey)
      .toString('utf8')
      .trim();
  }

  async getToken(token: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // const token = req.getAuth0token();
      if (isEmpty(token)) {
        const e = {
          name: 'Unauthorized',
          message: 'Missing Token',
          code: 403,
        };
        reject(e);
        return;
      }

      jwt.verify(
        token,
        this.getAuth0PublicKeyOrSecret.bind(this),
        this.auth0JWTVerifyOptions,
        (err, decoded) => {
          if (err || !decoded) {
            const e = {
              name: 'Unauthorized',
              message: 'Invalid Token',
              code: 403,
            };
            reject(e);
          } else {
            const email = (decoded as any).email;
            this.getTokenForUser(email)
              .then((response) => resolve(response))
              .catch((error) => {
                reject(error);
              });
          }
        }
      );
    });
  }

  private getAuth0PublicKeyOrSecret(header, cb) {
    this.auth0JWKSClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, key.getPublicKey());
      }
    });
  }

  private async findUserByEmail(email: string): Promise<any[] | null> {
    const values = [email];
    const response = await this.db.runQuery('findUserByEmail.sql', values);
    return response;
  }

  private getTokenForUser(email: string) {
    return new Promise<any>((resolve, reject) => {
      this.findUserByEmail(email).then((res) => {
        const userAndTenant = res;
        if (!userAndTenant) {
          const e = {
            name: 'Not found',
            message: 'User not found',
            code: 404,
          };
          reject(e);
          return;
        }
        const tenantId = res[0].tenantId;
        const user: any = {};
        user.firstName = res[0].firstName;
        user.lastName = res[0].lastName;
        user.userId = res[0].userId;
        user.designation = res[0].designation;
        user.persona = res[0].persona;
        jwt.sign(
          {
            tenantId,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              userId: user.userId,
              persona: user.persona,
              designation: user.designation,
            },
          },
          this.privateKey,
          {
            algorithm: 'RS256',
            expiresIn: config.jwt.expiresInSeconds,
            issuer: config.jwt.issuer,
            audience: config.jwt.audience,
          },
          (err, jwtToken) => {
            if (err || !jwtToken) {
              const e = {
                name: 'Signing error',
                message: err?.message || '',
                code: 500,
              };
              reject(e);
              return;
            }
            const response: any = {};
            response.tenantId = tenantId;
            response.user = user;
            response.jwtToken = jwtToken;
            resolve(response);
          }
        );
      });
    });
  }
}
