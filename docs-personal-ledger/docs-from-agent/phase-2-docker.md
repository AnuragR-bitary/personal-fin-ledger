# Phase 2: Docker Environment Setup

## Objective
Establish a reproducible local development environment using Docker and Docker Compose, ensuring the backend infrastructure runs seamlessly across different machines.

## Steps to Execute
1. **Create Backend Dockerfile:**
   - Create a `Dockerfile` inside the `backend/` directory.
   - Use an official Node.js image (e.g., `node:18-alpine` or `node:20-alpine`).
   - Set up the working directory, copy `package*.json`, install dependencies, and copy source files.
   - Expose the port used by `serverless-offline` (default 3000).
   - Define the command to run `npm run offline` focusing on host `0.0.0.0`.
2. **Create Docker Compose Configuration:**
   - Create a `docker-compose.yml` file in the root `personal-fin-ledger/` directory.
   - **Service 1: Backend:** Build from the `backend/Dockerfile`, map ports (e.g., 3000:3000), and link a `.env` file for environment variables. Mount volumes for hot-reloading if desired.
   - **Service 2: Database:** Define a PostgreSQL container (`postgres:15-alpine` or similar). Set environment variables for the database name, user, and password (e.g., `debt_tracker_db`). Map default PostgreSQL port (5433:5433).
3. **Environment Setup:** Ensure the backend `db.js` is configured to pick up the database host from the docker-compose network (e.g., `host: 'database'`).
