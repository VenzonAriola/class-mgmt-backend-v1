import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import dns from 'node:dns';

// Render (and many container platforms) don't have outbound IPv6 routing.
// Node can still resolve AAAA (IPv6) records for smtp.gmail.com and try
// those first, which fails with ENETUNREACH. Forcing IPv4-first resolution
// avoids that.
dns.setDefaultResultOrder('ipv4first');

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
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('Gmail email configuration is incomplete. Set GMAIL_USER and GMAIL_APP_PASSWORD.');
  }

  const options: SMTPTransport.Options = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  };

  // 'family' isn't part of @types/nodemailer's Options interface, but nodemailer
  // does forward it to the underlying socket connection at runtime. Assign it
  // separately to avoid tripping TypeScript's excess-property check.
  (options as SMTPTransport.Options & { family?: number }).family = 4;

  return nodemailer.createTransport(options);
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
    from: `"Class Management" <${process.env.GMAIL_USER}>`,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
};