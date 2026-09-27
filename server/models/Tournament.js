const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tournament name is required"],
            trim: true
        },
        game: {
            type: String,
            required: [true, "Game name is required"],
            enum: ["BGMI", "Free Fire", "Valorant", "COD Mobile", "Smash Karts", "Counter-Strike", "Mini Militia", "Other"],
            trim: true
        },
        format: {
            type: String,
            trim: true,
            default: "Solo"
        },
        type: {
            type: String,
            trim: true,
            default: "Solo"
        },
        teamSize: {
            type: Number,
            default: 1
        },
        totalPlayers: {
            type: Number,
            default: 100
        },
        entryFee: {
            type: String,
            default: "Free"
        },
        prizePool: {
            type: String,
            required: [true, "Prize pool is required"]
        },
        maxSlots: {
            type: Number,
            required: [true, "Max slots required"],
            min: 2
        },
        registeredCount: {
            type: Number,
            default: 0
        },
        date: {
            type: String,
            required: [true, "Date is required"]
        },
        time: {
            type: String,
            required: [true, "Time is required"]
        },
        status: {
            type: String,
            enum: ["Upcoming", "Registration Open", "Registration Closed", "Ongoing", "Completed"],
            default: "Registration Open"
        },
        rules: {
            type: String,
            default: "Standard competitive rules apply. Room details shared 15 mins prior."
        },
        minTeamSize: {
            type: Number,
            default: 1
        },
        maxTeamSize: {
            type: Number,
            default: 4
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tournament", tournamentSchema);
