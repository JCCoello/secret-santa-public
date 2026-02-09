# 🎄 Secret Santa Web App

A simple, ad-free Secret Santa web application perfect for teams, families, or any group gift exchange. No registration required, no data tracking - just pure holiday magic!

## ✨ Features

- **Clean & Simple Interface**: Easy-to-use form for adding family members
- **Smart Assignment Algorithm**: Ensures no one gets themselves as their Secret Santa
- **Automatic Email Sending**: Sends personalized emails to each participant with their assignment
- **Event Details**: Include budget, date, location, and special notes
- **Mobile Friendly**: Works great on phones and tablets
- **No Ads**: Pure family fun without distractions
- **Privacy Focused**: No data storage or tracking
- **English & Spanish**: Language switcher in the header; choice is saved and used for UI, emails, and API messages

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- Gmail account (or other email service) for sending emails

### Installation

1. **Clone or download this project** to your computer

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up email configuration** (see Email Setup section below)

4. **Start the application**:

   ```bash
   npm start
   ```

5. **Open your browser** and go to `http://localhost:3000`

## 🌐 Deploy globally with Vercel

Deploy this app to Vercel to get a public URL so anyone can access it from anywhere.

1. **Install Vercel CLI** (optional, for local deploy):

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   - **From the web**: Push this repo to GitHub, then go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo. Vercel will detect the Node app and use `api/index.js` and `vercel.json`.
   - **From the CLI**: Run `vercel` in the project root and follow the prompts.

3. **Set environment variables on Vercel** (required for email):

   - In the Vercel project: **Settings → Environment Variables**
   - Add `EMAIL_USER` and `EMAIL_PASS` (same as in Email Setup).

4. Your app will be live at `https://your-project.vercel.app` (or your custom domain).

## 📧 Email Setup

To send Secret Santa emails, you need to configure email credentials:

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the project root:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Option 2: Direct Configuration

Edit `server.js` and update the email configuration in the `createTransporter()` function.

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in EMAIL_PASS

### Other Email Providers

Update the transporter configuration in `server.js` for other email services like Outlook, Yahoo, etc.

## 🎯 How to Use

1. **Add Event Details** (optional):

   - Set a budget range
   - Choose an exchange date
   - Specify location
   - Add any special notes or themes

2. **Add Participants**:

   - Enter each family member's name and email
   - Need at least 2 people to create assignments
   - Remove participants if needed

3. **Create Secret Santa**:
   - Click the big red button to generate assignments
   - Emails are sent automatically to all participants
   - Each person gets their assignment privately

## 🎁 Email Template

Each participant receives a beautiful HTML email containing:

- Their Secret Santa assignment
- Event details (budget, date, location)
- Holiday-themed design
- Reminder to keep it secret

## 🛠 Technical Details

### Built With

- **Backend**: Node.js with Express
- **Email**: Nodemailer
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Modern CSS with gradients and animations

### Project Structure

```
secret-santa-app/
├── server.js              # Express server and API
├── package.json          # Dependencies and scripts
├── README.md             # This file
├── .env                  # Email credentials (create this)
└── public/
    ├── index.html        # Main web interface
    ├── translations.js  # EN/ES strings and language helpers
    ├── styles.css        # Styling and layout
    └── script.js         # Frontend JavaScript
```

### API Endpoints

- `GET /` - Serves the main application
- `POST /api/create-secret-santa` - Creates assignments and sends emails

## 🔒 Privacy & Security

- **No Data Storage**: Participant information is only used to send emails
- **No Tracking**: No analytics, cookies, or user tracking
- **Local First**: Runs on your own computer/server
- **Open Source**: Full transparency in how it works

## 🎄 Customization

### Styling

Edit `public/styles.css` to customize colors, fonts, and layout.

### Email Template

Modify the HTML template in `server.js` in the `sendSecretSantaEmails()` function.

### Assignment Algorithm

The algorithm in `assignSecretSanta()` ensures fair, random assignments with no self-assignments.

## 📋 Troubleshooting

### Email Issues

- **Authentication Error**: Check your app password and email settings
- **Emails Not Sending**: Verify your email service configuration
- **Gmail Blocking**: Make sure 2FA is enabled and you're using an app password

### General Issues

- **Port Already in Use**: The app runs on port 3000 by default. Change it by setting PORT environment variable
- **Dependencies Error**: Run `npm install` to install all required packages
- **Browser Issues**: Try a different browser or clear your cache

## 🎅 Tips for Success

1. **Test First**: Send a test email to yourself before the family event
2. **Double-Check Emails**: Make sure all email addresses are correct
3. **Set Expectations**: Include clear event details and gift guidelines
4. **Backup Plan**: Keep a record of who got whom (just in case!)

## 💝 Contributing

This is a simple family project, but feel free to:

- Report bugs or issues
- Suggest new features
- Submit improvements
- Share with other families!

## 🎉 License

This project is free to use, modify, and share. Spread the holiday joy!

---

**Made with ❤️ for teams and groups. No ads, no tracking, just Secret Santa magic!**

Enjoy your family Secret Santa exchange! 🎄🎁🎅
