// auto_verify.js
// Background script to automatically verify pending verification entries (contributors, email, phone OTP)
// It runs as a cron job (every 5 minutes) and marks entries as verified if they are older than 30 min
// but not older than 24 h. Adjust the logic as needed for other verification tables.

import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wumdbpyhpblvgjttsbpv.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase credentials not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function minutesSince(dateStr) {
  if (!dateStr) return 0;
  return (Date.now() - new Date(dateStr).getTime()) / 60000;
}

async function verifyContributors() {
  // Fetch pending contributors (where verified is false OR null, or status is PENDING)
  const { data, error } = await supabase
    .from('contributors')
    .select('id, user_id, created_at, verified, status')
    .or('verified.eq.false,verified.is.null,status.eq.PENDING');

  if (error) {
    console.error('Error fetching contributors:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No pending contributors to verify.');
    return;
  }

  const toVerify = data.filter((c) => {
    // If already active or approved, skip
    if (c.status === 'ACTIVE' && c.verified === true) return false;
    const mins = minutesSince(c.created_at);
    return mins >= 24 * 60; // Auto-verify 24 hours after form submission
  });

  if (toVerify.length === 0) {
    console.log(`Found ${data.length} pending applications, but none have reached 24 hours yet.`);
    return;
  }

  const ids = toVerify.map((c) => c.id);
  const nowIso = new Date().toISOString();

  const { error: updError } = await supabase
    .from('contributors')
    .update({ verified: true, status: 'ACTIVE', approved_at: nowIso })
    .in('id', ids);

  if (updError) {
    console.error('Update error on contributors:', updError);
  } else {
    console.log(`Successfully auto-verified ${ids.length} contributors after 24h.`);

    // Also award Golden Tick in profiles table for associated user IDs
    for (const c of toVerify) {
      if (c.user_id) {
        await supabase
          .from('profiles')
          .update({ golden_tick: true, role: 'contributor' })
          .eq('id', c.user_id)
          .catch(e => console.warn('Profile golden tick sync notice:', e));
      }
    }
  }
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

// Run once immediately on start
console.log('Running initial verification pass on startup...');
verifyContributors();

cron.schedule('*/5 * * * *', async () => {
  console.log('Running auto‑verification job', new Date().toISOString());
  await verifyContributors();
  // await verifyEmails(); // Uncomment if you want to auto‑verify emails
});

console.log('Auto‑verification script started (checking every 5 mins).');
