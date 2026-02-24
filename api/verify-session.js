// ASTRO4 — verify-session.js v1
// Verifies Stripe checkout session after redirect
// Frontend sends session_id, we validate with Stripe API

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    console.error('ASTRO4 VERIFY: Missing STRIPE_SECRET_KEY');
    return res.status(500).json({ valid: false, error: 'Not configured' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    const { session_id } = body;

    if (!session_id || !session_id.startsWith('cs_')) {
      return res.status(400).json({ valid: false, error: 'Invalid session ID' });
    }

    // Retrieve session from Stripe
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, {
      headers: {
        'Authorization': `Bearer ${stripeSecret}`
      }
    });

    if (!response.ok) {
      console.error('ASTRO4 VERIFY: Stripe API error', response.status);
      return res.status(400).json({ valid: false, error: 'Session not found' });
    }

    const session = await response.json();

    // Must be paid
    if (session.payment_status !== 'paid') {
      return res.status(200).json({ valid: false, error: 'Payment not completed' });
    }

    // Determine product type from mode
    const isPremium = session.mode === 'subscription';
    const isPack10 = session.mode === 'payment';

    // Generate a simple token: hash of session_id + timestamp
    const crypto = await import('crypto');
    const token = crypto.default
      .createHash('sha256')
      .update(session.id + session.created)
      .digest('hex')
      .substring(0, 32);

    console.log('ASTRO4 VERIFY: Session verified', {
      session_id: session.id,
      mode: session.mode,
      amount: session.amount_total,
      email: session.customer_details?.email
    });

    return res.status(200).json({
      valid: true,
      product: isPremium ? 'premium' : 'pack10',
      credits: isPremium ? 999 : 10,
      token: token,
      email: session.customer_details?.email || null
    });

  } catch (error) {
    console.error('ASTRO4 VERIFY: Error:', error.message);
    return res.status(500).json({ valid: false, error: 'Verification failed' });
  }
}
