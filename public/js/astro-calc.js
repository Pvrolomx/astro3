// Zodiaco Occidental
function getWesternSign(birthDate) {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  
  const signs = [
    { name: "Capricornio", element: "Tierra", start: [12, 22], end: [1, 19] },
    { name: "Acuario", element: "Aire", start: [1, 20], end: [2, 18] },
    { name: "Piscis", element: "Agua", start: [2, 19], end: [3, 20] },
    { name: "Aries", element: "Fuego", start: [3, 21], end: [4, 19] },
    { name: "Tauro", element: "Tierra", start: [4, 20], end: [5, 20] },
    { name: "Géminis", element: "Aire", start: [5, 21], end: [6, 20] },
    { name: "Cáncer", element: "Agua", start: [6, 21], end: [7, 22] },
    { name: "Leo", element: "Fuego", start: [7, 23], end: [8, 22] },
    { name: "Virgo", element: "Tierra", start: [8, 23], end: [9, 22] },
    { name: "Libra", element: "Aire", start: [9, 23], end: [10, 22] },
    { name: "Escorpio", element: "Agua", start: [10, 23], end: [11, 21] },
    { name: "Sagitario", element: "Fuego", start: [11, 22], end: [12, 21] }
  ];
  
  for (const sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    
    if (startMonth === 12 && endMonth === 1) {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return sign;
      }
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign;
      }
    }
  }
  return signs[0];
}

// Zodiaco Chino
function getChineseZodiac(birthYear) {
  const animals = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente",
                   "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];
  const elements = ["Madera", "Fuego", "Tierra", "Metal", "Agua"];
  
  const idx = (birthYear - 4) % 12;
  const elemIdx = Math.floor(((birthYear - 4) % 10) / 2);
  const yinYang = birthYear % 2 === 0 ? "Yang" : "Yin";
  
  return {
    animal: animals[idx],
    element: elements[elemIdx],
    yinYang: yinYang
  };
}

// Nakshatra (Védico simplificado)
function getNakshatra(birthDate) {
  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];
  
  const start = new Date(birthDate.getFullYear(), 0, 0);
  const diff = birthDate - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const idx = Math.floor((dayOfYear / 365) * 27) % 27;
  
  return { nakshatra: nakshatras[idx] };
}

// Arcángel Guardian
function getArchangel(birthDate) {
  const dateStr = birthDate.toISOString().split('T')[0].replace(/-/g, '');
  let sum = dateStr.split('').reduce((a, b) => a + parseInt(b), 0);
  while (sum > 9) {
    sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  const archangels = {
    1: { name: "Miguel", color: "Azul", domain: "Protección y coraje" },
    2: { name: "Gabriel", color: "Blanco", domain: "Comunicación y pureza" },
    3: { name: "Chamuel", color: "Rosa", domain: "Amor y relaciones" },
    4: { name: "Rafael", color: "Verde", domain: "Sanación y abundancia" },
    5: { name: "Uriel", color: "Rojo/Dorado", domain: "Sabiduría y servicio" },
    6: { name: "Jofiel", color: "Amarillo", domain: "Iluminación y belleza" },
    7: { name: "Zadkiel", color: "Violeta", domain: "Transmutación y perdón" },
    8: { name: "Raziel", color: "Arcoíris", domain: "Misterios y magia" },
    9: { name: "Metatrón", color: "Magenta", domain: "Ascensión y geometría" }
  };
  
  return archangels[sum];
}

// NUMEROLOGIA - Nuevo para ASTRO4
function getNumerology(birthDate, fullName) {
  // Numero de Vida (suma fecha nacimiento)
  const dateStr = birthDate.toISOString().split('T')[0].replace(/-/g, '');
  let lifeNumber = dateStr.split('').reduce((a, b) => a + parseInt(b), 0);
  while (lifeNumber > 9 && lifeNumber !== 11 && lifeNumber !== 22 && lifeNumber !== 33) {
    lifeNumber = lifeNumber.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  // Tabla Pitagorica
  const letterValues = {
    a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
    j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
    s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
  };
  
  const vowels = ['a','e','i','o','u'];
  const nameLower = (fullName || '').toLowerCase().replace(/[^a-z]/g, '');
  
  // Numero del Alma (solo vocales)
  let soulSum = 0;
  for (const char of nameLower) {
    if (vowels.includes(char)) {
      soulSum += letterValues[char] || 0;
    }
  }
  while (soulSum > 9 && soulSum !== 11 && soulSum !== 22) {
    soulSum = soulSum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  // Numero de Destino (todas las letras)
  let destinySum = 0;
  for (const char of nameLower) {
    destinySum += letterValues[char] || 0;
  }
  while (destinySum > 9 && destinySum !== 11 && destinySum !== 22) {
    destinySum = destinySum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  // Numero Personal del Dia
  const today = new Date();
  const daySum = today.getDate() + (today.getMonth() + 1) + lifeNumber;
  let personalDay = daySum;
  while (personalDay > 9) {
    personalDay = personalDay.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  const meanings = {
    1: { keyword: 'Liderazgo', desc: 'Independencia, iniciativa, originalidad' },
    2: { keyword: 'Cooperación', desc: 'Diplomacia, equilibrio, sensibilidad' },
    3: { keyword: 'Expresión', desc: 'Creatividad, comunicación, alegría' },
    4: { keyword: 'Estabilidad', desc: 'Trabajo, orden, construcción' },
    5: { keyword: 'Libertad', desc: 'Cambio, aventura, versatilidad' },
    6: { keyword: 'Responsabilidad', desc: 'Amor, hogar, servicio' },
    7: { keyword: 'Sabiduría', desc: 'Análisis, espiritualidad, introspección' },
    8: { keyword: 'Poder', desc: 'Abundancia, éxito material, autoridad' },
    9: { keyword: 'Humanitarismo', desc: 'Compasión, culminación, universalidad' },
    11: { keyword: 'Maestro Espiritual', desc: 'Intuición elevada, inspiración' },
    22: { keyword: 'Maestro Constructor', desc: 'Grandes logros, visión práctica' },
    33: { keyword: 'Maestro Sanador', desc: 'Servicio elevado, amor incondicional' }
  };
  
  return {
    lifeNumber: lifeNumber,
    lifeMeaning: meanings[lifeNumber] || meanings[9],
    soulNumber: soulSum,
    soulMeaning: meanings[soulSum] || meanings[9],
    destinyNumber: destinySum,
    destinyMeaning: meanings[destinySum] || meanings[9],
    personalDay: personalDay,
    personalDayMeaning: meanings[personalDay] || meanings[9]
  };
}
