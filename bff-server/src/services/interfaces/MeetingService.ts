export interface Meeting {
  subject: string;
  date: string;
  status: string;
}

export interface MeetingService {
  getAllMeetings(
    tenantId: string,
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]>;

  getPipelineData(
    startDate: string,
    endDate: string): Promise<any[]>;
}
