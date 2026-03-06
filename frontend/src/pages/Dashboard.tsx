import { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, Clock, Users,
    ArrowUpRight, ArrowDownRight, LayoutDashboard,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import { getDebts, getFriends } from '../services/api';
import type { Debt, Friend } from '../types';

export default function Dashboard() {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [d, f] = await Promise.all([getDebts(), getFriends()]);
                setDebts(d);
                setFriends(f);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const friendMap: Record<string, Friend> = {};
    friends.forEach((f) => { friendMap[f.id] = f; });

    const pendingDebts = debts.filter((d) => d.status === 'PENDING');
    const totalLent = pendingDebts.reduce((s, d) => s + Number(d.amount), 0);
    const friendsWithDebt = new Set(pendingDebts.map((d) => d.debtorId)).size;

    const recentDebts = [...debts]
        .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
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
                    label="Total Lent"
                    value={loading ? '—' : `$${totalLent.toFixed(2)}`}
                    icon={<TrendingUp size={18} />}
                    variant="blue"
                    subtext="outstanding amount"
                />
                <StatCard
                    label="Total Borrowed"
                    value="$0.00"
                    icon={<TrendingDown size={18} />}
                    variant="red"
                    subtext="you owe others"
                />
                <StatCard
                    label="Pending Debts"
                    value={loading ? '—' : String(pendingDebts.length)}
                    icon={<Clock size={18} />}
                    variant="amber"
                    subtext="awaiting settlement"
                />
                <StatCard
                    label="Active Friends"
                    value={loading ? '—' : String(friendsWithDebt)}
                    icon={<Users size={18} />}
                    variant="green"
                    subtext="with pending balance"
                />
            </div>

            {/* Two-column section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="xl:col-span-2">
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-text-primary font-semibold text-sm">Recent Activity</h2>
                            <span className="text-text-muted text-xs">{debts.length} total records</span>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-14 rounded-lg bg-bg-elevated animate-pulse" />
                                ))}
                            </div>
                        ) : recentDebts.length === 0 ? (
                            <div className="py-12 text-center text-text-muted">
                                <p className="text-4xl mb-2">💸</p>
                                <p className="text-sm">No activity yet. Add a debt to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentDebts.map((debt) => {
                                    const creditor = friendMap[debt.creditorId]?.name ?? 'Unknown';
                                    const debtor = friendMap[debt.debtorId]?.name ?? 'Unknown';
                                    const isPending = debt.status === 'PENDING';
                                    return (
                                        <div
                                            key={debt.id}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface hover:bg-bg-hover transition-colors"
                                        >
                                            <div className={`p-2 rounded-lg flex-shrink-0 ${isPending ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                                                }`}>
                                                {isPending ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-text-primary text-sm font-medium truncate">{debt.description}</p>
                                                <p className="text-text-muted text-xs">
                                                    <span className="text-text-secondary">{debtor}</span> owes <span className="text-text-secondary">{creditor}</span>
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-text-primary text-sm font-semibold font-mono">
                                                    ${Number(debt.amount).toFixed(2)}
                                                </p>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isPending ? 'badge-amber' : 'badge-success'
                                                    }`}>
                                                    {debt.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Friends Summary */}
                <div>
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-text-primary font-semibold text-sm">Friends</h2>
                            <span className="text-text-muted text-xs">{friends.length} total</span>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-12 rounded-lg bg-bg-elevated animate-pulse" />
                                ))}
                            </div>
                        ) : friends.length === 0 ? (
                            <p className="text-text-muted text-sm text-center py-8">No friends yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {friends.slice(0, 6).map((f) => {
                                    const owes = pendingDebts
                                        .filter((d) => d.debtorId === f.id)
                                        .reduce((s, d) => s + Number(d.amount), 0);
                                    return (
                                        <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-hover transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue-light flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {f.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-text-primary text-sm font-medium truncate">{f.name}</p>
                                                {f.phone && <p className="text-text-muted text-xs truncate">{f.phone}</p>}
                                            </div>
                                            {owes > 0 && (
                                                <span className="text-accent-red-light text-xs font-mono font-semibold">
                                                    ${owes.toFixed(0)}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
