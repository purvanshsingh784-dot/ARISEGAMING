import { useState } from "react";
import branding from "../../config/branding";
import { games } from "../../data/seedData";

const links = [
  { label: "Games", href: "#games" },
  { label: "Tournaments", href: "#tournaments" },
  { label: "Matches", href: "#matches" },
  { label: "Notifications", href: "#notifications" },
  { label: "Feedback", href: "#feedback" },
];

export default function Navbar({ onOpenOrganizerLogin, onOpenOrganizerDashboard, isOrganizerLoggedIn }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-[#0e1013]/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <a href="/" className="flex items-center gap-3 group">
          {branding.logoImage ? (
            <img
              src={branding.logoImage}
              alt={branding.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#00d2ff]/60 shadow-[0_0_15px_rgba(0,210,255,0.5)] transition-transform group-hover:scale-105"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center bg-[#00d2ff] font-display text-base font-bold text-ink clip-corner-sm">
              {branding.logoText}
            </span>
          )}
          <span className="font-display text-xl font-extrabold tracking-wider text-white group-hover:text-[#00d2ff] transition-colors drop-shadow-[0_0_10px_rgba(0,210,255,0.3)]">
            {branding.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#tournaments"
            className="rounded-sm border border-border-strong px-4 py-2 text-sm font-medium text-text transition-colors hover:border-gold hover:text-gold"
          >
            Browse tournaments
          </a>

          {isOrganizerLoggedIn ? (
            <button
              onClick={onOpenOrganizerDashboard}
              className="flex items-center gap-1.5 rounded-sm bg-gold/15 border border-gold/40 px-3 py-1.5 text-xs font-bold text-gold hover:bg-gold hover:text-ink transition-all"
            >
              <span> Organizer Dashboard</span>
            </button>
          ) : (
            <button
              onClick={onOpenOrganizerLogin}
              className="text-sm text-text-muted transition-colors hover:text-gold cursor-pointer"
            >
              Organizer login
            </button>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center text-text md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-5 py-4 md:hidden space-y-3">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-text-muted" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#tournaments" className="text-sm font-medium text-gold" onClick={() => setOpen(false)}>
              Browse tournaments
            </a>
            {isOrganizerLoggedIn ? (
              <button
                onClick={() => { setOpen(false); onOpenOrganizerDashboard(); }}
                className="text-left text-sm font-bold text-gold"
              >
                ⚙️ Organizer Dashboard
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); onOpenOrganizerLogin(); }}
                className="text-left text-sm text-text-muted hover:text-gold"
              >
                Organizer login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
