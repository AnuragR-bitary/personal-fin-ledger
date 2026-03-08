import { useState, useEffect, useMemo } from 'react';
import { ArrowLeftRight, ArrowDownRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import Table from '../components/ui/Table';
import { getPayments } from '../services/payment.service';
import { getFriends } from '../services/friend.service';
import type { Friend, Payment } from '../types';

export default function TransactionsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const friendMap: Record<string, Friend> = {};
    friends.forEach((f) => { friendMap[f.id] = f; });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [p, f] = await Promise.all([getPayments(), getFriends()]);
                setPayments(p);
                setFriends(f);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() =>
        payments.filter((p) => {
            const from = friendMap[p.from_user_id]?.name ?? '';
            const to = friendMap[p.to_user_id]?.name ?? '';
            const term = search.toLowerCase();
            return from.toLowerCase().includes(term) || to.toLowerCase().includes(term) || (p.method ?? '').toLowerCase().includes(term);
        }),
        [payments, friends, search]
    );

    const columns = [
        {
            key: 'type',
            header: 'Type',
            render: (_p: Payment) => (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium bg-accent-green/15 text-accent-green-light">
                    <ArrowDownRight size={12} />
                    Repayment
                </div>
            ),
        },
        {
            key: 'from',
            header: 'From',
            render: (p: Payment) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-red/20 text-red-400 flex items-center justify-center text-[10px] font-bold">
                        {(friendMap[p.from_user_id]?.name ?? '?').charAt(0)}
                    </div>
                    <span className="text-text-primary text-sm">{friendMap[p.from_user_id]?.name ?? p.from_user_id}</span>
                </div>
            ),
        },
        {
            key: 'to',
            header: 'To',
            render: (p: Payment) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-green/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                        {(friendMap[p.to_user_id]?.name ?? 'You').charAt(0)}
                    </div>
                    <span className="text-text-primary text-sm">{friendMap[p.to_user_id]?.name ?? 'You (Owner)'}</span>
                </div>
            ),
        },
        {
            key: 'method',
            header: 'Method',
            render: (p: Payment) => (
                <span className="text-text-secondary text-sm">{p.method ?? '—'}</span>
            ),
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (p: Payment) => (
                <span className="font-mono font-semibold text-emerald-400">₹{Number(p.amount).toFixed(2)}</span>
            ),
        },
        {
            key: 'date',
            header: 'Date',
            render: (p: Payment) => (
                <span className="text-text-muted text-sm">
                    {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '—'}
                </span>
            ),
        },
    ];

    const total = filtered.reduce((s, p) => s + Number(p.amount), 0);

    return (
        <div>
            <PageHeader
                title="Transactions"
                subtitle={`${filtered.length} payments · ₹${total.toFixed(2)} total`}
                icon={<ArrowLeftRight size={18} />}
            />

            <div className="flex items-center gap-3 mb-5">
                <div className="max-w-xs flex-1">
                    <SearchInput
                        id="tx-search"
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by name or method..."
                    />
                </div>
            </div>

            <Table
                columns={columns}
                data={filtered}
                loading={loading}
                emptyMessage="No payments recorded yet."
            />
        </div>
    );
}
