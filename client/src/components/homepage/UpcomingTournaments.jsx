import TournamentCard from "./TournamentCard";

export default function UpcomingTournaments({ tournamentsList, onRegister }) {
  const displayList = tournamentsList || [];

  return (
    <section id="tournaments" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00d2ff]">Live Competitions</span>
            <h2 className="font-display text-3xl font-extrabold uppercase text-text">Upcoming tournaments</h2>
          </div>
          <span className="text-sm font-semibold text-text-muted">
            Total Listed ({displayList.length})
          </span>
        </div>

        {displayList.length === 0 ? (
          <div className="border border-border bg-surface p-12 text-center clip-corner space-y-3">
            <div className="text-4xl"></div>
            <h3 className="font-display text-xl font-bold uppercase text-white">No Tournaments Scheduled Yet</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              New BGMI, Free Fire, and Valorant tournaments will be published here live as soon as organizers announce them!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayList.map((t) => (
              <TournamentCard key={t.id || t._id} t={t} onRegister={onRegister} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
