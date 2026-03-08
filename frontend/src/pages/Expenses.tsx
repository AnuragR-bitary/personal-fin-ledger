import { useState, useEffect, useMemo } from 'react';
import { Receipt, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import { Button, Input, Select } from '../components/ui/FormElements';
import { getExpenses, createExpense, deleteExpense } from '../services/expense.service';
import { getFriends, getMe } from '../services/friend.service';
import type { Expense, Friend, CreateExpenseInput } from '../types';

// ─── Add Expense Modal ────────────────────────────────────────────────────────

function AddExpenseModal({ isOpen, onClose, owner, friends, onSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    owner: Friend | null;
    friends: Friend[];          // non-owner friends only
    onSuccess: () => void;
}) {
    const everyone = useMemo(() => {
        // Owner always appears first, labelled "Me"
        const all: { id: string; label: string }[] = [];
        if (owner) all.push({ id: owner.id, label: 'Me' });
        friends.forEach((f) => all.push({ id: f.id, label: f.name }));
        return all;
    }, [owner, friends]);

    const [form, setForm] = useState({
        description: '',
        amount: '',
        paidById: owner?.id ?? '',
        participants: [] as string[],
        splitType: 'EQUAL' as 'EQUAL' | 'CUSTOM',
        date: new Date().toISOString().split('T')[0],
    });

    // Custom split amounts keyed by userId
    const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Every time the modal opens, default paidById to the owner
    useEffect(() => {
        if (isOpen && owner) {
            setForm((p) => ({ ...p, paidById: p.paidById || owner.id }));
        }
        if (!isOpen) {
            // Full reset on close
            setForm({ description: '', amount: '', paidById: owner?.id ?? '', participants: [], splitType: 'EQUAL', date: new Date().toISOString().split('T')[0] });
            setCustomAmounts({});
        }
    }, [isOpen, owner]);

    const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

    const toggleParticipant = (id: string) => {
        const next = form.participants.includes(id)
            ? form.participants.filter((p) => p !== id)
            : [...form.participants, id];
        set('participants', next);
        // Remove custom amount if participant removed
        if (form.participants.includes(id)) {
            setCustomAmounts((prev) => { const c = { ...prev }; delete c[id]; return c; });
        }
    };

    const totalAmount = parseFloat(form.amount) || 0;
    // For equal split: total / (selected friends + payer)
    const perPerson = form.participants.length > 0
        ? (totalAmount / (form.participants.length + 1)).toFixed(2)
        : '0.00';

    // Validation: custom amounts must not exceed total and all fields must be filled
    const customTotal = Object.values(customAmounts).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    const allCustomFilled = form.splitType !== 'CUSTOM' || form.participants.every((uid) => parseFloat(customAmounts[uid]) > 0);
    const customValid = form.splitType !== 'CUSTOM' || (allCustomFilled && customTotal <= totalAmount + 0.01);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.description || !form.amount || !form.paidById || form.participants.length === 0) return;
        if (!customValid) return;
        setLoading(true);
        try {
            const participants = form.participants.map((userId) => ({
                userId,
                owedAmount: form.splitType === 'CUSTOM' ? parseFloat(customAmounts[userId] || '0') : undefined,
            }));
            const input: CreateExpenseInput = {
                description: form.description,
                amount: totalAmount,
                paidByUserId: form.paidById,
                expenseDate: form.date,
                splitType: form.splitType,
                participants,
            };
            await createExpense(input);
            onSuccess();
            onClose();
            // Reset
            setForm({ description: '', amount: '', paidById: owner?.id ?? '', participants: [], splitType: 'EQUAL', date: new Date().toISOString().split('T')[0] });
            setCustomAmounts({});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const paidByOptions = everyone.map((p) => ({ value: p.id, label: p.label }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Expense" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="expense-desc"
                    label="Description"
                    placeholder="e.g. Dinner at restaurant"
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    required
                    autoFocus
                />

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        id="expense-amount"
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
                        id="expense-date"
                        label="Date"
                        type="date"
                        value={form.date}
                        onChange={(e) => set('date', e.target.value)}
                        required
                    />
                </div>

                {/* Who paid? — includes "Me" by default */}
                <Select
                    id="expense-paid-by"
                    label="Who Paid?"
                    value={form.paidById || (owner?.id ?? '')}
                    onChange={(e) => set('paidById', e.target.value)}
                    options={paidByOptions}
                    required
                />

                {/* Participants */}
                <div>
                    <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                        Split Between
                        {form.splitType === 'EQUAL' && form.participants.length > 0 && (
                            <span className="ml-2 text-text-muted normal-case font-normal">
                                (₹{perPerson} each)
                            </span>
                        )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {friends.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => toggleParticipant(f.id)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.participants.includes(f.id)
                                    ? 'bg-accent-blue/20 border-accent-blue/30 text-accent-blue-light'
                                    : 'bg-bg-surface border-border text-text-secondary hover:bg-bg-hover'
                                    }`}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                    {form.participants.length === 0 && (
                        <p className="text-text-muted text-xs mt-1">Select at least one participant</p>
                    )}
                </div>

                {/* Split type */}
                <Select
                    id="expense-split"
                    label="Split Type"
                    value={form.splitType}
                    onChange={(e) => {
                        set('splitType', e.target.value as 'EQUAL' | 'CUSTOM');
                        setCustomAmounts({});
                    }}
                    options={[
                        { value: 'EQUAL', label: 'Equal Split' },
                        { value: 'CUSTOM', label: 'Custom Split' },
                    ]}
                />

                {/* Custom split — per-participant amount inputs */}
                {form.splitType === 'CUSTOM' && form.participants.length > 0 && (
                    <div className="p-3 rounded-xl bg-bg-surface border border-border space-y-2">
                        <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                            Custom Amounts
                            {totalAmount > 0 && (
                                <span className={`ml-2 normal-case font-normal ${customValid ? 'text-emerald-400' : 'text-red-400'}`}>
                                    — ₹{customTotal.toFixed(2)} / ₹{totalAmount.toFixed(2)}
                                    {!customValid && ' (must match total)'}
                                </span>
                            )}
                        </p>
                        {form.participants.map((uid) => {
                            const label = everyone.find((p) => p.id === uid)?.label ?? uid;
                            return (
                                <div key={uid} className="flex items-center gap-3">
                                    <span className="text-text-secondary text-sm w-28 truncate">{label}</span>
                                    <Input
                                        id={`custom-amt-${uid}`}
                                        type="number"
                                        placeholder="0.00"
                                        value={customAmounts[uid] ?? ''}
                                        onChange={(e) => setCustomAmounts((prev) => ({ ...prev, [uid]: e.target.value }))}
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        size="sm"
                        loading={loading}
                        icon={<Plus size={14} />}
                        disabled={form.participants.length === 0 || !customValid}
                    >
                        Add Expense
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Expenses Page ────────────────────────────────────────────────────────────

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [owner, setOwner] = useState<Friend | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [addOpen, setAddOpen] = useState(false);

    // Map ALL users (owner + friends) for display
    const friendMap: Record<string, Friend> = {};
    if (owner) friendMap[owner.id] = owner;
    friends.forEach((f) => { friendMap[f.id] = f; });

    const loadData = async () => {
        setLoading(true);
        try {
            const [e, f, me] = await Promise.all([getExpenses(), getFriends(), getMe()]);
            setExpenses(e);
            setFriends(f);
            setOwner(me);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const filtered = useMemo(() =>
        expenses.filter((e) => e.description.toLowerCase().includes(search.toLowerCase())),
        [expenses, search]
    );

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Delete this expense?')) return;
        try {
            await deleteExpense(id);
            setExpenses((prev) => prev.filter((x) => x.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Label a user_id — owner always shown as "Me"
    const labelFor = (userId: string) => {
        const f = friendMap[userId];
        if (!f) return 'Unknown';
        return f.is_owner ? 'Me' : f.name;
    };

    const columns = [
        {
            key: 'description',
            header: 'Description',
            render: (ex: Expense) => (
                <p className="text-text-primary font-medium text-sm">{ex.description}</p>
            ),
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (ex: Expense) => (
                <span className="font-mono font-semibold text-text-primary">₹{Number(ex.amount).toFixed(2)}</span>
            ),
        },
        {
            key: 'paidBy',
            header: 'Paid By',
            render: (ex: Expense) => {
                const name = labelFor(ex.paid_by_user_id);
                const isMe = friendMap[ex.paid_by_user_id]?.is_owner;
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isMe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-accent-purple/20 text-accent-purple-light'}`}>
                            {name.charAt(0)}
                        </div>
                        <span className="text-text-secondary text-sm">{name}</span>
                    </div>
                );
            },
        },
        {
            key: 'myShare',
            header: 'My Share',
            render: (ex: Expense) => {
                if (!owner) return <span className="text-text-muted text-sm">—</span>;
                const myParticipant = ex.participants.find((p) => p.user_id === owner.id);
                if (!myParticipant) return <span className="text-text-muted text-sm">—</span>;

                const paidByMe = ex.paid_by_user_id === owner.id;
                const share = Number(myParticipant.owed_amount);

                // If I paid: I'm owed money (positive — show green)
                // If friend paid: I owe them (negative — show red)
                return paidByMe
                    ? <span className="font-mono text-sm text-emerald-400">+₹{share.toFixed(2)}</span>
                    : <span className="font-mono text-sm text-red-400">-₹{share.toFixed(2)}</span>;
            },
        },
        {
            key: 'participants',
            header: 'Split With',
            render: (ex: Expense) => (
                <div className="flex items-center -space-x-1.5">
                    {ex.participants.slice(0, 4).map((p) => (
                        <div
                            key={p.user_id}
                            title={labelFor(p.user_id)}
                            className="w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan border border-bg-card flex items-center justify-center text-[9px] font-bold"
                        >
                            {labelFor(p.user_id).charAt(0)}
                        </div>
                    ))}
                    {ex.participants.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-bg-elevated border border-bg-card text-text-muted text-[9px] flex items-center justify-center">
                            +{ex.participants.length - 4}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'splitType',
            header: 'Split',
            render: (ex: Expense) => (
                <span className={ex.split_type === 'EQUAL' ? 'badge-blue' : 'badge-purple'}>{ex.split_type}</span>
            ),
        },
        {
            key: 'date',
            header: 'Date',
            render: (ex: Expense) => (
                <span className="text-text-muted text-sm">{new Date(ex.expense_date).toLocaleDateString()}</span>
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (ex: Expense) => (
                <button
                    onClick={(e) => handleDelete(ex.id, e)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Expense"
                >
                    <Trash2 size={14} />
                </button>
            ),
        },
    ];

    const totalAmount = expenses.reduce((s, e) => s + Number(e.amount), 0);

    return (
        <div>
            <PageHeader
                title="Expenses"
                subtitle={`${expenses.length} expenses · ₹${totalAmount.toFixed(2)} total`}
                icon={<Receipt size={18} />}
                actions={
                    <Button id="add-expense-btn" icon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
                        Add Expense
                    </Button>
                }
            />

            <div className="mb-5 max-w-xs">
                <SearchInput
                    id="expenses-search"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search expenses..."
                />
            </div>

            <Table
                columns={columns}
                data={filtered}
                loading={loading}
                emptyMessage="No expenses yet. Add the first one!"
            />

            <AddExpenseModal
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                owner={owner}
                friends={friends}
                onSuccess={loadData}
            />
        </div>
    );
}
