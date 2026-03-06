import { useState, useEffect, useMemo } from 'react';
import { CreditCard, CheckCircle2, Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import { Button, Input } from '../components/ui/FormElements';
import { getFriends, getDebts, recordRepayment } from '../services/api';
import type { Friend, Debt } from '../types';

// ─── Settle Modal ─────────────────────────────────────────────────────────────

function SettleModal({ isOpen, onClose, debt, friends, onSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    debt: Debt | null;
    friends: Friend[];
    onSuccess: () => void;
}) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (debt) setAmount(debt.amount.toString());
    }, [debt]);

    const friendMap: Record<string, Friend> = {};
    friends.forEach((f) => { friendMap[f.id] = f; });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!debt || !amount) return;
        setLoading(true);
        try {
            await recordRepayment(debt.id, parseFloat(amount));
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!debt) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settle Debt" size="sm">
            <div className="mb-5 p-4 rounded-xl bg-bg-surface border border-border">
                <p className="text-text-muted text-xs mb-1">Settling debt for</p>
                <h3 className="text-text-primary font-semibold">{debt.description}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-text-secondary text-sm">{friendMap[debt.debtorId]?.name}</span>
                    <span className="text-text-muted">→</span>
                    <span className="text-text-secondary text-sm">{friendMap[debt.creditorId]?.name}</span>
                    <span className="text-text-primary font-mono font-semibold ml-auto">${Number(debt.amount).toFixed(2)}</span>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="settle-amount"
                    label="Amount to Pay ($)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    max={debt.amount}
                    step="0.01"
                    required
                    autoFocus
                />
                <div className="flex gap-2 justify-end pt-1">
                    <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="success"
                        size="sm"
                        loading={loading}
                        icon={<CheckCircle2 size={14} />}
                    >
                        Confirm Payment
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Debts Page ───────────────────────────────────────────────────────────────

interface DebtRow {
    id: string;
    friendName: string;
    description: string;
    youOwe: number;
    theyOwe: number;
    netBalance: number;
    status: 'PENDING' | 'PAID';
    _debt: Debt;
}

export default function DebtsPage() {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [settleDebt, setSettleDebt] = useState<Debt | null>(null);
    const [settleOpen, setSettleOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('PENDING');

    const friendMap: Record<string, Friend> = {};
    friends.forEach((f) => { friendMap[f.id] = f; });

    const loadData = async () => {
        setLoading(true);
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

    useEffect(() => { loadData(); }, []);

    const rows: DebtRow[] = useMemo(() => debts.map((d) => {
        const friendName = friendMap[d.debtorId]?.name ?? 'Unknown';
        return {
            id: d.id,
            friendName,
            description: d.description,
            youOwe: 0,
            theyOwe: Number(d.amount),
            netBalance: Number(d.amount),
            status: d.status,
            _debt: d,
        };
    }), [debts, friends]);

    const filtered = useMemo(() =>
        rows
            .filter((r) => statusFilter === 'ALL' || r.status === statusFilter)
            .filter((r) =>
                r.friendName.toLowerCase().includes(search.toLowerCase()) ||
                r.description.toLowerCase().includes(search.toLowerCase())
            ),
        [rows, search, statusFilter]
    );

    const totalPending = rows
        .filter((r) => r.status === 'PENDING')
        .reduce((s, r) => s + r.theyOwe, 0);

    const openSettle = (row: DebtRow) => {
        if (row.status !== 'PENDING') return;
        setSettleDebt(row._debt);
        setSettleOpen(true);
    };

    const columns = [
        {
            key: 'description',
            header: 'Description',
            render: (r: DebtRow) => (
                <div>
                    <p className="text-text-primary font-medium text-sm">{r.description}</p>
                    <p className="text-text-muted text-xs">{r.friendName}</p>
                </div>
            ),
        },
        {
            key: 'debtor',
            header: 'Debtor',
            render: (r: DebtRow) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent-amber/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                        {r.friendName.charAt(0)}
                    </div>
                    <span className="text-text-secondary text-sm">{r.friendName}</span>
                </div>
            ),
        },
        {
            key: 'theyOwe',
            header: 'Amount',
            render: (r: DebtRow) => (
                <span className="font-mono font-semibold text-text-primary">
                    ${r.theyOwe.toFixed(2)}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (r: DebtRow) => (
                <span className={r.status === 'PENDING' ? 'badge-amber' : 'badge-success'}>{r.status}</span>
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (r: DebtRow) =>
                r.status === 'PENDING' ? (
                    <Button
                        size="sm"
                        variant="success"
                        icon={<CheckCircle2 size={13} />}
                        onClick={(e) => { e.stopPropagation(); openSettle(r); }}
                    >
                        Settle
                    </Button>
                ) : (
                    <span className="text-text-muted text-xs flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-400" /> Settled
                    </span>
                ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Debts & Settlements"
                subtitle={`$${totalPending.toFixed(2)} outstanding`}
                icon={<CreditCard size={18} />}
                actions={
                    <Button id="add-debt-btn" icon={<Plus size={14} />} variant="secondary">
                        Add Debt
                    </Button>
                }
            />

            <div className="flex items-center gap-3 mb-5">
                <div className="max-w-xs flex-1">
                    <SearchInput
                        id="debts-search"
                        value={search}
                        onChange={setSearch}
                        placeholder="Search debts..."
                    />
                </div>
                <div className="flex gap-1 p-1 bg-bg-surface border border-border rounded-lg">
                    {(['ALL', 'PENDING', 'PAID'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === f
                                    ? 'bg-accent-blue text-white'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <Table
                columns={columns}
                data={filtered}
                loading={loading}
                emptyMessage="No debts found. Great job staying settled!"
            />

            <SettleModal
                isOpen={settleOpen}
                onClose={() => { setSettleOpen(false); setSettleDebt(null); }}
                debt={settleDebt}
                friends={friends}
                onSuccess={loadData}
            />
        </div>
    );
}
