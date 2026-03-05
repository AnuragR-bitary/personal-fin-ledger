import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';

function App() {
  return (
    <div className="container">
      <header className="mb-8">
        <h1 className="text-2xl flex items-center gap-2">
          <span>💸</span> Personal Finance Ledger
        </h1>
        <p className="text-secondary">Keep track of your shared expenses and debts.</p>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
