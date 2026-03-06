import { Settings } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export default function SettingsPage() {
    return (
        <div>
            <PageHeader
                title="Settings"
                subtitle="Application preferences"
                icon={<Settings size={18} />}
            />
            <div className="glass-card">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-text-primary font-medium text-sm mb-1">API Endpoint</h3>
                        <p className="text-text-muted text-xs mb-3">Backend URL for all API requests</p>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-surface border border-border font-mono text-sm text-text-secondary">
                            {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}
                        </div>
                    </div>
                    <div className="border-t border-border pt-4">
                        <h3 className="text-text-primary font-medium text-sm mb-1">Version</h3>
                        <p className="text-text-muted text-xs">FinLedger v1.0.0 · Personal Finance Tracker</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
