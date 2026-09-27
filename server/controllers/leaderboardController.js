const Leaderboard = require("../models/Leaderboard");

// Placement points matrix
const PLACEMENT_POINTS = {
    1: 15,
    2: 12,
    3: 10,
    4: 8,
    5: 6,
    6: 4,
    7: 4,
    8: 4,
    9: 4,
    10: 4
};

const mockLeaderboards = {};

// @desc    Get tournament leaderboard
// @route   GET /api/tournaments/:id/leaderboard
const getLeaderboard = async (req, res, next) => {
    try {
        const { id: tournamentId } = req.params;

        try {
            const leaderboard = await Leaderboard.findOne({ tournamentId });
            if (leaderboard) {
                return res.json({ success: true, data: leaderboard });
            }
        } catch (dbErr) {
            // Ignore DB error
        }

        if (mockLeaderboards[tournamentId]) {
            return res.json({ success: true, data: mockLeaderboards[tournamentId] });
        }

        return res.json({
            success: true,
            data: { tournamentId, entries: [] }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit match scores & compute leaderboard standings (Admin)
// @route   POST /api/tournaments/:id/scores
const submitScores = async (req, res, next) => {
    try {
        const { id: tournamentId } = req.params;
        const { scores } = req.body; // Array of { teamName, placement, kills }

        if (!scores || !Array.isArray(scores)) {
            return res.status(400).json({ success: false, message: "Scores array required" });
        }

        // Calculate points & rank
        const entries = scores.map(item => {
            const placementPoints = PLACEMENT_POINTS[item.placement] || (item.placement <= 15 ? 2 : 1);
            const killPoints = (item.kills || 0) * 1; // 1 pt per kill
            const totalPoints = placementPoints + killPoints;

            return {
                teamName: item.teamName,
                kills: item.kills || 0,
                placementPoints,
                totalPoints
            };
        });

        // Sort by totalPoints descending, then kills descending for tie-break
        entries.sort((a, b) => {
            if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
            return b.kills - a.kills;
        });

        // Assign ranks
        entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        try {
            let leaderboard = await Leaderboard.findOne({ tournamentId });
            if (leaderboard) {
                leaderboard.entries = entries;
                await leaderboard.save();
            } else {
                leaderboard = await Leaderboard.create({ tournamentId, entries });
            }
            return res.json({ success: true, message: "Scores processed successfully", data: leaderboard });
        } catch (dbErr) {
            mockLeaderboards[tournamentId] = { tournamentId, entries };
            return res.json({
                success: true,
                message: "Scores processed successfully (offline mode)",
                data: mockLeaderboards[tournamentId]
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLeaderboard,
    submitScores
};
