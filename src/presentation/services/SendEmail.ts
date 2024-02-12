import nodemailer from 'nodemailer';
import { EmailContent } from '../types/EmailContent';
import APIError from '../errorHandlers/APIError';
import HttpStatusCode from '../enums/HTTPStatusCode';

export abstract class SendEmail {
  private static host = process.env.Email_Host;
  private static secure = true;
  private static sender = process.env.Email_Auth_User;
  private static password = process.env.Email_Auth_Pass;

  static send = async (emailContent: EmailContent) => {
    try {
      const transporter = nodemailer.createTransport({
        host: this.host,
        secure: this.secure,
        port: this.secure ? 465 : 587, 
        auth: {
          user: this.sender,
          pass: this.password
        },
      });
    
      const mailOptions = {
        from: `${process.env.APP_Name} <${this.sender}>`,
        to: emailContent.to,
        subject: emailContent.subject,
        html: emailContent.message
      }
      
      await transporter.sendMail(mailOptions);
    }
    catch(error: any) {
      throw new APIError('Something wrong is happened', HttpStatusCode.InternalServerError);
    }
  };
} 
