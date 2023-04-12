/* eslint-disable functional/no-method-signature */
export type AdminService = {
    uploadFile(system: string, sub_system: string, reportName: string, startDate: Date, endDate: Date, filePath: string): Promise<any>;
    getUploadedSystems();

    InsertAdminUsers(
        userName:string,
        email:string
    ):Promise<any[]>
    getAdminUsers()

    InsertAdminUsersList(
        uploadFiles:string
    ):Promise<any[]>
    getAdminUsersList()

    
}

