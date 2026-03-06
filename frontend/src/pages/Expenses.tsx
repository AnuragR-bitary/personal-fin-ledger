import { useState, useEffect, useMemo } from 'react';
import { Receipt, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import { Button, Input, Select } from '../components/ui/FormElements';
import { getExpenses, getFriends, createExpense, deleteExpense } from '../services/api';
import type { Expense, Friend } from '../types';

// ─── Add Expense Modal ────────────────────────────────────────────────────────

function AddExpenseModal({ isOpen, onClose, friends, onSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    friends: Friend[];
    onSuccess: () => void;
}) {
    const [form, setForm] = useState({
        description: '',
        amount: '',
        paidById: '',
        participants: [] as string[],
        splitType: 'EQUAL' as 'EQUAL' | 'CUSTOM',
        date: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);

    const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

    const toggleParticipant = (id: string) => {
        set('participants', form.participants.includes(id)
            ? form.participants.filter((p) => p !== id)
            : [...form.participants, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.description || !form.amount || !form.paidById || form.participants.length === 0) return;
        setLoading(true);
        try {
            await createExpense({
                description: form.description,
                amount: parseFloat(form.amount),
                paidById: form.paidById,
                participants: form.participants,
                splitType: form.splitType,
                date: form.date,
            });
            onSuccess();
            onClose();
            setForm({ description: '', amount: '', paidById: '', participants: [], splitType: 'EQUAL', date: new Date().toISOString().split('T')[0] });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const friendOptions = friends.map((f) => ({ value: f.id, label: f.name }));

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
                        label="Amount ($)"
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

                <Select
                    id="expense-paid-by"
                    label="Who Paid?"
                    value={form.paidById}
                    onChange={(e) => set('paidById', e.target.value)}
                    options={friendOptions}
                    placeholder="Select friend"
                    required
                />

                <div>
                    <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Participants</p>
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

                <Select
                    id="expense-split"
                    label="Split Type"
                    value={form.splitType}
                    onChange={(e) => set('splitType', e.target.value as 'EQUAL' | 'CUSTOM')}
                    options={[
                        { value: 'EQUAL', label: 'Equal Split' },
                        { value: 'CUSTOM', label: 'Custom Split' },
                    ]}
                />

                <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        size="sm"
                        loading={loading}
                        icon={<Plus size={14} />}
                        disabled={form.participants.length === 0}
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
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [addOpen, setAddOpen] = useState(false);

    const friendMap: Record<string, Friend> = {};
    friends.forEach((f) => { friendMap[f.id] = f; });

    const loadData = async () => {
        setLoading(true);
        try {
            const [e, f] = await Promise.all([getExpenses(), getFriends()]);
            setExpenses(e);
            setFriends(f);
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
                <span className="font-mono font-semibold text-text-primary">${Number(ex.amount).toFixed(2)}</span>
            ),
        },
        {
            key: 'paidBy',
            header: 'Paid By',
            render: (ex: Expense) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple-light flex items-center justify-center text-[10px] font-bold">
                        {friendMap[ex.paidById]?.name?.charAt(0) ?? '?'}
                    </div>
                    <span className="text-text-secondary text-sm">{friendMap[ex.paidById]?.name ?? 'Unknown'}</span>
                </div>
            ),
        },
        {
            key: 'participants',
            header: 'Split With',
            render: (ex: Expense) => (
                <div className="flex items-center -space-x-1.5">
                    {ex.participants.slice(0, 4).map((pid) => (
                        <div
                            key={pid}
                            title={friendMap[pid]?.name}
                            className="w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan border border-bg-card flex items-center justify-center text-[9px] font-bold"
                        >
                            {friendMap[pid]?.name?.charAt(0) ?? '?'}
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
                <span className={ex.splitType === 'EQUAL' ? 'badge-blue' : 'badge-purple'}>{ex.splitType}</span>
            ),
        },
        {
            key: 'date',
            header: 'Date',
            render: (ex: Expense) => (
                <span className="text-text-muted text-sm">{new Date(ex.date).toLocaleDateString()}</span>
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
                subtitle={`${expenses.length} expenses · $${totalAmount.toFixed(2)} total`}
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
                friends={friends}
                onSuccess={loadData}
            />
        </div>
    );
}
