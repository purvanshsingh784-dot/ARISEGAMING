// Official Tournament Rulebook Dataset (Extracted from Rulebook PDF Pages 2–20)

export const commonRules = {
    purpose: "Establish a consistent, transparent and competitive framework for the tournament. Publisher terms and platform rules apply.",
    eligibility: {
        age: "Participants must be 16+ unless event notice specifies otherwise. Minors require parent/guardian consent.",
        account: "Players must compete using their own registered game account. Account sharing, impersonation, or paid stand-ins are strictly prohibited.",
        region: "Players must lawfully participate from the eligible region. VPN use to bypass regional restrictions is prohibited."
    },
    generalRules: [
        "Players must compete honestly and follow all admin lobby, room, map, side, and server instructions.",
        "Collusion, match fixing, win trading, boosting, and intentional throwing are strictly prohibited.",
        "No macros, scripts, bots, modified clients, cheat software, memory manipulation, or overlays.",
        "Team voice communication is permitted. Harassment, threats, hate speech, and slurs are forbidden.",
        "Check-in must be completed 15–30 minutes before scheduled match time.",
        "Default grace period: 10 minutes after official match time before a forfeit is declared.",
        "If a player disconnects before the match meaningfully begins, admin may restart the lobby."
    ],
    penalties: [
        { level: "Level 1", example: "Minor first-time admin issue or late check-in", penalty: "Warning / correction" },
        { level: "Level 2", example: "Repeated lateness or minor rule breach", penalty: "Round/map penalty or match loss" },
        { level: "Level 3", example: "Serious misconduct or intentional exploit abuse", penalty: "Match forfeit / disqualification" },
        { level: "Level 4", example: "Cheating, account sharing, DDoS, or match fixing", penalty: "Immediate disqualification + ban" },
        { level: "Level 5", example: "Threatening safety or tournament integrity", penalty: "Permanent ban + legal referral" }
    ]
};

export const gameRules = {
    bgmi: {
        slug: "bgmi",
        name: "BGMI (BATTLEGROUNDS MOBILE INDIA)",
        category: "Battle Royale",
        image: "/images/bgmi.jpg",
        roster: "Solo (1 Player) / Duo (2 Players) / Squad (4 Players)",
        mode: "Solo, Duo & Squad Battle Royale Modes",
        scoringMatrix: [
            { place: "1st Place", points: "10 Pts" },
            { place: "2nd Place", points: "6 Pts" },
            { place: "3rd Place", points: "5 Pts" },
            { place: "4th Place", points: "4 Pts" },
            { place: "5th Place", points: "3 Pts" },
            { place: "6th Place", points: "2 Pts" },
            { place: "7th – 8th Place", points: "1 Pt" },
            { place: "9th – 16th Place", points: "0 Pts" },
            { place: "Finish / Kill", points: "1 Pt per elimination" }
        ],
        matchRules: [
            "Organizers can host Solo, Duo, or Squad tournaments. Choose mode during tournament creation.",
            "Solo players register individually without a team requirement.",
            "Only registered roster players may enter the custom room.",
            "No unauthorized emulators, modified clients, scripts, or macros. Mobile devices only.",
            "Teaming with another squad/player in Solo mode or stream sniping is strictly prohibited.",
            "Players must follow announced room ID, map, and perspective settings.",
            "Scorekeeper result sheet supported by in-game screenshot is official result record."
        ]
    },
    "free-fire": {
        slug: "free-fire",
        name: "FREE FIRE MAX",
        category: "Battle Royale",
        image: "/images/free-fire.jpg",
        roster: "Solo (1 Player) / Duo (2 Players) / Squad (4 Players)",
        mode: "Solo, Duo & Squad Battle Royale Custom Room",
        scoringMatrix: [
            { place: "1st Place (Booyah)", points: "12 Pts" },
            { place: "2nd Place", points: "9 Pts" },
            { place: "3rd Place", points: "8 Pts" },
            { place: "4th Place", points: "7 Pts" },
            { place: "5th Place", points: "6 Pts" },
            { place: "6th Place", points: "5 Pts" },
            { place: "7th – 8th Place", points: "3 Pts" },
            { place: "9th – 12th Place", points: "2 Pts" },
            { place: "13th – 18th Place", points: "1 Pt" },
            { place: "Elimination", points: "1 Pt per kill" }
        ],
        matchRules: [
            "Supports Solo, Duo, and Squad tournament formats selectable by organizer.",
            "Solo mode allows direct player-by-player registration.",
            "Use only official tournament-approved Free Fire MAX client.",
            "Unauthorized APKs, scripts, hacks, or modified clients are strictly banned.",
            "No teaming, intentional feeding, or kill trading in Solo or Squad matches.",
            "Players must use their registered Free Fire UID and account.",
            "Room credentials controlled by organizer; sharing credentials results in removal."
        ]
    },
    valorant: {
        slug: "valorant",
        name: "VALORANT",
        category: "Tactical FPS",
        image: "/images/valorant.jpg",
        roster: "5 Starters + 1 Optional Substitute",
        mode: "5v5 Competitive (Best of 1 / Best of 3)",
        scoringMatrix: [
            { place: "Open Qualifier", points: "Best-of-1 (BO1)" },
            { place: "Quarterfinals / Semis", points: "Best-of-3 (BO3)" },
            { place: "Grand Finals", points: "Best-of-3 (BO3) or BO5" },
            { place: "Veto Procedure", points: "Team A Ban → Team B Ban → Team A Pick → Team B Pick → Decider" }
        ],
        matchRules: [
            "Players must use registered Riot ID + Tagline (e.g. Player#1234).",
            "No cheats, scripts, unauthorized software, or stream sniping.",
            "Map pool and side selection follows organizer veto announcement prior to match.",
            "Tactical & Technical pauses allowed only through official in-game pause system.",
            "Riot Games community tournament guidelines apply."
        ]
    },
    "cod-mobile": {
        slug: "cod-mobile",
        name: "CALL OF DUTY: MOBILE",
        category: "Mobile FPS",
        image: "/images/cod-mobile.jpg",
        roster: "5 Starters + 1 Optional Substitute",
        mode: "Multiplayer Series (BO3: Hardpoint, Search & Destroy, Control)",
        scoringMatrix: [
            { place: "Game 1", points: "Hardpoint (250 Score limit / 600s)" },
            { place: "Game 2", points: "Search & Destroy (9 Round Wins limit)" },
            { place: "Game 3", points: "Control (3 Round Wins limit)" },
            { place: "Series Winner", points: "First team to 2 map wins (BO3)" }
        ],
        matchRules: [
            "Mobile devices only. No external controllers, keyboard/mouse adapters, or emulators.",
            "Map & Mode rotation specified in pre-match announcement bulletin.",
            "No account sharing, ghosting, DDoS, or unauthorized attachments/perks if banned.",
            "Match procedure: Check-in → Admin verification → Custom lobby created → Settings confirmed."
        ]
    },
    "smash-karts": {
        slug: "smash-karts",
        name: "SMASH KARTS",
        category: "Kart Battle Royale",
        image: "/images/smash-karts.jpg",
        roster: "Single Tournament (Individual 1 Player) / Flag Tournament (Team Squad)",
        mode: "Single Arena Free-For-All & Flag Capture Team Battle",
        scoringMatrix: [
            { place: "1st Place", points: "15 Pts" },
            { place: "2nd Place", points: "10 Pts" },
            { place: "3rd Place", points: "7 Pts" },
            { place: "4th Place", points: "5 Pts" },
            { place: "Elimination / Knockout", points: "1 Pt per KO" }
        ],
        matchRules: [
            "Single Tournament format: Players register individually for solo kart arena deathmatch.",
            "Flag Tournament format: Teams register together for capture-the-flag team kart conquest.",
            "Players must join the private custom arena room code within 5 minutes of release.",
            "Custom speed mods, weapon hack scripts, or altered game clients are strictly banned.",
            "Highest total kills or flags captured at match timer expiration wins.",
            "In case of score ties, a 1v1 Sudden Death round will be hosted by Admin."
        ]
    },
    "counter-strike": {
        slug: "counter-strike",
        name: "COUNTER-STRIKE 2 (CS2)",
        category: "Tactical FPS",
        image: "/images/counter-strike.jpg",
        roster: "5 Starters + 1 Optional Substitute",
        mode: "5v5 Competitive (MR12 Standard)",
        scoringMatrix: [
            { place: "Match Win", points: "3 Pts" },
            { place: "Overtime Win", points: "2 Pts" },
            { place: "Overtime Loss", points: "1 Pt" },
            { place: "Regulation Loss", points: "0 Pts" }
        ],
        matchRules: [
            "MR12 standard: 12 rounds per half. Overtime is MR3 with $10,000 starting economy.",
            "Official Active Duty Map Pool: Mirage, Inferno, Nuke, Ancient, Anubis, Dust II.",
            "VAC anti-cheat and anti-cheat client mandatory for all tournament servers.",
            "Tactical timeouts limited to 1 per team per half (60-second duration)."
        ]
    },
    "mini-militia": {
        slug: "mini-militia",
        name: "MINI MILITIA (DOODLE ARMY 2)",
        category: "Mobile Arcade FPS",
        image: "/images/mini-militia.jpg",
        roster: "4 Starters / Squad Battle",
        mode: "Multiplayer Deathmatch (Custom Room)",
        scoringMatrix: [
            { place: "1st Place Team", points: "12 Pts" },
            { place: "2nd Place Team", points: "8 Pts" },
            { place: "3rd Place Team", points: "5 Pts" },
            { place: "Top Frag MVP", points: "+3 Bonus Pts" }
        ],
        matchRules: [
            "Official Play Store / App Store client only. Unlimited nitro/health MOD APKs result in immediate ban.",
            "Official Maps: Catacombs, Outpost, High Tower (announced in lobby bulletin).",
            "Match duration: 10 minutes per round. Team with highest accumulated frags wins.",
            "Room code shared 10 minutes prior to match schedule in squad portal."
        ]
    },
    "pokemon-showdown": {
        slug: "pokemon-showdown",
        name: "POKEMON SHOWDOWN",
        category: "Strategy / Battle Arena",
        image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=800&auto=format&fit=crop",
        roster: "1 Player (Singles / Doubles)",
        mode: "Competitive Turn-Based Battle (BO3)",
        scoringMatrix: [
            { place: "Match Win (BO3)", points: "3 Pts" },
            { place: "Game Win", points: "1 Pt per game win" },
            { place: "Sweeper Bonus", points: "+1 Bonus Pt (6-0 / Clean Sweep)" },
            { place: "Tournament Winner", points: "Championship Trophy + Prize Pool" }
        ],
        matchRules: [
            "Matches played on official Pokemon Showdown platform (play.pokemonshowdown.com).",
            "Official Format: OverUsed (OU) / VGC Regulations as specified in tournament bulletin.",
            "Species Clause, Sleep Clause, Evasion Clause, and OHKO Clause enforced automatically by simulator.",
            "Players must submit battle replay links (replay.pokemonshowdown.com) to admins for verification.",
            "Disconnect timer active: 150 seconds allowed to reconnect before automatic match forfeit."
        ]
    }
};

export default gameRules;
