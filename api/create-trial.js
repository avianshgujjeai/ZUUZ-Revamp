// /api/create-trial.js — Vercel serverless function (CommonJS)
// Creates a Stripe customer with a 30-day free trial, no card required

const PLAN_PRICE_IDS = {
  solo:       null,  // Add your Stripe Price IDs here (starts with price_)
  team:       null,  // Stripe Dashboard → Products → click plan → copy Price ID
  growth:     null,
  scale:      null,
  enterprise: null
};

module.exports = async function handler(req, res) {
  // CORS headers
  const ALLOWED_ORIGINS = ['https://zuuz.ai', 'https://www.zuuz.ai'];
  const reqOrigin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin',
    ALLOWED_ORIGINS.indexOf(reqOrigin) !== -1 ? reqOrigin : 'https://zuuz.ai');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, company, phone, plan, crm, mailboxes, mailboxProvider } = req.body || {};

  if (!name || String(name).trim().split(/\s+/).length < 2) {
    return res.status(400).json({ error: 'Please provide your first and last name.' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  if (!company) {
    return res.status(400).json({ error: 'Company name is required.' });
  }
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }
  if (!mailboxProvider) {
    return res.status(400).json({ error: 'Mailbox provider is required.' });
  }
  if (!plan) {
    return res.status(400).json({ error: 'Plan is required.' });
  }

  // Reject free / personal email providers — a business email is required
  const FREE_EMAIL_DOMAINS = [
    'gmail.com', 'googlemail.com',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'yahoo.com', 'ymail.com', 'rocketmail.com',
    'aol.com', 'gmx.com', 'protonmail.com', 'proton.me'
  ];
  const emailDomain = (String(email).split('@')[1] || '').toLowerCase();
  if (FREE_EMAIL_DOMAINS.indexOf(emailDomain) !== -1) {
    return res.status(400).json({ error: 'Please use a company email address.' });
  }

  // Brevo — add contact to trial nurture list (runs regardless of Stripe config/result below)
  if (process.env.BREVO_API_KEY) {
    fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name.split(' ')[0],
          LASTNAME:  name.split(' ').slice(1).join(' ') || '',
          COMPANY:   company || '',
          PLAN:      plan,
          CRM:       crm || '',
          MAILBOXES: mailboxes || 1,
          MAILBOX_PROVIDER: mailboxProvider || ''
        },
        listIds: [Number(process.env.BREVO_TRIAL_LIST_ID)],
        updateEnabled: true
      })
    }).catch(function (err) { console.error('Brevo contact error:', err.message); });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    // Graceful fallback — still capture the lead via Web3Forms on the frontend
    console.warn('STRIPE_SECRET_KEY not set — skipping Stripe, lead captured via Web3Forms');
    return res.status(200).json({ success: true, customerId: null, subscriptionId: null, note: 'stripe_skipped' });
  }

  try {
    // 1. Create Stripe customer
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    if (phone) params.append('phone', phone);
    params.append('metadata[company]',     company     || '');
    params.append('metadata[plan]',        plan);
    params.append('metadata[crm]',         crm         || '');
    params.append('metadata[mailboxes]',   mailboxes   || '1');
    params.append('metadata[mailbox_provider]', mailboxProvider || '');
    params.append('metadata[source]',      'trial_signup');
    params.append('metadata[trial_start]', new Date().toISOString());

    const custRes = await fetch('https://api.stripe.com/v1/customers', {
      method:  'POST',
      headers: { 'Authorization': 'Bearer ' + STRIPE_SECRET, 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString()
    });
    const customer = await custRes.json();
    if (!custRes.ok) throw new Error(customer.error?.message || 'Stripe customer creation failed');

    // 2. Create 30-day trial subscription (if Price ID is configured)
    let subscriptionId = null;
    const priceId = PLAN_PRICE_IDS[plan];

    if (priceId) {
      const subParams = new URLSearchParams();
      subParams.append('customer',                    customer.id);
      subParams.append('items[0][price]',             priceId);
      subParams.append('trial_period_days',           '30');
      subParams.append('trial_settings[end_behavior][missing_payment_method]', 'cancel');
      subParams.append('metadata[company]',           company || '');
      subParams.append('metadata[crm]',               crm     || '');
      subParams.append('metadata[source]',            'trial_signup');

      const subRes = await fetch('https://api.stripe.com/v1/subscriptions', {
        method:  'POST',
        headers: { 'Authorization': 'Bearer ' + STRIPE_SECRET, 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    subParams.toString()
      });
      const subscription = await subRes.json();
      if (subRes.ok) subscriptionId = subscription.id;
      else console.error('Subscription creation failed:', subscription.error?.message);
    }

    return res.status(200).json({ success: true, customerId: customer.id, subscriptionId });

  } catch (err) {
    console.error('Trial creation error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
