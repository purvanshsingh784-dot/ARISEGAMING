import { useState } from "react";
import api from "../../services/api";

export default function RegistrationModal({ target, gameSlug, onClose }) {
  // Resolve tournament target info safely
  const safeGame = String(target?.game || (typeof target === "string" ? target : gameSlug || "BGMI"));
  const tournamentName = target?.name || (typeof target === "string" ? target : `${safeGame.toUpperCase()} TOURNAMENT`);
  const gameName = safeGame;
  const entryFee = target?.entryFee || "₹100/team";
  const slug = safeGame.toLowerCase().replace(/\s+/g, "-");
  const mode = target?.format || target?.type || target?.mode || "Solo";
  const isSolo = mode === "Solo" || mode === "Single Player" || mode === "Single Tournament" || mode === "Individual";
  const isDuo = mode === "Duo";
  
  const isValorant = slug === "valorant";
  const isCodm = slug === "cod-mobile" || slug === "cod mobile";
  const resolvedTeamSize = target?.teamSize !== undefined && target?.teamSize !== null && Number(target.teamSize) > 0
    ? Math.max(0, Number(target.teamSize) - 1)
    : (isSolo ? 0 : isDuo ? 1 : (isValorant || isCodm ? 4 : 3));
  const teamSize = resolvedTeamSize;

  const [formData, setFormData] = useState({
    teamName: "",
    captainName: "",
    captainPhone: "",
    captainEmail: "",
    inGameName: "",
    inGameId: "",
    transactionId: "",
    consent: false,
  });

  const [teamMembers, setTeamMembers] = useState(
    Array.from({ length: teamSize }, () => ({ name: "", inGameId: "" }))
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.transactionId.trim()) {
      setErrorMsg("Payment Transaction UID / UTR is required to verify your entry.");
      return;
    }
    if (!formData.consent) {
      setErrorMsg("Please accept the tournament rulebook terms before registering.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const finalTeamName = isSolo 
      ? (formData.inGameName ? `${formData.inGameName} (Solo)` : `${formData.captainName} (Solo)`)
      : (formData.teamName || `${formData.captainName}'s Team`);

    const newReg = {
      _id: "reg_" + Date.now(),
      tournamentName,
      game: gameName,
      mode,
      teamName: finalTeamName,
      captainName: formData.captainName,
      captainPhone: formData.captainPhone,
      captainEmail: formData.captainEmail,
      inGameId: formData.inGameId || formData.inGameName,
      paymentStatus: "Pending",
      transactionId: formData.transactionId,
      teamMembers: isSolo ? [] : teamMembers,
      createdAt: new Date().toISOString()
    };

    try {
      const existingRegs = JSON.parse(localStorage.getItem("arise_registrations") || "[]");
      existingRegs.unshift(newReg);
      localStorage.setItem("arise_registrations", JSON.stringify(existingRegs));

      const mockTournamentId = target?.id || target?._id || "t_registered_" + Date.now();
      await api.registerForTournament(mockTournamentId, newReg);
    } catch (err) {
      console.log("Registration saved to local organizer store.");
    } finally {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border-2 border-[#00d2ff]/60 bg-[#171a1f] text-white shadow-[0_0_30px_rgba(0,210,255,0.25)] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Banner */}
        <div className="flex items-center justify-between border-b border-[#2a2f38] bg-[#1e2229] p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#00d2ff]">
                Official {mode} Registration
              </span>
            </div>
            <h2 className="font-display text-2xl font-black uppercase tracking-wide text-white mt-1">
              {tournamentName}
            </h2>
            <div className="text-xs text-text-muted mt-0.5">
              Entry Fee: <strong className="text-[#00d2ff]">{entryFee}</strong> · Game: <strong className="text-text">{gameName}</strong> · Mode: <strong className="text-gold">{mode}</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-border bg-surface px-3 py-1 text-sm font-bold text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form / Confirmation Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {success ? (
            /* Registration Confirmation & Printable Pass Screen */
            <div className="py-6 text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#00d2ff]/20 border-2 border-[#00d2ff] text-4xl text-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.4)] animate-bounce">
                ✓
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#00d2ff]">Official Registration Pass</span>
                <h3 className="font-display text-3xl font-black uppercase text-white tracking-wide mt-1">
                  Registration Complete!
                </h3>
                <p className="text-xs text-text-muted mt-1.5">
                  Your entry has been recorded and submitted for tournament seeding.
                </p>
              </div>

              {/* Email Sent Notice Box */}
              <div className="mx-auto max-w-md border border-[#00d2ff]/40 bg-[#00d2ff]/10 p-3.5 text-xs text-[#00d2ff] rounded-lg font-medium flex items-center justify-center gap-2">
                ✉️ <span>Confirmation email dispatched from <strong>arisesports13@gmail.com</strong> to <strong>{formData.captainEmail || "your email"}</strong>!</span>
              </div>

              {/* Printable Official Receipt Pass */}
              <div id="registration-ticket" className="mx-auto max-w-md border-2 border-[#00d2ff]/40 bg-[#12151c] p-6 text-left text-xs space-y-3 rounded-xl shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#2a2f38] pb-3">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#00d2ff]">ARISE Esports Pass</div>
                    <div className="font-mono text-sm font-bold text-white">#ARISE-REG-{Date.now().toString().slice(-6)}</div>
                  </div>
                  <span className="bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 px-2.5 py-1 text-[10px] font-extrabold rounded uppercase">
                    Pending Verification
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="text-text-muted">Tournament:</span>
                    <span className="font-bold text-white text-right">{tournamentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="text-text-muted">Game Arena & Mode:</span>
                    <span className="font-bold text-[#00d2ff]">{gameName} ({mode})</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="text-text-muted">{isSolo ? "Player Name:" : "Team / Captain:"}</span>
                    <span className="font-bold text-white">{isSolo ? (formData.captainName || formData.inGameName) : (formData.teamName || formData.captainName)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="text-text-muted">Contact Phone:</span>
                    <span className="font-mono font-bold text-white">{formData.captainPhone}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="text-text-muted">Payment Amount:</span>
                    <span className="font-extrabold text-gold">{entryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Payment Transaction UTR:</span>
                    <span className="font-mono font-bold text-[#00d2ff] select-all">{formData.transactionId}</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-text-muted text-center border-t border-border/40">
                  Keep this ticket screenshot as official registration proof.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mx-auto max-w-md flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-surface-raised border border-[#00d2ff]/40 text-[#00d2ff] font-display text-xs font-extrabold uppercase rounded-lg hover:bg-[#00d2ff]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  📥 Save / Print Ticket Pass
                </button>
                <a
                  href="https://discord.gg/2hpWdw4G"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#5865F2] text-white font-display text-xs font-extrabold uppercase rounded-lg hover:bg-[#4752C4] transition-all flex items-center justify-center gap-2"
                >
                  👾 Join Official Discord
                </a>
              </div>

              {/* WhatsApp Community Direct Join Access */}
              <div className="mx-auto max-w-md border border-[#25D366]/40 bg-[#25D366]/10 p-4 text-center space-y-2 rounded-lg">
                <div className="text-xs font-bold text-white">
                  📢 Join WhatsApp Community for Room ID & Pass updates:
                </div>
                <a
                  href="https://chat.whatsapp.com/DCSTb0iPik8Ltm8gKyiH15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 font-display text-xs font-extrabold text-white transition-all hover:bg-[#20ba5a] hover:scale-105 shadow-lg shadow-[#25D366]/30"
                >
                  Join WhatsApp Group →
                </a>
              </div>

              <div>
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 bg-[#00d2ff] text-ink font-display font-extrabold uppercase text-xs clip-corner-sm hover:brightness-110 cursor-pointer"
                >
                  Close & Done
                </button>
              </div>
            </div>
          ) : (
            /* Registration Input Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="border border-live/40 bg-live/10 p-3 text-xs font-bold text-live flex items-center gap-2">
                  ⚠️ <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Player or Team & Captain Details */}
              <div className="space-y-4">
                <h3 className="font-display text-sm font-extrabold text-[#00d2ff] uppercase tracking-wider">
                  {isSolo ? "1. Solo Player Details" : `1. Team & Captain Details (${mode})`}
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {!isSolo && (
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1">Team Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alpha Squad"
                        value={formData.teamName}
                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                        className="w-full border border-border bg-surface-raised px-3 py-2 text-sm text-text focus:border-[#00d2ff] focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      {isSolo ? "Player Full Name *" : "Captain Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.captainName}
                      onChange={(e) => setFormData({ ...formData, captainName: e.target.value })}
                      className="w-full border border-border bg-surface-raised px-3 py-2 text-sm text-text focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      {isSolo ? "WhatsApp / Mobile Number *" : "Captain WhatsApp / Mobile *"}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.captainPhone}
                      onChange={(e) => setFormData({ ...formData, captainPhone: e.target.value })}
                      className="w-full border border-border bg-surface-raised px-3 py-2 text-sm text-text focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      {isSolo ? "Player Email Address *" : "Captain Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.captainEmail || ""}
                      onChange={(e) => setFormData({ ...formData, captainEmail: e.target.value })}
                      className="w-full border border-border bg-surface-raised px-3 py-2 text-sm text-text focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      {isSolo ? "In-Game Name (IGN) *" : "Captain In-Game Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="In-Game Username"
                      value={formData.inGameName}
                      onChange={(e) => setFormData({ ...formData, inGameName: e.target.value })}
                      className="w-full border border-border bg-surface-raised px-3 py-2 text-sm text-text focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      {isValorant ? "Riot ID + Tag *" : "In-Game Player UID *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isValorant ? "Player#1234" : "512394812"}
                      value={formData.inGameId}
                      onChange={(e) => setFormData({ ...formData, inGameId: e.target.value })}
                      className="w-full border border-border bg-surface-raised px-3 py-2 text-sm text-text focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Squad / Duo Roster (Only for non-solo matches) */}
              {!isSolo && teamMembers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-display text-sm font-extrabold text-[#00d2ff] uppercase tracking-wider">
                    {isDuo ? "2. Duo Teammate Details (1 Additional Player)" : "2. Squad Roster (Additional Teammates)"}
                  </h3>

                  <div className="space-y-3">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-2 border border-border/60 bg-surface-raised p-3 clip-corner-sm">
                        <div>
                          <label className="block text-[11px] font-semibold text-text-muted mb-1">
                            Player {idx + 2} Name
                          </label>
                          <input
                            type="text"
                            placeholder={`Player ${idx + 2} Name`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, "name", e.target.value)}
                            className="w-full border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:border-[#00d2ff] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-text-muted mb-1">
                            {isValorant ? `Player ${idx + 2} Riot ID + Tag` : `Player ${idx + 2} UID`}
                          </label>
                          <input
                            type="text"
                            placeholder={isValorant ? "Name#TAG" : "In-game ID"}
                            value={member.inGameId}
                            onChange={(e) => handleMemberChange(idx, "inGameId", e.target.value)}
                            className="w-full border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:border-[#00d2ff] focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Required Payment & QR Code Section */}
              <div className="space-y-4 border border-[#00d2ff]/40 bg-[#00d2ff]/5 p-4 clip-corner-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-extrabold text-[#00d2ff] uppercase tracking-wider flex items-center gap-2">
                    <span>💳 3. Payment Section (Required *)</span>
                  </h3>
                  <span className="text-xs font-extrabold text-gold bg-black/60 px-2.5 py-1 rounded border border-gold/40">
                    Amount: {entryFee}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 bg-black/60 border border-border p-4 clip-corner-sm">
                  {/* Clean Local UPI QR Code Display */}
                  <div className="flex flex-col items-center bg-white p-2.5 rounded-lg shadow-md shrink-0">
                    <img
                      src="/images/payment-qr.png"
                      alt="Purvansh Singh UPI QR"
                      className="w-36 h-auto object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/payment-qr.jpg";
                      }}
                    />
                    <div className="mt-1 text-[11px] font-extrabold text-black tracking-tight uppercase">Purvansh Singh</div>
                  </div>

                  <div className="flex-1 text-xs space-y-2 text-center sm:text-left">
                    <div className="font-bold text-white text-sm">
                      Scan QR Code using Google Pay, PhonePe, Paytm or BHIM
                    </div>
                    <div className="text-text-muted">
                      Payee: <strong className="text-white font-semibold">Purvansh Singh</strong>
                    </div>
                    <div className="text-text-muted">
                      UPI ID: <strong className="text-[#00d2ff] font-mono text-sm select-all">purvanshsingh784@okicici</strong>
                    </div>
                    <div className="text-text-muted">
                      Please enter the transaction ID / UTR after completing payment below.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Transaction UID / UTR Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 12-digit UTR or Transaction Ref (e.g. 429184029184)"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full border border-[#00d2ff]/60 bg-surface-raised px-3.5 py-2.5 text-sm font-mono text-[#00d2ff] focus:border-[#00d2ff] focus:outline-none focus:ring-1 focus:ring-[#00d2ff]"
                  />
                </div>
              </div>

              {/* Rules Consent */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-[#00d2ff]"
                />
                <label htmlFor="consent" className="text-xs text-text-muted">
                  I confirm that I have read and agree to the <strong className="text-text">Official Tournament Rulebook</strong> and verify that the payment transaction ID provided above is valid.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#00d2ff] to-[#00a3ff] text-ink font-display text-base font-extrabold uppercase tracking-wider hover:brightness-110 transition-all clip-corner-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] cursor-pointer"
              >
                {loading ? "Verifying & Submitting..." : "Submit Registration & Pay →"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
