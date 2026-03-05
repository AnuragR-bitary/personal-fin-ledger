# Phase 3: Frontend Scaffolding

## Objective
Set up the user interface using React and Vite, creating the foundational components to interact with the Serverless API.

## Steps to Execute
1. **Initialize Vite Application:**
   - In the `frontend/` directory, run `npm create vite@latest . -- --template react-ts` (or `react-swc-ts`).
   - Run `npm install` for the base dependencies.
2. **Install Additional Dependencies:**
   - Install `axios` for HTTP API requests.
   - Install `react-router-dom` if client-side routing is needed (e.g., separating the Dashboard from detailed views).
3. **Folder Structure Organization:**
   - Clean up default Vite assets (`App.css`, boilerplate `App.tsx` content) if necessary.
   - Create `src/components/`:
     - `DebtList.tsx` (Displays active debts)
     - `AddDebtForm.tsx` (Form to submit a new debt)
     - `FriendList.tsx` (Displays list of friends)
     - `RepaymentForm.tsx` (Form to log a payment against a debt)
   - Create `src/pages/`:
     - `Dashboard.tsx` (Main view assembling the components)
   - Create `src/services/`
     - `api.ts` (Export configured `axios` instance and wrapper functions calling the backend, such as `getFriends()`, `createDebt()`, etc.)
4. **Wire Up Basic App Structure:** Update `App.tsx` to mount the `Dashboard.tsx` component.
