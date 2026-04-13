# 🌿 Leaf Keeper

A hydration tracking app with plant care tips.

## Features
- 💧 Log daily water intake (presets + custom)
- 📊 Weekly hydration chart
- ↩️ Undo last entry
- 🌱 Plant care tips (Python Flask API)
- 🔔 Watering reminders (Go API)

## Run Locally

### 1. Frontend (React + Vite)
cd frontend
npm install
npm run dev
# Opens on http://localhost:3000

### 2. Python Backend (Plant Care)
cd python-backend
pip install -r requirements.txt
python main.py
# Runs on http://localhost:5000

### 3. Go Backend (Reminders)
cd go-backend
go run main.go
# Runs on http://localhost:8080

## Tech Stack
- React 18 + Vite
- Python Flask
- Go (Gorilla-less, standard library)