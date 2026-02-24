// ASTRO4 — stripe-checkout.js v2
// Real Stripe monetization: pack 10 + premium monthly
// No more donation codes — all payments through Stripe

// ═══════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════

const STRIPE_CONFIG = {
  publishableKey: 'pk_live_51SceBWPG43KliMINorbpT7H9ggnpju2C7OXgvdYdwaCrq5vq12c5AZv7PqDhR4XedTupwhONPhmIaqxi9pvhNljn00cvXoh4zL',
  prices: {
    pack10: 'price_1SsVusPG43KliMINvkZ9f1Wo',       // $29 MXN one-time
    premiumMonthly: 'price_1SsVwKPG43KliMINIuhvF9Fv'  // $49 MXN/month
  }
};

const FREE_USES_LIMIT = 5;
const PACK10_CREDITS = 10;
const PREMIUM_CREDITS = 999;
const STORAGE_KEY = 'astro4_usage';

// ═══════════════════════════════════════════════════════
// SISTEMA DE USOS
// ═══════════════════════════════════════════════════════

function getUsageData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { count: 0, product: null, token: null, credits: FREE_USES_LIMIT };
  try {
    const data = JSON.parse(stored);
    // Migration from old format
    if (!data.credits && data.credits !== 0) {
      data.credits = data.donated ? FREE_USES_LIMIT + PACK10_CREDITS : FREE_USES_LIMIT;
      data.product = data.donated ? 'pack10' : null;
      delete data.donated;
    }
    return data;
  } catch {
    return { count: 0, product: null, token: null, credits: FREE_USES_LIMIT };
  }
}

function saveUsageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getUsageCount() {
  return getUsageData().count;
}

function incrementUsage() {
  const data = getUsageData();
  data.count++;
  saveUsageData(data);
  return data.count;
}

function hasReachedLimit() {
  const data = getUsageData();
  return data.count >= data.credits;
}

function getRemainingUses() {
  const data = getUsageData();
  return Math.max(0, data.credits - data.count);
}

// ═══════════════════════════════════════════════════════
// STRIPE CHECKOUT
// ═══════════════════════════════════════════════════════

let stripe = null;

function initStripe() {
  if (typeof Stripe === 'undefined') return false;
  stripe = Stripe(STRIPE_CONFIG.publishableKey);
  return true;
}

function getReturnUrl(product) {
  const base = window.location.origin + '/app.html';
  const params = new URLSearchParams(window.location.search);
  params.set('payment', 'pending');
  params.set('product', product);
  return base + '?' + params.toString();
}

async function checkoutPack10() {
  if (!stripe && !initStripe()) {
    showToast(window.currentLang === 'es' ? 'Error cargando pagos' : 'Error loading payments', true);
    return;
  }
  try {
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: STRIPE_CONFIG.prices.pack10, quantity: 1 }],
      mode: 'payment',
      successUrl: getReturnUrl('pack10') + '&session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: getReturnUrl('cancelled')
    });
    if (error) showToast(error.message, true);
  } catch (err) {
    showToast(window.currentLang === 'es' ? 'Error al procesar' : 'Processing error', true);
  }
}

async function checkoutPremium() {
  if (!stripe && !initStripe()) {
    showToast(window.currentLang === 'es' ? 'Error cargando pagos' : 'Error loading payments', true);
    return;
  }
  try {
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: STRIPE_CONFIG.prices.premiumMonthly, quantity: 1 }],
      mode: 'subscription',
      successUrl: getReturnUrl('premium') + '&session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: getReturnUrl('cancelled')
    });
    if (error) showToast(error.message, true);
  } catch (err) {
    showToast(window.currentLang === 'es' ? 'Error al procesar' : 'Processing error', true);
  }
}

// ═══════════════════════════════════════════════════════
// VERIFICACIÓN POST-PAGO
// ═══════════════════════════════════════════════════════

async function verifyPaymentSession(sessionId) {
  try {
    const response = await fetch('/api/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId })
    });

    const data = await response.json();

    if (data.valid) {
      const usage = getUsageData();
      usage.product = data.product;
      usage.token = data.token;
      usage.credits = usage.count + data.credits; // Add credits on top of current usage
      if (data.email) usage.email = data.email;
      saveUsageData(usage);
      updateCreditsUI();

      const msg = data.product === 'premium'
        ? (window.currentLang === 'es' ? '🌟 ¡Premium activado! Consultas ilimitadas.' : '🌟 Premium activated! Unlimited consultations.')
        : (window.currentLang === 'es' ? '🎉 ¡Gracias! Tienes 10 consultas más.' : '🎉 Thanks! You have 10 more consultations.');
      showToast(msg);
      return true;
    } else {
      showToast(window.currentLang === 'es' ? 'No se pudo verificar el pago' : 'Could not verify payment', true);
      return false;
    }
  } catch (err) {
    console.error('ASTRO4: Payment verification error:', err);
    showToast(window.currentLang === 'es' ? 'Error verificando pago' : 'Payment verification error', true);
    return false;
  }
}

// Check URL for session_id on page load
async function checkPaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const payment = params.get('payment');

  if (sessionId && sessionId.startsWith('cs_')) {
    // Verify FIRST, clean URL AFTER — so user can retry on failure
    const success = await verifyPaymentSession(sessionId);

    if (success) {
      // Payment verified — clean URL
      params.delete('session_id');
      params.delete('payment');
      params.delete('product');
      const cleanUrl = window.location.pathname + '?' + params.toString();
      window.history.replaceState({}, '', cleanUrl);
    }
    // If failed, session_id stays in URL so reload retries
  } else if (payment === 'cancelled') {
    params.delete('payment');
    params.delete('product');
    const cleanUrl = window.location.pathname + '?' + params.toString();
    window.history.replaceState({}, '', cleanUrl);
  }
}

// ═══════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = (isError ? '❌ ' : '✅ ') + message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  } else {
    alert(message);
  }
}

function updateCreditsUI() {
  const badge = document.getElementById('creditsBadge');
  if (!badge) return;

  const remaining = getRemainingUses();
  const data = getUsageData();

  if (data.product === 'premium') {
    badge.innerHTML = '🌟 Premium';
    badge.className = 'credits-badge premium';
  } else if (remaining > 0) {
    badge.innerHTML = '🔮 ' + remaining + (window.currentLang === 'es' ? ' consultas' : ' queries');
    badge.className = data.product === 'pack10' ? 'credits-badge pack' : 'credits-badge free';
  } else {
    badge.innerHTML = '💫 ' + (window.currentLang === 'es' ? 'Sin consultas' : 'No queries left');
    badge.className = 'credits-badge empty';
  }
  badge.style.display = 'block';
}

// ═══════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  updateCreditsUI();
  setTimeout(() => initStripe(), 1000);
  // Check if returning from Stripe
  setTimeout(() => checkPaymentReturn(), 500);
});
