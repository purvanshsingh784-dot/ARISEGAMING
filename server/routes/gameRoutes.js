const express = require("express");
const router = express.Router();
const { getGames, createGame, deleteGame } = require("../controllers/gameController");

router.get("/", getGames);
router.post("/", createGame);
router.delete("/:slug", deleteGame);

module.exports = router;
