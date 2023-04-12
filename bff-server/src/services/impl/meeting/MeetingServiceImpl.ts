import { Meeting, MeetingService } from '../../interfaces/MeetingService';
import { inject, injectable } from 'inversify';
import { Dependencies } from '../../../Dependencies';
import { Database } from '../../interfaces/Database';

@injectable()
export class MeetingServiceImpl implements MeetingService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  getPipelineData(
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.getPipelineDataFromDb(startDate, endDate)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getAllMeetings(
    tenantId: string,
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.getAllMeetingsFromDb(tenantId, userId, startDate, endDate)
        .then((res) => {
          var result = [];
          var _new = [];
          var existing = [];
          res.forEach((r) => {
            r.status == 'Customer' ? existing.push(r) : _new.push(r);
          });
          result.push(_new);
          result.push(existing);
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private async getAllMeetingsFromDb(
    tenantId: string,
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Meeting[]> {
    console.log(tenantId, userId);
    // const values = [userId, startDate, endDate];
    const values = [startDate, endDate];
    const response = await this.db.runQuery(
      'meeting/getAllMeetings.sql',
      values
    );
    return response;
  }

  private async getPipelineDataFromDb(
    startDate: string,
    endDate: string
  ): Promise<Meeting[]> {
    const values = [startDate, endDate];
    const response = await this.db.runQuery(
      'meeting/newPipeline.sql',
      values
    );
    return response;
  }
}
