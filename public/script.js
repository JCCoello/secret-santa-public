// Participants storage
let participants = [];

// DOM elements
const participantNameInput = document.getElementById("participant-name");
const participantEmailInput = document.getElementById("participant-email");
const addParticipantBtn = document.getElementById("add-participant-btn");
const participantsList = document.getElementById("participants-list");
const createSecretSantaBtn = document.getElementById("create-secret-santa-btn");
const resultMessage = document.getElementById("result-message");

// Budget and notes inputs
const budgetInput = document.getElementById("budget");
const notesInput = document.getElementById("notes");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addParticipantBtn.addEventListener("click", addParticipant);
  createSecretSantaBtn.addEventListener("click", createSecretSanta);

  // Allow Enter key to add participants
  participantNameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addParticipant();
  });

  participantEmailInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addParticipant();
  });

  updateCreateButton();
});

// Add participant function
function addParticipant() {
  const name = participantNameInput.value.trim();
  const email = participantEmailInput.value.trim();

  // Validation
  if (!name) {
    showMessage("Por favor ingresa un nombre", "error");
    participantNameInput.focus();
    return;
  }

  if (!email) {
    showMessage("Por favor ingresa un correo electrónico", "error");
    participantEmailInput.focus();
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Por favor ingresa un correo electrónico válido", "error");
    participantEmailInput.focus();
    return;
  }

  // Check for duplicate emails
  if (participants.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
    showMessage("Este correo ya fue agregado", "error");
    participantEmailInput.focus();
    return;
  }

  // Add participant
  const participant = { name, email };
  participants.push(participant);

  // Clear inputs
  participantNameInput.value = "";
  participantEmailInput.value = "";
  participantNameInput.focus();

  // Update UI
  renderParticipants();
  updateCreateButton();
  hideMessage();
}

// Remove participant function
function removeParticipant(index) {
  participants.splice(index, 1);
  renderParticipants();
  updateCreateButton();
}

// Render participants list
function renderParticipants() {
  participantsList.innerHTML = "";

  if (participants.length === 0) {
    participantsList.innerHTML =
      '<p style="text-align: center; color: #666; font-style: italic;">Aún no se han agregado participantes. ¡Agrega al menos 2 para comenzar!</p>';
    return;
  }

  participants.forEach((participant, index) => {
    const participantDiv = document.createElement("div");
    participantDiv.className = "participant-item";

    participantDiv.innerHTML = `
            <div class="participant-info">
                <div class="participant-name">${escapeHtml(
                  participant.name
                )}</div>
                <div class="participant-email">${escapeHtml(
                  participant.email
                )}</div>
            </div>
            <button class="remove-participant" onclick="removeParticipant(${index})">Eliminar</button>
        `;

    participantsList.appendChild(participantDiv);
  });
}

// Update create button state
function updateCreateButton() {
  createSecretSantaBtn.disabled = participants.length < 2;

  if (participants.length < 2) {
    createSecretSantaBtn.textContent = `🎁 Agrega ${
      2 - participants.length
    } participante${2 - participants.length > 1 ? "s" : ""} más para comenzar`;
  } else {
    createSecretSantaBtn.textContent = `🎁 Crear Amigo Secreto y Enviar ${participants.length} Correos`;
  }
}

// Create Secret Santa function
async function createSecretSanta() {
  if (participants.length < 2) {
    showMessage("Se necesitan al menos 2 participantes", "error");
    return;
  }

  // Disable button and show loading
  createSecretSantaBtn.disabled = true;
  createSecretSantaBtn.textContent =
    "🎅 Creando asignaciones y enviando correos...";
  hideMessage();

  try {
    const response = await fetch("/api/create-secret-santa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participants,
        budget: budgetInput.value.trim() || null,
        notes: notesInput.value.trim() || null,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(`🎉 ¡Éxito! ${data.message}`, "success");

      // Clear form after successful submission
      setTimeout(() => {
        if (
          confirm(
            "¡Amigo Secreto creado exitosamente! ¿Te gustaría limpiar el formulario para crear otro?"
          )
        ) {
          participants = [];
          renderParticipants();
          budgetInput.value = "";
          notesInput.value = "";
          hideMessage();
        }
      }, 3000);
    } else {
      showMessage(`❌ Error: ${data.error}`, "error");
    }
  } catch (error) {
    console.error("Error creating Secret Santa:", error);
    showMessage(
      "❌ Error al crear Amigo Secreto. Por favor verifica tu conexión a internet e intenta de nuevo.",
      "error"
    );
  } finally {
    // Re-enable button
    updateCreateButton();
    createSecretSantaBtn.disabled = participants.length < 2;
  }
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showMessage(message, type) {
  resultMessage.textContent = message;
  resultMessage.className = type;
  resultMessage.classList.remove("hidden");

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(hideMessage, 5000);
  }
}

function hideMessage() {
  resultMessage.classList.add("hidden");
}

// Example data for testing (remove in production)
function addExampleData() {
  if (participants.length === 0) {
    participants = [
      { name: "Mom", email: "mom@family.com" },
      { name: "Dad", email: "dad@family.com" },
      { name: "Sister Sarah", email: "sarah@family.com" },
      { name: "Brother Mike", email: "mike@family.com" },
    ];
    renderParticipants();
    updateCreateButton();
  }
}

// Add example data button (for testing)
// Uncomment the next line if you want a quick way to add test data
// console.log('To add example data, run: addExampleData()');

// Initial render
renderParticipants();
