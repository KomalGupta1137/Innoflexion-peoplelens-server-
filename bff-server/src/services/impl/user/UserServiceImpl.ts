import { User, UserService, UserSetting } from '../../interfaces/UserService';
import { RequestContext } from '../../../server';
import { inject, injectable } from 'inversify';
import { Database } from '../../interfaces/Database';
import { Dependencies } from '../../../Dependencies';
@injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @inject(Dependencies.Database.toString()) private readonly db: Database
  ) { }

  getUserById(id: string, context: RequestContext): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.getUser(id, context)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getUser(id: string, context: RequestContext): Promise<User> {
    const values = [context.user.tenantId, id];
    const response = await this.db.runQueryFromFile(
      'user/getUser.sql',
      values,
      context
    );
    // console.log('ress : ', response, id);
    return response[0];
  }

  async getUser_ById(id: string, tenantId: string): Promise<User> {
    const values = [tenantId, id];
    const response = await this.db.runQuery('user/getUser.sql', values);
    return response[0];
  }

  getUsersByIds(
    ids: Array<string>,
    context: RequestContext
  ): Promise<Array<User>> {
    return new Promise<Array<User>>((resolve, reject) => {
      this.getUsers(ids, context)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getUsers(ids: string[], context: RequestContext): Promise<User[]> {
    const values = [ids];
    const response = await this.db.runQueryFromFile(
      'user/getUsers.sql',
      values,
      context
    );
    return response;
  }

  getManagers(userId: string): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.getAllManagers(userId)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("err........", err)
          reject(err);
        });
    });
  }

  // async getAllManagers(userId): Promise<User[]> {
  //   const response = await this.db.runQuery('user/getManagers.sql', [userId]);
  //   let managersList = []
  //   for (const elem of response) {
  //     let repList = [];
  //     let checkHasTwoReps = await this.db.runQuery('user/checkMoreThanTwoReps.sql', [elem.userId])
  //     if(checkHasTwoReps.length >= 2){
  //       for (const reps of checkHasTwoReps) {
  //         let checkDatainOpportunity = await this.db.runQuery('user/checkDataInOpportunity.sql', [reps.userId]);
  //         let checkDataInQuota = await this.db.runQuery('user/checkDataInQuota.sql', [reps.userId])

  //          if(checkDatainOpportunity.length > 0 && checkDataInQuota.length > 0){
  //           console.log("yes")
  //           repList.push(reps)
  //          }

  //       }
  //     }
  //     if(repList.length >= 2){
  //       managersList.push(elem)
  //       repList = [];
  //     }
  //   }


  //   return managersList;
  // }

  async getAllManagers(userId): Promise<User[]> {
    const values = [userId];
    const response = await this.db.runQuery('user/getManagers.sql', values);
    return response;
  }

  getUsersByParentId(
    parentId: string,
    tenantId: string,
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.getAllUsers(parentId, tenantId, userId, startDate, endDate)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getAllUsers(
    parentId: string,
    tenantId: string,
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<User[]> {
    console.log(userId);
    const values = [startDate, endDate, tenantId, parentId];
    const response = await this.db.runQuery(
      'user/getUsersByParentId.sql',
      values
    );
    var result: any[] = [];
    await Promise.all(
      response.map(async (obj) => {
        var user = await this.getUser_ById(obj.userId, tenantId);
        obj.user = user;
        delete obj.user_id;
        result.push(obj);
      })
    );
    return result;
  }

  getUserSettingByUserId(id: string): Promise<UserSetting> {
    return new Promise<UserSetting>((resolve, reject) => {
      this.getUserSetting(id)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getUserSetting(id: string): Promise<UserSetting> {
    const values = [id];
    const response = await this.db.runQuery('user/getUserSetting.sql', values, false);
    // console.log('ress : ', response, id);
    return response[0];
  }

  updateUserSettingByUserId(
    userId: string,
    notification: string,
    calendar: string,
    timeline: string,
    overview: string,
    leaderboard: string,
    reports: string,
    fullName: string,
    jobTitle: string,
    people: string,
    customer: string
  ): Promise<UserSetting> {
    return new Promise<UserSetting>((resolve, reject) => {
      this.updateUserSetting(
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
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async updateUserSetting(
    userId: string,
    notification: string,
    calendar: string,
    timeline: string,
    overview: string,
    leaderboard: string,
    reports: string,
    fullName: string,
    jobTitle: string,
    people: string,
    customer: string
  ): Promise<UserSetting> {
    const values = [
      userId,
      notification,
      calendar,
      timeline,
      overview,
      leaderboard,
      reports,
      people,
      customer
    ];
    var name = fullName.split(' ');

    const values2 = [userId, name[0], name[1], jobTitle];

    const response = await this.db.runQuery(
      'user/updateUserSetting.sql',
      values
    );
    await this.db.runQuery('user/updateUserInfo.sql', values2);
    return response[0];
  }

  async getSalseOutcomeScale(): Promise<any> {
    const values = [];
    const response = await this.db.runQuery(
      'user/getSalesOutcomeScale.sql', values, false
    );
    return response;
  }

  async setSalesOutcomeScale(objectValue: any[]): Promise<any> {
    for (const elem of objectValue) {
      let values = [elem.min, elem.max, elem.outcome];
      await this.db.runQuery(
        'user/setSalesOutcomeScale.sql', values
      );
    }
  }

  async setDefaultSalesOutcomeScale(): Promise<any> {
    let defaultData = [
      {
        "tenant_id": "03cc3ac6-204f-47a6-bc6b-a5f1d5a4ee3d",
        "outcome": "SalesClosed",
        "minimum": 400,
        "maximum": 1500
      },
      {
        "tenant_id": "03cc3ac6-204f-47a6-bc6b-a5f1d5a4ee3d",
        "outcome": "DealsClosed",
        "minimum": 1,
        "maximum": 25
      },
      {
        "tenant_id": "03cc3ac6-204f-47a6-bc6b-a5f1d5a4ee3d",
        "outcome": "DealSize",
        "minimum": 10,
        "maximum": 250
      },
      {
        "tenant_id": "03cc3ac6-204f-47a6-bc6b-a5f1d5a4ee3d",
        "outcome": "QuotaAttainment",
        "minimum": 5,
        "maximum": 150
      },
      {
        "tenant_id": "03cc3ac6-204f-47a6-bc6b-a5f1d5a4ee3d",
        "outcome": "WinRate",
        "minimum": 10,
        "maximum": 40
      },
      {
        "tenant_id": "03cc3ac6-204f-47a6-bc6b-a5f1d5a4ee3d",
        "outcome": "SalesCycle",
        "minimum": 30,
        "maximum": 360
      }
    ]
    for (const elem of defaultData) {
      let values = [elem.minimum, elem.maximum, elem.outcome];
      await this.db.runQuery(
        'user/setSalesOutcomeScale.sql', values
      );
    }
  }
}
