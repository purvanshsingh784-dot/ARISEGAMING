const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Esports Arena",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
