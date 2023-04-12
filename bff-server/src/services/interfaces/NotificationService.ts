export interface NotificationService {
  setNotification(
    tenantId: string,
    userId: string,
    parentId: string,
    action: string,
    actionCompleteDate: string,
    rec_id: string
  ): Promise<any>;

  getActiveNotifications(tenantId, userId): Promise<any[]>;
  getPastNotifications(tenantId, userId): Promise<any[]>;
  getNotificationById(tenantId, userId, id): Promise<any>;
  getOutcomeTrackerByUserId(tenantId, userId): Promise<any>;
}
