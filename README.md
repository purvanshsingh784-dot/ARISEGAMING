# ARISE GAMING — Esports Tournament Platform (Localhost Setup)

An online esports tournament platform for organizing, managing, and competing in gaming tournaments locally.

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
- **Framework**: React 19 + Vite (`http://localhost:5173`)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design System
- **Routing**: React Router DOM v7

### Backend
- **Server**: Node.js + Express.js v5 (`http://localhost:5000`)
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs

---

## 📁 Project Structure

```text
ARISEGAMING/
├── client/              # React + Vite frontend application (localhost:5173)
│   ├── src/             # Components, pages, hooks, services, and assets
│   ├── public/          # Static public assets
│   ├── package.json
│   └── vite.config.js   # Vite dev server + proxy to localhost:5000
├── server/              # Express + MongoDB backend API (localhost:5000)
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose data models
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic services
│   ├── server.js        # Main server entry point
│   └── package.json
├── package.json         # Root package manifest
└── README.md
```

---

## ⚡ How to Run Locally (Localhost)

### 1. Configure Environment Variables
Ensure a `.env` file exists in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 2. Start the Backend Server (Terminal 1)
```bash
cd server
npm install
npm run dev
```
Backend active at: **`http://localhost:5000`**

### 3. Start the Frontend Client (Terminal 2)
```bash
cd client
npm install
npm run dev
```
Frontend active at: **`http://localhost:5173`**

---

## 🛡️ License & Contributing

Built for **Arise Esports**. All rights reserved.


