import { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, Clock, Users, LayoutDashboard,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import { getFriends, getMe } from '../services/friend.service';
import { getBalances } from '../services/payment.service';
import { getExpenses } from '../services/expense.service';
import type { Friend, Balance, Expense } from '../types';

export default function Dashboard() {
    const [owner, setOwner] = useState<Friend | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [balances, setBalances] = useState<Balance[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [me, f, b, e] = await Promise.all([getMe(), getFriends(), getBalances(), getExpenses()]);
                setOwner(me);
                setFriends(f);
                setBalances(b);
                setExpenses(e);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Build a map of ALL users (owner + friends)
    const userMap: Record<string, Friend> = useMemo(() => {
        const map: Record<string, Friend> = {};
        if (owner) map[owner.id] = owner;
        friends.forEach((f) => { map[f.id] = f; });
        return map;
    }, [owner, friends]);

    const labelFor = (userId: string) => {
        const u = userMap[userId];
        if (!u) return 'Unknown';
        return u.is_owner ? 'Me' : u.name;
    };

    // Only show balances for friends who actually have expenses
    const activeBalances = useMemo(() => balances.filter((b) => b.total_owed > 0), [balances]);
    const pendingBalances = useMemo(() => activeBalances.filter((b) => b.balance > 0), [activeBalances]);

    // Derived stats from real balance data
    const totalOutstanding = pendingBalances.reduce((s, b) => s + b.balance, 0);
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);

    const recentExpenses = [...expenses]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 8);

    return (
        <div>
            <PageHeader
                title="Dashboard"
                subtitle="Overview of your financial activity"
                icon={<LayoutDashboard size={18} />}
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Total Outstanding"
                    value={loading ? '—' : `₹${totalOutstanding.toFixed(2)}`}
                    icon={<TrendingUp size={18} />}
                    variant="blue"
                    subtext="owed to you"
                />
                <StatCard
                    label="Total Expenses"
                    value={loading ? '—' : `₹${totalExpenses.toFixed(2)}`}
                    icon={<TrendingDown size={18} />}
                    variant="red"
                    subtext="recorded so far"
                />
                <StatCard
                    label="Expenses Count"
                    value={loading ? '—' : String(expenses.length)}
                    icon={<Clock size={18} />}
                    variant="amber"
                    subtext="total entries"
                />
                <StatCard
                    label="Active Friends"
                    value={loading ? '—' : String(pendingBalances.length)}
                    icon={<Users size={18} />}
                    variant="green"
                    subtext="with pending balance"
                />
            </div>

            {/* Two-column section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Expenses */}
                <div className="xl:col-span-2">
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-text-primary font-semibold text-sm">Recent Expenses</h2>
                            <span className="text-text-muted text-xs">{expenses.length} total</span>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-14 rounded-lg bg-bg-elevated animate-pulse" />
                                ))}
                            </div>
                        ) : recentExpenses.length === 0 ? (
                            <div className="py-12 text-center text-text-muted">
                                <p className="text-4xl mb-2">💸</p>
                                <p className="text-sm">No expenses yet. Add one to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentExpenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface hover:bg-bg-hover transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-accent-blue/15 text-accent-blue-light flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {expense.description.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-text-primary text-sm font-medium truncate">{expense.description}</p>
                                            <p className="text-text-muted text-xs">
                                                Paid by <span className="text-text-secondary">{labelFor(expense.paid_by_user_id)}</span>
                                                {' · '}{new Date(expense.expense_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-text-primary text-sm font-semibold font-mono">
                                                ₹{Number(expense.amount).toFixed(2)}
                                            </p>
                                            <span className={`text-[10px] font-medium ${expense.split_type === 'EQUAL' ? 'badge-blue' : 'badge-purple'}`}>
                                                {expense.split_type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Friends Balance summary — only outstanding balances */}
                <div>
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-text-primary font-semibold text-sm">Outstanding Balances</h2>
                            <span className="text-text-muted text-xs">{pendingBalances.length} pending</span>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-12 rounded-lg bg-bg-elevated animate-pulse" />
                                ))}
                            </div>
                        ) : pendingBalances.length === 0 ? (
                            <div className="py-8 text-center text-text-muted">
                                <p className="text-3xl mb-2">🎉</p>
                                <p className="text-sm">All settled up! No pending balances.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pendingBalances.slice(0, 6).map((b) => (
                                    <div key={b.user_id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-hover transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue-light flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {b.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-text-primary text-sm font-medium truncate">{b.name}</p>
                                        </div>
                                        <span className="text-xs font-mono font-semibold text-emerald-400">
                                            ₹{b.balance.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
