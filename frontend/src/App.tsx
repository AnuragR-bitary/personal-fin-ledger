import { Routes, Route } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import Dashboard from './pages/Dashboard';
import FriendsPage from './pages/Friends';
import ExpensesPage from './pages/Expenses';
import TransactionsPage from './pages/Transactions';
import DebtsPage from './pages/Debts';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/debts" element={<DebtsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
