const mongoose = require("mongoose");

const leaderboardEntrySchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    kills: { type: Number, default: 0 },
    placementPoints: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }
});

const leaderboardSchema = new mongoose.Schema(
    {
        tournamentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tournament",
            required: true
        },
        entries: [leaderboardEntrySchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
