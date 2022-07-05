import SES from './ses.email';

interface EmailBody {
  text: string,
  html?: string
}

interface Email {
  to: string,
  from: string,
  subject: string,
  body: EmailBody
}

interface EmailService {
  sendMail(email: Email): Promise<void>
}

// Change this to change the default email provider
// Note that you will need to have your .env setup 
const mailer: EmailService = new SES();

export { 
  Email,
  EmailBody,
  EmailService,

  mailer
};