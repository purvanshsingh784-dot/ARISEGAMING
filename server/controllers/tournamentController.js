const Tournament = require("../models/Tournament");

// Server live tournaments store seeded with default active tournaments
const fallbackTournaments = [];

// @desc    Get all tournaments
// @route   GET /api/tournaments
const getTournaments = async (req, res, next) => {
    try {
        const { game, status } = req.query;
        let query = {};

        if (game) query.game = game;
        if (status) query.status = status;

        try {
            const tournaments = await Tournament.find(query).sort({ createdAt: -1 });
            return res.json({ success: true, count: tournaments.length, data: tournaments });
        } catch (dbErr) {
            console.log("ℹ️ MongoDB query failed, using server memory store.");
        }

        let filtered = fallbackTournaments;
        if (game) filtered = filtered.filter(t => t.game.toLowerCase() === game.toLowerCase());
        if (status) filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());

        return res.json({ success: true, count: filtered.length, data: filtered });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single tournament
// @route   GET /api/tournaments/:id
const getTournamentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        try {
            const tournament = await Tournament.findById(id);
            if (tournament) {
                return res.json({ success: true, data: tournament });
            }
        } catch (dbErr) {
            // Check fallback
        }

        const fallback = fallbackTournaments.find(t => t._id === id || t.id === id || String(t._id).endsWith(id));
        if (fallback) {
            return res.json({ success: true, data: fallback });
        }

        return res.status(404).json({ success: false, message: "Tournament not found" });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new tournament (Admin)
// @route   POST /api/tournaments
const createTournament = async (req, res, next) => {
    try {
        const tournamentData = {
            ...req.body,
            format: req.body.format || req.body.type || "Solo",
            type: req.body.type || req.body.format || "Solo",
            teamSize: Number(req.body.teamSize) || (req.body.format === "Solo" ? 1 : req.body.format === "Duo" ? 2 : 4),
            totalPlayers: Number(req.body.totalPlayers) || 100,
            maxSlots: Number(req.body.maxSlots) || 25,
            minTeamSize: Number(req.body.teamSize) || 1,
            maxTeamSize: Number(req.body.teamSize) || 4,
            time: req.body.time || "",
            date: req.body.date || "",
            prizePool: req.body.prizePool || "",
            entryFee: req.body.entryFee || "Free"
        };

        const uniqueId = req.body._id || req.body.id || "tourn_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
        const mock = { _id: uniqueId, id: uniqueId, registeredCount: req.body.registered || 0, ...tournamentData };

        fallbackTournaments.unshift(mock);

        try {
            const newTournament = await Tournament.create(tournamentData);
            return res.status(201).json({ success: true, data: newTournament });
        } catch (dbErr) {
            return res.status(201).json({ success: true, data: mock });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update tournament (Admin)
// @route   PUT /api/tournaments/:id
const updateTournament = async (req, res, next) => {
    try {
        const { id } = req.params;
        const targetIdStr = String(id);
        const idx = fallbackTournaments.findIndex(t => String(t._id) === targetIdStr || String(t.id) === targetIdStr);
        if (idx !== -1) {
            fallbackTournaments[idx] = { ...fallbackTournaments[idx], ...req.body };
        }

        try {
            const updated = await Tournament.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
            if (updated) {
                return res.json({ success: true, data: updated });
            }
        } catch (dbErr) {
            // Fallback update
        }

        return res.json({ success: true, message: "Tournament updated", data: { _id: id, id, ...req.body } });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete tournament (Admin)
// @route   DELETE /api/tournaments/:id
const deleteTournament = async (req, res, next) => {
    try {
        const { id } = req.params;
        const targetIdStr = String(id);
        for (let i = fallbackTournaments.length - 1; i >= 0; i--) {
            const item = fallbackTournaments[i];
            if (String(item._id) === targetIdStr || String(item.id) === targetIdStr) {
                fallbackTournaments.splice(i, 1);
            }
        }

        try {
            await Tournament.findByIdAndDelete(id);
        } catch (dbErr) {
            // Ignore DB error if offline
        }
        return res.json({ success: true, message: "Tournament deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTournaments,
    getTournamentById,
    createTournament,
    updateTournament,
    deleteTournament
};
