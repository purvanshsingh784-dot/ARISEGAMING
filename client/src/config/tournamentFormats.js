// Centralized Game and Tournament Format Configurations & Capacity Calculation

export const GAME_FORMAT_CONFIG = {
  "BGMI": {
    hasAutoCalculation: true,
    formats: ["Solo", "Duo", "Squad"],
    capacities: {
      "Solo": { totalPlayers: 100, teamSize: 1, totalSlots: 100 },
      "Duo": { totalPlayers: 100, teamSize: 2, totalSlots: 50 },
      "Squad": { totalPlayers: 100, teamSize: 4, totalSlots: 25 },
    },
  },
  "Free Fire": {
    hasAutoCalculation: true,
    formats: ["Solo", "Duo", "Squad"],
    capacities: {
      "Solo": { totalPlayers: 50, teamSize: 1, totalSlots: 50 },
      "Duo": { totalPlayers: 50, teamSize: 2, totalSlots: 25 },
      "Squad": { totalPlayers: 48, teamSize: 4, totalSlots: 12 },
    },
  },
  "Smash Karts": {
    hasAutoCalculation: false,
    formats: ["Solo Battle", "Team Battle", "Custom Kart Battle"],
    defaultTeamSize: 1,
    defaultSlots: 16,
  },
  "Valorant": {
    hasAutoCalculation: false,
    formats: ["5v5 Team Battle"],
    defaultTeamSize: 5,
    defaultSlots: 16,
  },
  "COD Mobile": {
    hasAutoCalculation: false,
    formats: ["5v5 Team Battle", "Search & Destroy 5v5"],
    defaultTeamSize: 5,
    defaultSlots: 16,
  },
  "Counter-Strike": {
    hasAutoCalculation: false,
    formats: ["5v5 Team Battle"],
    defaultTeamSize: 5,
    defaultSlots: 16,
  },
  "Pokemon Showdown": {
    hasAutoCalculation: false,
    formats: ["1v1 Battle"],
    defaultTeamSize: 1,
    defaultSlots: 32,
  },
  "Mini Militia": {
    hasAutoCalculation: false,
    formats: ["4v4 Squad", "Solo FFA", "Custom Match"],
    defaultTeamSize: 4,
    defaultSlots: 8,
  },
};

/**
 * Checks whether automatic capacity calculation applies for a game.
 * ONLY BGMI and Free Fire use automatic lobby capacity calculation.
 */
export const isAutoCalculatedGame = (gameName) => {
  if (!gameName) return false;
  const name = gameName.toLowerCase().trim();
  return name === "bgmi" || name === "free fire";
};

/**
 * Returns supported formats for a given game.
 */
export const getSupportedFormats = (gameName) => {
  if (!gameName) return ["Standard Tournament"];
  const matched = Object.keys(GAME_FORMAT_CONFIG).find(
    (g) => g.toLowerCase() === gameName.toLowerCase().trim()
  );
  if (matched && GAME_FORMAT_CONFIG[matched]) {
    return GAME_FORMAT_CONFIG[matched].formats;
  }
  return ["Standard Tournament", "5v5 Team Battle", "Solo / FFA"];
};

/**
 * Calculates total players, team size, and total slots based on game and format.
 */
export const calculateTournamentCapacity = (gameName, format, customSlots = null) => {
  if (!gameName) {
    return { totalPlayers: 0, teamSize: 1, totalSlots: 0, isAutoCalculated: false };
  }

  const matchedGame = Object.keys(GAME_FORMAT_CONFIG).find(
    (g) => g.toLowerCase() === gameName.toLowerCase().trim()
  );

  const gameConfig = matchedGame ? GAME_FORMAT_CONFIG[matchedGame] : null;

  if (gameConfig && gameConfig.hasAutoCalculation && gameConfig.capacities && gameConfig.capacities[format]) {
    const base = gameConfig.capacities[format];
    return {
      totalPlayers: base.totalPlayers,
      teamSize: base.teamSize,
      totalSlots: base.totalSlots,
      isAutoCalculated: true,
    };
  }

  // Non auto-calculated games (Smash Karts, Valorant, COD Mobile, CS2, Pokemon, etc.)
  const defaultTeamSize = gameConfig ? (gameConfig.defaultTeamSize || (format.includes("5v5") ? 5 : format.includes("1v1") ? 1 : 1)) : (format.includes("5v5") ? 5 : 1);
  const defaultSlots = gameConfig ? (gameConfig.defaultSlots || 16) : 16;
  const slots = customSlots !== null && Number(customSlots) > 0 ? Number(customSlots) : defaultSlots;

  return {
    totalPlayers: slots * defaultTeamSize,
    teamSize: defaultTeamSize,
    totalSlots: slots,
    isAutoCalculated: false,
  };
};
