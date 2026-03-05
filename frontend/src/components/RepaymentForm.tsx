import { useState } from 'react';
import { recordRepayment } from '../services/api';
import type { Debt } from '../services/api';
import { CreditCard } from 'lucide-react';

interface RepaymentFormProps {
    debt: Debt;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function RepaymentForm({ debt, onSuccess, onCancel }: RepaymentFormProps) {
    const [amount, setAmount] = useState<string>(debt.amount.toString());
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        setLoading(true);
        try {
            await recordRepayment(debt.id, parseFloat(amount));
            onSuccess();
        } catch (err) {
            console.error('Failed to record repayment', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 border border-border rounded-lg bg-primary">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="text-sm text-secondary">Repayment Amount (Max: ${debt.amount})</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    max={debt.amount}
                    step="0.01"
                    required
                />
                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={onCancel} className="btn bg-secondary border border-border text-sm" disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-success text-sm flex items-center gap-1" disabled={loading}>
                        <CreditCard size={16} /> {loading ? 'Processing...' : 'Settle'}
                    </button>
                </div>
            </form>
        </div>
    );
}
