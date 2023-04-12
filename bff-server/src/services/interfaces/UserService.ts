import { RequestContext } from '../../server';

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  persona: string;
  designation: string;
}

export interface UserSetting {
  userId: string;
  notification: string;
  calendar: string;
  timeline: string;
  overview: string;
  leaderboard: string;
  reports: string;
  fullName: string;
  jobTitle: string;
  email: string;
}

export interface UserService {
  getUserById(id: string, context: RequestContext): Promise<User>;

  getUsersByIds(
    ids: Array<string>,
    context: RequestContext
  ): Promise<Array<User>>;

  getManagers(userId: string): Promise<Array<User>>;

  getUsersByParentId(
    parentId: string,
    tenantId: string,
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Array<User>>;

  getUserSettingByUserId(id: string): Promise<UserSetting>;

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
  ): Promise<any>;

  getSalseOutcomeScale(): Promise<any>;

  setSalesOutcomeScale(
    objectValue: any
  ): Promise<any>;

  setDefaultSalesOutcomeScale(): Promise<any>;

}
