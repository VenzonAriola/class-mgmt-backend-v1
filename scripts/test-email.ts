import 'dotenv/config';
import { sendVerificationEmail } from '../src/lib/email';

const to = process.argv[2];

if (!to) {
  console.error('Usage: tsx scripts/test-email.ts your-real-email@example.com');
  process.exit(1);
}

console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD set:', Boolean(process.env.GMAIL_APP_PASSWORD));
console.log('GMAIL_APP_PASSWORD length:', process.env.GMAIL_APP_PASSWORD?.length);

sendVerificationEmail({
  user: { email: to, name: 'Test User' },
  url: 'https://example.com/verify?token=test123',
})
  .then(() => console.log('✅ Email sent successfully to', to))
  .catch((err) => {
    console.error('❌ Email failed to send:');
    console.error(err);
  });