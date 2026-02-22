# Bus Pass Management System

A full-stack web app for managing bus passes, routes, payments, and approvals. **Student** and **Admin** roles with separate dashboards, JWT auth, and MySQL.

## Features

- **Students:** Request passes (daily/weekly), view my pass, pay (simulated), view buses & drivers
- **Admins:** Add routes (set prices), add buses, approve/reject passes, view payments
- **Auth:** Login, register (admin registration requires security key)
- **UI:** Dark theme, animated headings, dashboard cards with spotlight effect

## Prerequisites

- **Node.js** 18+
- **MySQL** (local or remote)

## Quick Start

```bash
# Install dependencies
npm install

# Database: create DB and run schema
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bus_pass;"
mysql -u root -p bus_pass < scripts/schema.sql

# Environment: create .env.local (see below)
# Then run:
npm run dev
```

Open **http://localhost:3000**. Register as student, or register as admin using security key **Nova** (or set `ADMIN_SECURITY_KEY` in `.env.local`).

## Environment (.env.local)

| Variable            | Description                    | Default   |
|---------------------|--------------------------------|-----------|
| `MYSQL_HOST`        | MySQL host                     | localhost |
| `MYSQL_USER`        | MySQL user                     | root      |
| `MYSQL_PASSWORD`    | MySQL password                 | (empty)   |
| `MYSQL_DATABASE`    | Database name                  | bus_pass  |
| `ADMIN_SECURITY_KEY`| Key required to register admin | Nova      |
| `JWT_SECRET`        | Secret for JWT (optional)      | (dev default) |

## Scripts

| Command           | Description                |
|-------------------|----------------------------|
| `npm run dev`     | Start dev server           |
| `npm run build`   | Production build           |
| `npm run start`   | Start production server    |
| `npm run clear-data` | Truncate all DB tables (fresh start) |

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, MySQL (mysql2), JWT (jose), bcrypt, Motion, GSAP.
