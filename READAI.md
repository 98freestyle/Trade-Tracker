# Trade Tracker - Context

## What It Is
Full-stack web app for tracking stock trades with automatic P&L calculations, deposit tracking, and performance analytics. Built as a modern alternative to Excel/Google Sheets for active traders.

## Tech Stack
- **Backend:** FastAPI + SQLite + SQLAlchemy
- **Frontend:** React + Vite + Tailwind CSS
- **Auth:** JWT with Argon2 password hashing
- **Deployment:** Backend as systemd service (port 8002), frontend via nginx

## File Structure
```
.
├── READAI.md
├── README.md
├── backend/
│   ├── READAI.md
│   ├── auth.py              # JWT & password hashing
│   ├── database.py          # DB connection
│   ├── main.py              # FastAPI app entry, CORS, router includes
│   ├── models.py            # User, Trade, Deposit models
│   ├── requirements.txt
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # Register, login, user endpoints
│   │   ├── deposits.py      # Deposit CRUD
│   │   └── trades.py        # Trade CRUD + auto P&L calculation
│   ├── seed_data.py         # Real Stake data (24 trades, 5 deposits)
│   └── tradetracker.db      # SQLite database
└── frontend/
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public/
    ├── src/
    │   ├── App.jsx              # React Router with protected routes
    │   ├── components/
    │   │   ├── DepositForm.jsx  # Modal for add deposits
    │   │   ├── Navbar.jsx       # Navigation with active link styling
    │   │   ├── StatCard.jsx     # Reusable stat display component
    │   │   ├── TradeForm.jsx    # Modal for add/edit trades
    │   │   └── TradeTable.jsx   # Reusable trades table component
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Main overview with stats + tables
    │   │   ├── Analytics.jsx    # Performance analysis & breakdowns
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   └── services/
    │       └── api.js           # Axios with JWT interceptor
    ├── tailwind.config.js
    └── vite.config.js
```

## What's Built
✅ Auth system (register, login, JWT tokens)
✅ Trade CRUD with auto P&L calculation (including brokerage fees)
✅ Deposit tracking (add, view, delete)
✅ Dashboard with stats: Total P&L, Win Rate, ROI, Account Value
✅ Analytics page with P&L by ticker, best/worst trades, avg win/loss
✅ Edit/delete trades from UI
✅ Modal forms for data entry
✅ Clean navigation with separate pages
✅ Dark theme UI
✅ Real Stake trade data loaded in seed

## What's NOT Built Yet
❌ Charts/visualizations (P&L over time, performance graphs)
❌ CSV/PDF export for tax purposes
❌ Trade filtering or search
❌ Mobile optimization
❌ Toast notifications
❌ Loading states
❌ Error boundaries

## Known Issues
- No database migrations (schema changes = manual fix or DB reset)
- CORS allows all origins
- No rate limiting
- JWT secret is placeholder
- No pagination (breaks with 1000+ trades)
- No input validation on forms
- ~$2 discrepancy in seed data vs Stake (likely Stake-side rounding)

---

## Development Roadmap

### Phase 1: Build Features (Current Focus)
**Goal:** Get all functionality working on happy path

#### Priority Order:
1. **Charts & Visualizations**
   - P&L over time line chart
   - Win rate trends
   - Monthly performance breakdown
   
2. **Export Functionality**
   - Export trades to CSV
   - Export to PDF for tax purposes
   - Date range filtering for exports

3. **Filtering & Search**
   - Filter trades by symbol, date range, P&L
   - Search trades
   - Sort by any column

4. **Advanced Analytics**
   - Performance by ticker
   - Monthly breakdown
   - Risk/reward metrics
   - Drawdown analysis

**Why first?** Need to know what we're building before we can protect it. Features change quickly early on.

---

### Phase 2: Polish & UX
**Goal:** Make it feel professional

- [ ] Loading states on all actions
- [ ] Toast notifications (react-hot-toast)
- [ ] Better empty states
- [ ] User-friendly error messages
- [ ] Floating FAB buttons for quick actions
- [ ] Page transitions (Framer Motion)
- [ ] Mobile responsive design
- [ ] PWA support

**Why now?** Features are locked in, so we can polish the UX properly without rework.

---

### Phase 3: Harden Security & Data
**Goal:** Make it production-ready

#### Security:
- [ ] Change JWT secret from placeholder to real secret
- [ ] Add rate limiting (prevent spam/abuse)
- [ ] CORS - restrict to actual domain (not `*`)
- [ ] Input validation on all endpoints (prevent SQL injection, XSS)
- [ ] Password requirements (min length, complexity)
- [ ] Secure password reset flow
- [ ] HTTPS in production

#### Data Integrity:
- [ ] Database migrations (Alembic)
- [ ] Pagination for trades/deposits
- [ ] Data validation before saving
- [ ] Prevent duplicate trades
- [ ] Handle null/undefined properly
- [ ] Backup strategy

#### Error Handling:
- [ ] Try/catch blocks in all API calls
- [ ] Network error handling (offline mode)
- [ ] 404 page for bad routes
- [ ] Error boundaries in React
- [ ] Proper logging

#### Edge Cases:
- [ ] Open trade handling improvements
- [ ] Negative balance scenarios
- [ ] Timezone handling for dates
- [ ] Slow/failed API responses
- [ ] Large dataset performance

**Why last?** This stuff rarely changes once set up. Do it once when ready to ship.

---

### Phase 4: Testing & Monitoring
**Goal:** Keep it running smoothly

- [ ] Real user testing
- [ ] Bug fixes from production
- [ ] Performance monitoring
- [ ] Automated backups
- [ ] Analytics tracking

---

## Page Structure

### `/dashboard` - Main Hub
**Purpose:** Daily check-in, quick overview
- 4 main stat cards: Deposited, P&L, Account Value, ROI
- Secondary stats: Total Trades, Win Rate, Open Positions
- Full trades table (sortable, with actions)
- Full deposits table
- Quick action buttons: Add Trade, Add Deposit

### `/analytics` - Performance Deep Dive
**Purpose:** Analyze and improve trading performance
- Average win/loss metrics
- Win/loss ratio
- P&L by ticker (sortable table)
- Best 5 trades
- Worst 5 trades
- *Coming: Charts, trends, advanced breakdowns*

### `/settings` (Future)
**Purpose:** Account preferences, data management
- Export data
- Account settings
- Theme preferences
- Dark mode toggle

---

## Dev Workflow

**Restart backend:**
```bash
sudo systemctl restart tradetracker
sudo journalctl -u tradetracker -n 50  # check logs
```

**Frontend build:**
```bash
cd frontend && npm run build
# nginx auto-serves from dist/
```

**Reset database (nukes all data):**
```bash
rm backend/tradetracker.db
sudo systemctl restart tradetracker
python backend/seed_data.py  # loads real Stake data
```

**Test credentials:** test@test.com / test123

---

## Important Notes
- Database: `/home/tradetracker/Trade-Tracker/backend/tradetracker.db`
- All values in USD only
- P&L formula: (exit - entry) × shares - brokerage_fee
- Brokerage fees: $6 per trade ($3 buy + $3 sell)
- Tokens stored in localStorage
- Open trades show in table but don't affect stats (no P&L calculated until closed)

---

## Architecture Decisions

### Why Separate Pages (Not Tabs)?
- Cleaner URLs for bookmarking
- Faster load times (lazy load analytics charts only when needed)
- Better mental model: "going to analytics" vs "switching tabs"
- More mobile-friendly
- Easier to add navbar links, breadcrumbs, permissions later

### Why Build Features Before Hardening?
1. Features change a lot early - no point error-handling code that might get redesigned
2. You learn what breaks by using it - build it, break it, then fix it properly
3. Motivation stays high - seeing new features > fixing edge cases
4. Clear scope - know exactly what needs hardening after features are done

### Component Philosophy
- Keep components reusable (StatCard, TradeTable)
- Professional comments on all functions
- No shortcuts, no overbuilding
- Props for customization, not one-off components