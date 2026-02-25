// API endpoint - v13: Input validation + gibberish check + no error leaking

const MAX_NOMBRE = 50;
const MAX_SIGN = 50;

function isGibberish(text) {
  if (!text || typeof text !== 'string') return true;
  const cleaned = text.trim().toLowerCase();
  if (cleaned.length < 2) return true;
  if (!/[a-záéíóúñ]/i.test(cleaned)) return true;
  if (/(.)\1{3,}/.test(cleaned)) return true;
  if (/qwert|asdf|zxcv|wasd|hjkl/i.test(cleaned)) return true;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Parse body safely - ignore parsing errors and use defaults
  let nombre = 'Usuario';
  let trad = 'western';
  let sig = 'Aries';
  let lang = 'es';
  
  try {
    if (req.body && typeof req.body === 'object') {
      nombre = req.body.nombre || nombre;
      trad = req.body.tradition || req.body.tradicion || trad;
      sig = req.body.sign || req.body.signo || sig;
      lang = req.body.lang || lang;
    }
  } catch (e) {
    // Ignore body parsing errors, use defaults
  }

  // Gibberish check on nombre
  if (isGibberish(nombre)) {
    nombre = 'Usuario';
  }

  // Input validation — prevent oversized payloads
  if (nombre.length > MAX_NOMBRE) {
    return res.status(400).json({ respuesta: 'Nombre demasiado largo.', lectura: 'Error' });
  }
  if (sig.length > MAX_SIGN) {
    return res.status(400).json({ respuesta: 'Datos inválidos.', lectura: 'Error' });
  }
  // Validate tradition is one of the expected values
  const validTraditions = ['western', 'vedic', 'chinese', 'numerology'];
  if (!validTraditions.includes(trad)) {
    trad = 'western';
  }
  // Validate lang
  if (lang !== 'es' && lang !== 'en') {
    lang = 'es';
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ASTRO4 PROFUNDIZAR: Missing ANTHROPIC_API_KEY');
    return res.status(500).json({ respuesta: 'Servicio temporalmente no disponible.', lectura: 'Error' });
  }

  // Gender neutral instruction
  const genderNote = lang === 'es' 
    ? `Ve directo al grano SIN saludos (no Hola, Querido, Estimado, Amigo). Dirígete a ${nombre} en segunda persona sin asumir género.`
    : `Go straight to the point WITHOUT greetings (no Hello, Dear, Friend). Address ${nombre} in second person without assuming gender.`;

  // Prompts by tradition
  const prompts = {
    western: lang === 'es' 
      ? `Eres un astrólogo occidental. ${nombre} es ${sig}. ${genderNote} Genera una lectura para HOY. Incluye: energía del día, consejo práctico, afirmación. Máximo 100 palabras.`
      : `You are a Western astrologer. ${nombre} is ${sig}. ${genderNote} Generate a reading for TODAY. Include: day's energy, practical advice, affirmation. Maximum 100 words.`,
    vedic: lang === 'es'
      ? `Eres un jyotishi. ${nombre} tiene Nakshatra ${sig}. ${genderNote} Lectura para HOY según Jyotish. Máximo 100 palabras.`
      : `You are a jyotishi. ${nombre}'s Nakshatra is ${sig}. ${genderNote} Reading for TODAY. Maximum 100 words.`,
    chinese: lang === 'es'
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
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const text = await response.text();
    
    if (!response.ok) {
      console.error('ASTRO4 PROFUNDIZAR: API error status:', response.status);
      return res.status(500).json({ respuesta: 'Error en el servicio. Intenta de nuevo.', lectura: 'Error' });
    }
    
    const data = JSON.parse(text);
    const lectura = data.content?.[0]?.text || 'Sin lectura disponible';
    
    return res.status(200).json({ respuesta: lectura, lectura });
    
  } catch (error) {
    console.error('ASTRO4 PROFUNDIZAR: Error:', error.message);
    return res.status(500).json({ respuesta: 'Algo salió mal. Intenta de nuevo.', lectura: 'Error' });
  }
}
