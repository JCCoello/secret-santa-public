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

// Send Secret Santa emails
async function sendSecretSantaEmails(assignments, budget, notes) {
  const transporter = createTransporter();

  for (const assignment of assignments) {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: assignment.giver.email,
      subject: "🎅 ¡Tu Asignación de Amigo Secreto!",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #d32f2f; text-align: center;">🎄 Asignación de Amigo Secreto 🎄</h2>
                    <p style="font-size: 18px;">¡Ho ho ho, ${
                      assignment.giver.name
                    }!</p>
                    <p>Has sido asignado(a) para ser el Amigo Secreto de:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #2e7d32; margin: 0; font-size: 24px;">🎁 ${
                          assignment.recipient.name
                        } 🎁</h3>
                    </div>
                    ${
                      budget
                        ? `<p><strong>Presupuesto:</strong> ${budget}</p>`
                        : ""
                    }
                    ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ""}
                    <p style="margin-top: 30px; font-style: italic; color: #666;">"
                        ¡Recuerda, esto es un secreto! No le digas a ${
                          assignment.recipient.name
                        } que eres su Amigo Secreto. 🤫
                    </p>
                    <p style="text-align: center; color: #d32f2f;">
                        ¡Feliz Navidad! 🎅🎄
                    </p>
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

// API endpoint to create and send Secret Santa assignments
app.post("/api/create-secret-santa", async (req, res) => {
  try {
    const { participants, budget, notes } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({
        error: "Se necesitan al menos 2 participantes con nombre y correo",
      });
    }

    // Validate participants
    for (const participant of participants) {
      if (!participant.name || !participant.email) {
        return res.status(400).json({
          error: "Cada participante debe tener un nombre y correo",
        });
      }
    }

    // Create assignments
    const assignments = assignSecretSanta(participants);

    // Send emails
    await sendSecretSantaEmails(assignments, budget, notes);

    res.json({
      success: true,
      message: `¡Correos de Amigo Secreto enviados a ${participants.length} participantes!`,
      assignmentCount: assignments.length,
    });
  } catch (error) {
    console.error("Error creating Secret Santa:", error);
    res.status(500).json({
      error:
        "Error al crear las asignaciones de Amigo Secreto. Por favor intenta de nuevo.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Aplicación Amigo Secreto ejecutándose en http://localhost:${PORT}`
  );
  console.log(
    "Asegúrate de configurar las variables de entorno EMAIL_USER y EMAIL_PASS para la funcionalidad de correo"
  );
});

module.exports = app;
