import { useState } from "react";
import { gameRules, commonRules } from "../../data/gameRulesData";

export default function GameRulesModal({ gameSlug, onClose, onProceedToRegister, tournamentsList = [], onRegisterTournament, gamesList = [] }) {
  const [activeTab, setActiveTab] = useState("scoring");
  const matchedCustomGame = (gamesList || []).find(g => g.slug === gameSlug || g.slug === (gameSlug || "").toLowerCase().replace(/\s+/g, "-"));

  const game = gameRules[gameSlug] || (matchedCustomGame ? {
    slug: matchedCustomGame.slug,
    name: matchedCustomGame.name.toUpperCase(),
    category: matchedCustomGame.category,
    image: matchedCustomGame.image,
    roster: "Squad / Solo",
    mode: "Esports Tournament",
    scoringMatrix: [
      { place: "1st Place", points: "10 Pts" },
      { place: "2nd Place", points: "6 Pts" },
      { place: "3rd Place", points: "4 Pts" },
      { place: "Kill / Finish", points: "1 Pt per elimination" }
    ],
    matchRules: [
      "Official game client only. Mobile / PC as per match schedule.",
      "Check-in must be completed 15 minutes prior to match schedule.",
      "Room ID & Password shared in designated room portal."
    ]
  } : gameRules["bgmi"]);

  if (!game) return null;

  const bannerImg = matchedCustomGame?.image || game.image || "/images/bgmi.jpg";
  const currentSlug = (gameSlug || game.slug || "").toLowerCase().replace(/\s+/g, "-");
  const matchedTournaments = tournamentsList.filter((t) => {
    if (!t.game) return false;
    const tSlug = t.game.toLowerCase().replace(/\s+/g, "-");
    const gName = game.name.toLowerCase();
    const tName = t.game.toLowerCase();
    return tSlug === currentSlug || tName.includes(gName) || gName.includes(tName);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden border border-border bg-surface shadow-2xl clip-corner">
        
        {/* Header Banner with Game Wallpaper */}
        <div className="relative h-44 w-full overflow-hidden border-b border-border">
          <img
            src={bannerImg}
            alt={game.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/bgmi.jpg";
            }}
            className="h-full w-full object-cover object-center filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-display text-sm font-bold text-white transition-colors hover:bg-gold hover:text-ink cursor-pointer"
          >
            ✕ Close
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block rounded-sm border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold">
              Official Rulebook 2026
            </span>
            <h2 className="font-display text-3xl font-extrabold uppercase text-white drop-shadow-md md:text-4xl">
              {game.name}
            </h2>
            <div className="mt-1 flex flex-wrap gap-4 text-xs font-medium text-text-muted">
              <span>🎮 Mode: <strong className="text-text">{game.mode}</strong></span>
              <span>👥 Roster: <strong className="text-text">{game.roster}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-border bg-surface-raised px-6 text-sm">
          <button
            onClick={() => setActiveTab("scoring")}
            className={`py-3 font-display font-semibold transition-colors border-b-2 px-4 cursor-pointer ${
              activeTab === "scoring"
                ? "border-gold text-gold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Format & Scoring
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`py-3 font-display font-semibold transition-colors border-b-2 px-4 cursor-pointer ${
              activeTab === "rules"
                ? "border-gold text-gold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Match Rules
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`py-3 font-display font-semibold transition-colors border-b-2 px-4 cursor-pointer ${
              activeTab === "general"
                ? "border-gold text-gold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Eligibility & Grace Period
          </button>
          <button
            onClick={() => setActiveTab("penalties")}
            className={`py-3 font-display font-semibold transition-colors border-b-2 px-4 cursor-pointer ${
              activeTab === "penalties"
                ? "border-gold text-gold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Penalties Matrix
          </button>
          <button
            onClick={() => setActiveTab("tournaments")}
            className={`py-3 font-display font-semibold transition-colors border-b-2 px-4 cursor-pointer ${
              activeTab === "tournaments"
                ? "border-[#00d2ff] text-[#00d2ff]"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Tournaments {matchedTournaments.length > 0 ? `(${matchedTournaments.length})` : ""}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-text">
          
          {activeTab === "tournaments" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#00d2ff]">
                    Active & Scheduled
                  </span>
                  <h3 className="font-display text-xl font-extrabold uppercase text-white tracking-wide">
                    {game.name} Tournaments
                  </h3>
                </div>
                <span className="text-xs text-text-muted">
                  Showing {matchedTournaments.length} tournament(s) for {game.name}
                </span>
              </div>

              {matchedTournaments.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {matchedTournaments.map((t) => {
                    const pct = Math.min(100, Math.round((t.registered / t.maxSlots) * 100));
                    return (
                      <div
                        key={t.id || t._id}
                        className="flex flex-col justify-between border border-border/80 bg-surface-raised p-4 clip-corner-sm hover:border-[#00d2ff]/50 transition-all"
                      >
                        <div>
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <h4 className="font-display text-lg font-bold text-white uppercase">{t.name}</h4>
                            <span className="shrink-0 rounded-sm border border-[#00d2ff]/30 bg-[#00d2ff]/10 px-2 py-0.5 text-[10px] font-bold text-[#00d2ff]">
                              {t.status}
                            </span>
                          </div>

                          <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-text-muted text-[11px] block">Entry Fee</span>
                              <strong className="text-white">{t.entryFee}</strong>
                            </div>
                            <div>
                              <span className="text-text-muted text-[11px] block">Prize Pool</span>
                              <strong className="text-gold">{t.prizePool}</strong>
                            </div>
                            <div>
                              <span className="text-text-muted text-[11px] block">Date</span>
                              <strong className="text-text">{t.date}</strong>
                            </div>
                            <div>
                              <span className="text-text-muted text-[11px] block">Time</span>
                              <strong className="text-text">{t.time}</strong>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="mb-1 flex justify-between text-[11px] text-text-muted">
                              <span>Slots Filled</span>
                              <span className="font-semibold text-white">
                                {t.registered}/{t.maxSlots}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#00d2ff] to-[#00a3ff]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={t.status === "Registration Closed"}
                          onClick={() => {
                            onClose();
                            if (onRegisterTournament) {
                              onRegisterTournament(t);
                            } else {
                              onProceedToRegister(game.slug);
                            }
                          }}
                          className={`w-full py-2.5 font-display text-xs font-extrabold uppercase transition-all clip-corner-sm cursor-pointer ${
                            t.status === "Registration Closed"
                              ? "border border-border text-text-muted opacity-50 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#00d2ff] to-[#00a3ff] text-ink hover:brightness-110 shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                          }`}
                        >
                          {t.status === "Registration Closed" ? "Registration Closed" : "Register Now →"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-border/80 bg-surface-raised p-8 text-center space-y-3 clip-corner-sm">
                  <div className="text-3xl">🏆</div>
                  <h4 className="font-display text-lg font-bold text-white uppercase">
                    Official {game.name} Championship
                  </h4>
                  <p className="text-xs text-text-muted max-w-md mx-auto">
                    Direct entry for {game.name} is currently open. Click below to fill your squad details and secure your slot!
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onProceedToRegister(game.slug);
                    }}
                    className="mt-2 inline-block px-6 py-2.5 bg-gradient-to-r from-[#00d2ff] to-[#00a3ff] text-ink font-display text-xs font-extrabold uppercase clip-corner-sm hover:brightness-110 shadow-md cursor-pointer"
                  >
                    Register Now for {game.name} →
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "scoring" && (
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-gold uppercase tracking-wide">
                Official Points & Format Matrix
              </h3>
              <div className="overflow-hidden border border-border bg-surface-raised clip-corner-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-black/40 font-display uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="px-4 py-3">Placement / Stage</th>
                      <th className="px-4 py-3">Points Awarded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {game.scoringMatrix.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="px-4 py-2.5 font-medium text-text">{item.place}</td>
                        <td className="px-4 py-2.5 font-bold text-gold">{item.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-gold uppercase tracking-wide">
                Specific Game Rules
              </h3>
              <ul className="space-y-2.5">
                {game.matchRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 border border-border/50 bg-surface-raised p-3 clip-corner-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                      {idx + 1}
                    </span>
                    <span className="text-text">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-display font-semibold text-gold mb-1">Age & Eligibility (Section 2)</h4>
                <p className="text-text-muted">{commonRules.eligibility.age}</p>
                <p className="text-text-muted mt-1">{commonRules.eligibility.account}</p>
              </div>

              <div>
                <h4 className="font-display font-semibold text-gold mb-1">Match Operations & Check-In (Section 6)</h4>
                <ul className="list-disc list-inside space-y-1 text-text-muted">
                  <li>Teams check-in 15–30 minutes prior to scheduled start.</li>
                  <li><strong>10-Minute Grace Period:</strong> After grace period, forfeits apply.</li>
                  <li>Room ID & Password shared in designated room channel only.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-semibold text-gold mb-1">Disconnects & Remakes (Section 7)</h4>
                <p className="text-text-muted">Disconnects prior to meaningful match start may trigger lobby restart at Admin discretion. Mid-game crashes remain player responsibility.</p>
              </div>
            </div>
          )}

          {activeTab === "penalties" && (
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-gold uppercase tracking-wide">
                Disciplinary & Penalties Matrix (Section 9)
              </h3>
              <div className="overflow-hidden border border-border bg-surface-raised clip-corner-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-black/40 font-display uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="px-4 py-3">Level</th>
                      <th className="px-4 py-3">Violation Example</th>
                      <th className="px-4 py-3">Penalty Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {commonRules.penalties.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="px-4 py-2.5 font-bold text-gold">{item.level}</td>
                        <td className="px-4 py-2.5 text-text-muted">{item.example}</td>
                        <td className="px-4 py-2.5 font-medium text-text">{item.penalty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Direct Registration Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border bg-surface-raised p-4 px-6">
          <div className="text-xs text-text-muted text-center sm:text-left">
            By registering, you confirm acceptance of all official rules above.
          </div>
          {matchedTournaments.length > 0 ? (
            <button
              onClick={() => {
                onClose();
                const target = matchedTournaments.find(t => t.status === "Registration Open") || matchedTournaments[0];
                if (onRegisterTournament) {
                  onRegisterTournament(target);
                } else {
                  onProceedToRegister(game.slug);
                }
              }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#00d2ff] to-[#00a3ff] text-ink font-display text-base font-extrabold uppercase tracking-wider transition-all hover:brightness-110 clip-corner-sm cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.4)]"
            >
              Register Now for {game.name.split(" ")[0]} →
            </button>
          ) : (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-2.5 bg-surface border border-border text-text-muted font-display text-xs font-bold uppercase tracking-wider clip-corner-sm opacity-60 cursor-not-allowed"
            >
              No Active Tournament Currently
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
