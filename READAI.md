# Trade Tracker - Claude Context

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
│   ├── seed_data.py         # Test data script (24 trades, 5 deposits)
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
    │   │   ├── Navbar.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── TradeForm.jsx    # Modal for add/edit trades
    │   │   └── TradeTable.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Main page: stats, trades, deposits
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   └── services/
    │       └── api.js           # Axios with JWT interceptor
    ├── tailwind.config.js
    └── vite.config.js
```

## What's Built
✅ Auth system (register, login, JWT tokens)
✅ Trade CRUD with auto P&L calculation
✅ Deposit tracking (add, view, delete)
✅ Dashboard with stats: Total P&L, Win Rate, ROI, Account Value
✅ Edit/delete trades from UI
✅ Modal forms for data entry
✅ Dark theme UI

## What's NOT Built
❌ Brokerage fees NOT subtracted from P&L yet (needs fix)
❌ Charts/visualizations (P&L over time, performance graphs)
❌ Advanced analytics (best/worst trades, monthly breakdown)
❌ CSV import/export
❌ Trade filtering or search
❌ Mobile optimization
❌ Email verification
❌ Password reset
❌ Error boundaries/toast notifications

## Known Issues
- **Brokerage fees ignored in P&L** - calculate_trade_metrics needs update
- No database migrations (schema changes = manual fix or DB reset)
- CORS allows all origins
- No rate limiting
- JWT secret is placeholder
- No pagination (breaks with 1000+ trades)

## Roadmap (Priority Order)

### Phase 1: Critical Fixes
1. Fix brokerage fee calculation in P&L
2. Add basic charts (P&L over time, win rate graph)
3. Export to PDF/CSV for tax purposes

### Phase 2: Polish
4. Advanced analytics (best trades, performance by ticker)
5. Trade filtering and search
6. Design overhaul (animations, better colors)
7. Error handling + toast notifications

### Phase 3: Advanced
8. CSV import with column mapping
9. Mobile responsive + PWA
10. Security hardening (rate limits, migrations)

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
python backend/seed_data.py  # optional: add test data
```

**Test credentials:** test@test.com / test123

## Important Notes
- Database: `/home/tradetracker/Trade-Tracker/backend/tradetracker.db`
- All values in USD only
- P&L formula: (exit - entry) × shares - brokerage_fee (NEEDS FIX)
- Tokens stored in localStorage