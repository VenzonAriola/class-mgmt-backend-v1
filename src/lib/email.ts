import nodemailer from 'nodemailer';

export type VerificationEmailPayload = {
  to: string;
  verificationUrl: string;
  appName?: string;
};

export type VerificationEmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const buildVerificationEmailMessage = ({
  to,
  verificationUrl,
  appName = 'Class Management',
}: VerificationEmailPayload): VerificationEmailMessage => ({
  to,
  subject: `Verify your ${appName} account`,
  text: `Welcome to ${appName}! Please verify your email by visiting: ${verificationUrl}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2>Verify your email</h2>
      <p>Welcome to ${appName}.</p>
      <p>Please verify your email address by clicking the button below.</p>
      <p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 18px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
          Verify Email
        </a>
      </p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
    </div>
  `,
});

export const createEmailTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP email configuration is incomplete. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendVerificationEmail = async ({
  user,
  url,
}: {
  user: { email: string; name?: string | null };
  url: string;
}) => {
  const transport = createEmailTransport();
  const message = buildVerificationEmailMessage({
    to: user.email,
    verificationUrl: url,
    appName: 'Class Management',
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
};
