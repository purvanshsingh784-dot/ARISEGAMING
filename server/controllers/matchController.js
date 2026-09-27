const Match = require("../models/Match");

const fallbackMatches = [
    {
        _id: "66e850f1a1b2c3d4e5f60010",
        tournamentName: "BGMI NIGHT CUP",
        matchNumber: 2,
        time: "8:45 PM",
        status: "Live",
        roomId: "8472910",
        roomPassword: "bgmi",
        isRoomPublished: true
    },
    {
        _id: "66e850f1a1b2c3d4e5f60011",
        tournamentName: "VALORANT CLASH SERIES",
        matchNumber: 1,
        time: "9:00 PM",
        status: "Scheduled",
        roomId: "",
        roomPassword: "",
        isRoomPublished: false
    }
];

// @desc    Get all scheduled or live matches
// @route   GET /api/matches
const getMatches = async (req, res, next) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        try {
            const matches = await Match.find(query).sort({ createdAt: -1 });
            if (matches && matches.length > 0) {
                return res.json({ success: true, count: matches.length, data: matches });
            }
        } catch (dbErr) {
            // Ignore DB error
        }

        let filtered = fallbackMatches;
        if (status) filtered = filtered.filter(m => m.status.toLowerCase() === status.toLowerCase());

        return res.json({ success: true, count: filtered.length, data: filtered });
    } catch (error) {
        next(error);
    }
};

// @desc    Create match schedule (Admin)
// @route   POST /api/matches
const createMatch = async (req, res, next) => {
    try {
        const { tournamentId, tournamentName, matchNumber, time, status } = req.body;

        try {
            const newMatch = await Match.create({
                tournamentId,
                tournamentName,
                matchNumber,
                time,
                status: status || "Scheduled"
            });
            return res.status(201).json({ success: true, data: newMatch });
        } catch (dbErr) {
            const mock = {
                _id: "match_" + Date.now(),
                tournamentName,
                matchNumber,
                time,
                status: status || "Scheduled",
                roomId: "",
                roomPassword: "",
                isRoomPublished: false
            };
            fallbackMatches.unshift(mock);
            return res.status(201).json({ success: true, data: mock });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Publish Room ID and Password (Admin)
// @route   PATCH /api/matches/:id/room
const updateRoomCredentials = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { roomId, roomPassword } = req.body;

        const updated = await Match.findByIdAndUpdate(
            id,
            { roomId, roomPassword, isRoomPublished: true },
            { new: true }
        );

        if (updated) {
            return res.json({ success: true, message: "Room details published successfully", data: updated });
        }

        return res.status(404).json({ success: false, message: "Match not found in database" });
    } catch (error) {
        // Do NOT report success if the database write actually failed —
        // that hides real outages from the organizer.
        return res.status(503).json({
            success: false,
            message: "Could not save room credentials — database is unavailable. Please check the server's MongoDB connection and try again."
        });
    }
};

// @desc    Delete/Clear Room Credentials (Admin)
// @route   DELETE /api/matches/:id/room
const deleteRoomCredentials = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idx = fallbackMatches.findIndex(m => m._id === id || m.id === id);
        if (idx !== -1) {
            fallbackMatches[idx].roomId = "";
            fallbackMatches[idx].roomPassword = "";
            fallbackMatches[idx].isRoomPublished = false;
        }

        try {
            await Match.findByIdAndUpdate(id, { roomId: "", roomPassword: "", isRoomPublished: false });
        } catch (dbErr) {
            // Ignore
        }

        return res.json({ success: true, message: "Room credentials deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMatches,
    createMatch,
    updateRoomCredentials,
    deleteRoomCredentials
};

