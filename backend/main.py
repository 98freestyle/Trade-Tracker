from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth, trades

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trade Tracker API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(trades.router)

@app.get("/")
def read_root():
    return {"status": "Trade Tracker API Running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}