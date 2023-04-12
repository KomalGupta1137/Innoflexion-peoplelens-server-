import { NotificationService } from '../../interfaces/NotificationService';
import { inject, injectable } from 'inversify';
import { Dependencies } from '../../../Dependencies';
import { Database } from '../../interfaces/Database';

@injectable()
export class NotificationServiceImpl implements NotificationService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  async setNotification(
    tenantId,
    userId,
    parentId,
    action,
    actionCompleteDate,
    rec_id
  ): Promise<any> {
    const values = [
      tenantId,
      userId,
      parentId,
      action,
      actionCompleteDate,
      rec_id,
    ];
    const response = await this.db.runQuery(
      'notification/setNotification.sql',
      values
    );
    return response;
  }

  getActiveNotifications(tenantId, userId): Promise<Array<any>> {
    return new Promise<Array<any>>((resolve, reject) => {
      this.getAllNotificationsForUser(tenantId, userId)
        .then((res) => {
          var result: any = [];
          res.forEach(r => {
            if (r.doneDate == null) result.push(r);
          })
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getPastNotifications(tenantId, userId): Promise<Array<any>> {
    return new Promise<Array<any>>((resolve, reject) => {
      this.getAllNotificationsForUser(tenantId, userId)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getNotificationById(tenantId, userId, id): Promise<Array<any>> {
    return new Promise<Array<any>>((resolve, reject) => {
      this.getNotification(tenantId, userId, id)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getOutcomeTrackerByUserId(tenantId, userId): Promise<Array<any>> {
    return new Promise<Array<any>>((resolve, reject) => {
      this.getOutcomeTracker(tenantId, userId)
        .then((res) => {
          var result: any = [];
          res.forEach(r => {
            if (r.doneDate != null) result.push(r);
          })
          resolve(result);
          // resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getNotification(tenantId, userId, id): Promise<any> {
    const values = [tenantId, userId, id];
    const response = await this.db.runQuery(
      'notification/getNotificationById.sql',
      values
    );
    return response;
  }

  private async getAllNotificationsForUser(tenantId, userId): Promise<any[]> {
    const values = [tenantId, userId];

    const response = await this.db.runQuery(
      'notification/getNotifications.sql',
      values,
      false
    );
    return response;
  }

  private async getOutcomeTracker(tenantId, userId): Promise<any> {
    const values = [tenantId, userId];
    const response = await this.db.runQuery(
      'notification/getOutcomeTracker.sql',
      values,
      false
    );

    // for loop on the res
    let quaters = {
      Q1: {
        startDate: 'year-01-01T00:00:00.00Z',
        endDate: 'year-04-01T00:00:00.00Z',
      },
      Q2: {
        startDate: 'year-04-01T00:00:00.00Z',
        endDate: 'year-07-01T00:00:00.00Z',
      },
      Q3: {
        startDate: 'year-07-01T00:00:00.00Z',
        endDate: 'year-10-01T00:00:00.00Z',
      },
      Q4: {
        startDate: 'year-10-01T00:00:00.00Z',
        endDate: 'year-12-01T00:00:00.00Z',
      },
    };
    for (const res of response) {
      // res[0].due_date = "2021-01-18T06:38:58.226Z";
      // res[0].done_date = "2022-10-01T06:38:58.226Z";

      const d = new Date('2022-09-01T06:38:58.226Z'); //done date
      const d2 = new Date();

      let Difference_In_Time = d2.getTime() - d.getTime(); // todays date -  completion date should be above  31
      var Difference_In_Days = Math.round(
        Difference_In_Time / (1000 * 3600 * 24)
      );
      if (Difference_In_Days > 31) {
        let month = d.getMonth();
        let year = d.getFullYear();

        let currentMonth = d2.getMonth();
        let currentYear = d2.getFullYear();

        let currentQ;
        let nudgeQ;

        if (month >= 0 && month <= 2) {
          nudgeQ = 1;
        } else if (month >= 3 && month <= 5) {
          nudgeQ = 2;
        } else if (month >= 6 && month <= 8) {
          nudgeQ = 3;
        } else if (month >= 9 && month <= 11) {
          nudgeQ = 4;
        }

        if (currentMonth >= 0 && currentMonth <= 2) {
          currentQ = 1;
        } else if (currentMonth >= 3 && currentMonth <= 5) {
          currentQ = 2;
        } else if (currentMonth >= 6 && currentMonth <= 8) {
          currentQ = 3;
        } else if (currentMonth >= 9 && currentMonth <= 11) {
          currentQ = 4;
        }
        let chartObj = [];

        for (let index = 0; index < 6; index++) {
          const obj = { xAxis: '', value: 0, nudge: '' };

          if (currentQ - 1 == 0) {
            obj.xAxis = `${currentYear} Q${currentQ}`;
            chartObj.push(obj);
            currentYear = currentYear - 1;
            currentQ = 4;
          } else {
            obj.xAxis = `${currentYear} Q${currentQ}`;
            chartObj.push(obj);
            currentQ--;
          }
        }

        for (var key in chartObj) {
          const obj = chartObj[key];
          const strArr = obj.xAxis.split(' ');
          // let startD = quaters[strArr[1]].startDate.replace('year', strArr[0]);// change back to this
          let startD = quaters[strArr[1]].startDate.replace('year', '2020');

          // let endD = quaters[strArr[1]].endDate.replace('year', strArr[0]);// change back to this
          let endD = quaters[strArr[1]].endDate.replace('year', '2020');

          const values = [tenantId, userId, startD, endD];
          let response;

          if (
            res.outcome
              .toLowerCase()
              .replace(' ', '')
              .search('quotaattainment') >= 0
          ) {
            response = await this.db.runQuery(
              'notification/getQuotaAttainmentBarData.sql',
              values
            );
          }

          if (
            res.outcome.toLowerCase().replace(' ', '').search('salescycle') >= 0
          ) {
            response = await this.db.runQuery(
              'notification/salesCycleBarData.sql',
              values
            );
          }

          if (
            res.outcome.toLowerCase().replace(' ', '').search('winrate') >= 0
          ) {
            response = await this.db.runQuery(
              'notification/winrateBarData.sql',
              values
            );
          }

          if (res.outcome.toLowerCase().replace(' ', '').search('deals') >= 0) {
            response = await this.db.runQuery(
              'notification/noOfDealsBarData.sql',
              values
            );
          }
          obj.value = parseInt(response[0].quotaAttainment);
          if (obj.xAxis == `${year} Q${nudgeQ}`) {
            obj.nudge = 'DONE DATE';
          }
        }
        chartObj.reverse();
        res['outcomeTrackerChartData'] = chartObj;
      }
    }
    return response;
  }
}
