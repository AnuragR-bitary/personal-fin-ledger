import { useState, useEffect, useMemo } from 'react';
import { CreditCard, CheckCircle2, Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import { Button, Input, Select } from '../components/ui/FormElements';
import { getBalances, createPayment } from '../services/payment.service';
import type { Balance, CreatePaymentInput } from '../types';

// ─── Record Payment Modal ─────────────────────────────────────────────────────
// Only shows friends who actually owe money (balance > 0)

function RecordPaymentModal({ isOpen, onClose, pendingBalances, onSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    pendingBalances: Balance[];  // pre-filtered to balance > 0
    onSuccess: () => void;
}) {
    const [form, setForm] = useState({ fromUserId: '', amount: '', method: '' });
    const [loading, setLoading] = useState(false);
    const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

    // When a friend is selected, pre-fill with their outstanding balance
    const handleFriendChange = (userId: string) => {
        const bal = pendingBalances.find((b) => b.user_id === userId);
        setForm((p) => ({
            ...p,
            fromUserId: userId,
            amount: bal ? bal.balance.toFixed(2) : '',
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.fromUserId || !form.amount || !form.method) return;
        setLoading(true);
        try {
            const input: CreatePaymentInput = {
                fromUserId: form.fromUserId,
                amount: parseFloat(form.amount),
                method: form.method,
            };
            await createPayment(input);
            onSuccess();
            onClose();
            setForm({ fromUserId: '', amount: '', method: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const friendOptions = pendingBalances.map((b) => ({
        value: b.user_id,
        label: `${b.name} — owes ₹${b.balance.toFixed(2)}`,
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="sm">
            {pendingBalances.length === 0 ? (
                <div className="py-8 text-center text-text-muted">
                    <p className="text-3xl mb-2">🎉</p>
                    <p className="text-sm">All your friends are settled up!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        id="pay-from"
                        label="Who is paying you back?"
                        value={form.fromUserId}
                        onChange={(e) => handleFriendChange(e.target.value)}
                        options={friendOptions}
                        placeholder="Select friend"
                        required
                    />
                    <Input
                        id="pay-amount"
                        label="Amount (₹)"
                        type="number"
                        placeholder="0.00"
                        value={form.amount}
                        onChange={(e) => set('amount', e.target.value)}
                        min="0.01"
                        step="0.01"
                        required
                    />
                    <Input
                        id="pay-method"
                        label="Method"
                        placeholder="e.g. UPI, Cash, Bank Transfer"
                        value={form.method}
                        onChange={(e) => set('method', e.target.value)}
                        required
                    />
                    <div className="flex gap-2 justify-end pt-2">
                        <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="success" size="sm" loading={loading} icon={<CheckCircle2 size={14} />}>
                            Record Payment
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

// ─── Debts Page ───────────────────────────────────────────────────────────────

export default function DebtsPage() {
    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [payOpen, setPayOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SETTLED'>('PENDING');

    const loadData = async () => {
        setLoading(true);
        try {
            const b = await getBalances();
            // Only show friends who have ever had an expense (total_owed > 0)
            setBalances(b.filter((bal) => bal.total_owed > 0));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // Friends with outstanding balance — used for payment modal
    const pendingBalances = useMemo(() => balances.filter((b) => b.balance > 0), [balances]);

    const filtered = useMemo(() =>
        balances
            .filter((b) => {
                if (statusFilter === 'PENDING') return b.balance > 0;
                if (statusFilter === 'SETTLED') return b.balance <= 0;
                return true;
            })
            .filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
        [balances, search, statusFilter]
    );

    const totalPending = pendingBalances.reduce((s, b) => s + b.balance, 0);

    const columns = [
        {
            key: 'friend',
            header: 'Friend',
            render: (b: Balance) => (
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-accent-amber/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                        {b.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-text-primary text-sm font-medium">{b.name}</span>
                </div>
            ),
        },
        {
            key: 'total_owed',
            header: 'Total Owed',
            render: (b: Balance) => (
                <span className="font-mono text-sm text-text-secondary">₹{b.total_owed.toFixed(2)}</span>
            ),
        },
        {
            key: 'total_paid',
            header: 'Paid Back',
            render: (b: Balance) => (
                <span className="font-mono text-sm text-blue-400">₹{b.total_paid.toFixed(2)}</span>
            ),
        },
        {
            key: 'balance',
            header: 'Outstanding',
            render: (b: Balance) => (
                <span className={`font-mono font-semibold text-sm ${b.balance > 0 ? 'text-emerald-400' : 'text-text-muted'}`}>
                    {b.balance > 0 ? `₹${b.balance.toFixed(2)}` : '—'}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (b: Balance) => (
                <span className={b.balance > 0 ? 'badge-amber' : 'badge-success'}>
                    {b.balance > 0 ? 'PENDING' : 'SETTLED'}
                </span>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Debts & Settlements"
                subtitle={`₹${totalPending.toFixed(2)} outstanding`}
                icon={<CreditCard size={18} />}
                actions={
                    <Button
                        id="record-payment-btn"
                        icon={<Plus size={14} />}
                        variant="success"
                        onClick={() => setPayOpen(true)}
                    >
                        Record Payment
                    </Button>
                }
            />

            <div className="flex items-center gap-3 mb-5">
                <div className="max-w-xs flex-1">
                    <SearchInput
                        id="debts-search"
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by friend..."
                    />
                </div>
                <div className="flex gap-1 p-1 bg-bg-surface border border-border rounded-lg">
                    {(['ALL', 'PENDING', 'SETTLED'] as const).map((f) => (
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
                emptyMessage={statusFilter === 'PENDING' ? 'All settled up! 🎉' : 'No data found.'}
            />

            <RecordPaymentModal
                isOpen={payOpen}
                onClose={() => setPayOpen(false)}
                pendingBalances={pendingBalances}
                onSuccess={loadData}
            />
        </div>
    );
}
