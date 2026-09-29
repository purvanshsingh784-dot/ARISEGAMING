const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/authRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const matchRoutes = require("./routes/matchRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const gameRoutes = require("./routes/gameRoutes");
const Feedback = require("./models/Feedback");
const Stats = require("./models/Stats");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Serverless DB connection middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (e) {}
    next();
});

// Normalize URL path so both /api/xxx and /xxx work seamlessly with Vercel rewrites and standalone servers
app.use((req, res, next) => {
    const matchedPath = req.headers["x-matched-path"] || req.headers["x-forwarded-url"];
    
    if (req.url.startsWith("/api/index.js")) {
        const queryIdx = req.url.indexOf("?");
        const query = queryIdx !== -1 ? req.url.slice(queryIdx) : "";
        
        if (matchedPath && !matchedPath.startsWith("/api/index.js")) {
            const hasQuery = matchedPath.includes("?");
            req.url = matchedPath + (hasQuery ? "" : query);
        } else {
            const original = req.originalUrl || "";
            if (original && !original.startsWith("/api/index.js")) {
                req.url = original;
            } else {
                const stripped = req.url.replace("/api/index.js", "");
                req.url = stripped ? (stripped.startsWith("/") ? stripped : "/" + stripped) : "/api";
            }
        }
    }
    
    if (!req.url.startsWith("/api") && req.url !== "/") {
        req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
    }
    
    next();
});


// API Base Home route
app.get(["/", "/api"], (req, res) => {
    res.json({
        success: true,
        message: "Esports Platform API is running!",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            tournaments: "/api/tournaments",
            games: "/api/games",
            registrations: "/api/registrations",
            matches: "/api/matches",
            announcements: "/api/announcements",
            leaderboard: "/api/leaderboard",
            feedback: "/api/feedback",
            health: "/api/health"
        }
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend status: healthy",
        timestamp: new Date().toISOString()
    });
});

let serverHeroStats = { prizePool: "₹18K+", teamsCount: "120+", gamesCount: "8" };
let serverFeedbacks = [];

// Hero Stats API
app.get("/api/stats", async (req, res) => {
    try {
        const dbStats = await Stats.findOne({ key: "hero_stats" });
        if (dbStats) {
            return res.json({
                success: true,
                data: {
                    prizePool: dbStats.prizePool,
                    teamsCount: dbStats.teamsCount,
                    gamesCount: dbStats.gamesCount
                }
            });
        }
    } catch (e) {}
    res.json({ success: true, data: serverHeroStats });
});

app.post("/api/stats", async (req, res) => {
    serverHeroStats = { ...serverHeroStats, ...req.body };
    try {
        const saved = await Stats.findOneAndUpdate(
            { key: "hero_stats" },
            {
                prizePool: req.body.prizePool || serverHeroStats.prizePool,
                teamsCount: req.body.teamsCount || serverHeroStats.teamsCount,
                gamesCount: req.body.gamesCount || serverHeroStats.gamesCount
            },
            { upsert: true, new: true }
        );
        return res.json({ success: true, data: saved });
    } catch (e) {}
    res.json({ success: true, data: serverHeroStats });
});

// Feedback API
app.get("/api/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        if (feedbacks && feedbacks.length > 0) {
            return res.json({ success: true, count: feedbacks.length, data: feedbacks });
        }
    } catch (dbErr) {
        // Fallback to in-memory store
    }
    res.json({ success: true, count: serverFeedbacks.length, data: serverFeedbacks });
});

app.post("/api/feedback", async (req, res) => {
    const fbData = {
        name: req.body.name || "Anonymous Player",
        email: req.body.email || "",
        rating: req.body.rating || "5",
        message: req.body.message || ""
    };

    try {
        const newFeedback = await Feedback.create(fbData);
        return res.status(201).json({ success: true, data: newFeedback });
    } catch (dbErr) {
        // Do NOT report success if it wasn't actually saved to the database —
        // that's what made feedback invisible to the admin before.
        return res.status(503).json({
            success: false,
            message: "Could not save feedback — database is unavailable. Please try again shortly."
        });
    }
});

app.delete("/api/feedback/:id", async (req, res) => {
    const { id } = req.params;
    serverFeedbacks = serverFeedbacks.filter(f => f._id !== id && f.id !== id);

    try {
        await Feedback.findByIdAndDelete(id);
    } catch (dbErr) {}

    res.json({ success: true, message: "Feedback deleted" });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/games", gameRoutes);
app.use("/api", registrationRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api", leaderboardRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start server locally if run directly
if (require.main === module) {
    connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 API Endpoints active at http://localhost:${PORT}/api/tournaments`);
    });
}

module.exports = app;