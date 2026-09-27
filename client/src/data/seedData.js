// Live store for games, tournaments, live matches, and announcements.

export const games = [
  { slug: "bgmi", name: "BGMI", category: "Battle Royale", image: "/images/bgmi.jpg" },
  { slug: "free-fire", name: "Free Fire", category: "Battle Royale", image: "/images/free-fire.jpg" },
  { slug: "valorant", name: "Valorant", category: "Tactical FPS", image: "/images/valorant.jpg" },
  { slug: "cod-mobile", name: "COD Mobile", category: "Mobile FPS", image: "/images/cod-mobile.jpg" },
  { slug: "smash-karts", name: "Smash Karts", category: "Kart Battle Royale", image: "/images/smash-karts.jpg" },
  { slug: "counter-strike", name: "Counter-Strike", category: "Tactical FPS", image: "/images/cs2.jpg" },
  { slug: "mini-militia", name: "Mini Militia", category: "Mobile Arcade FPS", image: "/images/mini-militia.jpg" },
  { slug: "pokemon-showdown", name: "Pokemon Showdown", category: "Strategy / Battle Arena", image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=800&auto=format&fit=crop" },
];

export let tournaments = [];

export const addTournamentToStore = (newT) => {
  const uniqueId = newT._id || newT.id || `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const item = {
    _id: uniqueId,
    id: uniqueId,
    name: newT.name,
    game: newT.game,
    format: newT.format || newT.type || "Solo",
    type: newT.type || newT.format || "Solo",
    entryFee: newT.entryFee || "Free",
    prizePool: newT.prizePool || "₹0",
    totalPlayers: Number(newT.totalPlayers) || 0,
    teamSize: Number(newT.teamSize) || 1,
    maxSlots: Number(newT.maxSlots) || 0,
    registered: Number(newT.registered) || 0,
    date: newT.date || "",
    time: newT.time || "",
    status: newT.status || "Upcoming",
  };
  tournaments.unshift(item);
  return item;
};

export const updateTournamentInStore = (updatedT) => {
  const targetId = String(updatedT._id || updatedT.id);
  const idx = tournaments.findIndex(t => String(t.id) === targetId || String(t._id) === targetId);
  if (idx !== -1) {
    tournaments[idx] = { ...tournaments[idx], ...updatedT };
  }
};

export const deleteTournamentFromStore = (id) => {
  const targetId = String(id);
  for (let i = tournaments.length - 1; i >= 0; i--) {
    if (String(tournaments[i].id) === targetId || String(tournaments[i]._id) === targetId) {
      tournaments.splice(i, 1);
    }
  }
};

export const liveMatches = [];

export const announcements = [];

export const addAnnouncementToStore = (newA) => {
  const item = {
    id: newA.id || newA._id || `a_${Date.now()}`,
    title: newA.title,
    content: newA.content || "",
    scope: newA.scope || "All",
    priority: newA.priority || "medium",
    time: "Just now",
  };
  announcements.unshift(item);
  return item;
};

export const deleteAnnouncementFromStore = (id) => {
  const idx = announcements.findIndex(a => a.id === id || a._id === id);
  if (idx !== -1) {
    announcements.splice(idx, 1);
  }
};


export const addGameToStore = (newG) => {
  const slug = newG.slug || newG.name.toLowerCase().replace(/\s+/g, "-");
  const item = {
    slug,
    name: newG.name,
    category: newG.category || "Esports Arena",
    image: newG.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
  };
  games.unshift(item);
  return item;
};

export const deleteGameFromStore = (slug) => {
  const idx = games.findIndex(g => g.slug === slug || g.slug === slug.toLowerCase().replace(/\s+/g, "-"));
  if (idx !== -1) {
    games.splice(idx, 1);
  }
};
