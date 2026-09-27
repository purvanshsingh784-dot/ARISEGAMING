const express = require("express");
const {
    getTournaments,
    getTournamentById,
    createTournament,
    updateTournament,
    deleteTournament
} = require("../controllers/tournamentController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getTournaments);
router.get("/:id", getTournamentById);
router.post("/", protect, adminOnly, createTournament);
router.put("/:id", protect, adminOnly, updateTournament);
router.delete("/:id", protect, adminOnly, deleteTournament);

module.exports = router;
