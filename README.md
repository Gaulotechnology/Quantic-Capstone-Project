# Tumaini AI Recruitment Platform

> *"Delivering faster, fairer, and more transparent recruitment across South Africa and the African continent."*

An AI-powered recruitment platform that transforms manual CV screening into an intelligent, scalable talent acquisition engine. Built as a **Python FastAPI microservices backend** with a **React TypeScript frontend**.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Quick Start](#quick-start)
7. [Service Reference](#service-reference)
8. [Environment Variables](#environment-variables)
9. [Development Workflow](#development-workflow)
10. [Brand](#brand)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (:3009 / :5173 dev)            │
│              Landing Page · Jobs · Search · Shortlists           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP (REST)
                            ▼
┌────────┬────────┬────────┬────────┬────────┐
│identity│   cv   │ vector │matching│  job   │
│ :8001  │ :8002  │ :8003  │ :8004  │ :8005  │
│  JWT   │Uploads │Search  │Scoring │Jobs    │
│  RBAC  │Parsing │Embed   │RAG     │Shortlst│
└───┬────┴───┬────┴───┬────┴───┬────┴───┬────┘
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
     PostgreSQL×5   Redis    RabbitMQ
   (one per svc)   (cache)   (events)
```

**Each microservice owns its own database.** Inter-service communication is asynchronous via RabbitMQ domain events.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Language** | Python 3.12 | All backend services |
| **Framework** | FastAPI | Async HTTP, OpenAPI generation |
| **Frontend** | React 19 + TypeScript + Vite | SPA with MUI v9 components |
| **Package manager** | uv (workspaces) | Monorepo dependency management |
| **Architecture** | DDD + Microservices | Domain isolation, event-driven |
| **Message broker** | RabbitMQ 3.13 | Async domain events |
| **Relational DB** | PostgreSQL 15 | Per-service persistent storage |
| **Cache** | Redis 7 | Sessions, embedding cache |
| **AI — LLM** | **DeepSeek** (primary) + Llama 3 (fallback) | Candidate scoring, semantic search, match explanation |
| **AI — Embeddings** | sentence-transformers `all-MiniLM-L6-v2` | 384-dim CV embeddings |
| **Vector DB** | Qdrant 1.9 | Semantic candidate search (HNSW index) |
| **File storage** | AWS S3 (af-south-1) | CV file storage (POPIA compliant) |
| **Containers** | Docker + Docker Compose | Local development environment |

---

## Features

### Public Website
- Beautiful landing page with hero section, stats, and featured jobs
- Job browsing and searching before login
- Responsive design with animations and gradient backgrounds

### Candidate Portal
- **Dashboard** — application stats, profile completeness tracker
- **Browse Jobs** — search, filter by sector/location, apply with one click
- **My Applications** — track status: Submitted → Shortlisted → Interview → Offered
- **Profile** — upload CV, view AI-extracted skills and experience

### Recruiter / Admin Portal
- **Dashboard** — active jobs, candidate counts, AI matching stats, quick actions
- **Job Management** — create, edit, delete jobs (PostgreSQL persisted, survives restarts)
- **AI Talent Search** — natural-language semantic search via DeepSeek with sector/location/experience filters
- **AI Matching** — automatic candidate scoring when posting a new job
- **Shortlists** — create named lists, add candidates, export to PDF/Excel, remove candidates
- **CV Management** — bulk upload, AI parsing, view extracted data in detail dialog

### AI Capabilities
- **Semantic Search** — DeepSeek ranks candidates by relevance to natural-language queries
- **Candidate Scoring** — score against job descriptions with matched/missing skills and rationale
- **Match Explanation** — human-readable rationale for every AI decision with user feedback buttons
- **Filters** — sector, location, and minimum experience respected by pre-filtering before AI scoring
- **Fallback** — local Llama 3 via Ollama when cloud API is unavailable

---

## Project Structure

```
tumaini-platform/
├── README.md                         # this file
├── docker-compose.yml                # full local environment
├── pyproject.toml                    # uv workspace root
├── .env.example                      # environment template
│
├── frontend/                         # React SPA
│   ├── package.json
│   ├── vite.config.ts                # proxy config for dev
│   ├── public/
│   │   ├── logo.png                  # Tumaini brand logo
│   │   └── favicon.svg
│   └── src/
│       ├── App.tsx                   # routes, providers
│       ├── pages/
│       │   ├── LandingPage.tsx       # public home with hero, stats, featured jobs
│       │   ├── auth/                 # Login, Register, Forgot/Reset Password
│       │   ├── candidate/            # Dashboard, Jobs, Applications, Profile
│       │   └── recruiter/            # Dashboard, Jobs, Search, Shortlists, CVs
│       ├── api/                      # axios API clients (auth, cv, jobs, matching, vector)
│       ├── store/                    # Redux slices (auth, job, search)
│       ├── components/               # Shared UI (AppLayout, ProtectedRoute, MatchExplanationModal)
│       └── theme/                    # MUI theme with Tumaini brand colors
│
├── shared/                           # DDD Kernel
│   └── tumaini_shared/
│       ├── domain/                   # Entity, AggregateRoot, ValueObject, DomainEvent
│       └── api/app.py               # create_app() factory with CORS and Scalar docs
│
└── services/                         # Microservices
    ├── identity/    :8001            # Auth, JWT, RBAC, rate limiting
    ├── cv/          :8002            # CV upload, NER parsing, vector indexing
    ├── vector/      :8003            # Embeddings, DeepSeek semantic search
    ├── matching/    :8004            # DeepSeek scoring, RAG pipeline
    └── job/         :8005            # Jobs, shortlists, PDF/Excel export
```

---

## Prerequisites

| Tool | Minimum version | Install |
|---|---|---|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 4.x | docker.com |
| [Docker Compose](https://docs.docker.com/compose/) | v2.20+ | bundled with Docker Desktop |
| [Node.js](https://nodejs.org/) | 20+ | for frontend dev only |
| [uv](https://docs.astral.sh/uv/) | 0.4+ | for Python dev only |

---

## Quick Start

### 1. Clone and configure

```bash
git clone <repo-url>
cd tumaini-platform
cp .env.example .env
```

Edit `.env` and add your **DeepSeek API key**:

```bash
OPENAI_API_KEY=sk-your-deepseek-key-here
```

### 2. Start everything

```bash
docker compose up -d
```

This starts (in dependency order):
1. **PostgreSQL ×5** — one database per service
2. **Redis** — session cache
3. **Qdrant** — vector database
4. **RabbitMQ** — event bus
5. **5 FastAPI services** — identity, cv, vector, matching, job
6. **Frontend** — nginx serving React SPA on `:3009`

### 3. Access the platform

| URL | Description |
|---|---|
| `http://localhost:3009` | Production frontend |
| `http://localhost:5173` | Dev frontend (Vite HMR) |
| `http://localhost:8001/docs` | Identity API docs |
| `http://localhost:8003/docs` | Vector/Search API docs |
| `http://localhost:8004/docs` | Matching API docs |
| `http://localhost:8005/docs` | Jobs/Shortlists API docs |

### 4. Frontend development (optional)

```bash
cd frontend
npm install
npm run dev
```

Dev server at `http://localhost:5173` with hot module replacement. The Vite proxy forwards `/api/*` requests to the appropriate backend services.

---

## Service Reference

### Identity Service (`:8001`)
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — get JWT tokens
- `POST /api/auth/refresh` — refresh access token
- `GET /api/auth/me` — current user profile
- **Database**: PostgreSQL `auth_db`

### CV Service (`:8002`)
- `POST /api/cvs/upload` — upload single CV
- `POST /api/cvs/bulk-upload` — batch upload CVs
- `GET /api/cvs/me` — list user's CVs
- `GET /api/cvs/{id}` — get CV details
- **Database**: PostgreSQL `cv_db`

### Vector Service (`:8003`)
- `POST /api/vectors/search` — semantic search via DeepSeek
- `POST /api/vectors/add` — index candidate for search
- Supports filters: `sector`, `location`, `min_experience`
- **Database**: Qdrant + PostgreSQL `vector_db`

### Matching Service (`:8004`)
- `POST /api/matching/start` — score candidates against job
- `GET /api/matching/{job_id}/results` — retrieve ranked results
- DeepSeek primary, Llama 3 fallback via Ollama
- **Database**: PostgreSQL `matching_db`

### Job Service (`:8005`)
- `POST /api/jobs` — create job (persisted to PostgreSQL)
- `GET /api/jobs` — list/search jobs
- `GET /api/jobs/{id}` — job detail
- `POST /api/shortlists` — create shortlist
- `GET /api/shortlists` — list all shortlists with candidates
- `POST /api/shortlists/{id}/add` — add candidate to shortlist
- `DELETE /api/shortlists/{id}/candidates/{cid}` — remove candidate
- `GET /api/shortlists/{id}/export?format=pdf|excel` — download export
- **Database**: PostgreSQL `job_db` (tables: `jobs`, `shortlists`, `shortlist_candidates`)
- Tables auto-created on startup via lifespan event

---

## Environment Variables

| Variable | Service | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | matching, vector | — | **DeepSeek API key** (required for AI) |
| `OPENAI_BASE_URL` | matching, vector | `https://api.deepseek.com` | LLM API endpoint |
| `LLM_MODEL` | matching, vector | `deepseek-chat` | Model name for scoring/search |
| `OLLAMA_BASE_URL` | matching | `http://host.docker.internal:11434` | Local LLM fallback |
| `JWT_SECRET` | identity | — | JWT signing key (use a long random string) |
| `POSTGRES_PASSWORD` | all | `tumaini_dev` | Database password |
| `AWS_ACCESS_KEY_ID` | cv | — | S3 credentials for CV file storage |

---

## Development Workflow

### Rebuilding a service after code changes

```bash
DOCKER_BUILDKIT=0 docker compose up -d --build <service>
```

### Viewing logs

```bash
docker compose logs -f <service>
```

### Resetting a database

```bash
docker compose down -v <service>-db
docker compose up -d <service>
```

### Running seed data (jobs)

```bash
docker compose exec job python services/job/seed_jobs.py
```

### macOS notes

On macOS, Docker BuildKit may fail with provenance errors. Use `DOCKER_BUILDKIT=0` for builds. The TUI sandbox may block `uv lock` — run lockfile operations from a regular terminal.

---

## Brand

| Color | Hex | Usage |
|---|---|---|
| Pink | `#CD6DBB` | Primary accent, buttons, links |
| Purple | `#6834A4` | Secondary, sidebar, headers |
| Green | `#339345` | Success states, matched skills |
| Gold | `#FFD700` | CTA highlights on landing page |

Logo: `frontend/public/logo.png` — extracted from `Tumaini-Logo_Main-.png`

---

## Team

Built for the Quantic Final Project — Master's Dissertation in AI-Powered Recruitment Systems.
