import { useState, useEffect } from 'react';
import { getDebts, getFriends } from '../services/api';
import type { Debt, Friend } from '../services/api';
import { List, CheckCircle2, Clock } from 'lucide-react';
import RepaymentForm from './RepaymentForm';

interface DebtListProps {
    refreshTrigger: number;
}

export default function DebtList({ refreshTrigger }: DebtListProps) {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [friendsMap, setFriendsMap] = useState<Record<string, Friend>>({});
    const [loading, setLoading] = useState(true);
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

    const [localRefresh, setLocalRefresh] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [debtsData, friendsData] = await Promise.all([getDebts(), getFriends()]);
                setDebts(debtsData);

                const map: Record<string, Friend> = {};
                friendsData.forEach(f => { map[f.id] = f; });
                setFriendsMap(map);
            } catch (e) {
                console.error('Failed to load data', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshTrigger, localRefresh]);

    const handleRepaymentSuccess = async () => {
        setSelectedDebt(null);
        setLocalRefresh(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="card text-center p-8">
                <p className="text-secondary">Loading debts...</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 className="text-xl mb-4 flex items-center gap-2">
                <List size={20} className="text-accent-primary" />
                Recent Transactions
            </h2>

            {debts.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-border rounded-lg">
                    <p className="text-secondary">No debts recorded yet.</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {debts.map((debt) => {
                        const creditor = friendsMap[debt.creditorId]?.name || 'Unknown';
                        const debtor = friendsMap[debt.debtorId]?.name || 'Unknown';
                        const isPending = debt.status === 'PENDING';

                        return (
                            <li key={debt.id} className="p-4 bg-secondary rounded-lg border border-border">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg">{debt.description}</h3>
                                        <p className="text-sm text-secondary mt-1">
                                            <span className="font-medium text-text-primary">{debtor}</span> owes <span className="font-medium text-text-primary">{creditor}</span>
                                        </p>
                                    </div>
                                    <span className="text-xl font-bold font-mono">
                                        ${Number(debt.amount).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${isPending ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'}`}>
                                        {isPending ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                                        {debt.status}
                                    </div>

                                    {isPending && (
                                        <button
                                            className="text-sm btn text-accent-secondary bg-primary hover-lift px-3 py-1"
                                            onClick={() => setSelectedDebt(selectedDebt?.id === debt.id ? null : debt)}
                                        >
                                            Record Repayment
                                        </button>
                                    )}
                                </div>

                                {selectedDebt?.id === debt.id && (
                                    <RepaymentForm
                                        debt={debt}
                                        onSuccess={handleRepaymentSuccess}
                                        onCancel={() => setSelectedDebt(null)}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
