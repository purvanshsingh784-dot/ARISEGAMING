import { useState, useEffect } from "react";

export default function Hero({ heroStats: propStats, gamesList = [] }) {
  const liveCount = gamesList && gamesList.length ? String(gamesList.length) : null;
  const [stats, setStats] = useState({
    prizePool: "₹18K+",
    teamsCount: "120+",
    gamesCount: liveCount || "8"
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("arise_hero_stats") || "null");
      let activeStats = saved || propStats || { prizePool: "₹18K+", teamsCount: "120+", gamesCount: "8" };
      if (liveCount) {
        activeStats = { ...activeStats, gamesCount: liveCount };
      }
      setStats(activeStats);
    } catch (e) {}
  }, [propStats, gamesList]);

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-transparent">
      {/* Subtle Cyan & Gold Ambient Glow Spheres */}
      <div
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[450px] w-[600px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #00d2ff 0%, #3b82f6 40%, transparent 75%)" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #f2b807 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl px-5 py-20 text-center md:px-8 md:py-28">
        <div className="mx-auto flex flex-col items-center max-w-3xl">
          {/* Centered Registration Status Badge Removed */}

          {/* Centered Main Display Heading */}
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl drop-shadow-[0_4px_20px_rgba(0,210,255,0.25)]">
            ENTER THE <span className="bg-gradient-to-r from-white via-[#00d2ff] to-[#38bdf8] bg-clip-text text-transparent">BATTLE</span>
          </h1>

          {/* Centered Subtitle */}
          <p className="mt-6 text-lg font-medium tracking-wide text-text-muted sm:text-xl max-w-xl">
            Compete. Dominate. Win. The ultimate arena for competitive gaming.
          </p>

          {/* Centered CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#tournaments"
              className="clip-corner-sm bg-gradient-to-r from-[#00d2ff] to-[#00a3ff] px-8 py-3.5 font-display text-lg font-extrabold uppercase text-ink transition-all hover:brightness-110 hover:shadow-[0_0_25px_rgba(0,210,255,0.5)] transform hover:-translate-y-0.5"
            >
              Explore tournaments
            </a>
            <a
              href="#games"
              className="clip-corner-sm border border-[#00d2ff]/40 bg-surface/60 px-8 py-3.5 font-display text-lg font-semibold uppercase text-text transition-all hover:border-[#00d2ff] hover:bg-surface hover:text-[#00d2ff] transform hover:-translate-y-0.5"
            >
              View games
            </a>
          </div>
        </div>

        {/* Centered Stats Grid */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 gap-6 border-t border-border/80 pt-8">
          <Stat value={stats.prizePool || "₹18K+"} label="Prize pools live" />
          <Stat value={stats.teamsCount || "120+"} label="Teams competing" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="font-display text-3xl font-extrabold text-[#00d2ff] drop-shadow-[0_0_10px_rgba(0,210,255,0.4)] sm:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-text-muted sm:text-sm">
        {label}
      </div>
    </div>
  );
}
