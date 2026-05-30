# PMS Backend

Backend for the Permission Management System (Sistema Gestor de Permisos) — a platform used by an educational institution to manage student permissions, absences, schedules, and daily reports.

Built with [NestJS](https://nestjs.com/), TypeORM, and MySQL.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js 20+](https://nodejs.org/) (only if running outside Docker)

## Quick Start

```bash
# 1. Clone the repo and switch to the development branch
git clone <repo-url>
cd pms_backend
git checkout development

# 2. Create your environment file
cp .env.example .env.development.local
# Edit .env.development.local with your values (JWT secret, email credentials, etc.)

# 3. Start the development environment
npm run docker:dev
```

The API will be available at `http://localhost:3000` and Swagger docs at `http://localhost:3000/api`.

The MySQL database is accessible at `localhost:3306` with the credentials from your `.env.development.local`.

## Scripts

### Docker

| Command              | Description                                        |
| -------------------- | -------------------------------------------------- |
| `npm run docker:dev` | Start dev environment (app + database)             |
| `npm run docker:stop`| Stop all containers                                |
| `npm run docker:seed`| Run the database seeder inside the app container   |
| `npm run docker:reset`| Reset database (removes volume, restarts fresh)   |

### Shell helpers (`scripts/`)

| Script               | Description                                        |
| -------------------- | -------------------------------------------------- |
| `scripts/dev.sh`     | Start dev environment with `docker compose up`     |
| `scripts/stop.sh`    | Stop all containers                                |
| `scripts/logs.sh`    | Tail logs (`scripts/logs.sh [service]`)             |
| `scripts/seed.sh`    | Run the NestJS seeder                              |
| `scripts/reset-db.sh`| Wipe database volume and restart                   |
| `scripts/shell.sh`   | Open a shell inside the app container              |
| `scripts/db-shell.sh`| Open a MySQL CLI session                           |

### NestJS

| Command              | Description                                        |
| -------------------- | -------------------------------------------------- |
| `npm run start:dev`  | Start in watch mode (without Docker)               |
| `npm run build`      | Compile TypeScript                                 |
| `npm run start:prod` | Run compiled production build                      |
| `npm run lint`       | Lint and auto-fix                                  |
| `npm run test`       | Run unit tests                                     |
| `npm run seed`       | Run the database seeder locally (without Docker)   |
| `npm run clustering:export` | Export clustering snapshot + run + results to JSON (see below) |

## Clustering export (Phase 4B)

Writes a JSON report via `ClusteringService` (snapshot, AI run response, results, teacher DTO per subject group). The script sets `CLUSTERING_ENABLED=false` so the weekly cron does not start.

**Inside Docker** (DB host `db` works):

```bash
docker compose exec app npm run clustering:export -- --out /tmp/clustering-report.json 15
```

**On the host** (after `npm run docker:dev`): use `DB_HOST=127.0.0.1` and the mapped MySQL port in `.env.development.local`, then:

```bash
cd pms_backend
npm run clustering:export -- --out ./exports/report.json 15
# All groups with at least one graded attempt (omit ids):
npm run clustering:export -- --out ./exports/all.json
```

After `npm run build`: `npm run clustering:export:compiled` (same args, `node` runs `dist/`).

## Database Seeding

The seeder populates the database with mock data for local development: periods, time slots, subjects, teachers, groups, students, enrollments, and users.

It runs automatically on app start when `SEED_ON_START=true` is set in your environment file. It is **idempotent** — if data already exists, it skips seeding.

To seed manually: `npm run docker:seed`

To get a completely fresh database: `npm run docker:reset`

Default credentials after seeding:
- **Admin**: see `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your `.env.development.local`
- **Teachers & Students**: password is `Password123!`

## Project Structure

```
├── src/
│   ├── absences/          # Absence tracking
│   ├── auth/              # JWT authentication
│   ├── common/            # Shared decorators, guards, interfaces
│   ├── config/            # Configuration (database, JWT, mail, validation)
│   ├── daily-reports/     # Daily report management
│   ├── enrollments/       # Student enrollments
│   ├── groups/            # Student groups
│   ├── mail/              # Email service with Handlebars templates
│   ├── periods/           # Academic periods
│   ├── permissions/       # Permission requests
│   ├── schedules/         # Schedule views
│   ├── seeder/            # Database seeder for dev
│   ├── clustering/      # Phase 4B clustering (export script, teacher API)
│   ├── stats/             # Statistics and reporting views
│   ├── students/          # Student management
│   ├── subject-groups/    # Subject-group assignments
│   ├── subject-group-time-slots/  # Schedule slots
│   ├── subjects/          # Subjects
│   ├── teachers/          # Teacher management
│   ├── time-slots/        # Time slot definitions
│   ├── users/             # User accounts and roles
│   ├── app.module.ts
│   └── main.ts
├── database/              # Reference SQL scripts
├── scripts/               # Docker helper scripts
├── docker-compose.yml
├── Dockerfile
└── .env.example
```
