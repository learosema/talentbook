import nodemailer from 'nodemailer';


export function email() {
  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp4dev",
      port: parseInt(process.env.SMTP_PORT||'', 10) || 465,
      secure: (process.env.SMTP_SECURE === 'y') ? true : false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });
  } catch (err) {
    console.error(err);
    return null;
  }
} 
