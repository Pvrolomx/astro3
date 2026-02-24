// Función para detectar garabatos/texto sin sentido
function isGibberish(text) {
  if (!text || typeof text !== 'string') return true;
  
  const cleaned = text.trim().toLowerCase();
  
  // 1. Muy corto
  if (cleaned.length < 3) return true;
  
  // 2. Solo espacios o caracteres especiales
  if (!/[a-záéíóúñ]/i.test(cleaned)) return true;
  
  // 3. Caracteres repetidos (aaaa, jjjj, etc)
  if (/(.)\\1{3,}/.test(cleaned)) return true;
  
  // 4. Sin vocales (mínimo 1 vocal por cada 6 consonantes)
  const vowels = (cleaned.match(/[aeiouáéíóú]/gi) || []).length;
  const consonants = (cleaned.match(/[bcdfghjklmnñpqrstvwxyz]/gi) || []).length;
  if (consonants > 0 && vowels === 0) return true;
  if (consonants > 6 && vowels < consonants / 6) return true;
  
  // 5. Patrones de teclado común (qwerty, asdf, etc)
  const keyboardPatterns = /qwert|asdf|zxcv|qazwsx|wasd|hjkl/i;
  if (keyboardPatterns.test(cleaned)) return true;
  
  // 6. Mismo caracter alternando (abab, xyxy)
  if (/^(.{1,2})\\1{2,}$/.test(cleaned)) return true;
  
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    
    const { prompt } = body;
    
    // Validación de garabatos antes de llamar API
    if (isGibberish(prompt)) {
      return res.status(200).json({ 
        respuesta: '🔮 No entendí tu pregunta. ¿Puedes formularla de manera más clara para que pueda guiarte mejor?'
      });
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
        messages: [{ role: 'user', content: prompt || 'hola' }]
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
// v10 - removed debug info from responses, errors logged server-side only
