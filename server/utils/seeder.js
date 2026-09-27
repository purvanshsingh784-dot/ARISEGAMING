const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Tournament = require("../models/Tournament");
const Match = require("../models/Match");
const Announcement = require("../models/Announcement");

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log("🧹 Clearing old data...");
        await User.deleteMany();
        await Tournament.deleteMany();
        await Match.deleteMany();
        await Announcement.deleteMany();

        console.log("👤 Seeding default admin account...");
        const adminUser = await User.create({
            username: "EsportsAdmin",
            email: "admin@esports.com",
            password: "Admin@123",
            role: "admin"
        });

        console.log("🏆 Seeding initial tournaments...");
        const tournaments = await Tournament.create([
            {
                name: "BGMI NIGHT CUP",
                game: "BGMI",
                type: "Team",
                entryFee: "₹100/team",
                prizePool: "₹5,000",
                maxSlots: 32,
                registeredCount: 24,
                date: "25 Sep 2026",
                time: "8:00 PM",
                status: "Registration Open",
                rules: "Squad match. Mobile only. Emulators prohibited.",
                minTeamSize: 4,
                maxTeamSize: 4
            },
            {
                name: "FREE FIRE SOLO SHOWDOWN",
                game: "Free Fire",
                type: "Individual",
                entryFee: "₹50",
                prizePool: "₹2,000",
                maxSlots: 48,
                registeredCount: 48,
                date: "27 Sep 2026",
                time: "7:30 PM",
                status: "Registration Closed",
                rules: "Solo battle royale rules. Top 3 placement points awarded.",
                minTeamSize: 1,
                maxTeamSize: 1
            },
            {
                name: "VALORANT CLASH SERIES",
                game: "Valorant",
                type: "Team",
                entryFee: "₹200/team",
                prizePool: "₹8,000",
                maxSlots: 16,
                registeredCount: 9,
                date: "3 Oct 2026",
                time: "9:00 PM",
                status: "Registration Open",
                rules: "5v5 Competitive ruleset. Best of 3 maps in finals.",
                minTeamSize: 5,
                maxTeamSize: 5
            },
            {
                name: "COD MOBILE ROOKIE CUP",
                game: "COD Mobile",
                type: "Team",
                entryFee: "₹75/team",
                prizePool: "₹3,000",
                maxSlots: 24,
                registeredCount: 0,
                date: "10 Oct 2026",
                time: "6:00 PM",
                status: "Upcoming",
                rules: "Search & Destroy format. Standard banned weapons apply.",
                minTeamSize: 4,
                maxTeamSize: 5
            },
            {
                name: "SMASH KARTS GRAND PRIX",
                game: "Smash Karts",
                type: "Individual",
                entryFee: "Free",
                prizePool: "₹1,500",
                maxSlots: 32,
                registeredCount: 18,
                date: "29 Sep 2026",
                time: "6:30 PM",
                status: "Registration Open",
                rules: "3-minute arena knockout rounds. Highest kills advance.",
                minTeamSize: 1,
                maxTeamSize: 1
            },
            {
                name: "CS2 MAJOR SHOWDOWN",
                game: "Counter-Strike",
                type: "Team",
                entryFee: "₹250/team",
                prizePool: "₹10,000",
                maxSlots: 16,
                registeredCount: 14,
                date: "5 Oct 2026",
                time: "8:30 PM",
                status: "Registration Open",
                rules: "5v5 MR12 rules. VAC anti-cheat mandatory.",
                minTeamSize: 5,
                maxTeamSize: 5
            },
            {
                name: "MINI MILITIA DOODLE BATTLE",
                game: "Mini Militia",
                type: "Team",
                entryFee: "₹40/team",
                prizePool: "₹1,500",
                maxSlots: 32,
                registeredCount: 8,
                date: "8 Oct 2026",
                time: "7:00 PM",
                status: "Registration Open",
                rules: "Catacombs map 4v4 deathmatch.",
                minTeamSize: 4,
                maxTeamSize: 4
            }
        ]);

        console.log("🎮 Seeding initial matches...");
        await Match.create([
            {
                tournamentId: tournaments[0]._id,
                tournamentName: "BGMI NIGHT CUP",
                matchNumber: 2,
                time: "8:45 PM",
                status: "Live",
                roomId: "8472910",
                roomPassword: "bgmi",
                isRoomPublished: true
            },
            {
                tournamentId: tournaments[2]._id,
                tournamentName: "VALORANT CLASH SERIES",
                matchNumber: 1,
                time: "9:00 PM",
                status: "Scheduled",
                roomId: "",
                roomPassword: "",
                isRoomPublished: false
            }
        ]);

        console.log("📢 Seeding initial announcements...");
        await Announcement.create([
            {
                title: "BGMI room details released",
                content: "Room ID & password for BGMI Night Cup Match 2 are live.",
                scope: "BGMI",
                priority: "high"
            },
            {
                title: "Valorant registration closes tonight",
                content: "Only 7 team slots remaining for Valorant Clash Series.",
                scope: "Valorant",
                priority: "medium"
            },
            {
                title: "Free Fire leaderboard updated",
                content: "Official match points and kill standings have been published.",
                scope: "Free Fire",
                priority: "low"
            }
        ]);

        console.log("✅ Seed process completed successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seed Error:", error);
        process.exit(1);
    }
};

seedData();
