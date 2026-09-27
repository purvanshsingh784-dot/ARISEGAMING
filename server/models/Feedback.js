const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Player name is required"],
            trim: true
        },
        email: {
            type: String,
            default: "",
            trim: true
        },
        rating: {
            type: String,
            default: "5"
        },
        message: {
            type: String,
            required: [true, "Feedback message is required"],
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
