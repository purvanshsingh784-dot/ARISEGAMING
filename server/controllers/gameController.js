const Game = require("../models/Game");

const fallbackGames = [
  { slug: "bgmi", name: "BGMI", category: "Battle Royale", image: "/images/bgmi.jpg" },
  { slug: "free-fire", name: "FREE FIRE", category: "Battle Royale", image: "/images/free-fire.jpg" },
  { slug: "valorant", name: "VALORANT", category: "Tactical FPS", image: "/images/valorant.jpg" },
  { slug: "cod-mobile", name: "COD MOBILE", category: "Mobile FPS", image: "/images/cod-mobile.jpg" },
  { slug: "smash-karts", name: "SMASH KARTS", category: "Kart Battle Royale", image: "/images/smash-karts.jpg" },
  { slug: "counter-strike", name: "COUNTER-STRIKE 2", category: "Tactical FPS", image: "/images/counter-strike.jpg" },
  { slug: "mini-militia", name: "MINI MILITIA", category: "Mobile Arcade FPS", image: "/images/mini-militia.jpg" },
  { slug: "pokemon-showdown", name: "POKEMON SHOWDOWN", category: "Strategy / Battle Arena", image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=800&auto=format&fit=crop" }
];

// @desc Get all games
// @route GET /api/games
const getGames = async (req, res, next) => {
  try {
    try {
      const dbGames = await Game.find().sort({ createdAt: -1 });
      if (dbGames && dbGames.length > 0) {
        return res.json({ success: true, count: dbGames.length, data: dbGames });
      }
    } catch (dbErr) {
      // Fallback
    }
    return res.json({ success: true, count: fallbackGames.length, data: fallbackGames });
  } catch (error) {
    next(error);
  }
};

// @desc Create or update a game
// @route POST /api/games
const createGame = async (req, res, next) => {
  try {
    const { name, category, image, slug: providedSlug } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Game name is required" });
    }
    const slug = providedSlug || name.toLowerCase().replace(/\s+/g, "-");
    const gameData = {
      slug,
      name,
      category: category || "Esports Arena",
      image: image && typeof image === "string" && image.trim() ? image.trim() : "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
    };

    const existingIdx = fallbackGames.findIndex(g => g.slug === slug || (g.name && g.name.toLowerCase() === name.toLowerCase()));
    if (existingIdx !== -1) {
      fallbackGames[existingIdx] = { ...fallbackGames[existingIdx], ...gameData };
    } else {
      fallbackGames.unshift(gameData);
    }

    try {
      const updated = await Game.findOneAndUpdate({ slug }, gameData, { upsert: true, new: true });
      return res.status(201).json({ success: true, data: updated || gameData });
    } catch (dbErr) {
      return res.status(201).json({ success: true, data: gameData });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Delete a game
// @route DELETE /api/games/:slug
const deleteGame = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const idx = fallbackGames.findIndex(g => g.slug === slug || g.slug === slug.toLowerCase().replace(/\s+/g, "-"));
    if (idx !== -1) {
      fallbackGames.splice(idx, 1);
    }
    try {
      await Game.findOneAndDelete({ slug });
    } catch (dbErr) {}

    return res.json({ success: true, message: "Game arena deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGames,
  createGame,
  deleteGame
};
