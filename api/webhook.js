// ASTRO4 — webhook.js v4
// Fix: disable bodyParser + always read raw body for signature verification
// Vercel serverless functions support Web API natively

import crypto from 'crypto';

// Disable Vercel's automatic body parsing — we need raw bytes for Stripe signature
export const config = {
  api: {
    bodyParser: false
  }
};

function verifyStripeSignature(payload, signature, secret) {
  const elements = signature.split(',');
  const timestamp = elements.find(e => e.startsWith('t='))?.split('=')[1];
  const v1Signature = elements.find(e => e.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !v1Signature) return false;

  // Reject if timestamp is older than 5 minutes
  const now = Math.floor(Date.now() / 1000);
  if (now - parseInt(timestamp) > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  const a = Buffer.from(v1Signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'astro4-webhook' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('ASTRO4 WEBHOOK: Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  try {
    // Read raw body — bodyParser is disabled so we always read from stream
    let rawBody;
    rawBody = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      req.on('error', reject);
    });

    const signature = req.headers['stripe-signature'];

    if (!signature) {
      console.error('ASTRO4 WEBHOOK: Missing stripe-signature header');
      return res.status(400).json({ error: 'Missing signature' });
    }

    if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
      console.error('ASTRO4 WEBHOOK: Invalid signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('ASTRO4 WEBHOOK: Payment completed', {
        session_id: session.id,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        mode: session.mode,
        metadata: session.metadata
      });
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('ASTRO4 WEBHOOK: Error:', error.message);
    return res.status(400).json({ error: 'Webhook error' });
  }
}
