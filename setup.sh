#!/bin/bash
# CineMatrix AI — Quick Setup Script

set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     CINEMATRIX AI — SETUP WIZARD     ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── Backend ──────────────────────────────────────────────────────────────────
echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt -q

echo "🧠 Training recommendation model (demo mode)..."
python train_model.py --demo

echo ""
echo "✅ Backend ready."
echo ""

# ── Frontend ─────────────────────────────────────────────────────────────────
echo "📦 Installing Node dependencies..."
cd ../frontend
npm install --silent

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                        ALL SET!                              ║"
echo "║                                                              ║"
echo "║  1. Start backend:  cd backend && uvicorn main:app --reload  ║"
echo "║  2. Start frontend: cd frontend && npm start                 ║"
echo "║  3. Open browser:   http://localhost:3000                    ║"
echo "║                                                              ║"
echo "║  For real data: see README.md → Option B                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
