import {
  Recommendation,
  RecommendationService,
} from '../../interfaces/RecommendationService';
import { inject, injectable } from 'inversify';
import { Database } from '../../interfaces/Database';
import { Dependencies } from '../../../Dependencies';
@injectable()
export class RecommendationServiceImpl implements RecommendationService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  getRecommendation(
    id: string,
    outcome: string,
    product: string,
    quarter: string
  ): Promise<Recommendation> {
    return new Promise<Recommendation>((resolve, reject) => {
      this.getRecommendationForUser(id, outcome, product, quarter)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async getRecommendationForUser(
    id: string,
    _outcome: string,
    _product: string,
    _quarter: string
  ): Promise<Recommendation> {

    const values = [id];
    const response = await this.db.runQuery(
      'recommendation/getRecommendation.sql',
      values
    );
    return response[0];
  }
}
