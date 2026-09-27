const gameCards = [
  {
    slug: "bgmi",
    name: "BGMI",
    category: "Battle Royale",
    image: "/images/bgmi.jpg"
  },
  {
    slug: "free-fire",
    name: "FREE FIRE",
    category: "Battle Royale",
    image: "/images/free-fire.jpg"
  },
  {
    slug: "valorant",
    name: "VALORANT",
    category: "Tactical FPS",
    image: "/images/valorant.jpg"
  },
  {
    slug: "cod-mobile",
    name: "COD MOBILE",
    category: "Mobile FPS",
    image: "/images/cod-mobile.jpg"
  },
  {
    slug: "smash-karts",
    name: "SMASH KARTS",
    category: "Kart Battle Royale",
    image: "/images/smash-karts.jpg"
  },
  {
    slug: "counter-strike",
    name: "COUNTER-STRIKE 2",
    category: "Tactical FPS",
    image: "/images/counter-strike.jpg",
  },
  {
    slug: "mini-militia",
    name: "MINI MILITIA",
    category: "Mobile Arcade FPS",
    image: "/images/mini-militia.jpg"
  },
];

export default function GameSelection({ onSelectGame, gamesList }) {
  const displayGames = gamesList && gamesList.length > 0 ? gamesList : gameCards;

  return (
    <section id="games" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00d2ff]">Official Rulebooks & Entry</span>
            <h2 className="font-display text-3xl font-extrabold uppercase text-text sm:text-4xl">Supported Arenas</h2>
          </div>
          <p className="text-sm text-text-muted">
            Click any game to view official rulebook & register ({displayGames.length} Arenas)
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayGames.map((g) => {
            const getGameImage = () => {
              if (g.image && typeof g.image === "string" && g.image.trim()) {
                return g.image.trim();
              }
              const known = gameCards.find(c => c.slug === g.slug || c.slug === (g.slug || "").toLowerCase().replace(/\s+/g, "-"));
              if (known && known.image) {
                return known.image;
              }
              return `/images/${g.slug}.jpg`;
            };

            return (
              <button
                key={g.slug}
                type="button"
                onClick={() => onSelectGame(g.slug)}
                className="group relative flex h-64 w-full flex-col justify-end overflow-hidden border border-border/80 bg-surface p-5 text-left clip-corner transition-all duration-300 hover:border-[#00d2ff] hover:shadow-xl hover:shadow-[#00d2ff]/20 transform hover:-translate-y-1 cursor-pointer"
              >
                {/* Background Game Image */}
                <img
                  src={getGameImage()}
                  alt={g.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/bgmi.jpg";
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-center filter brightness-90 transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity group-hover:via-black/75" />

                {/* Action Badge */}
                <div className="absolute right-3 top-3 z-10 rounded-sm border border-[#00d2ff]/50 bg-black/80 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#00d2ff] backdrop-blur-sm transition-all group-hover:bg-[#00d2ff] group-hover:text-ink">
                  Rules & Entry →
                </div>

                {/* Game Label Info */}
                <div className="relative z-10">
                  <div className="font-display text-2xl font-black uppercase tracking-wide text-white drop-shadow-md group-hover:text-[#00d2ff] transition-colors">
                    {g.name}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {g.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
