require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server-side translations (API errors + email content)
const MSG = {
  en: {
    errorMinParticipants: "At least 2 participants with name and email are required.",
    errorParticipantNameEmail: "Each participant must have a name and email.",
    errorCreateAssignments: "Error creating Secret Santa assignments. Please try again.",
    successEmailsSent: "Secret Santa emails sent to {{count}} participants!",
    emailSubject: "Your Secret Santa Assignment!",
    emailTitle: "Secret Santa Assignment",
    emailGreeting: "Ho ho ho, {{name}}!",
    emailYouAreAssigned: "You have been assigned to be the Secret Santa for:",
    emailRememberSecret: "Remember, this is a secret! Don't tell {{name}} you're their Secret Santa.",
    emailHappyHolidays: "Happy Holidays!",
    emailBudget: "Budget:",
    emailNotes: "Notes:",
  },
  es: {
    errorMinParticipants: "Se necesitan al menos 2 participantes con nombre y correo",
    errorParticipantNameEmail: "Cada participante debe tener un nombre y correo",
    errorCreateAssignments: "Error al crear las asignaciones de Amigo Secreto. Por favor intenta de nuevo.",
    successEmailsSent: "¡Correos de Amigo Secreto enviados a {{count}} participantes!",
    emailSubject: "¡Tu Asignación de Amigo Secreto!",
    emailTitle: "Asignación de Amigo Secreto",
    emailGreeting: "¡Ho ho ho, {{name}}!",
    emailYouAreAssigned: "Has sido asignado(a) para ser el Amigo Secreto de:",
    emailRememberSecret: "¡Recuerda, esto es un secreto! No le digas a {{name}} que eres su Amigo Secreto.",
    emailHappyHolidays: "¡Feliz Navidad!",
    emailBudget: "Presupuesto:",
    emailNotes: "Notas:",
  },
};

function st(lang, key, params = {}) {
  const L = MSG[lang] || MSG.es;
  let s = L[key] || MSG.en[key] || key;
  Object.entries(params).forEach(([k, v]) => {
    s = s.replace(new RegExp(`{{${k}}}`, "g"), String(v));
  });
  return s;
}

// Secret Santa assignment logic
function assignSecretSanta(participants) {
  if (participants.length < 2) {
    throw new Error("Need at least 2 participants");
  }

  let assignments = [];
  let availableRecipients = [...participants];

  for (let i = 0; i < participants.length; i++) {
    const giver = participants[i];

    // Filter out the giver from available recipients
    let possibleRecipients = availableRecipients.filter(
      (p) => p.email !== giver.email
    );

    // If this is the last person and they would get themselves, we need to swap
    if (possibleRecipients.length === 0) {
      // Swap with a previous assignment
      const lastAssignment = assignments[assignments.length - 1];
      assignments[assignments.length - 1] = {
        giver: lastAssignment.giver,
        recipient: giver,
      };
      assignments.push({
        giver: giver,
        recipient: lastAssignment.recipient,
      });
    } else {
      // Randomly select a recipient
      const randomIndex = Math.floor(Math.random() * possibleRecipients.length);
      const recipient = possibleRecipients[randomIndex];

      assignments.push({
        giver: giver,
        recipient: recipient,
      });

      // Remove the selected recipient from available recipients
      availableRecipients = availableRecipients.filter(
        (p) => p.email !== recipient.email
      );
    }
  }

  return assignments;
}

// Email configuration (you'll need to set up your email credentials)
function createTransporter() {
  const emailUser = process.env.EMAIL_USER || "your-email@gmail.com";

  // Auto-detect email provider and use appropriate settings
  if (
    emailUser.includes("@outlook.") ||
    emailUser.includes("@hotmail.") ||
    emailUser.includes("@live.")
  ) {
    return nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Gmail configuration
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
}

// Send Secret Santa emails (lang: 'en' | 'es')
async function sendSecretSantaEmails(assignments, budget, notes, lang = "es") {
  const transporter = createTransporter();

  for (const assignment of assignments) {
    const subject = "🎅 " + st(lang, "emailSubject");
    const title = st(lang, "emailTitle");
    const giverNameSafe = escapeEmailHtml(assignment.giver.name);
    const recipientNameSafe = escapeEmailHtml(assignment.recipient.name);
    const greeting = st(lang, "emailGreeting", { name: giverNameSafe });
    const youAreAssigned = st(lang, "emailYouAreAssigned");
    const rememberSecret = st(lang, "emailRememberSecret", { name: recipientNameSafe });
    const happyHolidays = st(lang, "emailHappyHolidays");
    const budgetLabel = st(lang, "emailBudget");
    const notesLabel = st(lang, "emailNotes");

    const budgetSafe = budget ? escapeEmailHtml(budget) : "";
    const notesSafe = notes ? escapeEmailHtml(notes) : "";

    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: assignment.giver.email,
      subject,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #d32f2f; text-align: center;">🎄 ${title} 🎄</h2>
                    <p style="font-size: 18px;">${greeting}</p>
                    <p>${youAreAssigned}</p>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #2e7d32; margin: 0; font-size: 24px;">🎁 ${recipientNameSafe} 🎁</h3>
                    </div>
                    ${budgetSafe ? `<p><strong>${budgetLabel}</strong> ${budgetSafe}</p>` : ""}
                    ${notesSafe ? `<p><strong>${notesLabel}</strong> ${notesSafe}</p>` : ""}
                    <p style="margin-top: 30px; font-style: italic; color: #666;">${rememberSecret} 🤫</p>
                    <p style="text-align: center; color: #d32f2f;">${happyHolidays} 🎅🎄</p>
                </div>
            `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${assignment.giver.email}`);
    } catch (error) {
      console.error(`Error sending email to ${assignment.giver.email}:`, error);
      throw error;
    }
  }
}

// Escape HTML for safe use in email body
function escapeEmailHtml(str) {
  if (str == null || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// API endpoint to create and send Secret Santa assignments
app.post("/api/create-secret-santa", async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const lang = body.lang === "en" ? "en" : "es";
  try {
    const { participants, budget, notes } = body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({
        error: st(lang, "errorMinParticipants"),
      });
    }

    for (const participant of participants) {
      if (!participant.name || !participant.email) {
        return res.status(400).json({
          error: st(lang, "errorParticipantNameEmail"),
        });
      }
    }

    const assignments = assignSecretSanta(participants);
    await sendSecretSantaEmails(assignments, budget, notes, lang);

    res.json({
      success: true,
      message: st(lang, "successEmailsSent", { count: participants.length }),
      assignmentCount: assignments.length,
    });
  } catch (error) {
    console.error("Error creating Secret Santa:", error);
    res.status(500).json({
      error: st(lang, "errorCreateAssignments"),
    });
  }
});

// Start server only when run directly (not when required by Vercel serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Aplicación Amigo Secreto ejecutándose en http://localhost:${PORT}`
    );
    console.log(
      "Asegúrate de configurar las variables de entorno EMAIL_USER y EMAIL_PASS para la funcionalidad de correo"
    );
  });
}

module.exports = app;
