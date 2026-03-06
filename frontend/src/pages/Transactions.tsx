import { useState, useEffect, useMemo } from 'react';
import { ArrowLeftRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import Table from '../components/ui/Table';
import { getFriends, getDebts } from '../services/api';
import type { Friend, Debt } from '../types';

// We derive "transactions" from our debts list until a dedicated API endpoint exists.

interface TxRow {
    id: string;
    from: string;
    to: string;
    amount: number;
    description: string;
    date: string;
    type: 'EXPENSE_SPLIT' | 'REPAYMENT';
    status: 'PENDING' | 'PAID';
}

export default function TransactionsPage() {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL');

    const friendMap: Record<string, Friend> = {};
    friends.forEach((f) => { friendMap[f.id] = f; });

    useEffect(() => {
        const load = async () => {
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
        load();
    }, []);

    const rows: TxRow[] = debts.map((d) => ({
        id: d.id,
        from: friendMap[d.debtorId]?.name ?? d.debtorId,
        to: friendMap[d.creditorId]?.name ?? d.creditorId,
        amount: Number(d.amount),
        description: d.description,
        date: d.createdAt ?? '',
        type: 'EXPENSE_SPLIT',
        status: d.status,
    }));

    const filtered = useMemo(() => {
        return rows
            .filter((r) => typeFilter === 'ALL' || r.status === typeFilter)
            .filter((r) =>
                r.description.toLowerCase().includes(search.toLowerCase()) ||
                r.from.toLowerCase().includes(search.toLowerCase()) ||
                r.to.toLowerCase().includes(search.toLowerCase())
            );
    }, [rows, search, typeFilter]);

    const columns = [
        {
            key: 'type',
            header: 'Type',
            render: (r: TxRow) => (
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${r.type === 'EXPENSE_SPLIT'
                        ? 'bg-accent-blue/15 text-accent-blue-light'
                        : 'bg-accent-green/15 text-accent-green-light'
                    }`}>
                    {r.type === 'EXPENSE_SPLIT' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {r.type === 'EXPENSE_SPLIT' ? 'Expense Split' : 'Repayment'}
                </div>
            ),
        },
        {
            key: 'from',
            header: 'From',
            render: (r: TxRow) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-red/20 text-red-400 flex items-center justify-center text-[10px] font-bold">
                        {r.from.charAt(0)}
                    </div>
                    <span className="text-text-primary text-sm">{r.from}</span>
                </div>
            ),
        },
        {
            key: 'to',
            header: 'To',
            render: (r: TxRow) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-green/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                        {r.to.charAt(0)}
                    </div>
                    <span className="text-text-primary text-sm">{r.to}</span>
                </div>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            render: (r: TxRow) => <span className="text-text-secondary text-sm">{r.description}</span>,
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (r: TxRow) => (
                <span className="font-mono font-semibold text-text-primary">${r.amount.toFixed(2)}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (r: TxRow) => (
                <span className={r.status === 'PENDING' ? 'badge-amber' : 'badge-success'}>
                    {r.status}
                </span>
            ),
        },
        {
            key: 'date',
            header: 'Date',
            render: (r: TxRow) => (
                <span className="text-text-muted text-sm">
                    {r.date ? new Date(r.date).toLocaleDateString() : '—'}
                </span>
            ),
        },
    ];

    const total = filtered.reduce((s, r) => s + r.amount, 0);

    return (
        <div>
            <PageHeader
                title="Transactions"
                subtitle={`${filtered.length} transactions · $${total.toFixed(2)} total`}
                icon={<ArrowLeftRight size={18} />}
            />

            <div className="flex items-center gap-3 mb-5">
                <div className="max-w-xs flex-1">
                    <SearchInput
                        id="tx-search"
                        value={search}
                        onChange={setSearch}
                        placeholder="Search transactions..."
                    />
                </div>
                <div className="flex gap-1 p-1 bg-bg-surface border border-border rounded-lg">
                    {(['ALL', 'PENDING', 'PAID'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setTypeFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${typeFilter === f
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
                emptyMessage="No transactions found."
            />
        </div>
    );
}
