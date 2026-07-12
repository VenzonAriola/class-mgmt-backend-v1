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

export const sendVerificationEmail = async ({
  user,
  url,
}: {
  user: { email: string; name?: string | null };
  url: string;
}) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    throw new Error('Brevo email configuration is incomplete. Set BREVO_API_KEY and BREVO_SENDER_EMAIL.');
  }

  const message = buildVerificationEmailMessage({
    to: user.email,
    verificationUrl: url,
    appName: 'Class Management',
  });

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { name: 'Class Management', email: senderEmail },
      to: [{ email: message.to, name: user.name || undefined }],
      subject: message.subject,
      htmlContent: message.html,
      textContent: message.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo API request failed (${response.status}): ${body}`);
  }
};