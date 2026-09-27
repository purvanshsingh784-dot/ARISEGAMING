# Build plan / progress

- [x] Step 1: Project structure (client/server monorepo)
- [x] Step 2: Esports visual design system (tokens in index.css)
- [x] Step 3: Homepage (Hero, GameSelection, UpcomingTournaments, LiveMatches, Announcements, Navbar, Footer)
- [ ] Step 4: Game pages (/games/:slug)
- [ ] Step 5: Tournament details page
- [ ] Step 6: Registration system (individual + dynamic team-size form)
- [ ] Step 7: MongoDB models (server/models)
- [ ] Step 8: Connect registration form to backend API
- [ ] Step 9: Admin authentication (JWT, bcrypt password hashing)
- [ ] Step 10: Admin dashboard shell + stats
- [ ] Step 11: Tournament management (CRUD)
- [ ] Step 12: Participant/team management
- [ ] Step 13: Match management (room ID/password publish gate, countdown)
- [ ] Step 14: Scoring engine (config-driven, per spec §23-25)
- [ ] Step 15: Leaderboard (server-computed, tie-break rules)
- [ ] Step 16: Announcement system
- [ ] Step 17: UPI/payment gateway integration (server-verified only)
- [ ] Step 18: Phone confirmation service (abstracted notificationService)
- [ ] Step 19: Security hardening (rate limiting, validation, audit log)
- [ ] Step 20: Testing
- [ ] Step 21: Deployment (Vercel / Render / MongoDB Atlas)

## Credentials needed later (not before Step 17-18)
- Payment gateway (Razorpay or similar) API key/secret
- SMS/WhatsApp provider (e.g. Twilio, Gupshup) credentials
- MongoDB Atlas connection string
- Admin JWT secret (can be generated, doesn't need to come from you)
