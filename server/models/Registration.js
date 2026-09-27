const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    inGameId: { type: String, required: true }
});

const registrationSchema = new mongoose.Schema(
    {
        tournamentId: {
            type: String,
            required: true
        },
        teamName: {
            type: String,
            trim: true
        },
        captainName: {
            type: String,
            required: [true, "Captain / Player name is required"]
        },
        captainEmail: {
            type: String,
            required: [true, "Email is required"]
        },
        captainPhone: {
            type: String,
            required: [true, "Phone number is required"]
        },
        inGameId: {
            type: String,
            required: [true, "In-Game ID is required"]
        },
        inGameName: {
            type: String,
            required: [true, "In-Game Name is required"]
        },
        teamMembers: [memberSchema],
        paymentStatus: {
            type: String,
            enum: ["Pending", "Verified", "Failed"],
            default: "Pending"
        },
        transactionId: {
            type: String,
            default: ""
        },
        paymentProofUrl: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
