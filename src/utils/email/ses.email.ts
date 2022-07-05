import AWS from 'aws-sdk';
import { Email, EmailService } from '.';

export default class SES implements EmailService {
  constructor() {
    if ((!process.env.AWS_REGION) ||
        (!process.env.AWS_ACCESS_KEY_ID) ||
        (!process.env.AWS_SECRET_ACCESS_KEY) ||
        (!process.env.AWS_SES_API_VERSION)) {

      throw new Error('AWS SES is not configured correctly!');
    }

    AWS.config.update({ 
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async sendMail(email: Email): Promise<void> {
    const emailParams: AWS.SES.SendEmailRequest = {
      Destination: {
        ToAddresses: [email.to]
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: email.body.text
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: email.subject
        }
      },
      Source: email.from,
      ReplyToAddresses: [email.from]
    };
  
    if (email.body.html) {
      emailParams.Message.Body.Html = {
        Charset: 'UTF-8',
        Data: email.body.html
      };
    }

    await new AWS.SES({ 
      apiVersion: process.env.AWS_SES_API_VERSION 
    
    }).sendEmail(emailParams).promise();
  }
}