# Phase 1: Backend Scaffolding

## Objective
Initialize the Serverless backend using Node.js and AWS Lambda, setting up the core folder structure and necessary configuration files.

## Steps to Execute
1. **Initialize Project:** Run `npm init -y` inside the `backend/` directory.
2. **Install Dependencies:**
   - Production dependencies: `pg` (for PostgreSQL connection), `uuid` (for ID generation if needed).
   - Development dependencies: `serverless`, `serverless-offline`, `typescript`, `serverless-plugin-typescript` (or `esbuild` related dev dependencies).
3. **Configure `serverless.yml`:**
   - Set the provider to AWS/Node.js.
   - Configure it to compile TypeScript (e.g., using `serverless-plugin-typescript` or `esbuild`).
   - Add the `serverless-offline` plugin.
   - Define the 5 core HTTP functions mapping to their respective handler files:
     - `createDebt` (POST /debts)
     - `listDebts` (GET /debts)
     - `createFriend` (POST /friends)
     - `listFriends` (GET /friends)
     - `recordRepayment` (POST /repayments)
4. **Create Folder Structure & Scaffolding Files:** Create the `src/` directory and populate it with empty/stubbed files:
   - `src/handlers/` (`createDebt.ts`, `listDebts.ts`, `createFriend.ts`, `listFriends.ts`, `recordRepayment.ts`)
   - `src/services/` (`debtService.ts`, `friendService.ts`, `repaymentService.ts`)
   - `src/models/` (`debt.model.ts`, `friend.model.ts`, `repayment.model.ts`)
   - `src/utils/` (`response.ts`)
   - `src/config/` (`db.ts`)
5. **Configuration Files:** 
   - Create `.env.example`.
   - Update `package.json` scripts (`"offline": "serverless offline"`).
