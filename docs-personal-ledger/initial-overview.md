You are initializing a new project repository.

Project name: personal-fin-ledger

Goal:
Create scaffolding for a personal debt tracking system that records money lent to friends, repayments, and debt status (open, partially paid, closed).

The repository already contains:

backend/
frontend/
docs/

Use the following stack:

Backend:
- Node.js
- AWS Lambda
- Serverless Framework
- serverless-offline for local development
- Docker for reproducible environment

Frontend:
- React
- Vite

--------------------------------------------------

1. Backend Structure

Inside backend/ create a serverless project.

backend/
  src/
    handlers/
      createDebt.ts
      listDebts.ts
      createFriend.ts
      listFriends.ts
      recordRepayment.ts
    services/
      debtService.ts
      friendService.ts
      repaymentService.ts
    models/
      debt.model.ts
      friend.model.ts
      repayment.model.ts
    utils/
      response.ts
    config/
      db.ts

  serverless.yml
  package.json
  Dockerfile
  docker-compose.yml
  .env.example
  README.md

serverless.yml should define functions:

createDebt
listDebts
createFriend
listFriends
recordRepayment

Each function should be exposed via HTTP events.

Example endpoints:

POST /debts
GET /debts
POST /friends
GET /friends
POST /repayments

Add serverless-offline plugin for local development.

package.json scripts:

npm run offline
npm run deploy

--------------------------------------------------

2. Docker Setup

Create Dockerfile for backend Node runtime.

docker-compose.yml should start:

- backend service
- any required local dependencies (example database placeholder)

Ensure serverless-offline can run inside Docker.

--------------------------------------------------

3. Frontend Structure

Inside frontend/ create a React + Vite project.

frontend/
  src/
    components/
      DebtList.tsx
      AddDebtForm.tsx
      FriendList.tsx
      RepaymentForm.tsx
    pages/
      Dashboard.tsx
    services/
      api.ts
    App.tsx
    main.tsx

  vite.config.ts
  package.json
  README.md

api.ts should contain functions to call the backend endpoints.

--------------------------------------------------

4. Documentation

Inside docs/ create:

architecture.md
database-schema.md
api-spec.md
project-setup.md
future-features.md

database-schema.md should define entities:

friends
debts
repayments

Fields should include:

friends
- id
- name
- contact_info

debts
- id
- friend_id
- amount
- date_lent
- status

repayments
- id
- debt_id
- amount
- repayment_date

api-spec.md should describe REST endpoints.

project-setup.md should explain:

- running docker
- running serverless offline
- running frontend with vite

--------------------------------------------------

5. Root README

Update README.md with:

Project overview
Tech stack
Folder structure
Setup instructions