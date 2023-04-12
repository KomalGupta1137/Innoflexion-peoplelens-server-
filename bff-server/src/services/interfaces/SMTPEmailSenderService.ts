export interface SMTPEmailSenderService {
  sendEmail(to: string, message: string, action: string, completeDate: string);
}
