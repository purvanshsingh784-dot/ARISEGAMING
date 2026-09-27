const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "hero_stats",
            unique: true
        },
        prizePool: {
            type: String,
            default: "₹18K+"
        },
        teamsCount: {
            type: String,
            default: "120+"
        },
        gamesCount: {
            type: String,
            default: "8"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Stats", statsSchema);
