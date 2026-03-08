import { useState, useEffect, useMemo } from 'react';
import { Users, UserPlus, X, Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import { Button, Input } from '../components/ui/FormElements';
import { getFriends, createFriend, updateFriend, deleteFriend } from '../services/friend.service';
import { getBalances } from '../services/payment.service';
import type { Friend, Balance } from '../types';

// ─── Add / Edit Friend Modal ──────────────────────────────────────────────────

function FriendFormModal({ isOpen, onClose, onSuccess, editFriend }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editFriend?: Friend | null;
}) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const isEdit = !!editFriend;

    useEffect(() => {
        if (isOpen && editFriend) {
            setName(editFriend.name);
        }
        if (!isOpen) setName('');
    }, [isOpen, editFriend]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        try {
            if (isEdit && editFriend) {
                await updateFriend(editFriend.id, name.trim());
            } else {
                await createFriend(name.trim());
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Friend' : 'Add New Friend'} size="sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="friend-name"
                    label="Name"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                />
                <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
                    <Button type="submit" size="sm" loading={loading} icon={isEdit ? <Pencil size={14} /> : <Plus size={14} />}>
                        {isEdit ? 'Update' : 'Add Friend'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Friend Drawer ────────────────────────────────────────────────────────────

function FriendDrawer({ friend, balance, isOpen, onClose }: {
    friend: Friend | null;
    balance: Balance | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!friend) return null;

    const hasExpenses = (balance?.total_owed ?? 0) > 0 || (balance?.total_paid ?? 0) > 0;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
                    onClick={onClose}
                />
            )}
            <div className={`
                fixed right-0 top-0 h-screen w-[420px] z-50 bg-bg-card border-l border-border
                flex flex-col shadow-modal transition-transform duration-300 ease-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-blue/20 text-accent-blue-light flex items-center justify-center font-bold">
                            {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-text-primary font-semibold">{friend.name}</h2>
                            <p className="text-text-muted text-xs">
                                Member since {new Date(friend.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Balance summary */}
                {hasExpenses ? (
                    <div className="px-6 py-4 border-b border-border bg-bg-surface flex-shrink-0">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-lg bg-bg-card border border-border">
                                <p className="text-text-muted text-[10px] uppercase tracking-wide mb-1">Total Owed</p>
                                <p className="text-emerald-400 font-bold font-mono">
                                    ₹{(balance?.total_owed ?? 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-bg-card border border-border">
                                <p className="text-text-muted text-[10px] uppercase tracking-wide mb-1">Total Paid</p>
                                <p className="text-blue-400 font-bold font-mono">
                                    ₹{(balance?.total_paid ?? 0).toFixed(2)}
                                </p>
                            </div>
                            <div className={`text-center p-3 rounded-lg border ${(balance?.balance ?? 0) > 0
                                ? 'bg-emerald-500/10 border-emerald-500/20'
                                : 'bg-bg-card border-border'
                                }`}>
                                <p className="text-text-muted text-[10px] uppercase tracking-wide mb-1">Balance</p>
                                <p className={`font-bold font-mono ${(balance?.balance ?? 0) > 0 ? 'text-emerald-400' : 'text-text-muted'}`}>
                                    ₹{(balance?.balance ?? 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-4 border-b border-border bg-bg-surface flex-shrink-0 text-center">
                        <p className="text-text-muted text-sm">No expenses recorded with this friend yet.</p>
                    </div>
                )}

                <div className="flex-1 flex items-center justify-center text-text-muted text-sm px-6">
                    <p>View full history in the <strong>Expenses</strong> and <strong>Payments</strong> pages.</p>
                </div>
            </div>
        </>
    );
}

// ─── Friends Page ─────────────────────────────────────────────────────────────

export default function FriendsPage() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editFriend, setEditFriend] = useState<Friend | null>(null);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const loadData = async () => {
        try {
            const [f, b] = await Promise.all([getFriends(), getBalances()]);
            setFriends(f);
            setBalances(b);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const balanceMap = useMemo(() => {
        const map: Record<string, Balance> = {};
        balances.forEach((b) => { map[b.user_id] = b; });
        return map;
    }, [balances]);

    const filtered = useMemo(() =>
        friends.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
        [friends, search]
    );

    const openDrawer = (friend: Friend) => {
        setSelectedFriend(friend);
        setDrawerOpen(true);
    };

    const handleDeleteFriend = async (friend: Friend, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Delete "${friend.name}"? This cannot be undone.`)) return;
        try {
            await deleteFriend(friend.id);
            setFriends((prev) => prev.filter((f) => f.id !== friend.id));
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        {
            key: 'name',
            header: 'Friend',
            render: (f: Friend) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue-light flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {f.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-text-primary font-medium text-sm">{f.name}</p>
                </div>
            ),
        },
        {
            key: 'totalOwed',
            header: 'Total Owed',
            render: (f: Friend) => {
                const amt = balanceMap[f.id]?.total_owed ?? 0;
                return <span className={`font-mono font-semibold text-sm ${amt > 0 ? 'text-emerald-400' : 'text-text-muted'}`}>
                    {amt > 0 ? `₹${amt.toFixed(2)}` : '—'}
                </span>;
            },
        },
        {
            key: 'totalPaid',
            header: 'Paid Back',
            render: (f: Friend) => {
                const amt = balanceMap[f.id]?.total_paid ?? 0;
                return <span className={`font-mono font-semibold text-sm ${amt > 0 ? 'text-blue-400' : 'text-text-muted'}`}>
                    {amt > 0 ? `₹${amt.toFixed(2)}` : '—'}
                </span>;
            },
        },
        {
            key: 'balance',
            header: 'Balance',
            render: (f: Friend) => {
                const bal = balanceMap[f.id];
                // If no expense was ever created for this friend, show dash
                if (!bal || bal.total_owed === 0) {
                    return <span className="font-mono text-sm text-text-muted">—</span>;
                }
                // Has expense history — show balance or 'Settled'
                return <span className={`font-mono font-semibold text-sm ${bal.balance > 0 ? 'text-emerald-400' : bal.balance < 0 ? 'text-red-400' : 'text-text-muted'}`}>
                    {bal.balance !== 0 ? `₹${bal.balance.toFixed(2)}` : 'Settled'}
                </span>;
            },
        },
        {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (f: Friend) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={(e) => { e.stopPropagation(); setEditFriend(f); }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-accent-blue-light hover:bg-accent-blue/10 transition-colors"
                        title="Edit"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={(e) => handleDeleteFriend(f, e)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); openDrawer(f); }}
                    >
                        View →
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Friends"
                subtitle="Manage people you share expenses with"
                icon={<Users size={18} />}
                actions={
                    <Button
                        id="add-friend-btn"
                        icon={<UserPlus size={14} />}
                        onClick={() => setAddOpen(true)}
                    >
                        Add Friend
                    </Button>
                }
            />

            <div className="mb-5 max-w-xs">
                <SearchInput
                    id="friends-search"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search friends..."
                />
            </div>

            <Table
                columns={columns}
                data={filtered}
                loading={loading}
                emptyMessage="No friends found. Add someone to get started!"
                onRowClick={openDrawer}
            />

            {/* Add Friend */}
            <FriendFormModal
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={loadData}
            />

            {/* Edit Friend */}
            <FriendFormModal
                isOpen={!!editFriend}
                onClose={() => setEditFriend(null)}
                onSuccess={loadData}
                editFriend={editFriend}
            />

            <FriendDrawer
                friend={selectedFriend}
                balance={selectedFriend ? balanceMap[selectedFriend.id] ?? null : null}
                isOpen={drawerOpen}
                onClose={() => { setDrawerOpen(false); setTimeout(() => setSelectedFriend(null), 300); }}
            />
        </div>
    );
}
