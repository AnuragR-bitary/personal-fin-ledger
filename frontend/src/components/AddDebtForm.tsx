import { useState, useEffect } from 'react';
import { getFriends, createDebt } from '../services/api';
import type { Friend } from '../services/api';
import { PlusCircle } from 'lucide-react';

interface AddDebtFormProps {
    onSuccess: () => void;
}

export default function AddDebtForm({ onSuccess }: AddDebtFormProps) {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [creditorId, setCreditorId] = useState('');
    const [debtorId, setDebtorId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Replace with a better global state solution later if needed
        getFriends().then(setFriends).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !creditorId || !debtorId) return;
        if (creditorId === debtorId) return alert('Creditor and Debtor cannot be the same');

        setLoading(true);
        try {
            await createDebt({
                amount: parseFloat(amount),
                description,
                creditorId,
                debtorId,
            });
            setAmount('');
            setDescription('');
            setCreditorId('');
            setDebtorId('');
            onSuccess();
        } catch (err) {
            console.error('Failed to create debt', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card hover-lift">
            <h2 className="text-xl mb-4 flex items-center gap-2">
                <PlusCircle size={20} className="text-accent-primary" />
                Add Expense / Debt
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Description (e.g., Dinner, Movies)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Amount (e.g., 50.00)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                />

                <div className="grid grid-cols-2">
                    <select value={creditorId} onChange={(e) => setCreditorId(e.target.value)} required>
                        <option value="" disabled>Who paid?</option>
                        {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <select value={debtorId} onChange={(e) => setDebtorId(e.target.value)} required>
                        <option value="" disabled>Who owes?</option>
                        {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
                    {loading ? 'Creating...' : 'Record Debt'}
                </button>
            </form>
        </div>
    );
}
