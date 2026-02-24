// ASTRO4 — webhook.js v1 (placeholder)
// Stripe webhook endpoint — will be replaced with full implementation once whsec_ is configured

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Accept webhook, log for debugging
    console.log('ASTRO4 WEBHOOK: received POST');
    return res.status(200).json({ received: true });
  }

  // GET — health check for Stripe URL validation
  return res.status(200).json({ status: 'ok', service: 'astro4-webhook' });
}
