import { useState, useEffect } from "react";
import api from "../../services/api";
import { gameRules, commonRules } from "../../data/gameRulesData";
import {
  tournaments as defaultTournaments,
  addTournamentToStore,
  updateTournamentInStore,
  deleteTournamentFromStore,
  addAnnouncementToStore,
  deleteAnnouncementFromStore,
  addGameToStore,
  deleteGameFromStore,
  announcements as defaultAnnouncements,
  games as defaultGames
} from "../../data/seedData";
import { getSupportedFormats, calculateTournamentCapacity, isAutoCalculatedGame } from "../../config/tournamentFormats";

export default function OrganizerDashboardModal({ gamesListProp = [], onClose, onLogout, onTournamentsUpdated, onAnnouncementsUpdated, onGamesUpdated, onDataRefresh }) {
  const [activeTab, setActiveTab] = useState("tournaments");
  const [rulesSubTab, setRulesSubTab] = useState("matchRules");
  const [toastMessage, setToastMessage] = useState("");

  const getGameModes = (gameName) => {
    return getSupportedFormats(gameName);
  };

  const emptyTournamentState = {
    name: "",
    game: "",
    format: "",
    type: "",
    entryFee: "",
    prizePool: "",
    totalPlayers: 0,
    teamSize: 1,
    maxSlots: 0,
    date: "",
    time: "",
    status: "",
    rules: "",
  };

  // Tournaments state
  const [tournamentsList, setTournamentsList] = useState(defaultTournaments);
  const [editingTournament, setEditingTournament] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTournament, setNewTournament] = useState(emptyTournamentState);

  // Rules Editor state
  const [selectedGameSlug, setSelectedGameSlug] = useState("bgmi");
  const [customGameRules, setCustomGameRules] = useState(gameRules);
  const [customCommonRules, setCustomCommonRules] = useState(commonRules);

  // Inputs for adding new rule, scoring row, penalty level
  const [newMatchRuleText, setNewMatchRuleText] = useState("");
  const [newScoreRow, setNewScoreRow] = useState({ place: "", points: "" });
  const [newPenaltyRow, setNewPenaltyRow] = useState({ level: "", example: "", penalty: "" });

  // Registrations state
  const [registrations, setRegistrations] = useState([]);

  // Matches state
  const [matches, setMatches] = useState([]);
  const [roomData, setRoomData] = useState({ matchId: "", roomId: "", roomPassword: "" });

  // Announcement state
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    scope: "All",
    priority: "medium",
  });
  const [announcementsList, setAnnouncementsList] = useState(defaultAnnouncements);

  // Game list & deletion state
  const [gamesListState, setGamesListState] = useState(() => {
    if (gamesListProp && gamesListProp.length > 0) return gamesListProp;
    try {
      const saved = JSON.parse(localStorage.getItem("arise_games") || "null");
      if (saved && saved.length > 0) return saved;
    } catch (e) {}
    return defaultGames;
  });

  // Hero Banner Stats state
  const [heroStatsForm, setHeroStatsForm] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("arise_hero_stats") || '{"prizePool":"₹18K+","teamsCount":"120+","gamesCount":"8"}');
    } catch(e) {
      return { prizePool: "₹18K+", teamsCount: "120+", gamesCount: "8" };
    }
  });

  // Feedbacks state
  const [feedbacksList, setFeedbacksList] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("arise_tournaments") || "[]");
      if (Array.isArray(saved) && saved.some(t => t.id === "t_bgmi_solo_champ" || t.id === "t_bgmi_night_cup" || t.id === "t_free_fire_solo")) {
        localStorage.removeItem("arise_tournaments");
        setTournamentsList([]);
      }
    } catch (e) {}
    fetchTournamentsData();
    fetchMatchesData();
    loadRegistrationsData();
    loadFeedbacksData();
    loadGamesData();
    loadAnnouncementsData();
  }, []);

  const loadAnnouncementsData = async () => {
    try {
      const res = await api.getAnnouncements();
      if (res && res.success && Array.isArray(res.data)) {
        setAnnouncementsList(res.data);
        return;
      }
    } catch (e) {}

    try {
      const saved = JSON.parse(localStorage.getItem("arise_announcements") || "null");
      if (saved !== null && Array.isArray(saved)) {
        setAnnouncementsList(saved);
      }
    } catch (e) {}
  };

  const loadGamesData = async () => {
    try {
      const res = await api.getGames();
      if (res && res.success && res.data && res.data.length > 0) {
        setGamesListState(res.data);
        return;
      }
    } catch (e) {}

    try {
      const saved = JSON.parse(localStorage.getItem("arise_games") || "null");
      if (saved && saved.length > 0) {
        setGamesListState(saved);
      }
    } catch (e) {}
  };

  const loadFeedbacksData = async () => {
    try {
      const res = await api.getFeedbacks();
      if (res && res.success && res.data) {
        setFeedbacksList(res.data);
        return;
      }
    } catch(e) {}
    try {
      const saved = JSON.parse(localStorage.getItem("arise_feedbacks") || "[]");
      setFeedbacksList(saved);
    } catch(e) {}
  };

  const handleDeleteGame = async (slug) => {
    deleteGameFromStore(slug);
    try {
      await api.deleteGame(slug);
    } catch (e) {}
    const updated = gamesListState.filter(g => g.slug !== slug);
    setGamesListState(updated);
    try {
      localStorage.setItem("arise_games", JSON.stringify(updated));
    } catch (e) {}

    // Auto update gamesCount
    const newStats = { ...heroStatsForm, gamesCount: String(updated.length) };
    setHeroStatsForm(newStats);
    localStorage.setItem("arise_hero_stats", JSON.stringify(newStats));
    try {
      await api.updateStats(newStats);
    } catch (e) {}

    if (onGamesUpdated) onGamesUpdated(updated);
    if (onDataRefresh) onDataRefresh();
    showToast(`🗑️ Game Arena deleted successfully! Total games updated to ${updated.length}`);
  };

  const handleSaveHeroStats = async (e) => {
    e.preventDefault();
    try {
      await api.updateStats(heroStatsForm);
    } catch(e) {}
    localStorage.setItem("arise_hero_stats", JSON.stringify(heroStatsForm));
    showToast(`⚡ Hero Banner Stats updated live on homepage for all visitors!`);
    if (onDataRefresh) onDataRefresh();
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await api.deleteFeedback(id);
    } catch(e) {}
    const updated = feedbacksList.filter(f => f._id !== id);
    setFeedbacksList(updated);
    localStorage.setItem("arise_feedbacks", JSON.stringify(updated));
    showToast(`Feedback deleted.`);
  };

  // Game state
  const [newGameForm, setNewGameForm] = useState({
    name: "",
    category: "Battle Royale",
    image: "",
  });
  const [editingGameBannerSlug, setEditingGameBannerSlug] = useState(null);
  const [editGameBannerUrl, setEditGameBannerUrl] = useState("");

  const handleUpdateGameBanner = async (game) => {
    const trimmedUrl = editGameBannerUrl.trim();
    if (!trimmedUrl) return;

    const updatedGame = {
      ...game,
      image: trimmedUrl
    };

    try {
      await api.createGame(updatedGame);
    } catch (e) {}

    // Update in-memory rulebook entry
    if (gameRules[game.slug]) {
      gameRules[game.slug].image = trimmedUrl;
    }

    const updatedList = gamesListState.map(g => (g.slug === game.slug ? updatedGame : g));
    setGamesListState(updatedList);
    try {
      localStorage.setItem("arise_games", JSON.stringify(updatedList));
    } catch (e) {}

    if (onGamesUpdated) onGamesUpdated(updatedList);
    if (onDataRefresh) onDataRefresh();

    setEditingGameBannerSlug(null);
    setEditGameBannerUrl("");
    showToast(`📸 Banner image updated for "${game.name}"!`);
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    if (!newGameForm.name.trim()) return;
    const slug = newGameForm.name.toLowerCase().replace(/\s+/g, "-");
    const gameObj = {
      slug,
      name: newGameForm.name,
      category: newGameForm.category || "Esports Arena",
      image: newGameForm.image && newGameForm.image.trim() ? newGameForm.image.trim() : "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    };

    try {
      await api.createGame(gameObj);
    } catch (err) {}

    // Register rulebook entry if missing
    if (!gameRules[slug]) {
      gameRules[slug] = {
        slug,
        name: gameObj.name.toUpperCase(),
        category: gameObj.category,
        image: gameObj.image,
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
      };
    }

    addGameToStore(gameObj);
    const filteredOld = gamesListState.filter(g => g.slug !== slug);
    const updated = [gameObj, ...filteredOld];
    setGamesListState(updated);
    try {
      localStorage.setItem("arise_games", JSON.stringify(updated));
    } catch (e) {}

    // Auto update gamesCount
    const newStats = { ...heroStatsForm, gamesCount: String(updated.length) };
    setHeroStatsForm(newStats);
    localStorage.setItem("arise_hero_stats", JSON.stringify(newStats));
    try {
      await api.updateStats(newStats);
    } catch (e) {}

    if (onGamesUpdated) onGamesUpdated(updated);
    if (onDataRefresh) onDataRefresh();

    showToast(` Game "${newGameForm.name}" published live! Total Games Supported updated to ${updated.length}!`);
    setNewGameForm({ name: "", category: "Battle Royale", image: "" });
  };

  const loadRegistrationsData = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("arise_registrations") || "[]");
      setRegistrations(saved);
    } catch (err) {
      console.warn("Could not parse registrations from storage");
      setRegistrations([]);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchTournamentsData = async () => {
    try {
      const res = await api.getTournaments();
      if (res.success && res.data && res.data.length > 0) {
        setTournamentsList(res.data);
      }
    } catch (err) {
      console.log("Using seed data store for tournaments.");
    }
  };

  const fetchMatchesData = async () => {
    try {
      const res = await api.getMatches();
      if (res.success && res.data) {
        setMatches(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // TOURNAMENT SAVE / EDIT / DELETE HANDLERS
  // ----------------------------------------------------
  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!newTournament.game) {
      showToast("⚠️ Please select a Game first.");
      return;
    }
    if (!newTournament.format) {
      showToast("⚠️ Please select a Tournament Format.");
      return;
    }

    const uniqueId = "t_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const cap = calculateTournamentCapacity(newTournament.game, newTournament.format);
    const tournamentToSave = {
      _id: uniqueId,
      id: uniqueId,
      ...newTournament,
      format: newTournament.format,
      type: newTournament.format,
      totalPlayers: cap.totalPlayers,
      teamSize: cap.teamSize,
      maxSlots: cap.totalSlots,
      status: newTournament.status || "Upcoming",
      registered: 0
    };

    let createdItem = tournamentToSave;

    try {
      const res = await api.createTournament(tournamentToSave);
      if (res && res.success && res.data) {
        createdItem = { ...tournamentToSave, ...res.data };
      }
    } catch (err) {
      console.log("Offline mode: creating tournament locally");
    }

    addTournamentToStore(createdItem);

    // Keep existing tournaments and add the new tournament distinctly
    const targetIdStr = String(createdItem._id || createdItem.id);
    const filteredOld = tournamentsList.filter(
      t => String(t.id) !== targetIdStr && String(t._id) !== targetIdStr
    );
    const updated = [createdItem, ...filteredOld];

    setTournamentsList(updated);
    try {
      localStorage.setItem("arise_tournaments", JSON.stringify(updated));
    } catch (e) {}
    if (onTournamentsUpdated) onTournamentsUpdated(updated);
    if (onDataRefresh) onDataRefresh();

    setShowAddForm(false);
    showToast(`🏆 New Tournament "${newTournament.name}" published live!`);
    setNewTournament(emptyTournamentState);
  };

  const handleUpdateTournament = async (e) => {
    e.preventDefault();
    if (!editingTournament) return;

    const targetId = editingTournament._id || editingTournament.id;
    const cap = calculateTournamentCapacity(
      editingTournament.game,
      editingTournament.format || editingTournament.type
    );

    const updatedTournament = {
      ...editingTournament,
      format: editingTournament.format || editingTournament.type || "Solo",
      type: editingTournament.format || editingTournament.type || "Solo",
      totalPlayers: cap.totalPlayers,
      teamSize: cap.teamSize,
      maxSlots: cap.totalSlots,
    };

    try {
      if (targetId) {
        await api.updateTournament(targetId, updatedTournament);
      } else {
        await api.createTournament(updatedTournament);
      }
    } catch (err) {
      console.log("Offline update");
    }

    updateTournamentInStore(updatedTournament);
    const targetIdStr = String(targetId);
    const updatedList = tournamentsList.map(t => (String(t._id) === targetIdStr || String(t.id) === targetIdStr) ? updatedTournament : t);
    setTournamentsList(updatedList);
    try {
      localStorage.setItem("arise_tournaments", JSON.stringify(updatedList));
    } catch (e) {}
    if (onTournamentsUpdated) onTournamentsUpdated(updatedList);
    if (onDataRefresh) onDataRefresh();

    setEditingTournament(null);
    showToast(`✅ Tournament "${updatedTournament.name}" updated successfully!`);
  };

  const handleDeleteTournament = async (id) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this tournament?")) {
      deleteTournamentFromStore(id);
      try {
        await api.deleteTournament(id);
      } catch (e) {
        console.log("Offline delete");
      }
      const targetIdStr = String(id);
      const updatedList = tournamentsList.filter(t => String(t._id) !== targetIdStr && String(t.id) !== targetIdStr);
      setTournamentsList(updatedList);
      try {
        localStorage.setItem("arise_tournaments", JSON.stringify(updatedList));
      } catch (e) {}
      if (onTournamentsUpdated) onTournamentsUpdated(updatedList);
      if (onDataRefresh) onDataRefresh();
      showToast("🗑️ Tournament deleted successfully!");
    }
  };

  const handleDeleteRoomCredentials = async (targetId) => {
    if (confirm("Are you sure you want to delete/clear these Room Credentials?")) {
      try {
        await api.deleteRoomCredentials(targetId);
      } catch (e) {}

      const updatedTournaments = tournamentsList.map(t => {
        if (t._id === targetId || t.id === targetId) {
          return { ...t, roomId: "", roomPassword: "", isRoomPublished: false };
        }
        return t;
      });
      setTournamentsList(updatedTournaments);
      try {
        localStorage.setItem("arise_tournaments", JSON.stringify(updatedTournaments));
      } catch (e) {}
      if (onTournamentsUpdated) onTournamentsUpdated(updatedTournaments);

      const updatedMatches = matches.map(m => {
        if (m._id === targetId || m.id === targetId) {
          return { ...m, roomId: "", roomPassword: "", isRoomPublished: false };
        }
        return m;
      });
      setMatches(updatedMatches);

      if (onDataRefresh) onDataRefresh();
      showToast("🗑️ Room credentials deleted / cleared successfully.");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncementFromStore(id);
      try {
        await api.deleteAnnouncement(id);
      } catch (e) {}

      const updated = announcementsList.filter(a => a._id !== id && a.id !== id);
      setAnnouncementsList(updated);
      try {
        localStorage.setItem("arise_announcements", JSON.stringify(updated));
      } catch (e) {}

      if (onAnnouncementsUpdated) onAnnouncementsUpdated(updated);
      if (onDataRefresh) onDataRefresh();
      showToast("🗑️ Announcement deleted successfully.");
    }
  };

  // ----------------------------------------------------
  // GAME RULES & MATRIX EDITORS
  // ----------------------------------------------------
  const currentGame = customGameRules[selectedGameSlug] || customGameRules["bgmi"];

  // Add Match Rule
  const handleAddMatchRule = () => {
    if (!newMatchRuleText.trim()) return;
    const updatedRules = [...currentGame.matchRules, newMatchRuleText.trim()];
    const updatedGame = { ...currentGame, matchRules: updatedRules };
    const updatedCustom = { ...customGameRules, [selectedGameSlug]: updatedGame };
    setCustomGameRules(updatedCustom);
    gameRules[selectedGameSlug].matchRules = updatedRules;
    setNewMatchRuleText("");
    showToast(" Rule added! Click 'Save All Changes' to persist.");
  };

  const handleRemoveMatchRule = (index) => {
    const updatedRules = currentGame.matchRules.filter((_, i) => i !== index);
    const updatedGame = { ...currentGame, matchRules: updatedRules };
    const updatedCustom = { ...customGameRules, [selectedGameSlug]: updatedGame };
    setCustomGameRules(updatedCustom);
    gameRules[selectedGameSlug].matchRules = updatedRules;
  };

  // Add Scoring Matrix Row
  const handleAddScoringRow = () => {
    if (!newScoreRow.place.trim() || !newScoreRow.points.trim()) return;
    const updatedMatrix = [...currentGame.scoringMatrix, { place: newScoreRow.place, points: newScoreRow.points }];
    const updatedGame = { ...currentGame, scoringMatrix: updatedMatrix };
    const updatedCustom = { ...customGameRules, [selectedGameSlug]: updatedGame };
    setCustomGameRules(updatedCustom);
    gameRules[selectedGameSlug].scoringMatrix = updatedMatrix;
    setNewScoreRow({ place: "", points: "" });
    showToast(" Scoring row added!");
  };

  const handleRemoveScoringRow = (index) => {
    const updatedMatrix = currentGame.scoringMatrix.filter((_, i) => i !== index);
    const updatedGame = { ...currentGame, scoringMatrix: updatedMatrix };
    const updatedCustom = { ...customGameRules, [selectedGameSlug]: updatedGame };
    setCustomGameRules(updatedCustom);
    gameRules[selectedGameSlug].scoringMatrix = updatedMatrix;
  };

  // Add Penalty Row
  const handleAddPenaltyRow = () => {
    if (!newPenaltyRow.level.trim() || !newPenaltyRow.penalty.trim()) return;
    const updatedPenalties = [...customCommonRules.penalties, newPenaltyRow];
    const updatedCommon = { ...customCommonRules, penalties: updatedPenalties };
    setCustomCommonRules(updatedCommon);
    commonRules.penalties = updatedPenalties;
    setNewPenaltyRow({ level: "", example: "", penalty: "" });
    showToast(" Penalty level added!");
  };

  const handleRemovePenaltyRow = (index) => {
    const updatedPenalties = customCommonRules.penalties.filter((_, i) => i !== index);
    const updatedCommon = { ...customCommonRules, penalties: updatedPenalties };
    setCustomCommonRules(updatedCommon);
    commonRules.penalties = updatedPenalties;
  };

  // Global Save Rulebook
  const handleSaveRulebookGlobally = () => {
    // Sync all mutated state directly to exported gameRules and commonRules
    Object.keys(customGameRules).forEach(slug => {
      gameRules[slug] = customGameRules[slug];
    });
    commonRules.eligibility = customCommonRules.eligibility;
    commonRules.penalties = customCommonRules.penalties;
    showToast(" All rulebook, format & scoring, eligibility, and penalty matrix changes saved live!");
  };

  // ----------------------------------------------------
  // OTHER ACTIONS (PAYMENTS, ROOM, ANNOUNCEMENTS)
  // ----------------------------------------------------
  const togglePaymentStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "Verified" ? "Pending" : "Verified";
    setRegistrations(registrations.map(r => r._id === id ? { ...r, paymentStatus: nextStatus } : r));
    showToast(` Payment status updated to ${nextStatus}`);
  };

  const handlePublishRoom = async (e) => {
    e.preventDefault();
    if (!roomData.matchId || !roomData.roomId) return;
    try {
      await api.publishRoomCredentials(roomData.matchId, roomData.roomId, roomData.roomPassword);
    } catch (err) {}
    
    // Update match state
    setMatches(matches.map(m => m._id === roomData.matchId ? {
      ...m,
      roomId: roomData.roomId,
      roomPassword: roomData.roomPassword,
      isRoomPublished: true
    } : m));

    // Also update tournament state so room ID persists for tournaments
    const updatedTournaments = tournamentsList.map(t => (t._id || t.id) === roomData.matchId ? {
      ...t,
      roomId: roomData.roomId,
      roomPassword: roomData.roomPassword,
      isRoomPublished: true
    } : t);
    setTournamentsList(updatedTournaments);
    try {
      localStorage.setItem("arise_tournaments", JSON.stringify(updatedTournaments));
    } catch(err) {}

    showToast("🚀 Room ID & Password published to players successfully!");
    setRoomData({ matchId: "", roomId: "", roomPassword: "" });
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    let createdAnn = { ...announcementForm, id: "ann_" + Date.now(), _id: "ann_" + Date.now(), time: "Just now" };
    try {
      const res = await api.createAnnouncement(announcementForm);
      if (res && res.data) {
        createdAnn = res.data;
      }
    } catch (err) {}

    addAnnouncementToStore(createdAnn);
    const targetIdStr = String(createdAnn._id || createdAnn.id);
    const filteredOld = announcementsList.filter(a => String(a._id || a.id) !== targetIdStr);
    const updated = [createdAnn, ...filteredOld];

    setAnnouncementsList(updated);
    try {
      localStorage.setItem("arise_announcements", JSON.stringify(updated));
    } catch (e) {}

    if (onAnnouncementsUpdated) onAnnouncementsUpdated(updated);
    if (onDataRefresh) onDataRefresh();

    showToast(" Announcement published to website!");
    setAnnouncementForm({ title: "", content: "", scope: "All", priority: "medium" });
  };




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-border bg-surface shadow-2xl clip-corner">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-border bg-surface-raised p-5 gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-gold text-ink font-display font-extrabold text-lg clip-corner-sm">
              
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">Organizer Control Center</span>
              <h2 className="font-display text-2xl font-extrabold uppercase text-text">Admin Management Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="rounded-sm border border-live/40 bg-live/10 px-3 py-1.5 text-xs font-bold text-live hover:bg-live hover:text-white transition-colors"
            >
              🔒 Logout
            </button>
            <button
              onClick={onClose}
              className="rounded-full border border-border bg-surface p-2 text-sm text-text-muted hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Global Toast Alert Notification */}
        {toastMessage && (
          <div className="bg-open/20 border-b border-open/40 px-6 py-2 text-xs font-bold text-open flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage("")} className="text-text hover:text-white">✕</button>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-border bg-surface-raised px-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => { setActiveTab("tournaments"); fetchTournamentsData(); }}
            className={`py-3.5 px-4 font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "tournaments" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
             Manage Tournaments
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`py-3.5 px-4 font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "rules" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
             Edit Rules, Scoring & Matrix
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`py-3.5 px-4 font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "registrations" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
             Teams & Payments
          </button>
          <button
            onClick={() => setActiveTab("room")}
            className={`py-3.5 px-4 font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "room" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
             Room ID & Credentials
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`py-3.5 px-4 font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "announcements" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
             Post Announcement
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`py-3.5 px-4 font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "games" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
             Manage Game Arenas
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={`py-3.5 px-4 font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "hero" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            ⚡ Hero Banner Stats
          </button>
          <button
            onClick={() => { setActiveTab("feedbacks"); loadFeedbacksData(); }}
            className={`py-3.5 px-4 font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "feedbacks" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
             Player Feedbacks ({feedbacksList.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">

          {/* TAB 1: TOURNAMENTS */}
          {activeTab === "tournaments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-gold uppercase">Tournament Manager</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all listed tournaments?")) {
                        setTournamentsList([]);
                        try {
                          localStorage.setItem("arise_tournaments", JSON.stringify([]));
                        } catch (e) {}
                        if (onTournamentsUpdated) onTournamentsUpdated([]);
                        showToast("🧹 All tournaments cleared cleanly!");
                      }
                    }}
                    className="px-3 py-2 bg-live/10 border border-live/40 text-live font-display font-bold uppercase text-xs clip-corner-sm hover:bg-live hover:text-white transition-colors cursor-pointer"
                  >
                    🧹 Clear All Tournaments
                  </button>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-gold text-ink font-display font-bold uppercase text-xs clip-corner-sm hover:bg-white transition-colors cursor-pointer"
                  >
                    {showAddForm ? "Cancel" : "+ Add New Tournament"}
                  </button>
                </div>
              </div>

              {/* Add Tournament Form */}
              {showAddForm && (
                <form onSubmit={handleCreateTournament} className="border border-gold/40 bg-surface-raised p-5 space-y-4 clip-corner-sm shadow-xl">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="font-display font-bold text-gold uppercase text-base">Create New Tournament</h4>
                    <span className="text-[11px] text-text-muted">Fill all fields to publish live</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-text-muted font-semibold">Tournament Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter tournament name (e.g. BGMI Pro Cup)"
                        value={newTournament.name}
                        onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text font-medium mt-1 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted font-semibold">Game Title *</label>
                      <select
                        required
                        value={newTournament.game}
                        onChange={(e) => {
                          const selectedGame = e.target.value;
                          const formats = getSupportedFormats(selectedGame);
                          const firstFmt = formats[0] || "";
                          const cap = calculateTournamentCapacity(selectedGame, firstFmt);
                          setNewTournament({
                            ...newTournament,
                            game: selectedGame,
                            format: firstFmt,
                            type: firstFmt,
                            totalPlayers: cap.totalPlayers,
                            teamSize: cap.teamSize,
                            maxSlots: cap.totalSlots,
                          });
                        }}
                        className="w-full border border-border bg-surface px-3 py-2 text-text font-medium mt-1 focus:border-gold focus:outline-none"
                      >
                        <option value="">-- Select Game --</option>
                        <option value="BGMI">BGMI</option>
                        <option value="Free Fire">Free Fire</option>
                        <option value="Smash Karts">Smash Karts</option>
                        <option value="Valorant">Valorant</option>
                        <option value="COD Mobile">COD Mobile</option>
                        <option value="Counter-Strike">Counter-Strike</option>
                        <option value="Pokemon Showdown">Pokemon Showdown</option>
                        <option value="Mini Militia">Mini Militia</option>
                        {gamesListState
                          .filter(g => !["bgmi", "free fire", "smash karts", "valorant", "cod mobile", "counter-strike", "pokemon showdown", "mini militia"].includes((g.name || "").toLowerCase()))
                          .map(g => (
                            <option key={g.slug || g.name} value={g.name}>{g.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-gold font-extrabold">Tournament Format *</label>
                      <select
                        required
                        disabled={!newTournament.game}
                        value={newTournament.format}
                        onChange={(e) => {
                          const selectedFormat = e.target.value;
                          if (!selectedFormat) {
                            setNewTournament({ ...newTournament, format: "", type: "", totalPlayers: 0, teamSize: 1, maxSlots: 0 });
                          } else {
                            const cap = calculateTournamentCapacity(newTournament.game, selectedFormat, newTournament.maxSlots || null);
                            setNewTournament({
                              ...newTournament,
                              format: selectedFormat,
                              type: selectedFormat,
                              totalPlayers: cap.totalPlayers,
                              teamSize: cap.teamSize,
                              maxSlots: cap.totalSlots,
                            });
                          }
                        }}
                        className="w-full border-2 border-gold bg-surface px-3 py-2 text-gold font-extrabold mt-1 focus:border-gold focus:outline-none rounded disabled:opacity-50 disabled:border-border disabled:text-text-muted"
                      >
                        <option value="">{newTournament.game ? "-- Select Format --" : "-- Select Game First --"}</option>
                        {newTournament.game && getSupportedFormats(newTournament.game).map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Editable Slots for Games without Auto Calculation */}
                    {newTournament.game && !isAutoCalculatedGame(newTournament.game) && (
                      <div>
                        <label className="text-gold font-extrabold">Total Slots / Teams *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="Enter slots count (e.g. 16)"
                          value={newTournament.maxSlots || ""}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const cap = calculateTournamentCapacity(newTournament.game, newTournament.format, val);
                            setNewTournament({
                              ...newTournament,
                              maxSlots: val,
                              totalPlayers: cap.totalPlayers,
                              teamSize: cap.teamSize,
                            });
                          }}
                          className="w-full border-2 border-gold bg-surface px-3 py-2 text-gold font-extrabold mt-1 focus:border-gold focus:outline-none rounded"
                        />
                      </div>
                    )}

                    {/* Visual Quick-Select Format Buttons */}
                    {newTournament.game && (
                      <div className="sm:col-span-3 border border-gold/30 bg-black/40 p-3.5 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-gold font-extrabold uppercase text-xs tracking-wider flex items-center gap-2">
                            <span>🎮 Supported Formats for {newTournament.game}</span>
                          </label>
                          <span className="text-[11px] font-bold text-[#00d2ff]">
                            Selected Format: <strong className="underline">{newTournament.format || "None Selected"}</strong>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {getSupportedFormats(newTournament.game).map((fmt) => {
                            const isSelected = newTournament.format === fmt;
                            return (
                              <button
                                key={fmt}
                                type="button"
                                onClick={() => {
                                  const cap = calculateTournamentCapacity(newTournament.game, fmt, newTournament.maxSlots || null);
                                  setNewTournament({
                                    ...newTournament,
                                    format: fmt,
                                    type: fmt,
                                    totalPlayers: cap.totalPlayers,
                                    teamSize: cap.teamSize,
                                    maxSlots: cap.totalSlots,
                                  });
                                }}
                                className={`flex-1 min-w-[100px] py-2.5 px-4 font-display font-extrabold text-xs uppercase tracking-wider rounded-md border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                  isSelected
                                    ? "bg-gradient-to-r from-gold to-yellow-500 text-ink border-gold shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-105"
                                    : "bg-surface-raised border-border text-text-muted hover:border-gold/60 hover:text-white"
                                }`}
                              >
                                <span>{fmt.includes("Solo") || fmt.includes("1v1") ? "👤" : fmt.includes("Duo") ? "👥" : "⚔️"}</span>
                                <span>{fmt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Read-Only Automatic Capacity & Slot Calculation (ONLY FOR BGMI & FREE FIRE) */}
                    {newTournament.game && isAutoCalculatedGame(newTournament.game) && (
                      <div className="sm:col-span-3 bg-black/50 border border-[#00d2ff]/40 p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider flex items-center gap-2">
                            <span>⚡ Automatic Capacity & Slot Calculation</span>
                            <span className="text-[10px] bg-[#00d2ff]/20 text-[#00d2ff] px-2 py-0.5 rounded border border-[#00d2ff]/40">
                              🔒 Read-Only
                            </span>
                          </span>
                          {newTournament.game && newTournament.format && (
                            <span className="text-[11px] text-text-muted">
                              Rule: <strong className="text-white">{newTournament.game} - {newTournament.format}</strong>
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-surface border border-border p-3 rounded">
                            <label className="text-[10px] font-bold uppercase text-text-muted block tracking-wider">Total Players</label>
                            <div className="text-lg font-black text-gold font-display mt-0.5">
                              {newTournament.totalPlayers ? `${newTournament.totalPlayers} Players` : "—"}
                            </div>
                            <span className="text-[10px] text-text-muted">Total lobby capacity</span>
                          </div>
                          <div className="bg-surface border border-border p-3 rounded">
                            <label className="text-[10px] font-bold uppercase text-text-muted block tracking-wider">Team Size</label>
                            <div className="text-lg font-black text-white font-display mt-0.5">
                              {newTournament.teamSize ? `${newTournament.teamSize} ${newTournament.teamSize === 1 ? "Player (Solo)" : newTournament.teamSize === 2 ? "Players (Duo)" : "Players/Team"}` : "—"}
                            </div>
                            <span className="text-[10px] text-text-muted">Players per team</span>
                          </div>
                          <div className="bg-surface border border-border p-3 rounded">
                            <label className="text-[10px] font-bold uppercase text-text-muted block tracking-wider">Total Slots</label>
                            <div className="text-lg font-black text-[#00d2ff] font-display mt-0.5">
                              {newTournament.maxSlots ? `${newTournament.maxSlots} Slots` : "—"}
                            </div>
                            <span className="text-[10px] text-text-muted">Calculated tournament slots</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-text-muted font-semibold">Prize Pool *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter prize pool (e.g. ₹5,000)"
                        value={newTournament.prizePool}
                        onChange={(e) => setNewTournament({ ...newTournament, prizePool: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text font-medium mt-1 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted font-semibold">Entry Fee *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter entry fee (e.g. ₹50 or Free)"
                        value={newTournament.entryFee}
                        onChange={(e) => setNewTournament({ ...newTournament, entryFee: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text font-medium mt-1 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted font-semibold">Date & Time *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter date & time (e.g. 28 Sep 2026, 8:00 PM)"
                        value={newTournament.date}
                        onChange={(e) => setNewTournament({ ...newTournament, date: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text font-medium mt-1 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted font-semibold">Status *</label>
                      <select
                        required
                        value={newTournament.status}
                        onChange={(e) => setNewTournament({ ...newTournament, status: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text font-medium mt-1 focus:border-gold focus:outline-none"
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Registration Open">Registration Open</option>
                        <option value="Registration Closed">Registration Closed</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Live">Live</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-gold text-ink font-display font-extrabold uppercase text-sm clip-corner-sm hover:bg-white transition-colors cursor-pointer"
                    >
                      💾 SAVE TOURNAMENT NOW
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2.5 bg-surface border border-border text-text-muted hover:text-white text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Tournament List Table */}
              <div className="overflow-x-auto border border-border bg-surface-raised clip-corner-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-black/40 font-display uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="px-4 py-3">Tournament Name</th>
                      <th className="px-4 py-3">Game</th>
                      <th className="px-4 py-3">Format</th>
                      <th className="px-4 py-3">Prize Pool</th>
                      <th className="px-4 py-3">Entry Fee</th>
                      <th className="px-4 py-3">Slots</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {tournamentsList.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-10 text-center text-text-muted">
                          <p className="text-sm font-semibold">No tournaments currently listed.</p>
                          <p className="text-xs text-text-muted/60 mt-1">Click "+ Add New Tournament" above to create and publish one.</p>
                        </td>
                      </tr>
                    ) : (
                      tournamentsList.map((t) => (
                        <tr key={t.id || t._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-semibold text-text">{t.name}</td>
                          <td className="px-4 py-3 text-gold font-bold">{t.game}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-[#00d2ff]/10 border border-[#00d2ff]/40 text-[#00d2ff] font-extrabold rounded text-[10px] uppercase">
                              {t.format || t.type || t.mode || "Solo"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-text-muted">{t.prizePool}</td>
                          <td className="px-4 py-3 text-text-muted">{t.entryFee}</td>
                          <td className="px-4 py-3 text-text-muted font-mono font-medium">
                            <span className="text-gold font-bold">{t.registered || t.registeredCount || 0}</span> / {t.maxSlots || t.totalSlots || 0}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={t.status || "Upcoming"}
                              onChange={(e) => {
                                const updated = { ...t, status: e.target.value };
                                updateTournamentInStore(updated);
                                const newList = tournamentsList.map(item => (item.id === t.id || item._id === t._id) ? updated : item);
                                setTournamentsList(newList);
                                if (onTournamentsUpdated) onTournamentsUpdated(newList);
                                showToast(` Status updated to "${e.target.value}"`);
                              }}
                              className="bg-black/60 border border-border px-2 py-1 text-xs text-gold rounded font-bold"
                            >
                              <option value="Registration Open">Registration Open</option>
                              <option value="Registration Closed">Registration Closed</option>
                              <option value="Upcoming">Upcoming</option>
                              <option value="Live">Live</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const game = t.game || "BGMI";
                                  const fmt = t.format || t.type || "Solo";
                                  const cap = calculateTournamentCapacity(game, fmt);
                                  setEditingTournament({
                                    ...t,
                                    game,
                                    format: fmt,
                                    type: fmt,
                                    totalPlayers: t.totalPlayers || cap.totalPlayers,
                                    teamSize: t.teamSize || cap.teamSize,
                                    maxSlots: t.maxSlots || cap.totalSlots,
                                  });
                                }}
                                className="px-3 py-1 bg-surface border border-border hover:border-gold text-xs font-bold text-text rounded cursor-pointer transition-colors"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTournament(t._id || t.id)}
                                className="px-3 py-1 bg-live/15 border border-live/50 text-xs font-bold text-live rounded hover:bg-live hover:text-white cursor-pointer transition-colors"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Edit Tournament Modal */}
              {editingTournament && (
                <form onSubmit={handleUpdateTournament} className="border border-gold bg-surface-raised p-5 space-y-4 clip-corner-sm shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="font-display font-bold text-gold uppercase text-base">Edit Tournament: {editingTournament.name}</h4>
                    <button
                      type="button"
                      onClick={() => setEditingTournament(null)}
                      className="text-text-muted hover:text-white text-xs cursor-pointer"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-text-muted font-semibold">Tournament Name *</label>
                      <input
                        type="text"
                        required
                        value={editingTournament.name || ""}
                        onChange={(e) => setEditingTournament({ ...editingTournament, name: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text mt-1 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted font-semibold">Game Title *</label>
                      <select
                        value={editingTournament.game || ""}
                        onChange={(e) => {
                          const nextGame = e.target.value;
                          const supported = getSupportedFormats(nextGame);
                          const nextFormat = supported.includes(editingTournament.format) ? editingTournament.format : (supported[0] || "");
                          const cap = calculateTournamentCapacity(nextGame, nextFormat, editingTournament.maxSlots || null);
                          setEditingTournament({
                            ...editingTournament,
                            game: nextGame,
                            format: nextFormat,
                            type: nextFormat,
                            totalPlayers: cap.totalPlayers,
                            teamSize: cap.teamSize,
                            maxSlots: cap.totalSlots,
                          });
                        }}
                        className="w-full border border-border bg-surface px-3 py-2 text-text font-medium mt-1 focus:border-gold focus:outline-none"
                      >
                        <option value="BGMI">BGMI</option>
                        <option value="Free Fire">Free Fire</option>
                        <option value="Smash Karts">Smash Karts</option>
                        <option value="Valorant">Valorant</option>
                        <option value="COD Mobile">COD Mobile</option>
                        <option value="Counter-Strike">Counter-Strike</option>
                        <option value="Pokemon Showdown">Pokemon Showdown</option>
                        <option value="Mini Militia">Mini Militia</option>
                        {gamesListState
                          .filter(g => !["bgmi", "free fire", "smash karts", "valorant", "cod mobile", "counter-strike", "pokemon showdown", "mini militia"].includes((g.name || "").toLowerCase()))
                          .map(g => (
                            <option key={g.slug || g.name} value={g.name}>{g.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div>
                      <label className="text-gold font-extrabold">Tournament Format *</label>
                      <select
                        value={editingTournament.format || editingTournament.type || ""}
                        onChange={(e) => {
                          const nextFormat = e.target.value;
                          const cap = calculateTournamentCapacity(editingTournament.game, nextFormat, editingTournament.maxSlots || null);
                          setEditingTournament({
                            ...editingTournament,
                            format: nextFormat,
                            type: nextFormat,
                            totalPlayers: cap.totalPlayers,
                            teamSize: cap.teamSize,
                            maxSlots: cap.totalSlots,
                          });
                        }}
                        className="w-full border-2 border-gold bg-surface px-3 py-2 text-gold font-extrabold mt-1 focus:border-gold focus:outline-none"
                      >
                        {getSupportedFormats(editingTournament.game).map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    {/* Editable Slots for Games without Auto Calculation */}
                    {editingTournament.game && !isAutoCalculatedGame(editingTournament.game) && (
                      <div>
                        <label className="text-gold font-extrabold">Total Slots / Teams *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="Enter slots count"
                          value={editingTournament.maxSlots || ""}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const cap = calculateTournamentCapacity(editingTournament.game, editingTournament.format, val);
                            setEditingTournament({
                              ...editingTournament,
                              maxSlots: val,
                              totalPlayers: cap.totalPlayers,
                              teamSize: cap.teamSize,
                            });
                          }}
                          className="w-full border-2 border-gold bg-surface px-3 py-2 text-gold font-extrabold mt-1 focus:border-gold focus:outline-none rounded"
                        />
                      </div>
                    )}

                    {/* Read-Only Capacity Display (ONLY FOR BGMI & FREE FIRE) */}
                    {editingTournament.game && isAutoCalculatedGame(editingTournament.game) && (
                      <div className="sm:col-span-3 bg-black/50 border border-[#00d2ff]/40 p-3 rounded space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#00d2ff] uppercase tracking-wider flex items-center gap-1.5">
                            <span>⚡ Automatic Capacity & Slots (Auto-Recalculated)</span>
                          </span>
                          <span className="text-[10px] text-text-muted">
                            Rule: <strong className="text-white">{editingTournament.game} - {editingTournament.format || editingTournament.type}</strong>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-surface p-2 rounded border border-border">
                            <span className="text-[10px] text-text-muted uppercase block">Total Players</span>
                            <span className="text-sm font-black text-gold font-display">{editingTournament.totalPlayers || 0} Players</span>
                          </div>
                          <div className="bg-surface p-2 rounded border border-border">
                            <span className="text-[10px] text-text-muted uppercase block">Team Size</span>
                            <span className="text-sm font-black text-white font-display">{editingTournament.teamSize || 1} {editingTournament.teamSize === 1 ? "Player (Solo)" : "Players/Team"}</span>
                          </div>
                          <div className="bg-surface p-2 rounded border border-border">
                            <span className="text-[10px] text-text-muted uppercase block">Total Slots</span>
                            <span className="text-sm font-black text-[#00d2ff] font-display">{editingTournament.maxSlots || editingTournament.totalSlots || 0} Slots</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-text-muted font-semibold">Prize Pool</label>
                      <input
                        type="text"
                        value={editingTournament.prizePool || ""}
                        onChange={(e) => setEditingTournament({ ...editingTournament, prizePool: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text mt-1 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted font-semibold">Entry Fee</label>
                      <input
                        type="text"
                        value={editingTournament.entryFee || ""}
                        onChange={(e) => setEditingTournament({ ...editingTournament, entryFee: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text mt-1 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted font-semibold">Date & Time</label>
                      <input
                        type="text"
                        value={editingTournament.date || ""}
                        onChange={(e) => setEditingTournament({ ...editingTournament, date: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text mt-1 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted font-semibold">Status</label>
                      <select
                        value={editingTournament.status || "Upcoming"}
                        onChange={(e) => setEditingTournament({ ...editingTournament, status: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-2 text-text mt-1 focus:border-gold focus:outline-none"
                      >
                        <option value="Registration Open">Registration Open</option>
                        <option value="Registration Closed">Registration Closed</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Live">Live</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="px-6 py-2.5 bg-gold text-ink font-display font-extrabold uppercase text-xs clip-corner-sm hover:bg-white transition-colors cursor-pointer">
                      Save Tournament Changes
                    </button>
                    <button type="button" onClick={() => setEditingTournament(null)} className="px-4 py-2.5 bg-surface border border-border text-xs text-text-muted hover:text-white cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: GAME RULES & SCORING MATRIX EDITOR */}
          {activeTab === "rules" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">Official Rulebook Editor</span>
                  <h3 className="font-display text-xl font-bold uppercase text-text">Edit Rules, Scoring System & Matrices</h3>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-text-muted font-bold">Select Game Target:</label>
                  <select
                    value={selectedGameSlug}
                    onChange={(e) => setSelectedGameSlug(e.target.value)}
                    className="border border-gold bg-surface px-4 py-2 text-xs text-gold font-extrabold rounded"
                  >
                    <option value="bgmi">BGMI</option>
                    <option value="free-fire">Free Fire MAX</option>
                    <option value="valorant">VALORANT</option>
                    <option value="cod-mobile">COD Mobile</option>
                    <option value="smash-karts">Smash Karts</option>
                    <option value="counter-strike">Counter-Strike 2</option>
                    <option value="mini-militia">Mini Militia</option>
                  </select>
                </div>
              </div>

              {/* Subtabs for Rulebook Sections */}
              <div className="flex border-b border-border bg-black/40 text-xs font-bold uppercase">
                <button
                  onClick={() => setRulesSubTab("matchRules")}
                  className={`py-2.5 px-4 transition-colors border-b-2 ${
                    rulesSubTab === "matchRules" ? "border-gold text-gold bg-surface" : "border-transparent text-text-muted"
                  }`}
                >
                  📌 Match Rules
                </button>
                <button
                  onClick={() => setRulesSubTab("scoring")}
                  className={`py-2.5 px-4 transition-colors border-b-2 ${
                    rulesSubTab === "scoring" ? "border-gold text-gold bg-surface" : "border-transparent text-text-muted"
                  }`}
                >
                  📊 Format & Scoring Matrix
                </button>
                <button
                  onClick={() => setRulesSubTab("eligibility")}
                  className={`py-2.5 px-4 transition-colors border-b-2 ${
                    rulesSubTab === "eligibility" ? "border-gold text-gold bg-surface" : "border-transparent text-text-muted"
                  }`}
                >
                  🛡️ Eligibility & Grace Period
                </button>
                <button
                  onClick={() => setRulesSubTab("penalties")}
                  className={`py-2.5 px-4 transition-colors border-b-2 ${
                    rulesSubTab === "penalties" ? "border-gold text-gold bg-surface" : "border-transparent text-text-muted"
                  }`}
                >
                  ⚖️ Penalty Matrix
                </button>
              </div>

              {/* SUBTAB A: MATCH RULES */}
              {rulesSubTab === "matchRules" && (
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-text uppercase text-base">
                    Rules List for {currentGame.name}
                  </h4>
                  <ul className="space-y-2">
                    {currentGame.matchRules.map((rule, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-3 border border-border bg-surface-raised p-3 clip-corner-sm">
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => {
                            const updated = [...currentGame.matchRules];
                            updated[idx] = e.target.value;
                            const updatedGame = { ...currentGame, matchRules: updated };
                            setCustomGameRules({ ...customGameRules, [selectedGameSlug]: updatedGame });
                            gameRules[selectedGameSlug].matchRules = updated;
                          }}
                          className="flex-1 bg-transparent text-xs text-text focus:outline-none border-b border-transparent focus:border-gold"
                        />
                        <button
                          onClick={() => handleRemoveMatchRule(idx)}
                          className="text-live text-xs font-bold uppercase hover:underline"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Add New Rule */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Type a new rule requirement for players..."
                      value={newMatchRuleText}
                      onChange={(e) => setNewMatchRuleText(e.target.value)}
                      className="flex-1 border border-border bg-surface px-3 py-2 text-xs text-text focus:border-gold focus:outline-none"
                    />
                    <button
                      onClick={handleAddMatchRule}
                      className="px-6 py-2 bg-gold text-ink font-display font-extrabold uppercase text-xs clip-corner-sm"
                    >
                      + Add Rule
                    </button>
                  </div>
                </div>
              )}

              {/* SUBTAB B: SCORING MATRIX */}
              {rulesSubTab === "scoring" && (
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-text uppercase text-base">
                    Format & Placement Points Matrix for {currentGame.name}
                  </h4>

                  <div className="space-y-2">
                    {currentGame.scoringMatrix.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 border border-border bg-surface-raised p-2.5 clip-corner-sm items-center">
                        <input
                          type="text"
                          value={item.place}
                          onChange={(e) => {
                            const updated = [...currentGame.scoringMatrix];
                            updated[idx].place = e.target.value;
                            const updatedGame = { ...currentGame, scoringMatrix: updated };
                            setCustomGameRules({ ...customGameRules, [selectedGameSlug]: updatedGame });
                            gameRules[selectedGameSlug].scoringMatrix = updated;
                          }}
                          placeholder="Placement (e.g. 1st Place)"
                          className="bg-surface border border-border px-2.5 py-1.5 text-xs text-text"
                        />
                        <input
                          type="text"
                          value={item.points}
                          onChange={(e) => {
                            const updated = [...currentGame.scoringMatrix];
                            updated[idx].points = e.target.value;
                            const updatedGame = { ...currentGame, scoringMatrix: updated };
                            setCustomGameRules({ ...customGameRules, [selectedGameSlug]: updatedGame });
                            gameRules[selectedGameSlug].scoringMatrix = updated;
                          }}
                          placeholder="Points (e.g. 15 Pts)"
                          className="bg-surface border border-border px-2.5 py-1.5 text-xs text-gold font-bold"
                        />
                        <button
                          onClick={() => handleRemoveScoringRow(idx)}
                          className="text-live text-xs font-bold uppercase hover:underline text-left sm:text-right px-2"
                        >
                          Remove Row
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Score Row Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border border-gold/30 bg-gold/10 p-3 clip-corner-sm">
                    <input
                      type="text"
                      placeholder="Placement Label (e.g. 1st Place)"
                      value={newScoreRow.place}
                      onChange={(e) => setNewScoreRow({ ...newScoreRow, place: e.target.value })}
                      className="bg-surface border border-border px-2.5 py-1.5 text-xs text-text"
                    />
                    <input
                      type="text"
                      placeholder="Points Awarded (e.g. 15 Pts)"
                      value={newScoreRow.points}
                      onChange={(e) => setNewScoreRow({ ...newScoreRow, points: e.target.value })}
                      className="bg-surface border border-border px-2.5 py-1.5 text-xs text-text"
                    />
                    <button
                      onClick={handleAddScoringRow}
                      className="bg-gold text-ink font-display font-extrabold uppercase text-xs py-1.5 clip-corner-sm"
                    >
                      + Add Scoring Row
                    </button>
                  </div>
                </div>
              )}

              {/* SUBTAB C: ELIGIBILITY & GRACE PERIOD */}
              {rulesSubTab === "eligibility" && (
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-text uppercase text-base">
                    General Eligibility, Check-In & Grace Period (All Games)
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-text-muted font-bold mb-1">Age Requirement</label>
                      <textarea
                        rows="2"
                        value={customCommonRules.eligibility.age}
                        onChange={(e) => {
                          const updated = { ...customCommonRules.eligibility, age: e.target.value };
                          setCustomCommonRules({ ...customCommonRules, eligibility: updated });
                          commonRules.eligibility.age = e.target.value;
                        }}
                        className="w-full border border-border bg-surface px-3 py-2 text-text"
                      />
                    </div>

                    <div>
                      <label className="block text-text-muted font-bold mb-1">Account & Ownership Rules</label>
                      <textarea
                        rows="2"
                        value={customCommonRules.eligibility.account}
                        onChange={(e) => {
                          const updated = { ...customCommonRules.eligibility, account: e.target.value };
                          setCustomCommonRules({ ...customCommonRules, eligibility: updated });
                          commonRules.eligibility.account = e.target.value;
                        }}
                        className="w-full border border-border bg-surface px-3 py-2 text-text"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB D: PENALTY MATRIX */}
              {rulesSubTab === "penalties" && (
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-text uppercase text-base">
                    Disciplinary Tiers & Penalties Matrix (Sections 9)
                  </h4>

                  <div className="space-y-2">
                    {customCommonRules.penalties.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 border border-border bg-surface-raised p-2.5 clip-corner-sm items-center text-xs">
                        <input
                          type="text"
                          value={item.level}
                          onChange={(e) => {
                            const updated = [...customCommonRules.penalties];
                            updated[idx].level = e.target.value;
                            setCustomCommonRules({ ...customCommonRules, penalties: updated });
                            commonRules.penalties = updated;
                          }}
                          className="bg-surface border border-border px-2 py-1 text-gold font-bold"
                        />
                        <input
                          type="text"
                          value={item.example}
                          onChange={(e) => {
                            const updated = [...customCommonRules.penalties];
                            updated[idx].example = e.target.value;
                            setCustomCommonRules({ ...customCommonRules, penalties: updated });
                            commonRules.penalties = updated;
                          }}
                          className="bg-surface border border-border px-2 py-1 text-text"
                        />
                        <input
                          type="text"
                          value={item.penalty}
                          onChange={(e) => {
                            const updated = [...customCommonRules.penalties];
                            updated[idx].penalty = e.target.value;
                            setCustomCommonRules({ ...customCommonRules, penalties: updated });
                            commonRules.penalties = updated;
                          }}
                          className="bg-surface border border-border px-2 py-1 text-text"
                        />
                        <button
                          onClick={() => handleRemovePenaltyRow(idx)}
                          className="text-live font-bold uppercase hover:underline text-left sm:text-right"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Penalty Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 border border-gold/30 bg-gold/10 p-3 clip-corner-sm text-xs">
                    <input
                      type="text"
                      placeholder="Level (e.g. Level 6)"
                      value={newPenaltyRow.level}
                      onChange={(e) => setNewPenaltyRow({ ...newPenaltyRow, level: e.target.value })}
                      className="bg-surface border border-border px-2 py-1 text-text"
                    />
                    <input
                      type="text"
                      placeholder="Violation Example"
                      value={newPenaltyRow.example}
                      onChange={(e) => setNewPenaltyRow({ ...newPenaltyRow, example: e.target.value })}
                      className="bg-surface border border-border px-2 py-1 text-text"
                    />
                    <input
                      type="text"
                      placeholder="Penalty Action"
                      value={newPenaltyRow.penalty}
                      onChange={(e) => setNewPenaltyRow({ ...newPenaltyRow, penalty: e.target.value })}
                      className="bg-surface border border-border px-2 py-1 text-text"
                    />
                    <button
                      onClick={handleAddPenaltyRow}
                      className="bg-gold text-ink font-display font-extrabold uppercase py-1 clip-corner-sm"
                    >
                      + Add Level
                    </button>
                  </div>
                </div>
              )}

              {/* SAVE RULEBOOK BUTTON */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={handleSaveRulebookGlobally}
                  className="w-full py-3 bg-gold text-ink font-display font-extrabold uppercase text-sm tracking-wider hover:bg-white transition-colors clip-corner-sm"
                >
                  💾 SAVE ALL RULEBOOK & MATRIX CHANGES LIVE
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTRATIONS */}
          {activeTab === "registrations" && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-gold uppercase">Team Registrations & Payment Verification</h3>
              
              <div className="overflow-x-auto border border-border bg-surface-raised clip-corner-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-black/40 font-display uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="px-4 py-3">Team Name</th>
                      <th className="px-4 py-3">Captain Name</th>
                      <th className="px-4 py-3">WhatsApp / Mobile</th>
                      <th className="px-4 py-3">In-Game ID</th>
                      <th className="px-4 py-3">Transaction Ref</th>
                      <th className="px-4 py-3">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {registrations.map((r) => (
                      <tr key={r._id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-bold text-text">{r.teamName}</td>
                        <td className="px-4 py-3 text-text-muted">{r.captainName}</td>
                        <td className="px-4 py-3 text-text-muted">{r.captainPhone}</td>
                        <td className="px-4 py-3 font-mono text-gold">{r.inGameId}</td>
                        <td className="px-4 py-3 text-text-muted">{r.transactionId || "N/A"}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => togglePaymentStatus(r._id, r.paymentStatus)}
                            className={`px-3 py-1 rounded text-xs font-bold ${
                              r.paymentStatus === "Verified"
                                ? "bg-open/20 text-open border border-open/40"
                                : "bg-gold/20 text-gold border border-gold/40"
                            }`}
                          >
                            {r.paymentStatus} (Click to toggle)
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ROOM CREDENTIALS */}
          {activeTab === "room" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-lg font-bold text-gold uppercase">Publish &amp; Manage Room Credentials</h3>
                <p className="text-xs text-text-muted">Select a scheduled match or tournament to publish Room ID and Password, or delete existing published room credentials.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form to Publish Room Credentials */}
                <form onSubmit={handlePublishRoom} className="border border-border bg-surface-raised p-5 space-y-4 clip-corner-sm h-fit">
                  <h4 className="font-display font-bold text-white uppercase text-sm">+ Publish Room Credentials</h4>
                  <div>
                    <label className="block text-xs text-text-muted mb-1 font-semibold">Select Tournament / Match *</label>
                    <select
                      required
                      value={roomData.matchId}
                      onChange={(e) => setRoomData({ ...roomData, matchId: e.target.value })}
                      className="w-full border border-border bg-surface px-3 py-2 text-xs text-text font-bold focus:border-gold focus:outline-none"
                    >
                      <option value="">-- Choose Tournament / Match --</option>
                      {tournamentsList.map(t => (
                        <option key={t._id || t.id} value={t._id || t.id}>
                          {t.name} - {t.game} ({t.date || "TBD"})
                        </option>
                      ))}
                      {matches.length > 0 && <optgroup label="Scheduled Matches" />}
                      {matches.map(m => (
                        <option key={m._id} value={m._id}>
                          {m.tournamentName} - Match #{m.matchNumber} ({m.time})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-text-muted mb-1 font-semibold">Room ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 8472910"
                      value={roomData.roomId}
                      onChange={(e) => setRoomData({ ...roomData, roomId: e.target.value })}
                      className="w-full border border-border bg-surface px-3 py-2 text-xs text-text font-mono focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-text-muted mb-1 font-semibold">Room Password *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. bgmi2026"
                      value={roomData.roomPassword}
                      onChange={(e) => setRoomData({ ...roomData, roomPassword: e.target.value })}
                      className="w-full border border-border bg-surface px-3 py-2 text-xs text-text font-mono focus:border-gold focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gold text-ink font-display font-extrabold uppercase text-xs clip-corner-sm hover:bg-white transition-colors cursor-pointer"
                  >
                    🚀 Publish Room Credentials Now
                  </button>
                </form>

                {/* Active Published Credentials List with Delete Option */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="font-display font-bold text-white uppercase text-sm">Published Room Credentials</h4>
                    <span className="text-xs text-gold font-bold">
                      Active ({[...tournamentsList, ...matches].filter(i => i.roomId && i.isRoomPublished).length})
                    </span>
                  </div>

                  {([...tournamentsList, ...matches].filter(i => i.roomId && i.isRoomPublished).length === 0) ? (
                    <div className="border border-border bg-surface p-8 text-center clip-corner-sm space-y-2">
                      <div className="text-2xl">🔑</div>
                      <div className="font-bold text-white text-xs uppercase">No Published Room Credentials</div>
                      <p className="text-[11px] text-text-muted">Use the form on the left to publish Room ID &amp; Password for upcoming matches.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {[...tournamentsList, ...matches]
                        .filter((item, idx, self) => item.roomId && item.isRoomPublished && self.findIndex(i => (i._id || i.id) === (item._id || item.id)) === idx)
                        .map((item) => (
                          <div key={item._id || item.id} className="border border-gold/40 bg-surface p-4 clip-corner-sm space-y-3 relative hover:border-gold transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">{item.game || "Esports Arena"}</span>
                                <h5 className="font-bold text-white text-sm">{item.name || item.tournamentName}</h5>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteRoomCredentials(item._id || item.id)}
                                className="px-2.5 py-1 bg-live/10 border border-live/30 text-live text-xs font-bold rounded hover:bg-live hover:text-white transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                              >
                                🗑️ Delete Credentials
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 bg-surface-raised p-2.5 rounded border border-border/80 text-xs">
                              <div>
                                <span className="text-[10px] text-text-muted uppercase block font-semibold">Room ID</span>
                                <span className="font-mono font-bold text-gold text-sm">{item.roomId}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-text-muted uppercase block font-semibold">Password</span>
                                <span className="font-mono font-bold text-[#00d2ff] text-sm">{item.roomPassword}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-lg font-bold text-gold uppercase">Post &amp; Manage Announcements</h3>
                <p className="text-xs text-text-muted">Publish platform updates or delete old announcements live for all visitors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Post Announcement Form */}
                <form onSubmit={handlePostAnnouncement} className="border border-border bg-surface-raised p-5 space-y-4 clip-corner-sm h-fit">
                  <h4 className="font-display font-bold text-white uppercase text-sm">+ Post Official Platform Announcement</h4>

                  <div>
                    <label className="block text-xs text-text-muted mb-1 font-semibold">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Room details for BGMI Cup released"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      className="w-full border border-border bg-surface px-3 py-2 text-xs text-text focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-text-muted mb-1 font-semibold">Details / Content</label>
                    <textarea
                      rows="3"
                      placeholder="Provide notification details for players..."
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      className="w-full border border-border bg-surface px-3 py-2 text-xs text-text focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-text-muted mb-1 font-semibold">Game Scope</label>
                      <select
                        value={announcementForm.scope}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, scope: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-1.5 text-xs text-text focus:border-gold focus:outline-none"
                      >
                        <option value="All">All Games</option>
                        <option value="BGMI">BGMI</option>
                        <option value="Free Fire">Free Fire</option>
                        <option value="Valorant">Valorant</option>
                        <option value="COD Mobile">COD Mobile</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1 font-semibold">Priority</label>
                      <select
                        value={announcementForm.priority}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                        className="w-full border border-border bg-surface px-3 py-1.5 text-xs text-text focus:border-gold focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gold text-ink font-display font-extrabold uppercase text-xs clip-corner-sm hover:bg-white transition-colors cursor-pointer"
                  >
                    📢 Publish Announcement
                  </button>
                </form>

                {/* Published Announcements List with Delete Option */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="font-display font-bold text-white uppercase text-sm">Published Announcements</h4>
                    <span className="text-xs text-gold font-bold">Total ({announcementsList.length})</span>
                  </div>

                  {announcementsList.length === 0 ? (
                    <div className="border border-border bg-surface p-8 text-center clip-corner-sm space-y-2">
                      <div className="text-2xl">📢</div>
                      <div className="font-bold text-white text-xs uppercase">No Announcements Published</div>
                      <p className="text-[11px] text-text-muted">Use the form on the left to publish updates to players.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {announcementsList.map((ann) => (
                        <div key={ann.id || ann._id} className="border border-border bg-surface p-4 clip-corner-sm space-y-2 relative hover:border-gold/40 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${ann.priority === "high" ? "bg-live" : ann.priority === "medium" ? "bg-[#00d2ff]" : "bg-gold"}`} />
                              <h5 className="font-bold text-white text-xs">{ann.title}</h5>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteAnnouncement(ann.id || ann._id)}
                              className="px-2.5 py-1 bg-live/10 border border-live/30 text-live text-xs font-bold rounded hover:bg-live hover:text-white transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              🗑️ Delete Announcement
                            </button>
                          </div>

                          {ann.content && (
                            <p className="text-xs text-text-muted bg-surface-raised p-2 rounded border border-border/50">
                              {ann.content}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-text-muted/80 pt-1">
                            <span className="bg-surface-raised px-2 py-0.5 rounded border border-border/60 text-gold font-semibold">{ann.scope || "All Games"}</span>
                            <span>{ann.time || "Recent"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "games" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-lg font-bold text-gold uppercase"> Manage Game Arenas</h3>
                <p className="text-xs text-text-muted">Add new esports titles or delete existing arenas from the homepage grid.</p>
              </div>

              {/* Add Game Form */}
              <form onSubmit={handleCreateGame} className="max-w-xl space-y-4 border border-border bg-surface-raised p-5 clip-corner-sm">
                <h4 className="font-display font-bold text-white uppercase text-sm">+ Add New Game Arena</h4>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Game Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EA FC 24 or PUBG Mobile"
                    value={newGameForm.name}
                    onChange={(e) => setNewGameForm({ ...newGameForm, name: e.target.value })}
                    className="w-full border border-border bg-surface px-3 py-2 text-xs text-text focus:border-[#00d2ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Category / Mode *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Battle Royale, Tactical FPS, Sports"
                    value={newGameForm.category}
                    onChange={(e) => setNewGameForm({ ...newGameForm, category: e.target.value })}
                    className="w-full border border-border bg-surface px-3 py-2 text-xs text-text focus:border-[#00d2ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Banner Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or any image link"
                    value={newGameForm.image}
                    onChange={(e) => setNewGameForm({ ...newGameForm, image: e.target.value })}
                    className="w-full border border-border bg-surface px-3 py-2 text-xs text-text focus:border-[#00d2ff] focus:outline-none"
                  />
                  {newGameForm.image && (
                    <div className="mt-2 relative h-28 w-full overflow-hidden border border-[#00d2ff]/40 rounded bg-black/50">
                      <img
                        src={newGameForm.image}
                        alt="Banner Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/bgmi.jpg";
                        }}
                      />
                      <div className="absolute bottom-1 right-2 text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-[#00d2ff] font-bold">
                        Live Preview
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00d2ff] text-ink font-display font-extrabold uppercase text-xs clip-corner-sm hover:brightness-110 shadow-md cursor-pointer"
                >
                   Publish New Game Arena →
                </button>
              </form>

              {/* Game Arenas Management List */}
              <div className="space-y-3 pt-2">
                <h4 className="font-display font-bold text-white uppercase text-sm">Existing Game Arenas ({gamesListState.length})</h4>
                <div className="grid grid-cols-1 gap-3">
                  {gamesListState.map((g) => {
                    const currentImg = g.image || `/images/${g.slug}.jpg`;
                    const isEditing = editingGameBannerSlug === g.slug;

                    return (
                      <div key={g.slug} className="border border-border bg-surface p-3 clip-corner-sm space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={currentImg}
                              alt={g.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/images/bgmi.jpg";
                              }}
                              className="w-16 h-12 rounded object-cover border border-border/80 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-white text-sm truncate">{g.name}</div>
                              <div className="text-xs text-[#00d2ff]">{g.category}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (isEditing) {
                                  setEditingGameBannerSlug(null);
                                } else {
                                  setEditingGameBannerSlug(g.slug);
                                  setEditGameBannerUrl(g.image || "");
                                }
                              }}
                              className="px-3 py-1 bg-surface border border-gold/40 text-gold text-xs font-bold rounded hover:bg-gold hover:text-ink transition-colors cursor-pointer"
                            >
                              {isEditing ? "✕ Cancel" : "📸 Change Banner"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGame(g.slug)}
                              className="px-3 py-1 bg-live/10 border border-live/30 text-live text-xs font-bold rounded hover:bg-live hover:text-white transition-colors cursor-pointer"
                            >
                              🗑️ Delete Arena
                            </button>
                          </div>
                        </div>

                        {/* Inline Banner Editor */}
                        {isEditing && (
                          <div className="border border-gold/40 bg-surface-raised p-3 rounded space-y-2">
                            <label className="block text-xs font-bold text-gold">New Banner Image URL for "{g.name}":</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="Paste image link e.g. https://images.unsplash.com/..."
                                value={editGameBannerUrl}
                                onChange={(e) => setEditGameBannerUrl(e.target.value)}
                                className="flex-1 border border-border bg-surface px-3 py-1.5 text-xs text-text focus:border-gold focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateGameBanner(g)}
                                className="px-4 py-1.5 bg-gold text-ink text-xs font-extrabold uppercase rounded hover:bg-white transition-colors cursor-pointer"
                              >
                                💾 Save Banner
                              </button>
                            </div>
                            {editGameBannerUrl && (
                              <div className="relative h-24 w-full overflow-hidden border border-border rounded mt-2">
                                <img
                                  src={editGameBannerUrl}
                                  alt="Preview"
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/bgmi.jpg";
                                  }}
                                />
                                <div className="absolute bottom-1 right-2 text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-gold font-bold">
                                  Live Preview
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: HERO BANNER STATS */}
          {activeTab === "hero" && (
            <div className="space-y-6 max-w-xl">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-lg font-bold text-gold uppercase">⚡ Hero Banner Stats Settings</h3>
                <p className="text-xs text-text-muted">Customize the 3 main display statistics highlighted on your homepage hero section.</p>
              </div>

              <form onSubmit={handleSaveHeroStats} className="border border-border bg-surface-raised p-5 space-y-4 clip-corner-sm">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Prize Pools Live Stat (Left)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹18K+ or ₹50K+"
                    value={heroStatsForm.prizePool}
                    onChange={(e) => setHeroStatsForm({ ...heroStatsForm, prizePool: e.target.value })}
                    className="w-full border border-border bg-surface px-3 py-2 text-xs font-bold text-[#00d2ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Teams Competing Stat (Center)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 120+ or 500+"
                    value={heroStatsForm.teamsCount}
                    onChange={(e) => setHeroStatsForm({ ...heroStatsForm, teamsCount: e.target.value })}
                    className="w-full border border-border bg-surface px-3 py-2 text-xs font-bold text-[#00d2ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Games Supported Stat (Right)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7 or 10"
                    value={heroStatsForm.gamesCount}
                    onChange={(e) => setHeroStatsForm({ ...heroStatsForm, gamesCount: e.target.value })}
                    className="w-full border border-border bg-surface px-3 py-2 text-xs font-bold text-[#00d2ff]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold text-ink font-display font-extrabold uppercase text-xs clip-corner-sm hover:bg-white transition-colors cursor-pointer"
                >
                  💾 Save Hero Banner Stats Live →
                </button>
              </form>
            </div>
          )}

          {/* TAB: PLAYER FEEDBACKS */}
          {activeTab === "feedbacks" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-gold uppercase"> Player Feedbacks &amp; Reviews</h3>
                  <p className="text-xs text-text-muted">User submissions received from the homepage feedback form.</p>
                </div>
                <span className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded border border-gold/30">
                  Total Reviews ({feedbacksList.length})
                </span>
              </div>

              {feedbacksList.length === 0 ? (
                <div className="border border-border bg-surface p-8 text-center clip-corner space-y-2">
                  <div className="text-3xl"></div>
                  <div className="font-bold text-white text-sm">No Feedbacks Submitted Yet</div>
                  <div className="text-xs text-text-muted">User reviews submitted on the homepage will appear here.</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {feedbacksList.map((fb) => (
                    <div key={fb._id} className="border border-border bg-surface p-4 clip-corner-sm space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-sm">{fb.name}</span>
                          <span className="text-xs text-text-muted ml-2">({fb.email})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gold">{"".repeat(Number(fb.rating) || 5)}</span>
                          <button
                            onClick={() => handleDeleteFeedback(fb._id)}
                            className="text-xs text-live font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-text-muted bg-surface-raised p-2.5 rounded border border-border/60">
                        "{fb.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
