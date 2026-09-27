const express = require("express");
const { getLeaderboard, submitScores } = require("../controllers/leaderboardController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/tournaments/:id/leaderboard", getLeaderboard);
router.post("/tournaments/:id/scores", protect, adminOnly, submitScores);

module.exports = router;
