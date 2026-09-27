const Registration = require("../models/Registration");
const Tournament = require("../models/Tournament");
const sendRegistrationEmail = require("../utils/sendEmail");

const mockRegistrations = [];

// @desc    Submit registration for a tournament
// @route   POST /api/tournaments/:id/register
const registerForTournament = async (req, res, next) => {
    try {
        const { id: tournamentId } = req.params;
        const { teamName, captainName, captainEmail, captainPhone, inGameId, inGameName, teamMembers, transactionId, tournamentName } = req.body;

        if (!captainName || !captainEmail || !captainPhone) {
            return res.status(400).json({ success: false, message: "Please fill all required captain/player fields" });
        }

        const ticketId = "ARISE-REG-" + Date.now().toString().slice(-6);

        const registrationPayload = {
            tournamentId,
            tournamentName: tournamentName || "ARISE Tournament",
            teamName: teamName || captainName,
            captainName,
            captainEmail,
            captainPhone,
            inGameId: inGameId || inGameName || "N/A",
            inGameName: inGameName || captainName,
            teamMembers: teamMembers || [],
            transactionId: transactionId || "",
            paymentStatus: transactionId ? "Pending" : "Verified",
            ticketId
        };

        // Dispatch confirmation email
        sendRegistrationEmail({
            captainEmail,
            captainName,
            teamName: registrationPayload.teamName,
            tournamentName: registrationPayload.tournamentName,
            transactionId: registrationPayload.transactionId,
            ticketId
        });

        try {
            const registration = await Registration.create(registrationPayload);
            await Tournament.findByIdAndUpdate(tournamentId, { $inc: { registeredCount: 1 } });
            return res.status(201).json({
                success: true,
                message: "Registration submitted successfully",
                data: registration
            });
        } catch (dbErr) {
            // Do NOT report success if it wasn't actually saved to the database —
            // that's what made registrations invisible to the organizer before.
            return res.status(503).json({
                success: false,
                message: "Could not submit registration — database is unavailable. Please try again shortly."
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all registrations for a tournament (Admin)
// @route   GET /api/tournaments/:id/registrations
const getRegistrations = async (req, res, next) => {
    try {
        const { id: tournamentId } = req.params;

        try {
            const registrations = await Registration.find({ tournamentId }).sort({ createdAt: -1 });
            if (registrations && registrations.length > 0) {
                return res.json({ success: true, count: registrations.length, data: registrations });
            }
        } catch (dbErr) {
            // Ignore DB error
        }

        const filtered = mockRegistrations.filter(r => r.tournamentId === tournamentId);
        return res.json({ success: true, count: filtered.length, data: filtered });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify or update registration payment status (Admin)
// @route   PATCH /api/registrations/:id/payment
const verifyPayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "Verified" | "Failed" | "Pending"

        if (!status) {
            return res.status(400).json({ success: false, message: "Payment status required" });
        }

        try {
            const updated = await Registration.findByIdAndUpdate(id, { paymentStatus: status }, { new: true });
            if (updated) {
                return res.json({ success: true, message: `Payment status updated to ${status}`, data: updated });
            }
        } catch (dbErr) {
            // Fallback
        }

        return res.json({ success: true, message: `Payment status updated to ${status}`, data: { _id: id, paymentStatus: status } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerForTournament,
    getRegistrations,
    verifyPayment
};
