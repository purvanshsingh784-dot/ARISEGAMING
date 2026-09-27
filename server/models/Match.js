const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
    {
        tournamentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tournament",
            required: true
        },
        tournamentName: {
            type: String,
            required: true
        },
        matchNumber: {
            type: Number,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Scheduled", "Live", "Completed"],
            default: "Scheduled"
        },
        roomId: {
            type: String,
            default: ""
        },
        roomPassword: {
            type: String,
            default: ""
        },
        isRoomPublished: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
