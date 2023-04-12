import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
const ical = require('ical-generator');

@injectable()
export class SMTPEmailSenderImpl {
  constructor() { }

  sendEmail(
    to: string,
    message: string,
    action: string,
    completeDate: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'akshay.kumar@innoflexion.com',
          pass: 'aqkgftsdohpscalo',
        },
      });
      console.log(to);

      const mailObj = {
        from: 'akshay.kumar@innoflexion.com',
        // to: 'akshay.kumar@innoflexion.com', //to be changed to actual email
        to: 'ypanjabi@peoplelens.ai', //to be changed to actual email
        subject: 'PeopleLens (Manager Notification) - To grow your topline',
        html:
          message +
          '<div><br></div><div><a href="https://dev.peoplelens.ai/" style="background-color:#03a9f4;color:#ffffff!important;border:0px solid #000000;border-radius:3px;box-sizing:border-box;font-size:13px;font-weight:700;line-height:40px;padding:12px 24px;text-align:center;text-decoration:none;vertical-align:middle" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://peoplelens.ai/pages/our-lens.html&amp;source=gmail&amp;ust=1663054440264000&amp;usg=AOvVaw3b2LIES5tqQW906FqgPQWH">Go to App</a><div class="yj6qo"></div><div class="adL">&nbsp;<br></div><div class="adL"><br></div></div>',
      };
      const cal = ical({
        name: 'PeopleLens Notification',
      });
      cal.createEvent({
        start: completeDate, // eg : moment()
        end: completeDate, // eg : moment(1,'days')
        summary: action, // 'Summary of your event'
        organizer: {
          name: 'akshay.kumar@innoflexion.com',
          email: 'akshay.kumar@innoflexion.com',
        },
      });
      let alternatives = {
        'Content-Type': 'text/calendar',
        method: 'REQUEST',
        content: Buffer.from(cal.toString()),
        component: 'VEVENT',
        'Content-Class': 'urn:content-classes:calendarmessage',
      };
      mailObj['alternatives'] = alternatives;
      mailObj['alternatives']['contentType'] = 'text/calendar';
      mailObj['alternatives']['content'] = Buffer.from(cal.toString());
      this.send(transporter, mailObj)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private async send(transporter: any, message: any): Promise<any> {
    transporter.sendMail(message, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}
