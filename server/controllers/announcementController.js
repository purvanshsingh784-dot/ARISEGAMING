const Announcement = require("../models/Announcement");

const fallbackAnnouncements = [];

// @desc    Get announcements
// @route   GET /api/announcements
const getAnnouncements = async (req, res, next) => {
    try {
        const { scope } = req.query;
        let query = {};
        if (scope) query.scope = scope;

        try {
            const announcements = await Announcement.find(query).sort({ createdAt: -1 });
            if (announcements && announcements.length > 0) {
                return res.json({ success: true, count: announcements.length, data: announcements });
            }
        } catch (dbErr) {
            // Ignore DB error
        }

        let filtered = fallbackAnnouncements;
        if (scope && scope !== "All") {
            filtered = filtered.filter(a => a.scope.toLowerCase() === scope.toLowerCase() || a.scope === "All");
        }

        return res.json({ success: true, count: filtered.length, data: filtered });
    } catch (error) {
        next(error);
    }
};

// @desc    Create announcement (Admin)
// @route   POST /api/announcements
const createAnnouncement = async (req, res, next) => {
    try {
        const { title, content, scope, priority } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Announcement title is required" });
        }

        const mock = {
            _id: "ann_" + Date.now(),
            title,
            content: content || "",
            scope: scope || "All",
            priority: priority || "medium",
            createdAt: new Date()
        };
        fallbackAnnouncements.unshift(mock);

        try {
            const newAnnouncement = await Announcement.create({
                title,
                content: content || "",
                scope: scope || "All",
                priority: priority || "medium"
            });
            return res.status(201).json({ success: true, data: newAnnouncement });
        } catch (dbErr) {
            return res.status(201).json({ success: true, data: mock });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete announcement (Admin)
// @route   DELETE /api/announcements/:id
const deleteAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idx = fallbackAnnouncements.findIndex(a => a._id === id || a.id === id);
        if (idx !== -1) {
            fallbackAnnouncements.splice(idx, 1);
        }

        try {
            await Announcement.findByIdAndDelete(id);
        } catch (dbErr) {
            // Ignore
        }

        return res.json({ success: true, message: "Announcement deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement
};

