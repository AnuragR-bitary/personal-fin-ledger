import { useState, useEffect, useMemo } from 'react';
import { Users, UserPlus, Phone, ArrowUpRight, ArrowDownRight, X, Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import { Button, Input } from '../components/ui/FormElements';
import { getFriends, createFriend, getDebts, recordRepayment } from '../services/api';
import type { Friend, Debt } from '../types';

// ─── Add Friend Modal ─────────────────────────────────────────────────────────

function AddFriendModal({ isOpen, onClose, onSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (friend: Friend) => void;
}) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        try {
            const f = await createFriend(name.trim(), phone.trim() || undefined);
            onSuccess(f);
            setName(''); setPhone('');
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Friend" size="sm">
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
                <Input
                    id="friend-phone"
                    label="Phone / Identifier (optional)"
                    placeholder="e.g. +1 555 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
                    <Button type="submit" size="sm" loading={loading} icon={<Plus size={14} />}>Add Friend</Button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Friend Drawer ────────────────────────────────────────────────────────────

function FriendDrawer({ friend, debts, friends, isOpen, onClose, onRepaymentSuccess }: {
    friend: Friend | null;
    debts: Debt[];
    friends: Friend[];
    isOpen: boolean;
    onClose: () => void;
    onRepaymentSuccess: () => void;
}) {
    const [repayDebt, setRepayDebt] = useState<Debt | null>(null);
    const [repayAmount, setRepayAmount] = useState('');
    const [repayLoading, setRepayLoading] = useState(false);

    if (!friend) return null;

    const friendMap: Record<string, Friend> = {};
    friends.forEach((f) => { friendMap[f.id] = f; });

    const friendDebts = debts.filter(
        (d) => d.creditorId === friend.id || d.debtorId === friend.id
    );
    const pendingDebts = friendDebts.filter((d) => d.status === 'PENDING');
    const theyOweMe = pendingDebts
        .filter((d) => d.creditorId !== friend.id)
        .reduce((s, d) => s + Number(d.amount), 0);
    const iOweThem = pendingDebts
        .filter((d) => d.creditorId === friend.id)
        .reduce((s, d) => s + Number(d.amount), 0);
    const net = theyOweMe - iOweThem;

    const handleRepay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!repayDebt || !repayAmount) return;
        setRepayLoading(true);
        try {
            await recordRepayment(repayDebt.id, parseFloat(repayAmount));
            setRepayDebt(null);
            setRepayAmount('');
            onRepaymentSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setRepayLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Drawer panel */}
            <div
                className={`
          fixed right-0 top-0 h-screen w-[420px] z-50 bg-bg-card border-l border-border
          flex flex-col shadow-modal transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-blue/20 text-accent-blue-light flex items-center justify-center font-bold">
                            {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-text-primary font-semibold">{friend.name}</h2>
                            {friend.phone && (
                                <p className="text-text-muted text-xs flex items-center gap-1">
                                    <Phone size={10} /> {friend.phone}
                                </p>
                            )}
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
                <div className="px-6 py-4 border-b border-border bg-bg-surface flex-shrink-0">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-lg bg-bg-card border border-border">
                            <p className="text-text-muted text-[10px] uppercase tracking-wide mb-1">They Owe</p>
                            <p className="text-emerald-400 font-bold font-mono">${theyOweMe.toFixed(2)}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-bg-card border border-border">
                            <p className="text-text-muted text-[10px] uppercase tracking-wide mb-1">I Owe</p>
                            <p className="text-red-400 font-bold font-mono">${iOweThem.toFixed(2)}</p>
                        </div>
                        <div className={`text-center p-3 rounded-lg border ${net >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                            }`}>
                            <p className="text-text-muted text-[10px] uppercase tracking-wide mb-1">Net</p>
                            <p className={`font-bold font-mono ${net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {net >= 0 ? '+' : '-'}${Math.abs(net).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transaction history */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <h3 className="text-text-muted text-xs uppercase tracking-wider mb-3 font-semibold">
                        Transactions ({friendDebts.length})
                    </h3>
                    {friendDebts.length === 0 ? (
                        <p className="text-text-muted text-sm text-center py-8">No transactions yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {friendDebts.map((debt) => {
                                const isCreditedToFriend = debt.creditorId === friend.id;
                                const isPending = debt.status === 'PENDING';
                                const other = isCreditedToFriend
                                    ? friendMap[debt.debtorId]?.name
                                    : friendMap[debt.creditorId]?.name;

                                return (
                                    <div key={debt.id} className="p-3 rounded-lg bg-bg-surface border border-border">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-2.5">
                                                <div className={`p-1.5 rounded-lg mt-0.5 ${isCreditedToFriend ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                                    {isCreditedToFriend ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                                </div>
                                                <div>
                                                    <p className="text-text-primary text-sm font-medium">{debt.description}</p>
                                                    <p className="text-text-muted text-xs mt-0.5">
                                                        {isCreditedToFriend ? `${other} owes them` : `Owes ${other}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-text-primary text-sm font-semibold font-mono">
                                                    ${Number(debt.amount).toFixed(2)}
                                                </p>
                                                <span className={`text-[10px] font-medium ${isPending ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                    {debt.status}
                                                </span>
                                            </div>
                                        </div>

                                        {isPending && !isCreditedToFriend && (
                                            repayDebt?.id === debt.id ? (
                                                <form onSubmit={handleRepay} className="mt-3 flex gap-2">
                                                    <Input
                                                        id={`repay-${debt.id}`}
                                                        type="number"
                                                        value={repayAmount}
                                                        onChange={(e) => setRepayAmount(e.target.value)}
                                                        placeholder="Amount"
                                                        min="0.01"
                                                        max={debt.amount}
                                                        step="0.01"
                                                        required
                                                        className="flex-1"
                                                    />
                                                    <Button type="submit" size="sm" variant="success" loading={repayLoading}>Pay</Button>
                                                    <Button type="button" size="sm" variant="ghost" onClick={() => setRepayDebt(null)}>✕</Button>
                                                </form>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    className="mt-2 w-full"
                                                    onClick={() => { setRepayDebt(debt); setRepayAmount(debt.amount.toString()); }}
                                                >
                                                    Record Repayment
                                                </Button>
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Friends Page ─────────────────────────────────────────────────────────────

export default function FriendsPage() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const loadData = async () => {
        try {
            const [f, d] = await Promise.all([getFriends(), getDebts()]);
            setFriends(f);
            setDebts(d);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const filtered = useMemo(() =>
        friends.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
        [friends, search]
    );

    const openDrawer = (friend: Friend) => {
        setSelectedFriend(friend);
        setDrawerOpen(true);
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
                    <div>
                        <p className="text-text-primary font-medium text-sm">{f.name}</p>
                        {f.phone && <p className="text-text-muted text-xs">{f.phone}</p>}
                    </div>
                </div>
            ),
        },
        {
            key: 'theyOwe',
            header: 'They Owe You',
            render: (f: Friend) => {
                const amt = debts
                    .filter((d) => d.debtorId === f.id && d.status === 'PENDING')
                    .reduce((s, d) => s + Number(d.amount), 0);
                return <span className={`font-mono font-semibold text-sm ${amt > 0 ? 'text-emerald-400' : 'text-text-muted'}`}>
                    {amt > 0 ? `+$${amt.toFixed(2)}` : '—'}
                </span>;
            },
        },
        {
            key: 'youOwe',
            header: 'You Owe Them',
            render: (f: Friend) => {
                const amt = debts
                    .filter((d) => d.creditorId === f.id && d.status === 'PENDING')
                    .reduce((s, d) => s + Number(d.amount), 0);
                return <span className={`font-mono font-semibold text-sm ${amt > 0 ? 'text-red-400' : 'text-text-muted'}`}>
                    {amt > 0 ? `-$${amt.toFixed(2)}` : '—'}
                </span>;
            },
        },
        {
            key: 'txns',
            header: 'Transactions',
            render: (f: Friend) => {
                const count = debts.filter((d) => d.creditorId === f.id || d.debtorId === f.id).length;
                return <span className="badge-blue">{count}</span>;
            },
        },
        {
            key: 'actions',
            header: '',
            render: (f: Friend) => (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); openDrawer(f); }}
                >
                    View →
                </Button>
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

            {/* Search bar */}
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

            {/* Modals & Drawers */}
            <AddFriendModal
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={(f) => setFriends((prev) => [...prev, f])}
            />

            <FriendDrawer
                friend={selectedFriend}
                debts={debts}
                friends={friends}
                isOpen={drawerOpen}
                onClose={() => { setDrawerOpen(false); setTimeout(() => setSelectedFriend(null), 300); }}
                onRepaymentSuccess={loadData}
            />
        </div>
    );
}
