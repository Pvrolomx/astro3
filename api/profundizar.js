// API endpoint - v14: Rate limiting + security headers + input validation

const MAX_NOMBRE = 50;
const MAX_SIGN   = 50;

// ── Rate limiting in-memory ───────────────────────────────────────────────────
// Vercel funciones serverless comparten memoria dentro del mismo worker.
// El Map se resetea cuando el worker se recicla (~cada pocos minutos en free tier,
// más estable en paid). Para produccion seria, usar Upstash Redis.
// Limite: 10 requests por IP por hora — suficiente para uso real, bloquea abuso.
const rateLimitMap = new Map();
const RATE_LIMIT   = 10;          // max requests por ventana
const WINDOW_MS    = 60 * 60 * 1000; // 1 hora en ms

function checkRateLimit(ip) {
  const now  = Date.now();
  const key  = ip || 'unknown';
  const data = rateLimitMap.get(key);

  if (!data || now - data.windowStart > WINDOW_MS) {
    // Primera request o ventana expirada — resetear
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (data.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((data.windowStart + WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  data.count++;
  rateLimitMap.set(key, data);
  return { allowed: true, remaining: RATE_LIMIT - data.count };
}

// Limpieza periodica para no acumular IPs en memoria
function cleanRateLimitMap() {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.windowStart > WINDOW_MS) rateLimitMap.delete(key);
  }
}

// ── Gibberish check ──────────────────────────────────────────────────────────
function isGibberish(text) {
  if (!text || typeof text !== 'string') return true;
  const cleaned = text.trim().toLowerCase();
  if (cleaned.length < 2) return true;
  if (!/[a-záéíóúñ]/i.test(cleaned)) return true;
  if (/(.)\\1{3,}/.test(cleaned)) return true;
  if (/qwert|asdf|zxcv|wasd|hjkl/i.test(cleaned)) return true;
  return false;
}

// ── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting — obtener IP real (Vercel pasa x-forwarded-for)
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || req.socket?.remoteAddress
          || 'unknown';

  // Limpiar entradas viejas ocasionalmente
  if (Math.random() < 0.05) cleanRateLimitMap();

  const rateCheck = checkRateLimit(ip);
  
  // Siempre agregar headers de rate limit a la respuesta
  res.setHeader('X-RateLimit-Limit',     RATE_LIMIT);
  res.setHeader('X-RateLimit-Remaining', rateCheck.remaining);

  if (!rateCheck.allowed) {
    res.setHeader('Retry-After', rateCheck.retryAfter);
    return res.status(429).json({
      respuesta: 'Demasiadas consultas. Intenta de nuevo en una hora.',
      lectura:   'Rate limit exceeded'
    });
  }

  // Parse body — sign es requerido para evitar consumo de API sin datos del usuario
  let nombre = '';
  let trad   = 'western';
  let sig    = '';
  let lang   = 'es';

  try {
    if (req.body && typeof req.body === 'object') {
      nombre = req.body.nombre   || '';
      trad   = req.body.tradition || req.body.tradicion || trad;
      sig    = req.body.sign     || req.body.signo || '';
      lang   = req.body.lang     || lang;
    }
  } catch (e) {
    // Ignorar errores de parsing — usar defaults
  }

  // Validacion de campos requeridos — sin sign no hay lectura (evita abuso de API)
  if (!sig || sig.trim().length === 0) {
    return res.status(400).json({ respuesta: 'Datos incompletos.', lectura: 'Error' });
  }

  // nombre es opcional — usar 'Usuario' como fallback solo si viene vacio
  if (!nombre || isGibberish(nombre)) nombre = 'Usuario';

  // Validacion de longitud
  if (nombre.length > MAX_NOMBRE)
    return res.status(400).json({ respuesta: 'Nombre demasiado largo.', lectura: 'Error' });
  if (sig.length > MAX_SIGN)
    return res.status(400).json({ respuesta: 'Datos inválidos.', lectura: 'Error' });

  // Whitelist de tradiciones y lang
  const validTraditions = ['western', 'vedic', 'chinese', 'numerology'];
  if (!validTraditions.includes(trad)) trad = 'western';
  if (lang !== 'es' && lang !== 'en')  lang = 'es';

  // API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ASTRO4: Missing ANTHROPIC_API_KEY');
    return res.status(500).json({ respuesta: 'Servicio temporalmente no disponible.', lectura: 'Error' });
  }

  const genderNote = lang === 'es'
    ? `Ve directo al grano SIN saludos. Dirígete a ${nombre} en segunda persona sin asumir género.`
    : `Go straight to the point WITHOUT greetings. Address ${nombre} in second person without assuming gender.`;

  const prompts = {
    western:    lang === 'es'
      ? `Eres un astrólogo occidental. ${nombre} es ${sig}. ${genderNote} Genera una lectura para HOY. Incluye: energía del día, consejo práctico, afirmación. Máximo 100 palabras.`
      : `You are a Western astrologer. ${nombre} is ${sig}. ${genderNote} Generate a reading for TODAY. Include: day's energy, practical advice, affirmation. Maximum 100 words.`,
    vedic:      lang === 'es'
      ? `Eres un jyotishi. ${nombre} tiene Nakshatra ${sig}. ${genderNote} Lectura para HOY según Jyotish. Máximo 100 palabras.`
      : `You are a jyotishi. ${nombre}'s Nakshatra is ${sig}. ${genderNote} Reading for TODAY. Maximum 100 words.`,
    chinese:    lang === 'es'
      ? `Eres maestro de astrología china. ${nombre} es ${sig}. ${genderNote} Lectura para HOY basada en ciclo lunar. Máximo 100 palabras.`
      : `You are a Chinese astrology master. ${nombre} is ${sig}. ${genderNote} Reading for TODAY based on lunar cycle. Maximum 100 words.`,
    numerology: lang === 'es'
      ? `Eres numerólogo. ${nombre} tiene número ${sig}. ${genderNote} Lectura para HOY. Máximo 100 palabras.`
      : `You are a numerologist. ${nombre}'s number is ${sig}. ${genderNote} Reading for TODAY. Maximum 100 words.`
  };

  const prompt = prompts[trad] || prompts.western;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-api-key':          apiKey,
        'anthropic-version':  '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 250,
        messages:   [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      console.error('ASTRO4: API error status:', response.status);
      return res.status(500).json({ respuesta: 'Error en el servicio. Intenta de nuevo.', lectura: 'Error' });
    }

    const data    = await response.json();
    const lectura = data.content?.[0]?.text || 'Sin lectura disponible';

    return res.status(200).json({ respuesta: lectura, lectura });

  } catch (error) {
    console.error('ASTRO4: Error:', error.message);
    return res.status(500).json({ respuesta: 'Algo salió mal. Intenta de nuevo.', lectura: 'Error' });
  }
}
