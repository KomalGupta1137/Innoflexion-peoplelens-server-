/* eslint-disable import/order */
/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
import { inject, injectable } from 'inversify';
import { Dependencies } from '../../../Dependencies';
import { AdminService } from '../../interfaces/AdminService';
import { Database } from '../../interfaces/Database';
@injectable()
export class AdminServiceImpl implements AdminService {
    constructor(
        @inject(Dependencies.Database.toString()) private readonly db: Database
    ) { }

    InsertAdminUsers(userName: string, email: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.saveAdminUsers(userName, email)
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    async saveAdminUsers(userName: string, email: string): Promise<any> {
        const values = [userName, email];
        const response = await this.db.runQuery('admin/saveAdminUsers.sql', values);
        return response[0]
    }


    InsertAdminUsersList(filePath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.saveAdminUsersList(filePath)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    async saveAdminUsersList(
        filePath:string
    ): Promise<any> {
       const values = [filePath]
       const response = await this.db.runQuery('admin/AdminUsersList', values)
       return response[0];
    }

    async getAdminUsersList(): Promise<any> {
      return new Promise<any>(async (resolve, _) => {
        const response = await this.db.runQuery('admin/getUploadedAdminUsersList.sql',[],false);
        resolve(response)
      }) 
    }

    async getAdminUsers(): Promise<any> {
        return new Promise<any>(async (resolve, _) => {
          const response = await this.db.runQuery('admin/getUploadedAdminUsers.sql',[],false);
          resolve(response)
        }) 
      }


    uploadFile(
        system: string,
        sub_system: string,
        reportName: string,
        startDate: Date,
        endDate: Date,
        filePath: string
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.saveData(system, sub_system, reportName, startDate, endDate, filePath)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    async getUploadedSystems(): Promise<any> {
        return new Promise<any>(async (resolve, _) => {
            const response = await this.db.runQuery('admin/getUploadedSystems.sql', [], false);
            resolve(response);
        })
    }

    async saveData(
        system: string,
        sub_system: string,
        reportName: string,
        startDate: Date,
        endDate: Date,
        filePath: string
    ): Promise<any> {
        const values = [system, sub_system, reportName, startDate, endDate, filePath];
        const response = await this.db.runQuery('admin/saveData.sql', values);
        return response[0];
    }
}
