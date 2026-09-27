import { announcements as defaultAnnouncements } from "../../data/seedData";

export default function Announcements({ announcementsList }) {
  const displayList = Array.isArray(announcementsList) ? announcementsList : defaultAnnouncements;


  return (
    <section id="notifications" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00d2ff]">Live Updates</span>
            <h2 className="font-display text-3xl font-extrabold uppercase text-text">Announcements</h2>
          </div>
          <span className="text-sm font-semibold text-text-muted">
            Total Posted ({displayList.length})
          </span>
        </div>

        {displayList.length === 0 ? (
          <div className="border border-border bg-surface p-10 text-center clip-corner space-y-2">
            <img
              src="/images/megaphone.png"
              alt="Announcements"
              className="mx-auto h-20 w-auto object-contain drop-shadow-md mb-2"
            />
            <h3 className="font-display text-lg font-bold uppercase text-white">No Announcements Posted Yet</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Official organizer announcements and tournament room updates will be published here live.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayList.map((a) => (
              <div key={a.id || a._id} className="flex items-center justify-between gap-4 border border-border bg-surface px-5 py-4 clip-corner-sm hover:border-[#00d2ff]/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${a.priority === "high" ? "bg-live" : a.priority === "medium" ? "bg-[#00d2ff]" : "bg-gold"}`} />
                  <div>
                    <div className="text-sm font-bold text-white">{a.title}</div>
                    <div className="text-xs text-text-muted">{a.scope} {a.content ? `· ${a.content}` : ""}</div>
                  </div>
                </div>
                <div className="shrink-0 text-xs font-semibold text-text-muted">{a.time || "Recent"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
