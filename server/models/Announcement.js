const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Announcement title is required"],
            trim: true
        },
        content: {
            type: String,
            default: ""
        },
        scope: {
            type: String,
            enum: ["All", "BGMI", "Free Fire", "Valorant", "COD Mobile", "Smash Karts", "Counter-Strike", "Mini Militia"],
            default: "All"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
