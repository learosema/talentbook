import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function email(mailOptions: Mail.Options) {
  try {
    const transportOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST || 'smtp4dev',
      port: parseInt(process.env.SMTP_PORT||'', 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    };

    if (process.env.SMTP_SECURE === 'y') {
      transportOptions.tls = {ciphers: 'SSLv3'};
    }
    
    const transport = nodemailer.createTransport(transportOptions);
    await transport.verify();
    await transport.sendMail(mailOptions)
  } catch (err) {
    console.error('sending email failed: ', err);
  }
} 
