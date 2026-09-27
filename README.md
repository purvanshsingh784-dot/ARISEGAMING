# ARISE GAMING — Esports Tournament Platform

An online esports tournament platform for organizing, managing, and competing in gaming tournaments.

---

## 🚀 Features

- 🎮 **Multi-Game Support**: BGMI, Free Fire MAX, Call of Duty: Mobile, Valorant & more.
- 🏆 **Tournament Management**: Live status tracking, solo/duo/squad formats, prize pools, and automated bracket/schedule views.
- 📝 **Registration System**: Seamless team and solo registrations with custom player data validation.
- 💳 **Payments & Verification**: Integrated UPI/QR code payments with transaction ID tracking.
- 📊 **Live Leaderboards**: Real-time scoreboards, kill counts, rank points, and match standings.
- 📢 **Announcements & Notifications**: Instant platform updates and tournament alerts.
- 🔐 **Organizer/Admin Dashboard**: Control center to create tournaments, manage registrations, publish match room credentials, and inspect user feedback.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design System
- **Routing**: React Router DOM v7

### Backend
- **Server**: Node.js + Express.js v5
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Utilities**: CORS, dotenv, nodemailer

---

## 📁 Project Structure

```text
ARISEGAMING/
├── client/              # React + Vite frontend application
│   ├── src/             # Components, pages, hooks, services, and assets
│   ├── public/          # Static public assets
│   ├── package.json
│   └── vite.config.js
├── server/              # Express + MongoDB backend API
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose data models
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic services
│   ├── utils/           # Helper utilities and seeder
│   ├── server.js        # Main server entry point
│   └── package.json
├── api/                 # Serverless handlers (Vercel deployment)
├── render.yaml          # Render deployment configuration
├── vercel.json          # Vercel deployment configuration
├── package.json         # Root package manifest
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)

---

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/purvanshsingh784-dot/ARISEGAMING.git
   cd ARISEGAMING
   ```

2. **Configure Environment Variables:**

   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

   *(Optional)* Create a `.env` file inside the `client/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Install Dependencies & Start Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

4. **Install Dependencies & Start Frontend:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   The frontend dev server will open at `http://localhost:5173`.

---

## 🌐 Deployment Guide

### Option 1: Render Deployment (Recommended for Full-Stack)
- Connect repository `purvanshsingh784-dot/ARISEGAMING` to Render.
- Render will automatically detect `render.yaml` and configure the web service and static site.
- Set the environment variable `MONGO_URI` in your Render dashboard under server environment settings.

### Option 2: Vercel Deployment
- Import repository into Vercel.
- Vercel automatically uses `vercel.json` to build the Vite client and expose `/api` endpoints via `api/index.js`.
- Configure `MONGO_URI` and `JWT_SECRET` in Vercel Environment Variables.

---

## 🛡️ License & Contributing

Built for **Arise Esports**. All rights reserved.

