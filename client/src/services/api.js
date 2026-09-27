const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // Auth
    async login(email, password) {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    async registerUser(username, email, password) {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        return res.json();
    },

    // Tournaments
    async getTournaments(params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/tournaments${query ? `?${query}` : ""}`;
        const res = await fetch(url);
        return res.json();
    },

    async getTournamentById(id) {
        const res = await fetch(`${API_BASE_URL}/tournaments/${id}`);
        return res.json();
    },

    async createTournament(data) {
        const res = await fetch(`${API_BASE_URL}/tournaments`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async updateTournament(id, data) {
        const res = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async deleteTournament(id) {
        const res = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return res.json();
    },

    // Registrations
    async registerForTournament(tournamentId, payload) {
        const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        return res.json();
    },

    async getRegistrations(tournamentId) {
        const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations`, {
            headers: getHeaders()
        });
        return res.json();
    },

    // Matches
    async getMatches(params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/matches${query ? `?${query}` : ""}`;
        const res = await fetch(url);
        return res.json();
    },

    async publishRoomCredentials(matchId, roomId, roomPassword) {
        const res = await fetch(`${API_BASE_URL}/matches/${matchId}/room`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ roomId, roomPassword })
        });
        return res.json();
    },

    async deleteRoomCredentials(matchId) {
        const res = await fetch(`${API_BASE_URL}/matches/${matchId}/room`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return res.json();
    },

    // Announcements
    async getAnnouncements(scope = "") {
        const url = `${API_BASE_URL}/announcements${scope ? `?scope=${scope}` : ""}`;
        const res = await fetch(url);
        return res.json();
    },

    async createAnnouncement(data) {
        const res = await fetch(`${API_BASE_URL}/announcements`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async deleteAnnouncement(id) {
        const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return res.json();
    },

    // Games
    async getGames() {
        const res = await fetch(`${API_BASE_URL}/games`);
        return res.json();
    },

    async createGame(data) {
        const res = await fetch(`${API_BASE_URL}/games`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async deleteGame(slug) {
        const res = await fetch(`${API_BASE_URL}/games/${slug}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return res.json();
    },

    // Stats
    async getStats() {
        const res = await fetch(`${API_BASE_URL}/stats`);
        return res.json();
    },

    async updateStats(data) {
        const res = await fetch(`${API_BASE_URL}/stats`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // Feedbacks
    async getFeedbacks() {
        const res = await fetch(`${API_BASE_URL}/feedback`);
        return res.json();
    },

    async sendFeedback(data) {
        const res = await fetch(`${API_BASE_URL}/feedback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async deleteFeedback(id) {
        const res = await fetch(`${API_BASE_URL}/feedback/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return res.json();
    },

    // Leaderboards
    async getLeaderboard(tournamentId) {
        const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/leaderboard`);
        return res.json();
    },

    async submitScores(tournamentId, scores) {
        const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/scores`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ scores })
        });
        return res.json();
    }
};

export default api;
