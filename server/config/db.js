const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    const mongoUri = process.env.MONGO_URI;
    const isCloudEnv =
        process.env.NODE_ENV === "production" ||
        Boolean(process.env.RENDER) ||
        Boolean(process.env.VERCEL) ||
        Boolean(process.env.RAILWAY_ENVIRONMENT);

    const isLocalhostUri = !mongoUri || mongoUri.includes("localhost") || mongoUri.includes("127.0.0.1");

    // In production/cloud environments, do NOT attempt to connect to localhost MongoDB,
    // which would cause every request to hang for 5+ seconds before timing out.
    if (isCloudEnv && isLocalhostUri) {
        console.log("ℹ️ Cloud deployment detected: MONGO_URI is missing or pointing to localhost. Skipping MongoDB connection to avoid request timeouts.");
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
