# 🎄 Secret Santa Web App

A simple, ad-free Secret Santa web app for teams, families, or any group gift exchange. No accounts, no tracking—just add names and emails, hit the button, and everyone gets their assignment by email.

## ✨ Features

- **Simple interface** — Add participants (name + email), optional budget and notes, one button to draw and send.
- **Fair assignments** — No one gets themselves; algorithm ensures valid pairings.
- **Email delivery** — Each person gets one HTML email with their assignment and event details (budget, notes).
- **English & Spanish** — Language switcher (EN | ES) in the header; choice is saved and used for the whole app and emails.
- **Mobile friendly** — Works on phones and tablets.
- **Deploy anywhere** — Run locally or deploy to Vercel for a public URL.
- **Privacy focused** — No storage of participant data beyond sending the emails.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 14+
- **Email account** (e.g. Gmail) for sending (see [Email setup](#-email-setup)).

### Run locally

1. **Clone the repo** and go to the project folder.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure email** — Copy `.env.example` to `.env` and set your sender credentials (see [Email setup](#-email-setup)).

4. **Start the app:**

   ```bash
   npm start
   ```

5. Open **http://localhost:3000** in your browser.

## 🌐 Deploy on Vercel

The app is set up for Vercel serverless deployment so you can share a single link.

1. **Push the repo to GitHub** (if you haven’t already).

2. **Import on Vercel** — [vercel.com](https://vercel.com) → **Add New** → **Project** → import this repo. Use the default settings (no build step; Vercel uses `api/index.js` and `vercel.json`).

3. **Set environment variables** in the Vercel project (**Settings → Environment Variables**):
   - `EMAIL_USER` — sender email (e.g. your Gmail).
   - `EMAIL_PASS` — app password (for Gmail: 2FA + App password).

4. **Deploy** — Your app will be live at `https://<your-project>.vercel.app` (or your custom domain).

## 📧 Email Setup

Sending requires SMTP credentials via environment variables.

1. **Create a `.env` file** in the project root (see `.env.example`):

   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. **Gmail:** Enable 2-Step Verification, then create an **App password** (Google Account → Security → 2-Step Verification → App passwords) and use it as `EMAIL_PASS`.

3. **Other providers** — The app detects Outlook/Hotmail/Live and uses the right SMTP; for others you can adjust the transporter in `server.js` (see `createTransporter()`).

## 🎯 How to Use

1. **Language** — Use **EN** or **ES** in the top-right; the whole UI and emails follow that language.
2. **Participants** — Add at least 2 people (name + email). Remove or correct entries as needed.
3. **Optional** — Fill in “Amount to spend” and “Additional notes” if you want them in the emails.
4. **Create Secret Santa** — Click the main button. Assignments are drawn and emails sent; each person only sees their own assignment.

## 🎁 What’s in the Email

Each participant gets one HTML email with:

- Their Secret Santa assignment (who they’re giving a gift to).
- Budget and notes if you entered them.
- Short reminder to keep it secret.
- Language matches the language selected in the app.

## 🛠 Technical Overview

### Stack

- **Backend:** Node.js, Express.
- **Email:** Nodemailer (Gmail/Outlook-style SMTP).
- **Frontend:** Vanilla HTML, CSS, and JavaScript.
- **i18n:** `public/translations.js` (EN/ES); server uses matching strings for API and emails.

### Project layout

```
├── server.js           # Express app, API, and email logic
├── api/
│   └── index.js         # Vercel serverless entry
├── vercel.json         # Vercel rewrites (all routes → /api)
├── package.json
├── .env.example        # Example env vars (copy to .env)
├── .gitignore
├── README.md
└── public/
    ├── index.html      # Single-page UI
    ├── favicon.png     # Santa favicon
    ├── translations.js # EN/ES copy and language helpers
    ├── styles.css      # Layout and theme
    └── script.js       # UI and API calls
```

### API

- **GET /** — Serves the web app (HTML, assets).
- **POST /api/create-secret-santa** — Request body: `{ participants, budget?, notes?, lang? }`. Draws assignments, sends emails, returns success or error. `lang` is `"en"` or `"es"` (defaults to `"es"`).

### Security notes

- Participant names, emails, budget, and notes are only used to run the draw and send emails.
- User-supplied content in emails is HTML-escaped to avoid injection.
- No analytics or tracking; no persistent storage of participants.

## 🔧 Customization

- **Look and feel** — Edit `public/styles.css`.
- **Email layout / text** — Edit the template in `sendSecretSantaEmails()` in `server.js` and the `MSG` strings for each language.
- **Copy (EN/ES)** — Edit `public/translations.js` (UI) and the `MSG` object in `server.js` (API and emails).

## 📋 Troubleshooting

- **Emails not sending** — Check `EMAIL_USER` and `EMAIL_PASS`, 2FA + App password for Gmail, and that nothing is blocking SMTP.
- **Port in use** — Set `PORT` in the environment (e.g. `PORT=3001 npm start`).
- **Vercel** — Ensure `EMAIL_USER` and `EMAIL_PASS` are set in the Vercel project and redeploy after changing env vars.

## 🎉 License

Free to use, modify, and share. Enjoy your Secret Santa! 🎄🎁🎅
