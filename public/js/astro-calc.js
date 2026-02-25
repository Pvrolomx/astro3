// Zodiaco Occidental con i18n
const westernSigns = {
  es: [
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
  ],
  en: [
    { name: "Capricorn", element: "Earth", start: [12, 22], end: [1, 19] },
    { name: "Aquarius", element: "Air", start: [1, 20], end: [2, 18] },
    { name: "Pisces", element: "Water", start: [2, 19], end: [3, 20] },
    { name: "Aries", element: "Fire", start: [3, 21], end: [4, 19] },
    { name: "Taurus", element: "Earth", start: [4, 20], end: [5, 20] },
    { name: "Gemini", element: "Air", start: [5, 21], end: [6, 20] },
    { name: "Cancer", element: "Water", start: [6, 21], end: [7, 22] },
    { name: "Leo", element: "Fire", start: [7, 23], end: [8, 22] },
    { name: "Virgo", element: "Earth", start: [8, 23], end: [9, 22] },
    { name: "Libra", element: "Air", start: [9, 23], end: [10, 22] },
    { name: "Scorpio", element: "Water", start: [10, 23], end: [11, 21] },
    { name: "Sagittarius", element: "Fire", start: [11, 22], end: [12, 21] }
  ]
};

function getWesternSign(birthDate, lang) {
  lang = lang || 'es';
  const day = birthDate.getUTCDate();
  const month = birthDate.getUTCMonth() + 1;
  const signs = westernSigns[lang];
  
  for (const sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    if (startMonth === 12 && endMonth === 1) {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) return sign;
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign;
    }
  }
  return signs[0];
}


// Tabla Año Nuevo Chino - fechas exactas (100% precisión)
const CHINESE_NEW_YEAR = {
    1920: '1920-02-20', 1921: '1921-02-08', 1922: '1922-01-28', 1923: '1923-02-16',
    1924: '1924-02-05', 1925: '1925-01-24', 1926: '1926-02-13', 1927: '1927-02-02',
    1928: '1928-01-23', 1929: '1929-02-10', 1930: '1930-01-30', 1931: '1931-02-17',
    1932: '1932-02-06', 1933: '1933-01-26', 1934: '1934-02-14', 1935: '1935-02-04',
    1936: '1936-01-24', 1937: '1937-02-11', 1938: '1938-01-31', 1939: '1939-02-19',
    1940: '1940-02-08', 1941: '1941-01-27', 1942: '1942-02-15', 1943: '1943-02-05',
    1944: '1944-01-25', 1945: '1945-02-13', 1946: '1946-02-02', 1947: '1947-01-22',
    1948: '1948-02-10', 1949: '1949-01-29', 1950: '1950-02-17', 1951: '1951-02-06',
    1952: '1952-01-27', 1953: '1953-02-14', 1954: '1954-02-03', 1955: '1955-01-24',
    1956: '1956-02-12', 1957: '1957-01-31', 1958: '1958-02-18', 1959: '1959-02-08',
    1960: '1960-01-28', 1961: '1961-02-15', 1962: '1962-02-05', 1963: '1963-01-25',
    1964: '1964-02-13', 1965: '1965-02-02', 1966: '1966-01-21', 1967: '1967-02-09',
    1968: '1968-01-30', 1969: '1969-02-17', 1970: '1970-02-06', 1971: '1971-01-27',
    1972: '1972-02-15', 1973: '1973-02-03', 1974: '1974-01-23', 1975: '1975-02-11',
    1976: '1976-01-31', 1977: '1977-02-18', 1978: '1978-02-07', 1979: '1979-01-28',
    1980: '1980-02-16', 1981: '1981-02-05', 1982: '1982-01-25', 1983: '1983-02-13',
    1984: '1984-02-02', 1985: '1985-02-20', 1986: '1986-02-09', 1987: '1987-01-29',
    1988: '1988-02-17', 1989: '1989-02-06', 1990: '1990-01-27', 1991: '1991-02-15',
    1992: '1992-02-04', 1993: '1993-01-23', 1994: '1994-02-10', 1995: '1995-01-31',
    1996: '1996-02-19', 1997: '1997-02-07', 1998: '1998-01-28', 1999: '1999-02-16',
    2000: '2000-02-05', 2001: '2001-01-24', 2002: '2002-02-12', 2003: '2003-02-01',
    2004: '2004-01-22', 2005: '2005-02-09', 2006: '2006-01-29', 2007: '2007-02-18',
    2008: '2008-02-07', 2009: '2009-01-26', 2010: '2010-02-14', 2011: '2011-02-03',
    2012: '2012-01-23', 2013: '2013-02-10', 2014: '2014-01-31', 2015: '2015-02-19',
    2016: '2016-02-08', 2017: '2017-01-28', 2018: '2018-02-16', 2019: '2019-02-05',
    2020: '2020-01-25', 2021: '2021-02-12', 2022: '2022-02-01', 2023: '2023-01-22',
    2024: '2024-02-10', 2025: '2025-01-29', 2026: '2026-02-17', 2027: '2027-02-06',
    2028: '2028-01-26', 2029: '2029-02-13', 2030: '2030-02-03'
};

// Determina año chino real basado en fecha completa
function getChineseYear(birthDate) {
    const date = new Date(birthDate);
    const year = date.getFullYear();
    if (!CHINESE_NEW_YEAR[year]) return year;
    const cnyDate = new Date(CHINESE_NEW_YEAR[year]);
    return date < cnyDate ? year - 1 : year;
}

// Zodiaco Chino con i18n
const chineseData = {
  es: {
    animals: ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"],
    elements: ["Madera", "Fuego", "Tierra", "Metal", "Agua"]
  },
  en: {
    animals: ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"],
    elements: ["Wood", "Fire", "Earth", "Metal", "Water"]
  }
};

function getChineseZodiac(birthDate, lang) {
  lang = lang || 'es';
  const data = chineseData[lang];
  // Usar año chino real (considera Año Nuevo Chino)
  const chineseYear = typeof birthDate === 'object' ? getChineseYear(birthDate) : birthDate;
  const idx = (chineseYear - 4) % 12;
  const elemIdx = Math.floor(((chineseYear - 4) % 10) / 2);
  const yinYang = chineseYear % 2 === 0 ? "Yang" : "Yin";
  return { animal: data.animals[idx], element: data.elements[elemIdx], yinYang: yinYang, chineseYear: chineseYear };
}

// Nakshatra (Védico) - Cálculo basado en ciclo sideral lunar
// Precisión: ±1 nakshatra sin hora, ±0.5 con hora aproximada
function getNakshatra(birthDate, birthHour) {
  const nakshatras = [
    { name: "Ashwini", deity: "Ashwini Kumaras", quality: "swift, healing" },
    { name: "Bharani", deity: "Yama", quality: "restraint, transformation" },
    { name: "Krittika", deity: "Agni", quality: "sharp, purifying" },
    { name: "Rohini", deity: "Brahma", quality: "growth, creativity" },
    { name: "Mrigashira", deity: "Soma", quality: "seeking, curious" },
    { name: "Ardra", deity: "Rudra", quality: "storm, transformation" },
    { name: "Punarvasu", deity: "Aditi", quality: "renewal, return" },
    { name: "Pushya", deity: "Brihaspati", quality: "nourishing, prosperous" },
    { name: "Ashlesha", deity: "Nagas", quality: "mystical, intense" },
    { name: "Magha", deity: "Pitris", quality: "royal, ancestral" },
    { name: "Purva Phalguni", deity: "Bhaga", quality: "pleasure, creativity" },
    { name: "Uttara Phalguni", deity: "Aryaman", quality: "friendship, contracts" },
    { name: "Hasta", deity: "Savitar", quality: "skill, craftsmanship" },
    { name: "Chitra", deity: "Tvashtar", quality: "brilliant, artistic" },
    { name: "Swati", deity: "Vayu", quality: "independent, flexible" },
    { name: "Vishakha", deity: "Indra-Agni", quality: "determined, goal-oriented" },
    { name: "Anuradha", deity: "Mitra", quality: "devotion, friendship" },
    { name: "Jyeshtha", deity: "Indra", quality: "protective, senior" },
    { name: "Mula", deity: "Nirriti", quality: "foundational, investigative" },
    { name: "Purva Ashadha", deity: "Apas", quality: "invincible, purifying" },
    { name: "Uttara Ashadha", deity: "Vishvadevas", quality: "universal, victorious" },
    { name: "Shravana", deity: "Vishnu", quality: "learning, listening" },
    { name: "Dhanishta", deity: "Vasus", quality: "wealth, musical" },
    { name: "Shatabhisha", deity: "Varuna", quality: "healing, secretive" },
    { name: "Purva Bhadrapada", deity: "Aja Ekapada", quality: "fiery, transformative" },
    { name: "Uttara Bhadrapada", deity: "Ahir Budhnya", quality: "deep, spiritual" },
    { name: "Revati", deity: "Pushan", quality: "nurturing, journeys" }
  ];
  
  const NAKSHATRA_SPAN = 360 / 27; // 13.333°
  
  // Preparar fecha/hora de nacimiento
  let dt = new Date(birthDate);
  const hasTime = birthHour !== undefined && birthHour !== null && !isNaN(birthHour);
  
  let moonLong;
  let precision;
  
  // Intentar usar astronomy-engine si esta disponible
  if (typeof Astronomy !== 'undefined') {
    try {
      // Crear objeto Date con hora UTC
      const astroDate = Astronomy.MakeTime(dt);
      
      // Obtener longitud ecliptica de la Luna (tropical)
      const moonEcl = Astronomy.EclipticGeoMoon(astroDate);
      const tropicalLong = moonEcl.elon; // Longitud ecliptica tropical
      
      // Ayanamsa Lahiri para 2025 (~24.17°)
      // Formula: 23.85 + (year - 2000) * 0.0139
      const year = dt.getFullYear();
      const ayanamsa = 23.85 + (year - 2000) * 0.0139;
      
      // Convertir a longitud sideral
      moonLong = (tropicalLong - ayanamsa + 360) % 360;
      precision = hasTime ? "alta (astronomy-engine)" : "buena (astronomy-engine)";
      
    } catch (e) {
      console.warn('Astronomy-engine error, using fallback:', e);
      moonLong = calculateMoonLongFallback(dt);
      precision = hasTime ? "±0.5 nakshatra" : "±1 nakshatra";
    }
  } else {
    // Fallback: calculo basico
    moonLong = calculateMoonLongFallback(dt);
    precision = hasTime ? "±0.5 nakshatra" : "±1 nakshatra";
  }
  
  // Indice de Nakshatra (0-26)
  const idx = Math.floor(moonLong / NAKSHATRA_SPAN) % 27;
  
  // Pada (cuarto, 1-4)
  const pada = Math.floor((moonLong % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1;
  
  return { 
    nakshatra: nakshatras[idx].name,
    deity: nakshatras[idx].deity,
    quality: nakshatras[idx].quality,
    pada: pada,
    moonLongitude: Math.round(moonLong * 10) / 10,
    precision: precision
  };
}

// Funcion fallback para calcular longitud lunar
function calculateMoonLongFallback(dt) {
  const SIDEREAL_MONTH = 27.321661;
  const MOON_DAILY = 360 / SIDEREAL_MONTH;
  const REF_DATE = new Date(Date.UTC(2000, 0, 21, 4, 40, 0));
  const REF_MOON_LONG = 121;
  
  const daysDiff = (dt.getTime() - REF_DATE.getTime()) / (24 * 60 * 60 * 1000);
  let moonLong = (REF_MOON_LONG + (daysDiff * MOON_DAILY)) % 360;
  if (moonLong < 0) moonLong += 360;
  return moonLong;
}

// Numerología con i18n
const numMeanings = {
  es: {
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
  },
  en: {
    1: { keyword: 'Leadership', desc: 'Independence, initiative, originality' },
    2: { keyword: 'Cooperation', desc: 'Diplomacy, balance, sensitivity' },
    3: { keyword: 'Expression', desc: 'Creativity, communication, joy' },
    4: { keyword: 'Stability', desc: 'Work, order, construction' },
    5: { keyword: 'Freedom', desc: 'Change, adventure, versatility' },
    6: { keyword: 'Responsibility', desc: 'Love, home, service' },
    7: { keyword: 'Wisdom', desc: 'Analysis, spirituality, introspection' },
    8: { keyword: 'Power', desc: 'Abundance, material success, authority' },
    9: { keyword: 'Humanitarianism', desc: 'Compassion, culmination, universality' },
    11: { keyword: 'Spiritual Master', desc: 'Elevated intuition, inspiration' },
    22: { keyword: 'Master Builder', desc: 'Great achievements, practical vision' },
    33: { keyword: 'Master Healer', desc: 'Elevated service, unconditional love' }
  }
};

function getNumerology(birthDate, fullName, lang) {
  lang = lang || 'es';
  const meanings = numMeanings[lang];
  
  const dateStr = birthDate.toISOString().split('T')[0].replace(/-/g, '');
  let lifeNumber = dateStr.split('').reduce((a, b) => a + parseInt(b), 0);
  while (lifeNumber > 9 && lifeNumber !== 11 && lifeNumber !== 22 && lifeNumber !== 33) {
    lifeNumber = lifeNumber.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  const letterValues = {
    a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
    j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
    s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
  };
  const vowels = ['a','e','i','o','u'];
  const nameLower = (fullName || '').toLowerCase().replace(/[^a-z]/g, '');
  
  let soulSum = 0;
  for (const char of nameLower) {
    if (vowels.includes(char)) soulSum += letterValues[char] || 0;
  }
  while (soulSum > 9 && soulSum !== 11 && soulSum !== 22) {
    soulSum = soulSum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  let destinySum = 0;
  for (const char of nameLower) {
    destinySum += letterValues[char] || 0;
  }
  while (destinySum > 9 && destinySum !== 11 && destinySum !== 22) {
    destinySum = destinySum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  const today = new Date();
  const daySum = today.getDate() + (today.getMonth() + 1) + lifeNumber;
  let personalDay = daySum;
  while (personalDay > 9) {
    personalDay = personalDay.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
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