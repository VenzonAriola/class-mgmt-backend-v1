import test from 'node:test';
import assert from 'node:assert/strict';
import { buildVerificationEmailMessage } from './email.ts';

test('buildVerificationEmailMessage includes the verification URL and greeting', () => {
  const message = buildVerificationEmailMessage({
    to: 'student@example.com',
    verificationUrl: 'https://example.com/verify?token=abc123',
    appName: 'Class Management',
  });

  assert.equal(message.to, 'student@example.com');
  assert.match(message.subject, /verify/i);
  assert.match(message.text, /https:\/\/example\.com\/verify\?token=abc123/);
  assert.match(message.html, /https:\/\/example\.com\/verify\?token=abc123/);
});
