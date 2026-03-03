# RBAC App (Client + Server)


**Prerequisites**

- Node.js: recommended `24` (or latest LTS)
- Package manager: `npm`
- Docker & Docker Compose (optional, for Postgres DB)

**Repository layout**

- `client/` — React + Vite frontend
- `server/` — NestJS backend with Sequelize models
- `docker-compose.yml` — Postgres service used for local development

**Quickstart (Docker-backed DB)**

1. Start Postgres with Docker Compose:

```bash
docker-compose up -d
```

2. Start server (development):

`No migration or seeder needed will migrate and seed data when the application starts`

```bash
cd server
npm install
.env already included
npm run start:dev
```

3. Start client (development):

```bash
cd client
npm install
npm run dev
# open http://localhost:5173
```

**Server (important notes)**

- CORS allows `http://localhost:5173` in development (client dev port).
- Sequelize configuration reads environment variables
- The project currently sets Sequelize sync to force by default (may drop and recreate tables). Do not enable this in production.

**Database**

- Docker Compose creates a Postgres instance using credentials from `docker-compose.yml` (DB: `rbac_dev`, user: `postgres`, password: `postgres`).
- If you prefer a local Postgres, set env vars in `server/.env` to match.
