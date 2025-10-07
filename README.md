# Trade Tracker

Web app for tracking stock trades with P&L calculations, deposit tracking, and performance analytics.

**Tech Stack:** React + FastAPI + SQLite

## Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Seed test data:**
```bash
cd backend && python seed_data.py
```
Login: `test@test.com` / `test123`

## Features
- Trade CRUD with auto P&L calculation
- Deposit tracking with ROI metrics
- Win rate and account value analytics
- JWT authentication