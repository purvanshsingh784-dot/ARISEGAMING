import { liveMatches } from "../../data/seedData";

export default function LiveMatches({ matchesList }) {
  const displayMatches = matchesList && matchesList.length > 0 ? matchesList : liveMatches;

  return (
    <section id="matches" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-live">Real-time Arena</span>
            <h2 className="font-display text-3xl font-extrabold uppercase text-text">Live &amp; upcoming matches</h2>
          </div>
          <span className="text-sm font-semibold text-text-muted">Active Matches ({displayMatches.length})</span>
        </div>

        {displayMatches.length === 0 ? (
          <div className="border border-border bg-surface p-10 text-center clip-corner space-y-2">
            <div className="text-3xl"></div>
            <h3 className="font-display text-lg font-bold uppercase text-white">No Matches Currently Active</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Match schedules and room credentials will be broadcasted here during active tournament hours.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border border border-border bg-surface clip-corner-sm">
            {displayMatches.map((m) => (
              <div key={m.id || m._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  {m.status === "Live" ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-live bg-live/10 border border-live/30 px-2.5 py-1 rounded">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-live" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-gold bg-gold/10 border border-gold/30 px-2.5 py-1 rounded">
                      SCHEDULED
                    </span>
                  )}
                  <div>
                    <div className="font-bold text-text">{m.tournament || m.tournamentName}</div>
                    <div className="text-xs text-text-muted">Match #{m.matchNumber || 1}</div>
                  </div>
                </div>
                <div className="text-xs font-mono font-semibold text-text-muted">{m.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
