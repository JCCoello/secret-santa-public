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

// Apply all translations to the page (used on load and when language changes)
function applyTranslations() {
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key === "heading") {
      el.textContent = "🎄 " + t(key) + " 🎅";
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const lang = btn.getAttribute("data-lang");
    btn.classList.toggle("active", currentLang === lang);
  });
  updateCreateButton();
  renderParticipants();
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  document.documentElement.lang = currentLang;
  applyTranslations();

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      setLang(this.getAttribute("data-lang"));
    });
  });

  addParticipantBtn.addEventListener("click", addParticipant);
  createSecretSantaBtn.addEventListener("click", createSecretSanta);

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

  if (!name) {
    showMessage(t("errorEnterName"), "error");
    participantNameInput.focus();
    return;
  }

  if (!email) {
    showMessage(t("errorEnterEmail"), "error");
    participantEmailInput.focus();
    return;
  }

  if (!isValidEmail(email)) {
    showMessage(t("errorValidEmail"), "error");
    participantEmailInput.focus();
    return;
  }

  if (participants.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
    showMessage(t("errorDuplicateEmail"), "error");
    participantEmailInput.focus();
    return;
  }

  const participant = { name, email };
  participants.push(participant);

  participantNameInput.value = "";
  participantEmailInput.value = "";
  participantNameInput.focus();

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
      '<p style="text-align: center; color: #666; font-style: italic;">' +
      t("noParticipantsYet") +
      "</p>";
    return;
  }

  participants.forEach((participant, index) => {
    const participantDiv = document.createElement("div");
    participantDiv.className = "participant-item";

    participantDiv.innerHTML = `
            <div class="participant-info">
                <div class="participant-name">${escapeHtml(participant.name)}</div>
                <div class="participant-email">${escapeHtml(participant.email)}</div>
            </div>
            <button class="remove-participant" onclick="removeParticipant(${index})">${t("remove")}</button>
        `;

    participantsList.appendChild(participantDiv);
  });
}

// Update create button state
function getCreateButtonText() {
  if (participants.length < 2) {
    const need = 2 - participants.length;
    return "🎁 " + (need === 1 ? t("addMoreOne") : tWithParams("addMoreMany", { count: need }));
  }
  if (currentLang === "es") return "🎁 Crear Amigo Secreto y Enviar " + participants.length + " Correos";
  return "🎁 Create Secret Santa and Send " + participants.length + " Emails";
}

function updateCreateButton() {
  createSecretSantaBtn.disabled = participants.length < 2;
  createSecretSantaBtn.textContent = getCreateButtonText();
}

// Create Secret Santa function
async function createSecretSanta() {
  if (participants.length < 2) {
    showMessage(t("errorMinParticipants"), "error");
    return;
  }

  createSecretSantaBtn.disabled = true;
  createSecretSantaBtn.textContent = "🎅 " + t("creating");
  hideMessage();

  try {
    const response = await fetch("/api/create-secret-santa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participants,
        budget: budgetInput.value.trim() || null,
        notes: notesInput.value.trim() || null,
        lang: currentLang,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("🎉 " + t("successPrefix") + " " + data.message, "success");

      setTimeout(() => {
        if (confirm(t("confirmClearForm"))) {
          participants = [];
          renderParticipants();
          budgetInput.value = "";
          notesInput.value = "";
          hideMessage();
        }
      }, 3000);
    } else {
      showMessage("❌ " + (data.error || data.message || ""), "error");
    }
  } catch (error) {
    console.error("Error creating Secret Santa:", error);
    showMessage("❌ " + t("errorNetwork"), "error");
  } finally {
    updateCreateButton();
    createSecretSantaBtn.disabled = participants.length < 2;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  if (type === "success") setTimeout(hideMessage, 5000);
}

function hideMessage() {
  resultMessage.classList.add("hidden");
}

// Example data for testing
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

renderParticipants();
