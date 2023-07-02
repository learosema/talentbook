import Mail from "nodemailer/lib/mailer";



export const TPL_FORGOT = (tempLogin: string, loginExpiresIn: string): Partial<Mail.Options>  => {
  const magicLink = `${process.env.FRONTEND_URL||'https://localhost:8000'}/api/tempLogin?key=${encodeURIComponent(tempLogin)}`;
  return {
    subject: 'Talentbook: Your Login Link',
    text: 
      `Here's your temporary login link. It will expire in ${loginExpiresIn}.\n\n${magicLink}`,
    html:
      `Here's your temporary login link. It will expire in ${loginExpiresIn}.<br><br><a href="${process.env.FRONTEND_URL||'https://localhost:8000'}/api/tempLogin?key=${encodeURIComponent(tempLogin)}">Magic login Link</a>`,
  };
}