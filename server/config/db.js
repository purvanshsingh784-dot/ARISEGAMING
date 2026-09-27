const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    const mongoUri = process.env.MONGO_URI;

    // If running on Vercel and no cloud database URI provided, don't hang on localhost
    if (process.env.VERCEL && (!mongoUri || mongoUri.includes("localhost") || mongoUri.includes("127.0.0.1"))) {
        console.log("ℹ️ Vercel deployment: Cloud MongoDB Atlas URI required for persistent database on Vercel.");
        return;
    }

    try {
        const conn = await mongoose.connect(mongoUri || "mongodb://localhost:27017/esports-platform", {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`⚠️ MongoDB Connection Warning: ${error.message}`);
        console.log("ℹ️ Server running with memory fallback. To enable persistent cloud database, set MONGO_URI.");
    }
};

module.exports = connectDB;
