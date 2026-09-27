import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/homepage/Hero";
import GameSelection from "./components/homepage/GameSelection";
import UpcomingTournaments from "./components/homepage/UpcomingTournaments";
import LiveMatches from "./components/homepage/LiveMatches";
import Announcements from "./components/homepage/Announcements";
import FeedbackSection from "./components/homepage/FeedbackSection";
import ScrollBackground from "./components/layout/ScrollBackground";
import GameRulesModal from "./components/ui/GameRulesModal";
import RegistrationModal from "./components/ui/RegistrationModal";
import OrganizerLoginModal from "./components/ui/OrganizerLoginModal";
import OrganizerDashboardModal from "./components/ui/OrganizerDashboardModal";
import api from "./services/api";
import {
  tournaments as defaultTournaments,
  announcements as defaultAnnouncements,
  games as defaultGames,
  liveMatches as defaultMatches,
} from "./data/seedData";

function App() {
  const [activeRulesGame, setActiveRulesGame] = useState(null);
  const [activeRegistrationTarget, setActiveRegistrationTarget] = useState(null);

  // Global live states
  const [heroStats, setHeroStats] = useState(null);
  const [tournamentsList, setTournamentsList] = useState(defaultTournaments);
  const [announcementsList, setAnnouncementsList] = useState(defaultAnnouncements);
  const [gamesList, setGamesList] = useState(defaultGames);
  const [liveMatchesList, setLiveMatchesList] = useState(defaultMatches);

  // Organizer state
  const [isOrganizerLoggedIn, setIsOrganizerLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);

  const deduplicateTournaments = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter(t => {
      if (!t || !t.name) return false;
      const key = String(t._id || t.id || `${t.game}_${t.name}_${t.format}_${t.date}`);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const deduplicateGames = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter(g => {
      if (!g || !g.slug) return false;
      const key = g.slug.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const fetchAllData = async () => {
    try {
      const resStats = await api.getStats();
      if (resStats && resStats.success && resStats.data) {
        setHeroStats(resStats.data);
      } else {
        const saved = JSON.parse(localStorage.getItem("arise_hero_stats") || "null");
        if (saved) setHeroStats(saved);
      }
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem("arise_hero_stats") || "null");
      if (saved) setHeroStats(saved);
    }

    try {
      const resT = await api.getTournaments();
      if (resT.success && Array.isArray(resT.data)) {
        setTournamentsList(deduplicateTournaments(resT.data));
      } else {
        const saved = JSON.parse(localStorage.getItem("arise_tournaments") || "[]");
        setTournamentsList(deduplicateTournaments(saved));
      }
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem("arise_tournaments") || "[]");
      setTournamentsList(deduplicateTournaments(saved));
    }

    try {
      const resA = await api.getAnnouncements();
      if (resA.success && resA.data && resA.data.length > 0) {
        setAnnouncementsList(resA.data);
      } else {
        const saved = JSON.parse(localStorage.getItem("arise_announcements") || "null");
        if (saved && saved.length > 0) setAnnouncementsList(saved);
      }
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem("arise_announcements") || "null");
      if (saved && saved.length > 0) setAnnouncementsList(saved);
    }

    try {
      const resG = await api.getGames();
      if (resG.success && resG.data && resG.data.length > 0) {
        setGamesList(deduplicateGames(resG.data));
      } else {
        const saved = JSON.parse(localStorage.getItem("arise_games") || "null");
        if (saved && saved.length > 0) setGamesList(deduplicateGames(saved));
      }
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem("arise_games") || "null");
      if (saved && saved.length > 0) setGamesList(deduplicateGames(saved));
    }

    try {
      const resM = await api.getMatches();
      if (resM.success && resM.data && resM.data.length > 0) {
        setLiveMatchesList(resM.data);
      }
    } catch (e) {
      /* use default */
    }
  };

  useEffect(() => {
    // Clear legacy pre-seeded mock tournament data from browser localStorage if present
    try {
      const saved = JSON.parse(localStorage.getItem("arise_tournaments") || "[]");
      if (Array.isArray(saved) && saved.some(t => t.id === "t_bgmi_solo_champ" || t.id === "t_bgmi_night_cup" || t.id === "t_free_fire_solo")) {
        localStorage.removeItem("arise_tournaments");
      }
    } catch (e) {}

    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsOrganizerLoggedIn(true);
    }
    fetchAllData();
  }, []);

  const handleOpenRules = (gameSlug) => {
    setActiveRulesGame(gameSlug);
  };

  const handleRegisterTournament = (tournament) => {
    setActiveRegistrationTarget(tournament);
  };

  const handleProceedToRegistration = (gameSlug) => {
    setActiveRulesGame(null);
    const matched = tournamentsList.find(
      (t) =>
        t.game.toLowerCase().replace(/\s+/g, "-") === gameSlug.toLowerCase() ||
        t.game.toLowerCase().includes(gameSlug.toLowerCase())
    );
    setActiveRegistrationTarget(
      matched || { gameSlug, game: gameSlug, name: `${gameSlug.toUpperCase()} TOURNAMENT` }
    );
  };

  const handleLoginSuccess = () => {
    setIsOrganizerLoggedIn(true);
    setShowLoginModal(false);
    setShowDashboardModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsOrganizerLoggedIn(false);
    setShowDashboardModal(false);
  };

  const handleTournamentsUpdated = (newList) => {
    setTournamentsList([...newList]);
    fetchAllData();
  };

  const handleAnnouncementsUpdated = (newList) => {
    setAnnouncementsList([...newList]);
    fetchAllData();
  };

  const handleGamesUpdated = (newList) => {
    setGamesList([...newList]);
    fetchAllData();
  };

  // Derive live/upcoming matches dynamically from tournaments
  const computeLiveMatches = () => {
    if (!tournamentsList || tournamentsList.length === 0) return liveMatchesList;
    
    const now = new Date();
    const oneHourMs = 60 * 60 * 1000;
    
    const computedMatches = tournamentsList
      .filter(t => {
        if (t.status === "Completed") return false;
        
        // Try parsing the date string
        const tDate = new Date(t.date);
        if (isNaN(tDate.getTime())) {
          return t.status === "Live" || t.status === "Upcoming";
        }
        
        const diff = tDate.getTime() - now.getTime();
        // Return if it's currently live (started recently) or scheduled within the next 1 hour
        return diff <= oneHourMs && diff >= -(6 * 60 * 60 * 1000); 
      })
      .map(t => {
        const tDate = new Date(t.date);
        let currentStatus = t.status;
        
        if (!isNaN(tDate.getTime())) {
          const diff = tDate.getTime() - now.getTime();
          if (diff <= 0) currentStatus = "Live";
          else if (diff <= oneHourMs) currentStatus = "Upcoming";
        }
        
        return {
          id: t._id || t.id,
          tournamentName: t.name,
          matchNumber: 1,
          time: t.date || "TBD",
          status: currentStatus === "Live" ? "Live" : "Scheduled"
        };
      });

      return computedMatches.length > 0 ? computedMatches : liveMatchesList;
  };

  return (
    <div className="min-h-screen bg-ink font-body text-text relative overflow-x-hidden">
      <ScrollBackground />
      <Navbar
        onOpenOrganizerLogin={() => setShowLoginModal(true)}
        onOpenOrganizerDashboard={() => setShowDashboardModal(true)}
        isOrganizerLoggedIn={isOrganizerLoggedIn}
      />
      <main className="relative z-10">
        <Hero heroStats={heroStats} gamesList={gamesList} />
        <GameSelection gamesList={gamesList} onSelectGame={handleOpenRules} />
        <UpcomingTournaments tournamentsList={tournamentsList} onRegister={handleRegisterTournament} />
        <LiveMatches matchesList={computeLiveMatches()} />
        <Announcements announcementsList={announcementsList} />
        <FeedbackSection />
      </main>
      <Footer className="relative z-10" />

      {/* Rules Modal */}
      {activeRulesGame && (
        <GameRulesModal
          gameSlug={activeRulesGame}
          gamesList={gamesList}
          tournamentsList={tournamentsList}
          onClose={() => setActiveRulesGame(null)}
          onProceedToRegister={handleProceedToRegistration}
          onRegisterTournament={handleRegisterTournament}
        />
      )}

      {/* Registration Form Modal */}
      {activeRegistrationTarget && (
        <RegistrationModal
          target={activeRegistrationTarget}
          onClose={() => setActiveRegistrationTarget(null)}
        />
      )}

      {/* Organizer Login Modal */}
      {showLoginModal && (
        <OrganizerLoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Organizer Dashboard Modal */}
      {showDashboardModal && (
        <OrganizerDashboardModal
          gamesListProp={gamesList}
          onClose={() => setShowDashboardModal(false)}
          onLogout={handleLogout}
          onTournamentsUpdated={handleTournamentsUpdated}
          onAnnouncementsUpdated={handleAnnouncementsUpdated}
          onGamesUpdated={handleGamesUpdated}
          onDataRefresh={fetchAllData}
        />
      )}
    </div>
  );
}

export default App;
