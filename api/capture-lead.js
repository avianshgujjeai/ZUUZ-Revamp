import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // Email 1: Notify Avinash
    await resend.emails.send({
      from: 'ZUUZ <info@zuuz.ai>',
      to: process.env.LEAD_NOTIFICATION_EMAIL,
      subject: `New demo lead: ${email}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 500px;">
          <h2 style="color: #0E1F6B;">New lead from zuuz.ai</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Source:</strong> Video demo modal (70% watched)</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #666; font-size: 13px;">
            Reach out within 4 hours for highest conversion.
          </p>
        </div>
      `
    });

    // Email 2: Confirmation to the prospect
    await resend.emails.send({
      from: 'Avinash Gujje <avinash@zuuz.ai>',
      to: email,
      reply_to: 'avinash@zuuz.ai',
      subject: 'Your ZUUZ demo — let\'s set up a real walkthrough',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 540px; color: #111110; line-height: 1.55;">
          <p>Hi there,</p>
          <p>Thanks for watching the ZUUZ demo. You saw the basics — email goes in, qualified pipeline comes out, no rep typing.</p>
          <p>The real "aha" moment happens when you see it run on your actual mailbox. That's a 15-minute call. I run every demo personally so I can tell you in plain English whether ZUUZ is the right fit for your team — or honestly, when it isn't.</p>
          <p>
            <a href="https://cal.com/avinashgujje/15min"
               style="display: inline-block; background: #0F0F0E; color: #FAFAF7; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 500;">
              Book a 15-min demo →
            </a>
          </p>
          <p>Or just reply to this email with a question and I'll get back to you the same day.</p>
          <p style="margin-top: 32px;">
            — Avinash<br>
            <span style="color: #7A776E; font-size: 14px;">
              Founder, ZUUZ<br>
              <a href="mailto:avinash@zuuz.ai" style="color: #2563FF; text-decoration: none;">avinash@zuuz.ai</a> · <a href="https://zuuz.ai" style="color: #2563FF; text-decoration: none;">zuuz.ai</a><br>
              Sunnyvale · Dubai · Hyderabad
            </span>
          </p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Lead capture error:', err);
    return res.status(500).json({ error: 'Failed to process lead' });
  }
}
