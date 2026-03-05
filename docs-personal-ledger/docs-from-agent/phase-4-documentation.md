# Phase 4: API & Architecture Documentation

## Objective
Generate the project's living documentation, reflecting the final schema, architectural decisions, and APIs established during the scaffolding phases.

## Steps to Execute
1. **Create `database-schema.md`:** (To be placed in `docs-personal-ledger/docs-from-agent/` as per user instruction)
   - Outline tables: `friends`, `debts`, `repayments`.
   - Specify fields:
     - `friends`: id, name, contact_info
     - `debts`: id, friend_id, amount, date_lent, status
     - `repayments`: id, debt_id, amount, repayment_date
2. **Create `api-spec.md`:** 
   - Document RESTful endpoints, detailing request methods, paths, required body payloads, and example JSON responses for:
     - `POST /debts`
     - `GET /debts`
     - `POST /friends`
     - `GET /friends`
     - `POST /repayments`
3. **Create `architecture.md`:** 
   - Detail the high-level flow (Vite React App -> API Gateway -> Lambda via Serverless Offline -> PostgreSQL).
4. **Create `project-setup.md`:** 
   - Write comprehensive instructions for running the application locally:
     - How to spin up Docker containers.
     - How to run the Serverless backend locally (`npm run offline`).
     - How to run the Vite frontend locally (`npm run dev`).
5. **Create `future-features.md`:** 
   - Placeholder for logging upcoming functionality or improvements (e.g., authentication, complex split calculations).
