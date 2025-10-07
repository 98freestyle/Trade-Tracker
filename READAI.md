# Trade Tracker - AI Context

## What It Is
Web application for tracking stock trades with real-time P&L calculations, deposit tracking, and performance analytics. Replaces Excel/Google Sheets with a clean, modern interface.

## Tech Stack
- **Backend:** FastAPI + SQLite + SQLAlchemy
- **Frontend:** React + Vite + Tailwind CSS
- **Auth:** JWT tokens with Argon2 password hashing
- **Hosting:** Backend on VPS (port 8002), Frontend served via nginx

## Database Models
- **User:** id, email, hashed_password, created_at
- **Trade:** id, user_id, symbol, entry_date, exit_date, entry_price, exit_price, shares, brokerage_fee, notes, profit_loss, profit_loss_percent, total_cost, created_at
- **Deposit:** id, user_id, amount, deposit_date, notes, created_at

## File Structure
```
backend/
├── main.py          # FastAPI app entry point
├── models.py        # SQLAlchemy models (User, Trade, Deposit)
├── database.py      # Database connection and session management
├── auth.py          # Authentication helpers (JWT, password hashing)
├── seed_data.py     # Script to populate test data
├── routers/
│   ├── auth.py      # /api/auth/* endpoints (register, login, user profile)
│   ├── trades.py    # /api/trades/* endpoints (CRUD operations)
│   └── deposits.py  # /api/deposits/* endpoints (CRUD operations)

frontend/src/
├── components/
│   ├── TradeForm.jsx    # Modal for adding/editing trades
│   └── DepositForm.jsx  # Modal for adding deposits
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx    # Main page with stats, trades, and deposits
├── services/
│   └── api.js           # Axios API client with auth interceptors
└── App.jsx              # React Router setup with protected routes
```

## Features Implemented

### Authentication & Authorization
✅ User registration with email validation
✅ JWT-based login system
✅ Protected routes requiring authentication
✅ Secure password hashing with Argon2

### Trade Management
✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Automatic P&L calculation on trade entry
✅ Support for open positions (trades without exit date/price)
✅ Trade table with edit/delete actions
✅ Modal-based trade form for adding/editing

### Deposit Tracking
✅ Record deposits with date and notes
✅ USD-based deposit tracking
✅ Deposit history table with delete functionality
✅ Integration with account performance calculations

### Dashboard Analytics
✅ Total trades count
✅ Total P&L (aggregate profit/loss from all closed trades)
✅ Win rate percentage (winning trades / total closed trades)
✅ Total deposits (sum of all deposits)
✅ Account value (deposits + total P&L)
✅ ROI calculation (P&L / deposits × 100)

### UI/UX
✅ Dark mode interface with gray/blue color scheme
✅ Responsive grid layout for stats cards
✅ Modal forms for data entry
✅ Confirmation dialogs for destructive actions
✅ Real-time stat updates after data changes

## What's NOT Built Yet
❌ CSV import functionality
❌ Advanced analytics (best/worst trades, monthly performance breakdowns)
❌ Performance charts and visualizations
❌ Trade filtering and search
❌ Export functionality
❌ Mobile PWA setup
❌ Email verification system
❌ Password reset functionality
❌ Multi-currency support
❌ Brokerage fee tracking in P&L calculations

## Important Notes
- **brokerage_fee** field stores transaction fees (not broker name)
- JWT tokens stored in localStorage
- Backend runs as systemd service (`tradetracker`)
- Nginx serves frontend from `/dist` folder
- Database location: `/home/tradetracker/Trade-Tracker/backend/tradetracker.db`
- All monetary values stored and displayed in USD

## Development Workflow
1. Backend changes: Edit files → `sudo systemctl restart tradetracker`
2. Frontend changes: Edit files → `npm run build` → nginx serves updated build
3. Database reset: Delete `.db` file → restart backend (recreates schema)
4. Test data: Run `python seed_data.py` to populate dummy trades/deposits

## Next Steps (Priority Order)
1. Add performance charts (P&L over time, win rate visualization)
2. Implement advanced analytics endpoints
3. Design overhaul with animations and premium aesthetic
4. Add trade filtering and search functionality
5. Implement CSV import with column mapping
6. Build mobile-responsive layouts
7. Add export functionality (PDF reports, CSV downloads)

## Known Issues
- Database migrations not implemented (schema changes require manual fixes or DB reset)
- No rate limiting on API endpoints
- CORS currently allows all origins (should be restricted in production)
- No email verification (users can register with fake emails)
- Password reset requires manual database intervention