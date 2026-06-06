// /api/create-trial.js — Vercel serverless function
// Creates a Stripe customer with a 30-day free trial (no card required)
// Then stores metadata for Zoho sync via Stripe webhooks

const PLAN_PRICE_IDS = {
  solo:       'prod_UZxrXC8HGPLTUW',    // Replace with your actual Stripe Price IDs
  growth:     'prod_UZxuHfIjkjsBQU',  // Get from Stripe Dashboard → Products → Price ID
  scale:      'prod_UZxxNtW2oS9A4W',
  enterprise: null                     // Enterprise = manual, no Stripe subscription created
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, phone, plan, crm } = req.body;

  if (!name || !email || !plan) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    // 1. Create Stripe customer
    const customerParams = new URLSearchParams({
      name,
      email,
      'metadata[company]':  company || '',
      'metadata[plan]':     plan,
      'metadata[crm]':      crm || '',
      'metadata[phone]':    phone || '',
      'metadata[source]':   'trial_signup',
      'metadata[trial_start]': new Date().toISOString(),
    });
    if (phone) customerParams.append('phone', phone);

    const customerRes = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: customerParams.toString()
    });

    const customer = await customerRes.json();
    if (!customerRes.ok) throw new Error(customer.error?.message || 'Stripe customer creation failed');

    // 2. Create subscription with 30-day trial (no card) — skip for Enterprise
    let subscriptionId = null;
    const priceId = PLAN_PRICE_IDS[plan];

    if (priceId) {
      const subParams = new URLSearchParams({
        customer:                    customer.id,
        'items[0][price]':           priceId,
        'trial_period_days':         '30',
        'payment_settings[save_default_payment_method]': 'on_subscription',
        'trial_settings[end_behavior][missing_payment_method]': 'cancel',
        'metadata[company]':         company || '',
        'metadata[crm]':             crm || '',
        'metadata[source]':          'trial_signup',
      });

      const subRes = await fetch('https://api.stripe.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET}`,
          'Content-Type':  'application/x-www-form-urlencoded',
        },
        body: subParams.toString()
      });

      const subscription = await subRes.json();
      if (!subRes.ok) {
        // Non-fatal — customer created, subscription failed. Log and continue.
        console.error('Subscription creation failed:', subscription.error?.message);
      } else {
        subscriptionId = subscription.id;
      }
    }

    return res.status(200).json({
      success:        true,
      customerId:     customer.id,
      subscriptionId: subscriptionId,
    });

  } catch (err) {
    console.error('Trial creation error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
