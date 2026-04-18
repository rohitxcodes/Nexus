<div align="center">

<img src="https://code-quest-nexus.vercel.app/icon.png" alt="Code Quest Logo" width="100"/>

# ⚔️ Code Quest

**Gamified Competitive DSA Learning Platform**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-code--quest--nexus.vercel.app-6C63FF?style=for-the-badge&logo=vercel&logoColor=white)](https://code-quest-nexus.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express%20v5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=for-the-badge&logo=socket.io)](https://socket.io)

*Traditional DSA practice is dry and isolating. Code Quest wraps rigorous algorithmic challenges inside an RPG progression loop — levels, XP, clans, rewards, and real-time duels.*

</div>

---

## ✨ Features

- **🎮 Level System** — Progressive DSA levels with LOCKED / UNLOCKED / COMPLETED states. Each level: 2 Easy + 3 Medium + 1 Hard = 340 XP on full clear.
- **💻 Code Execution** — Monaco Editor with Judge0 CE integration. Supports C++, Java, Python, JavaScript with real test case evaluation.
- **⚔️ 1v1 Duels** — Challenge any user to a real-time match. Same problem, first ACCEPTED verdict wins.
- **🏰 Clans** — Create or join clans, manage membership, compete on a local leaderboard, and chat in real-time via Socket.io.
- **🏆 Trophies** — Milestone-based achievement system (First Blood, On Fire, Duel Master, Speed Demon, etc.)
- **🛒 Shop** — Gold & Cash currency system. Spend XP on power-ups, XP multipliers, and AI hints.
- **🤖 AI Hints** — Context-aware hints powered by Google Gemini. Costs in-game currency to prevent abuse.
- **📊 Leaderboard** — Global top-10 by XP + authenticated user's live rank.
- **🔐 Auth** — JWT via httpOnly cookies + Bearer token fallback. bcrypt password hashing.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| Vite | 7 | Build tool |
| TailwindCSS | 4 | Styling |
| React Router | 7 | Client-side routing |
| GSAP | 3 | Animations & scroll effects |
| Framer Motion | 12 | Component transitions |
| Monaco Editor | 0.55 | In-browser code editor |
| Socket.io-client | 4 | Real-time clan chat & match events |
| shadcn/ui | — | UI component primitives |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js + Express | v5 | REST API server |
| MongoDB + Mongoose | 9 | Database & ODM |
| Socket.io | 4 | WebSocket server for chat & duels |
| Judge0 CE (RapidAPI) | — | Code execution engine |
| Google Gemini | @google/genai | AI hint generation |
| JWT + bcrypt | — | Auth & password security |
| Jest + Supertest | — | API testing |
| mongodb-memory-server | — | In-memory DB for tests |

---

## 🗂️ Project Structure

```
Nexus/
├── Frontend/
│   ├── src/
│   │   ├── app/              # Router, providers, global store
│   │   ├── components/
│   │   │   ├── common/       # ProtectedRoute, PublicRoute
│   │   │   ├── layout/       # Nav, Body, PageWrapper
│   │   │   └── ui/           # Reusable UI primitives
│   │   ├── features/
│   │   │   └── problem_solving/  # Editor, submission hooks
│   │   ├── pages/
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── Home/         # Dashboard
│   │   │   ├── Train/        # Level selector, leaderboard
│   │   │   ├── level/        # Problem page
│   │   │   ├── Game/         # 1v1 match arena
│   │   │   ├── Shop/         # Item shop
│   │   │   └── Profile/      # User stats & trophies
│   │   ├── styles/
│   │   └── utils/            # api.js, storage.js, constants, helpers
│   └── public/               # Static assets
│
└── backend/
    ├── src/
    │   ├── config/           # DB connection, Socket.io setup, Gemini
    │   ├── controllers/      # Route handlers (thin layer)
    │   ├── services/         # Business logic
    │   │   └── submission/   # Judge0 pipeline (creator, wrapper, evaluator, xp handler)
    │   ├── models/           # Mongoose schemas
    │   ├── routes/           # Express routers
    │   ├── middleware/       # auth.middleware.js
    │   └── testing/          # Jest test suites per domain
    └── scripts/              # DB seed scripts (levels, problems, trophies)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)
- [Judge0 CE via RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) key
- Google Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/rohitxcodes/Nexus.git
cd Nexus
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_atlas_uri
RAPIDAPI_KEY=your_judge0_rapidapi_key
JWT_SECRET=your_jwt_secret_min_32_chars
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
NODE_ENV=development
```

Seed the database:

```bash
node scripts/seedProblems.js
node scripts/seedLevels.js
node scripts/seedTrophies.js
```

Start the server:

```bash
npm run dev       # development (nodemon)
npm start         # production
```

### 3. Frontend setup

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:3000`.

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Test suites cover: `auth`, `levels`, `submissions`, `xp`, `leaderboard`, `clans`, `matches`, `chat`, `shop`, `trophies`.

Uses `mongodb-memory-server` — no external DB required for tests.

---

## 📡 API Overview

Base URL: `/api` | Auth: `Authorization: Bearer <token>` or `httpOnly` cookie

| Domain | Base Route | Key Endpoints |
|--------|-----------|---------------|
| Auth | `/api/auth` | `POST /register`, `POST /login`, `GET /me` |
| Levels | `/api/levels` | `GET /`, `GET /:levelNumber` |
| Submissions | `/api/submissions` | `POST /` (triggers Judge0), `GET /:id` |
| XP | `/api/xp` | `POST /record` (idempotent), `GET /history` |
| Leaderboard | `/api/leaderboard` | `GET /overview` |
| Clans | `/api/clans` | Full CRUD + join/leave/approve/reject |
| Matches | `/api/matches` | `POST /challenge`, `POST /:id/accept`, `POST /:id/submit` |
| Chat | `/api/chat` | `GET /:clanId/history` + WebSocket events |
| Shop | `/api/shop` | `GET /items`, `POST /purchase`, `POST /hint` |
| Trophies | `/api/trophies` | `GET /`, `GET /mine` |
| Health | `/health` | `GET /` |

---

## ⚙️ Environment Variables

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `RAPIDAPI_KEY` | ✅ | Judge0 CE API key |
| `JWT_SECRET` | ✅ | JWT signing secret (32+ chars) |
| `GEMINI_API_KEY` | ✅ | Google Gemini key for AI hints |
| `PORT` | — | Server port (default: `3000`) |
| `NODE_ENV` | — | `development` or `production` |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend base URL |

---

## 🗺️ Roadmap

| Version | Scope | Status |
|---------|-------|--------|
| **v1.0** | Auth, levels, submissions, XP, clans, leaderboard | ✅ Live |
| **v1.1** | 1v1 match history, trophy system, clan leaderboard | 🔄 In Progress |
| **v1.2** | Real-time match arena, DS-filter browsing | 📋 Planned |
| **v1.3** | Full shop backend, currency deduction, power-up effects | 📋 Planned |
| **v2.0** | Mobile app (React Native), tournaments, streak system | 🔮 Future |

---

## 👥 Team

| Contributor | Role |
|-------------|------|
| [rohitxcodes](https://github.com/rohitxcodes) | Backend, Architecture |
| [OnkarRaj](https://github.com/OnkarRaj) | Frontend |
| [SujanSahoo](https://github.com/SujanSahoo) | Frontend, Features |
| [OmAditiyaPattnaik](https://github.com/omaditya073-wq) | Designing ,Frontend, Features |

---

<div align="center">

**[🚀 Try it live →](https://code-quest-nexus.vercel.app)**

</div>
