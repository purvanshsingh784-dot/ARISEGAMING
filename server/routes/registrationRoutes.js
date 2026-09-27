const express = require("express");
const {
    registerForTournament,
    getRegistrations,
    verifyPayment
} = require("../controllers/registrationController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/tournaments/:id/register", registerForTournament);
router.get("/tournaments/:id/registrations", protect, adminOnly, getRegistrations);
router.patch("/registrations/:id/payment", protect, adminOnly, verifyPayment);

module.exports = router;
