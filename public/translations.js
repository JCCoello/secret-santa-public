/**
 * Multi-language strings for Secret Santa app.
 * Keys shared with server for API errors and email content.
 */
const TRANSLATIONS = {
  en: {
    // Page
    title: "Secret Santa",
    heading: "Secret Santa",
    // Participants section
    participantsHeading: "Participants",
    participantsHint: "Add at least 2 people to get started!",
    nameLabel: "Name:",
    namePlaceholder: "Enter participant's name",
    emailLabel: "Email:",
    emailPlaceholder: "their.email@example.com",
    addParticipant: "Add Participant",
    budgetLabel: "Amount to spend:",
    budgetPlaceholder: "e.g. $25-50",
    notesLabel: "Additional notes:",
    notesPlaceholder: "Special instructions or themes...",
    // Button
    createAndSend: "Create Secret Santa and Send Emails",
    addMoreOne: "Add 1 more participant to get started",
    addMoreMany: "Add {{count}} more participants to get started",
    creating: "Creating assignments and sending emails...",
    remove: "Remove",
    // Empty state
    noParticipantsYet: "No participants added yet. Add at least 2 to get started!",
    // Validation (frontend)
    errorEnterName: "Please enter a name",
    errorEnterEmail: "Please enter an email address",
    errorValidEmail: "Please enter a valid email address",
    errorDuplicateEmail: "This email was already added",
    errorMinParticipants: "At least 2 participants are needed",
    // Success / confirm
    successPrefix: "Success!",
    confirmClearForm: "Secret Santa created successfully! Would you like to clear the form to create another?",
    // Network error
    errorNetwork: "Error creating Secret Santa. Please check your internet connection and try again.",
  },
  es: {
    title: "Amigo Secreto",
    heading: "Amigo Secreto",
    participantsHeading: "Participantes",
    participantsHint: "¡Agrega al menos 2 personas para comenzar!",
    nameLabel: "Nombre:",
    namePlaceholder: "Ingresa el nombre del participante",
    emailLabel: "Correo:",
    emailPlaceholder: "su.correo@ejemplo.com",
    addParticipant: "Agregar Participante",
    budgetLabel: "Monto a gastar:",
    budgetPlaceholder: "ej. $25-50",
    notesLabel: "Notas adicionales:",
    notesPlaceholder: "Instrucciones especiales o temas...",
    createAndSend: "Crear Amigo Secreto y Enviar Correos",
    addMoreOne: "Agrega 1 participante más para comenzar",
    addMoreMany: "Agrega {{count}} participantes más para comenzar",
    creating: "Creando asignaciones y enviando correos...",
    remove: "Eliminar",
    noParticipantsYet: "Aún no se han agregado participantes. ¡Agrega al menos 2 para comenzar!",
    errorEnterName: "Por favor ingresa un nombre",
    errorEnterEmail: "Por favor ingresa un correo electrónico",
    errorValidEmail: "Por favor ingresa un correo electrónico válido",
    errorDuplicateEmail: "Este correo ya fue agregado",
    errorMinParticipants: "Se necesitan al menos 2 participantes",
    successPrefix: "¡Éxito!",
    confirmClearForm: "¡Amigo Secreto creado exitosamente! ¿Te gustaría limpiar el formulario para crear otro?",
    errorNetwork: "Error al crear Amigo Secreto. Por favor verifica tu conexión a internet e intenta de nuevo.",
  },
};

// Default language (browser preference or Spanish)
function getDefaultLang() {
  const stored = localStorage.getItem("secret-santa-lang");
  if (stored && TRANSLATIONS[stored]) return stored;
  const browser = (navigator.language || navigator.userLanguage || "").toLowerCase();
  if (browser.startsWith("es")) return "es";
  return "en";
}

let currentLang = getDefaultLang();

function t(key) {
  const s = TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key];
  return s != null ? s : TRANSLATIONS.en[key] || key;
}

function tWithParams(key, params) {
  let s = t(key);
  if (params) for (const [k, v] of Object.entries(params)) s = s.split(`{{${k}}}`).join(String(v));
  return s;
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem("secret-santa-lang", lang);
  document.documentElement.lang = lang;
  if (typeof applyTranslations === "function") applyTranslations();
}
