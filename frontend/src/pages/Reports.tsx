import { BarChart3, Construction } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export default function ReportsPage() {
    return (
        <div>
            <PageHeader
                title="Reports"
                subtitle="Financial insights and analytics"
                icon={<BarChart3 size={18} />}
            />
            <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center mb-4">
                    <Construction size={28} className="text-accent-blue" />
                </div>
                <h2 className="text-text-primary font-semibold text-lg mb-2">Coming Soon</h2>
                <p className="text-text-muted text-sm max-w-xs">
                    Reports & analytics will be available in a future update. Stay tuned!
                </p>
            </div>
        </div>
    );
}
