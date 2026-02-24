// share-utils.js - Utilidades de compartir para ASTRO4
// C11 RAYO - Fase 3: Shareables

/**
 * Genera una imagen compartible con los resultados
 * @param {Object} data - Datos del perfil energético
 * @returns {Promise<Blob>} - Imagen PNG como blob
 */
async function generateShareableImage(data) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  
  // Fondo degradado
  const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);
  
  // Decoración: círculos sutiles
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  ctx.arc(540, 400, 300, 0, Math.PI * 2);
  ctx.strokeStyle = '#e94560';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(540, 400, 350, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  // Logo/Título
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ASTRO4', 540, 120);
  
  ctx.font = '28px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#e94560';
  ctx.fillText('Mi Perfil Energético', 540, 170);
  
  // Nombre del usuario
  ctx.font = 'bold 48px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(data.name || 'Tu Nombre', 540, 280);
  
  // Fecha de nacimiento
  ctx.font = '24px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#aaaaaa';
  ctx.fillText(data.birthDate || '', 540, 320);
  
  // Secciones de tradiciones
  const sections = [
    { icon: '☀️', title: 'Occidental', value: data.western || 'Sagitario', color: '#ffd700' },
    { icon: '🐲', title: 'Chino', value: data.chinese || 'Dragón de Madera', color: '#ff6b6b' },
    { icon: '🌙', title: 'Védico', value: data.vedic || 'Ashwini', color: '#4ecdc4' },
    { icon: '🔢', title: 'Numerología', value: data.numerology || 'Número 7', color: '#a855f7' }
  ];
  
  let y = 450;
  sections.forEach((section, idx) => {
    // Card background
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    roundRect(ctx, 80, y - 40, 920, 120, 20);
    ctx.fill();
    
    // Icon
    ctx.font = '48px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(section.icon, 120, y + 20);
    
    // Title
    ctx.font = '24px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = section.color;
    ctx.fillText(section.title, 200, y - 5);
    
    // Value
    ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(section.value, 200, y + 35);
    
    y += 150;
  });
  
  // Acciones del día (si existen)
  if (data.actions && data.actions.length > 0) {
    y += 30;
    ctx.textAlign = 'center';
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#e94560';
    ctx.fillText('✨ Guía del día ✨', 540, y);
    
    y += 50;
    ctx.font = '22px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    data.actions.slice(0, 3).forEach(action => {
      ctx.fillText('• ' + action.substring(0, 50), 540, y);
      y += 35;
    });
  }
  
  // Color y número de poder
  if (data.powerColor || data.powerNumber) {
    y += 40;
    ctx.fillStyle = 'rgba(233, 69, 96, 0.2)';
    roundRect(ctx, 200, y - 30, 680, 80, 15);
    ctx.fill();
    
    ctx.textAlign = 'center';
    ctx.font = '24px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    const powerText = [];
    if (data.powerColor) powerText.push(`Color: ${data.powerColor}`);
    if (data.powerNumber) powerText.push(`Número: ${data.powerNumber}`);
    ctx.fillText(powerText.join('  •  '), 540, y + 15);
  }
  
  // Footer con URL
  ctx.font = '22px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#888888';
  ctx.textAlign = 'center';
  ctx.fillText('Descubre tu perfil en:', 540, 1800);
  ctx.fillStyle = '#e94560';
  ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
  ctx.fillText('astro4.duendes.app', 540, 1840);
  
  // Watermark
  ctx.font = '18px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('Generado por ASTRO4 • Multi-Tradición', 540, 1890);
  
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png', 0.95);
  });
}

// Helper para rectángulos redondeados
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Descarga la imagen generada
 */
async function downloadShareImage(data) {
  const blob = await generateShareableImage(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `astro4-${data.name || 'perfil'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Compartir en WhatsApp
 */
function shareWhatsApp(data) {
  const text = generateShareText(data);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/**
 * Compartir en Twitter/X
 */
function shareTwitter(data) {
  const text = generateShareText(data, 240);
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/**
 * Copiar link al portapapeles
 */
async function copyShareLink(data) {
  const shareUrl = generateShareUrl(data);
  try {
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (err) {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

/**
 * Genera texto para compartir
 */
function generateShareText(data, maxLength = 500) {
  let text = `✨ Mi Perfil Energético ASTRO4 ✨\n\n`;
  text += `☀️ ${data.western || ''}\n`;
  text += `🐲 ${data.chinese || ''}\n`;
  text += `🌙 ${data.vedic || ''}\n`;
  text += `🔢 ${data.numerology || ''}\n\n`;
  text += `Descubre tu perfil: ${generateShareUrl(data)}`;
  
  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 3) + '...';
  }
  
  return text;
}

/**
 * Genera URL personalizada con parámetros
 */
function generateShareUrl(data) {
  const baseUrl = 'https://astro4.duendes.app/app.html';
  const params = new URLSearchParams();
  
  if (data.name) params.set('n', data.name);
  if (data.birthDate) params.set('d', data.birthDate);
  if (data.birthHour) params.set('h', data.birthHour);
  if (data.timezone) params.set('tz', data.timezone);
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Parsea parámetros de URL para pre-cargar datos
 */
function parseShareUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    name: params.get('n') || '',
    birthDate: params.get('d') || '',
    birthHour: params.get('h') || '',
    timezone: params.get('tz') || ''
  };
}

/**
 * Usar Web Share API nativa (móviles)
 */
async function nativeShare(data) {
  if (!navigator.share) {
    return false;
  }
  
  try {
    const blob = await generateShareableImage(data);
    const file = new File([blob], 'astro4-perfil.png', { type: 'image/png' });
    
    await navigator.share({
      title: 'Mi Perfil Energético ASTRO4',
      text: generateShareText(data, 200),
      url: generateShareUrl(data),
      files: [file]
    });
    return true;
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error sharing:', err);
    }
    return false;
  }
}

// Exportar funciones (si se usa como módulo)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateShareableImage,
    downloadShareImage,
    shareWhatsApp,
    shareTwitter,
    copyShareLink,
    generateShareUrl,
    parseShareUrlParams,
    nativeShare
  };
}
