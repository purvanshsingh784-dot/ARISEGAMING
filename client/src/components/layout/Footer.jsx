import branding from "../../config/branding";

export default function Footer() {
  return (
    <footer className="border-t border-border/80 bg-ink/90 px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm text-text-muted sm:flex-row">
        
        {/* Brand Copyright */}
        <div className="flex items-center gap-3">
          {branding.logoImage ? (
            <img
              src={branding.logoImage}
              alt={branding.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-[#00d2ff]/50 shadow-[0_0_10px_rgba(0,210,255,0.4)]"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center bg-[#00d2ff] font-display text-xs font-extrabold text-ink clip-corner-sm">
              {branding.logoText}
            </span>
          )}
          <span className="text-xs font-medium text-text-muted">
            © 2026 <strong className="text-white">{branding.name} Esports</strong>. All rights reserved.
          </span>
        </div>

        {/* Social Icons Section */}
        <div className="flex items-center gap-3">
          {/* Discord Icon Button */}
          <a
            href={branding.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            title="Join Discord Server"
            className="group flex items-center gap-2 rounded-lg border border-[#5865F2]/40 bg-[#5865F2]/10 px-3.5 py-2 text-xs font-bold text-[#5865F2] transition-all hover:bg-[#5865F2] hover:text-white hover:shadow-[0_0_15px_rgba(88,101,242,0.5)] transform hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.009c.12.098.245.195.372.288a.077.077 0 0 1-.006.128 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>Discord</span>
          </a>

          {/* Instagram Icon Button */}
          <a
            href={branding.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow Instagram Account"
            className="group flex items-center gap-2 rounded-lg border border-[#E1306C]/40 bg-[#E1306C]/10 px-3.5 py-2 text-xs font-bold text-[#E1306C] transition-all hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white hover:shadow-[0_0_15px_rgba(225,48,108,0.5)] transform hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>Instagram</span>
          </a>

          {/* YouTube Icon Button */}
          <a
            href={branding.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube Channel"
            className="group flex items-center gap-2 rounded-lg border border-[#FF0000]/40 bg-[#FF0000]/10 px-3.5 py-2 text-xs font-bold text-[#FF0000] transition-all hover:bg-[#FF0000] hover:text-white hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transform hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
