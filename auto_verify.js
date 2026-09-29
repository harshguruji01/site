// auto_verify.js
// Background script to automatically verify pending verification entries (contributors, email, phone OTP)
// It runs as a cron job (every 5 minutes) and marks entries as verified if they are older than 30 min
// but not older than 24 h. Adjust the logic as needed for other verification tables.

import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase credentials not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function minutesSince(dateStr) {
  return (Date.now() - new Date(dateStr).getTime()) / 60000;
}

async function verifyContributors() {
  const { data, error } = await supabase
    .from('contributors')
    .select('id, created_at, verified')
    .eq('verified', false);
  if (error) {
    console.error('Error fetching contributors:', error);
    return;
  }
  const toVerify = data.filter((c) => {
    const mins = minutesSince(c.created_at);
    return mins >= 30 && mins <= 24 * 60;
  });
  if (toVerify.length === 0) return;
  const ids = toVerify.map((c) => c.id);
  const { error: updError } = await supabase
    .from('contributors')
    .update({ verified: true, status: 'ACTIVE' })
    .in('id', ids);
  if (updError) console.error('Update error:', updError);
  else console.log(`Auto‑verified ${ids.length} contributors`);
}

// Example stub for email verification auto‑approve (use with caution)
async function verifyEmails() {
  const { data, error } = await supabase
    .from('auth.users')
    .select('id, created_at, email_confirmed_at')
    .is('email_confirmed_at', null);
  if (error) {
    console.error('Error fetching users for email auto‑verify:', error);
    return;
  }
  const toVerify = data.filter((u) => minutesSince(u.created_at) >= 30 && minutesSince(u.created_at) <= 24 * 60);
  for (const user of toVerify) {
    const { error: upd } = await supabase.auth.api.updateUserById(user.id, { email_confirmed_at: new Date().toISOString() });
    if (upd) console.error('Failed to auto‑verify email for', user.id, upd);
    else console.log('Auto‑verified email for', user.id);
  }
}

cron.schedule('*/5 * * * *', async () => {
  console.log('Running auto‑verification job', new Date().toISOString());
  await verifyContributors();
  // await verifyEmails(); // Uncomment if you want to auto‑verify emails
});

console.log('Auto‑verification script started');
