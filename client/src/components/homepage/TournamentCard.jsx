const statusStyle = {
  "Registration Open": "text-open border-open/40 bg-open/10",
  "Registration Closed": "text-text-muted border-border-strong bg-surface-raised",
  Upcoming: "text-gold border-gold/40 bg-gold/10",
  Live: "text-live border-live/40 bg-live/10",
};

export default function TournamentCard({ t, onRegister }) {
  const localRegCount = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("arise_registrations") || "[]");
      return saved.filter(
        (r) =>
          r.tournamentName?.toLowerCase() === t.name?.toLowerCase() ||
          r.game?.toLowerCase() === t.game?.toLowerCase()
      ).length;
    } catch (e) {
      return 0;
    }
  })();

  const totalRegistered = (t.registered || 0) + localRegCount;
  const pct = Math.min(100, Math.round((totalRegistered / t.maxSlots) * 100));
  const full = totalRegistered >= t.maxSlots;

  const modeLabel = t.format || t.type || t.mode || "Solo";
  const isSoloOrSingle = modeLabel === "Solo" || modeLabel === "Single Tournament" || modeLabel === "Individual";

  return (
    <div className="flex flex-col border border-border bg-surface p-5 clip-corner transition-all hover:border-[#00d2ff]/40">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#00d2ff]">{t.game}</span>
            <span className="rounded bg-[#00d2ff]/10 border border-[#00d2ff]/40 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#00d2ff]">
              {modeLabel}
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold leading-tight text-text">{t.name}</h3>
        </div>
        <span
          className={`shrink-0 rounded-sm border px-2 py-1 text-[11px] font-bold ${statusStyle[t.status] || ""}`}
        >
          {t.status}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
        <Field label="Entry" value={t.entryFee} />
        <Field label="Prize pool" value={t.prizePool} accent />
        <Field label="Date & Time" value={`${t.date} · ${t.time}`} />
        <Field label="Format / Mode" value={modeLabel} accent />
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex justify-between text-xs text-text-muted">
          <span>{isSoloOrSingle ? "Players" : "Teams"} registered</span>
          <span className="font-semibold text-text">
            {totalRegistered}/{t.maxSlots}
          </span>
        </div>
        <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden">
          <div
            className={`h-full ${full ? "bg-live" : "bg-gradient-to-r from-[#00d2ff] to-[#00a3ff]"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        disabled={t.status === "Registration Closed"}
        onClick={() => onRegister && onRegister(t)}
        className={`mt-auto text-center py-2.5 font-display text-base font-extrabold uppercase transition-all clip-corner-sm cursor-pointer ${
          t.status === "Registration Closed"
            ? "border border-border-strong text-text-muted opacity-60 cursor-not-allowed"
            : "bg-gradient-to-r from-[#00d2ff] to-[#00a3ff] text-ink hover:brightness-110 shadow-[0_0_15px_rgba(0,210,255,0.3)]"
        }`}
      >
        {t.status === "Registration Closed" ? "Registration Closed" : "Register now"}
      </button>
    </div>
  );
}

function Field({ label, value, accent }) {
  return (
    <div>
      <div className="text-[11px] text-text-muted">{label}</div>
      <div className={`font-medium ${accent ? "text-gold" : "text-text"}`}>{value}</div>
    </div>
  );
}
