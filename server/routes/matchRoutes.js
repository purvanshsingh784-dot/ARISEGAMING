const express = require("express");
const { getMatches, createMatch, updateRoomCredentials, deleteRoomCredentials } = require("../controllers/matchController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getMatches);
router.post("/", protect, adminOnly, createMatch);
router.patch("/:id/room", protect, adminOnly, updateRoomCredentials);
router.delete("/:id/room", protect, adminOnly, deleteRoomCredentials);

module.exports = router;

