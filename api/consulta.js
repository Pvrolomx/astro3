// ASTRO4 — consulta.js v12
// Refactor Opción B: prompt engineering server-side
// Protege IP del prompt, single source of truth

// ========== TABLAS DE CUALIDADES ==========

const westernQualities = {
  'Aries': { es: 'iniciador, valiente, impulsivo, lider natural', en: 'initiator, brave, impulsive, natural leader' },
  'Taurus': { es: 'estable, sensual, persistente, leal', en: 'stable, sensual, persistent, loyal' },
  'Tauro': { es: 'estable, sensual, persistente, leal', en: 'stable, sensual, persistent, loyal' },
  'Gemini': { es: 'comunicador, curioso, adaptable, mental', en: 'communicator, curious, adaptable, mental' },
  'Géminis': { es: 'comunicador, curioso, adaptable, mental', en: 'communicator, curious, adaptable, mental' },
  'Cancer': { es: 'protector, intuitivo, emocional, nutritivo', en: 'protective, intuitive, emotional, nurturing' },
  'Cáncer': { es: 'protector, intuitivo, emocional, nutritivo', en: 'protective, intuitive, emotional, nurturing' },
  'Leo': { es: 'expresivo, generoso, dramatico, lider', en: 'expressive, generous, dramatic, leader' },
  'Virgo': { es: 'analitico, servicial, perfeccionista, practico', en: 'analytical, helpful, perfectionist, practical' },
  'Libra': { es: 'diplomatico, estetico, equilibrado, social', en: 'diplomatic, aesthetic, balanced, social' },
  'Scorpio': { es: 'intenso, transformador, investigador, profundo', en: 'intense, transformative, investigator, deep' },
  'Escorpio': { es: 'intenso, transformador, investigador, profundo', en: 'intense, transformative, investigator, deep' },
  'Sagittarius': { es: 'explorador, filosofico, optimista, libre', en: 'explorer, philosophical, optimistic, free' },
  'Sagitario': { es: 'explorador, filosofico, optimista, libre', en: 'explorer, philosophical, optimistic, free' },
  'Capricorn': { es: 'ambicioso, estructurado, responsable, resistente', en: 'ambitious, structured, responsible, resilient' },
  'Capricornio': { es: 'ambicioso, estructurado, responsable, resistente', en: 'ambitious, structured, responsible, resilient' },
  'Aquarius': { es: 'innovador, humanitario, independiente, original', en: 'innovative, humanitarian, independent, original' },
  'Acuario': { es: 'innovador, humanitario, independiente, original', en: 'innovative, humanitarian, independent, original' },
  'Pisces': { es: 'empatico, artistico, intuitivo, sonador', en: 'empathic, artistic, intuitive, dreamer' },
  'Piscis': { es: 'empatico, artistico, intuitivo, sonador', en: 'empathic, artistic, intuitive, dreamer' }
};

const chineseAnimals = {
  'Rata': { es: 'ingenioso, adaptable, encantador', en: 'ingenious, adaptable, charming' },
  'Rat': { es: 'ingenioso, adaptable, encantador', en: 'ingenious, adaptable, charming' },
  'Buey': { es: 'trabajador, confiable, determinado', en: 'hardworking, reliable, determined' },
  'Ox': { es: 'trabajador, confiable, determinado', en: 'hardworking, reliable, determined' },
  'Tigre': { es: 'valiente, competitivo, impredecible', en: 'brave, competitive, unpredictable' },
  'Tiger': { es: 'valiente, competitivo, impredecible', en: 'brave, competitive, unpredictable' },
  'Conejo': { es: 'gentil, elegante, alerta', en: 'gentle, elegant, alert' },
  'Rabbit': { es: 'gentil, elegante, alerta', en: 'gentle, elegant, alert' },
  'Dragón': { es: 'confiado, inteligente, entusiasta', en: 'confident, intelligent, enthusiastic' },
  'Dragon': { es: 'confiado, inteligente, entusiasta', en: 'confident, intelligent, enthusiastic' },
  'Serpiente': { es: 'enigmatico, intuitivo, sabio', en: 'enigmatic, intuitive, wise' },
  'Snake': { es: 'enigmatico, intuitivo, sabio', en: 'enigmatic, intuitive, wise' },
  'Caballo': { es: 'energetico, libre, impaciente', en: 'energetic, free, impatient' },
  'Horse': { es: 'energetico, libre, impaciente', en: 'energetic, free, impatient' },
  'Cabra': { es: 'creativo, amable, dependiente', en: 'creative, kind, dependent' },
  'Goat': { es: 'creativo, amable, dependiente', en: 'creative, kind, dependent' },
  'Mono': { es: 'ingenioso, curioso, jugueton', en: 'ingenious, curious, playful' },
  'Monkey': { es: 'ingenioso, curioso, jugueton', en: 'ingenious, curious, playful' },
  'Gallo': { es: 'observador, trabajador, valiente', en: 'observant, hardworking, brave' },
  'Rooster': { es: 'observador, trabajador, valiente', en: 'observant, hardworking, brave' },
  'Perro': { es: 'leal, honesto, prudente', en: 'loyal, honest, prudent' },
  'Dog': { es: 'leal, honesto, prudente', en: 'loyal, honest, prudent' },
  'Cerdo': { es: 'compasivo, generoso, diligente', en: 'compassionate, generous, diligent' },
  'Pig': { es: 'compasivo, generoso, diligente', en: 'compassionate, generous, diligent' }
};

const chineseElements = {
  'Madera': { es: 'crecimiento y flexibilidad', en: 'growth and flexibility' },
  'Wood': { es: 'crecimiento y flexibilidad', en: 'growth and flexibility' },
  'Fuego': { es: 'pasion y accion', en: 'passion and action' },
  'Fire': { es: 'pasion y accion', en: 'passion and action' },
  'Tierra': { es: 'estabilidad y practicidad', en: 'stability and practicality' },
  'Earth': { es: 'estabilidad y practicidad', en: 'stability and practicality' },
  'Metal': { es: 'precision y determinacion', en: 'precision and determination' },
  'Agua': { es: 'adaptabilidad y profundidad', en: 'adaptability and depth' },
  'Water': { es: 'adaptabilidad y profundidad', en: 'adaptability and depth' }
};

const nakshatraQualities = {
  'Ashwini':            { es: 'veloz, sanador, pionero, impaciente por actuar', en: 'swift, healing, pioneering, eager to act' },
  'Bharani':            { es: 'transformador, intenso, responsable, protector', en: 'transformative, intense, responsible, protective' },
  'Krittika':           { es: 'cortante, purificador, critico, determinado', en: 'sharp, purifying, critical, determined' },
  'Rohini':             { es: 'creativo, fertil, sensual, magnetico', en: 'creative, fertile, sensual, magnetic' },
  'Mrigashira':         { es: 'buscador, curioso, gentil, inquieto', en: 'seeking, curious, gentle, restless' },
  'Ardra':              { es: 'tormentoso, transformador, intelectual, emocional', en: 'stormy, transformative, intellectual, emotional' },
  'Punarvasu':          { es: 'renovador, optimista, adaptable, generoso', en: 'renewing, optimistic, adaptable, generous' },
  'Pushya':             { es: 'nutritivo, prospero, devoto, protector', en: 'nourishing, prosperous, devoted, protective' },
  'Ashlesha':           { es: 'mistico, intenso, perceptivo, reservado', en: 'mystical, intense, perceptive, reserved' },
  'Magha':              { es: 'real, ancestral, autoritario, noble', en: 'royal, ancestral, authoritative, noble' },
  'Purva Phalguni':     { es: 'creativo, placentero, artistico, relajado', en: 'creative, pleasure-seeking, artistic, relaxed' },
  'Uttara Phalguni':    { es: 'amistoso, confiable, contractual, servicial', en: 'friendly, reliable, contractual, helpful' },
  'Hasta':              { es: 'habil, artesanal, ingenioso, detallista', en: 'skillful, crafty, ingenious, detail-oriented' },
  'Chitra':             { es: 'brillante, artistico, visionario, perfeccionista', en: 'brilliant, artistic, visionary, perfectionist' },
  'Swati':              { es: 'independiente, flexible, diplomatico, libre', en: 'independent, flexible, diplomatic, free' },
  'Vishakha':           { es: 'determinado, enfocado, ambicioso, persistente', en: 'determined, focused, ambitious, persistent' },
  'Anuradha':           { es: 'devoto, amistoso, leal, organizador', en: 'devoted, friendly, loyal, organizing' },
  'Jyeshtha':           { es: 'protector, senior, valiente, responsable', en: 'protective, senior, courageous, responsible' },
  'Mula':               { es: 'investigador, profundo, destructivo-reconstructivo, filosofico', en: 'investigative, deep, destructive-reconstructive, philosophical' },
  'Purva Ashadha':      { es: 'invencible, purificador, motivador, optimista', en: 'invincible, purifying, motivating, optimistic' },
  'Uttara Ashadha':     { es: 'universal, victorioso, lider, inamovible', en: 'universal, victorious, leading, immovable' },
  'Shravana':           { es: 'aprendiz, buen oyente, conectador, sabio', en: 'learning, good listener, connecting, wise' },
  'Dhanishta':          { es: 'abundante, musical, ambicioso, social', en: 'abundant, musical, ambitious, social' },
  'Shatabhisha':        { es: 'sanador, misterioso, independiente, analitico', en: 'healing, mysterious, independent, analytical' },
  'Purva Bhadrapada':   { es: 'fogoso, transformativo, idealista, extremo', en: 'fiery, transformative, idealistic, extreme' },
  'Uttara Bhadrapada':  { es: 'profundo, espiritual, sabio, controlado', en: 'deep, spiritual, wise, controlled' },
  'Revati':             { es: 'nutritivo, viajero, compasivo, sonador', en: 'nurturing, journeying, compassionate, dreamy' }
};

function getNakshatraQual(nakshatraName, lang) {
  const q = nakshatraQualities[nakshatraName];
  return q ? (q[lang] || q.es) : (lang === 'es' ? 'intuitivo, profundo, receptivo' : 'intuitive, deep, receptive');
}

const dayMeanings = {
  es: {1:'inicio', 2:'cooperación', 3:'expresión', 4:'estructura', 5:'cambio', 6:'armonía', 7:'reflexión', 8:'poder', 9:'cierre'},
  en: {1:'new beginnings', 2:'cooperation', 3:'expression', 4:'structure', 5:'change', 6:'harmony', 7:'reflection', 8:'power', 9:'completion'}
};

// ========== HELPERS ==========

function getWesternQual(signName, lang) {
  const q = westernQualities[signName];
  return q ? (q[lang] || q.es) : '';
}

function getChineseQual(animal, element, lang) {
  const animalQ = chineseAnimals[animal];
  const elemQ = chineseElements[element];
  const aText = animalQ ? (animalQ[lang] || animalQ.es) : '';
  const eText = elemQ ? (elemQ[lang] || elemQ.es) : element;
  return aText + ', ' + (lang === 'es' ? 'con energia de ' : 'with energy of ') + eText;
}

function isGibberish(text) {
  if (!text || typeof text !== 'string') return true;
  const cleaned = text.trim().toLowerCase();
  if (cleaned.length < 3) return true;
  if (!/[a-záéíóúñ]/i.test(cleaned)) return true;
  if (/(.)\1{3,}/.test(cleaned)) return true;
  const vowels = (cleaned.match(/[aeiouáéíóú]/gi) || []).length;
  const consonants = (cleaned.match(/[bcdfghjklmnñpqrstvwxyz]/gi) || []).length;
  if (consonants > 0 && vowels === 0) return true;
  if (consonants > 6 && vowels < consonants / 6) return true;
  if (/qwert|asdf|zxcv|qazwsx|wasd|hjkl/i.test(cleaned)) return true;
  if (/^(.{1,2})\1{2,}$/.test(cleaned)) return true;
  return false;
}

// ========== PROMPT BUILDER ==========

function buildPrompt(data) {
  const { nombre, genero, lang, pregunta, perfil, datosNum } = data;

  const westernQual = getWesternQual(perfil.westernName, lang);
  const chineseQual = getChineseQual(perfil.chineseAnimal, perfil.chineseElement, lang);
  const vedicQual = getNakshatraQual(perfil.vedic, lang);
  const dayMeaning = dayMeanings[lang][perfil.personalDay] || '';

  const generoTexto = genero === 'f' ? (lang === 'es' ? 'mujer' : 'woman') :
                      (genero === 'm' ? (lang === 'es' ? 'hombre' : 'man') :
                      (lang === 'es' ? 'genero no especificado' : 'gender not specified'));

  const saludoGenero = genero === 'f' ? (lang === 'es' ? 'Querida' : 'Dear') :
                       (genero === 'm' ? (lang === 'es' ? 'Querido' : 'Dear') : '');

  const saludo = saludoGenero ? saludoGenero + ' ' + nombre : nombre;

  const hoy = new Date();
  const fechaHoy = lang === 'es' ?
    hoy.toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long'}) :
    hoy.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});

  if (lang === 'es') {
    return 'Responde en ESPAÑOL. ' +
      'USUARIO: ' + nombre + ' (' + generoTexto + ', ' + datosNum.edad + ' años). ' +
      'FECHA: ' + fechaHoy + '. ' +
      '[PERFIL ENERGÉTICO - USA CUALIDADES NO NOMBRES: ' +
      'Occidental: ' + westernQual + ', ' +
      'Chino: ' + chineseQual + ', ' +
      'Nakshatra (védico): ' + vedicQual + ', ' +
      'Número Vida: ' + perfil.lifeNumber + ' (' + perfil.lifeMeaning + '), ' +
      'Día Personal: ' + perfil.personalDay + ' (' + dayMeaning + '), ' +
      'Año Personal: ' + datosNum.anoPersonal + ', ' +
      'Etapa de Vida: ' + datosNum.etapaActual + ' de 4 (inició a los ' + datosNum.edadInicioEtapa + ')] ' +
      'PREGUNTA: "' + pregunta + '". ' +
      'INSTRUCCIONES: ' +
      '1.Inicia con ' + saludo + '. ' +
      '2.Responde en 5-7 oraciones sustanciales. ' +
      '3.NO menciones nombres de signos, animales o nakshatras. SI menciona las CUALIDADES (ej: tu naturaleza intensa, tu energía rápida). ' +
      '4.Si la pregunta es sobre fechas o etapas, USA LOS NÚMEROS del perfil. ' +
      '5.Da al menos UN consejo específico y práctico para HOY. ' +
      '6.Tono: sabio pero directo, no vago ni poético. ' +
      '7.El usuario debe sentir que le hablas A ÉL/ELLA específicamente, no a un signo. ' +
      '8.Si la pregunta es incoherente, sin sentido, o no es una pregunta real (ej: letras random, texto sin significado), responde amablemente: "No entendí tu pregunta. ¿Puedes reformularla de forma más clara?" y NO des una lectura.';
  } else {
    return 'Respond in ENGLISH. ' +
      'USER: ' + nombre + ' (' + generoTexto + ', ' + datosNum.edad + ' years old). ' +
      'DATE: ' + fechaHoy + '. ' +
      '[ENERGY PROFILE - USE QUALITIES NOT NAMES: ' +
      'Western: ' + westernQual + ', ' +
      'Chinese: ' + chineseQual + ', ' +
      'Nakshatra (Vedic): ' + vedicQual + ', ' +
      'Life Number: ' + perfil.lifeNumber + ' (' + perfil.lifeMeaning + '), ' +
      'Personal Day: ' + perfil.personalDay + ' (' + dayMeaning + '), ' +
      'Personal Year: ' + datosNum.anoPersonal + ', ' +
      'Life Stage: ' + datosNum.etapaActual + ' of 4 (started at age ' + datosNum.edadInicioEtapa + ')] ' +
      'QUESTION: "' + pregunta + '". ' +
      'INSTRUCTIONS: ' +
      '1.Start with ' + saludo + '. ' +
      '2.Respond in 5-7 substantial sentences. ' +
      '3.DO NOT mention sign names, animals or nakshatras. DO mention QUALITIES (e.g., your intense nature, your quick energy). ' +
      '4.If the question is about dates or stages, USE THE NUMBERS from the profile. ' +
      '5.Give at least ONE specific and practical advice for TODAY. ' +
      '6.Tone: wise but direct, not vague or poetic. ' +
      '7.The user should feel you are speaking TO THEM specifically, not to a sign. ' +
      '8.If the question is incoherent, nonsensical, or not a real question (e.g., random letters, meaningless text), respond kindly: "I did not understand your question. Could you rephrase it more clearly?" and DO NOT give a reading.';
  }
}

// ========== INPUT LIMITS ==========

const MAX_NOMBRE = 50;
const MAX_PREGUNTA = 500;
const MAX_BODY_SIZE = 4096; // bytes

function validateInputLength(body) {
  // Check raw body size
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  if (bodyStr.length > MAX_BODY_SIZE) {
    return 'Solicitud demasiado grande.';
  }
  // Check individual fields
  if (body.nombre && body.nombre.length > MAX_NOMBRE) {
    return 'Nombre demasiado largo.';
  }
  if (body.pregunta && body.pregunta.length > MAX_PREGUNTA) {
    return 'Pregunta demasiado larga (máximo 500 caracteres).';
  }
  return null;
}

// ========== RATE LIMITING ==========
// In-memory rate limit — resets when Vercel worker recycles
// For serious production, use Upstash Redis
// Limit: 20 requests per IP per hour — generous for real use, blocks abuse

const rateLimitMap = new Map();
const RATE_LIMIT = 20;           // max requests per window
const WINDOW_MS = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || 'unknown';
  const data = rateLimitMap.get(key);

  if (!data || now - data.windowStart > WINDOW_MS) {
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

function cleanRateLimitMap() {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.windowStart > WINDOW_MS) rateLimitMap.delete(key);
  }
}

// ========== HANDLER ==========

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting — get real IP (Vercel passes x-forwarded-for)
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || req.socket?.remoteAddress
          || 'unknown';

  // Occasionally clean old entries
  if (Math.random() < 0.05) cleanRateLimitMap();

  const rateCheck = checkRateLimit(ip);

  // Always add rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT);
  res.setHeader('X-RateLimit-Remaining', rateCheck.remaining);

  if (!rateCheck.allowed) {
    res.setHeader('Retry-After', rateCheck.retryAfter);
    return res.status(429).json({
      respuesta: 'Demasiadas consultas. Por favor espera un momento antes de continuar.'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    // Input validation — prevent oversized payloads from burning API tokens
    const inputError = validateInputLength(body);
    if (inputError) {
      return res.status(400).json({ respuesta: inputError });
    }

    let promptText;

    if (body.perfil && body.datosNum) {
      const { pregunta } = body;

      if (isGibberish(pregunta)) {
        return res.status(200).json({
          respuesta: '🔮 No entendí tu pregunta. ¿Puedes formularla de manera más clara para que pueda guiarte mejor?'
        });
      }

      promptText = buildPrompt(body);

    } else {
      return res.status(400).json({ respuesta: 'Datos incompletos.' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error('ASTRO4: Missing ANTHROPIC_API_KEY');
      return res.status(500).json({ respuesta: 'Servicio temporalmente no disponible.' });
    }

    const systemPrompt = `Eres un guía astrológico y numerológico sabio y empático. Sigue las instrucciones del usuario al pie de la letra.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: promptText }]
      })
    });

    const rawText = await response.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('ASTRO4: Failed to parse API response');
      return res.status(500).json({ respuesta: 'Error al procesar la respuesta. Intenta de nuevo.' });
    }

    if (data.error) {
      console.error('ASTRO4: API error:', data.error.message);
      return res.status(500).json({ respuesta: 'Error en el servicio. Intenta de nuevo en unos momentos.' });
    }

    const respuesta = data.content?.[0]?.text || 'Sin respuesta';
    return res.status(200).json({ respuesta });

  } catch (error) {
    console.error('ASTRO4: Unhandled error:', error.message);
    return res.status(500).json({ respuesta: 'Algo salió mal. Intenta de nuevo.' });
  }
}
// v14 - Rate limiting: 20 req/hr per IP to protect API tokens from abuse
