const actionTemplates = {
  finanzas: [
    "Revisa un gasto que puedas eliminar esta semana",
    "Transfiere algo a tu ahorro, aunque sea poco",
    "Cancela una suscripción que no uses"
  ],
  relaciones: [
    "Envía un mensaje a alguien que extrañas",
    "Escucha más de lo que hablas hoy",
    "Inicia esa conversación que has postergado"
  ],
  creatividad: [
    "Dedica 15 minutos a algo creativo sin juzgar",
    "Escribe 3 ideas locas en un papel",
    "Cambia tu ruta habitual hoy"
  ],
  salud: [
    "Toma un vaso extra de agua cada hora",
    "Camina 10 minutos después de comer",
    "Acuéstate 30 minutos antes esta noche"
  ],
  carrera: [
    "Actualiza algo de tu perfil profesional",
    "Contacta a alguien de tu industria",
    "Aprende algo nuevo por 20 minutos"
  ],
  espiritual: [
    "Medita 5 minutos antes de empezar el día",
    "Escribe 3 cosas por las que estés agradecido",
    "Pasa tiempo en silencio sin pantallas"
  ]
};

const warnings = [
  "Decisiones impulsivas con dinero",
  "Discusiones innecesarias",
  "Compromisos que no puedes cumplir",
  "Exceso de cafeína o estimulantes",
  "Compararte con otros en redes sociales",
  "Postergar lo importante por lo urgente"
];

const colors = ["Rojo", "Naranja", "Amarillo", "Verde", "Azul", "Índigo", "Violeta", "Blanco", "Dorado"];
const hours = ["6-8 AM", "8-10 AM", "10-12 PM", "12-2 PM", "2-4 PM", "4-6 PM", "6-8 PM", "8-10 PM"];

function generateActions(western, chinese, archangel) {
  const themes = [];
  
  // Basado en elemento occidental
  if (western.element === "Fuego") themes.push("carrera", "creatividad");
  if (western.element === "Tierra") themes.push("finanzas", "salud");
  if (western.element === "Aire") themes.push("relaciones", "creatividad");
  if (western.element === "Agua") themes.push("espiritual", "relaciones");
  
  // Basado en elemento chino
  if (chinese.element === "Madera") themes.push("salud", "creatividad");
  if (chinese.element === "Fuego") themes.push("carrera", "relaciones");
  if (chinese.element === "Tierra") themes.push("finanzas", "espiritual");
  if (chinese.element === "Metal") themes.push("carrera", "finanzas");
  if (chinese.element === "Agua") themes.push("espiritual", "creatividad");
  
  // Seleccionar 3 acciones únicas
  const uniqueThemes = [...new Set(themes)].slice(0, 3);
  while (uniqueThemes.length < 3) {
    const randomTheme = Object.keys(actionTemplates)[Math.floor(Math.random() * 6)];
    if (!uniqueThemes.includes(randomTheme)) uniqueThemes.push(randomTheme);
  }
  
  const actions = uniqueThemes.map(theme => {
    const pool = actionTemplates[theme];
    return pool[Math.floor(Math.random() * pool.length)];
  });
  
  // Generar extras basados en fecha
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  return {
    actions: actions,
    warning: warnings[dayOfYear % warnings.length],
    color: archangel ? archangel.color : colors[dayOfYear % colors.length],
    number: (dayOfYear % 9) + 1,
    hour: hours[dayOfYear % hours.length]
  };
}
