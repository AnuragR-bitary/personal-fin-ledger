import type { ReactNode } from 'react';
import type { StatCardVariant } from '../../types';

interface StatCardProps {
    label: string;
    value: string;
    icon: ReactNode;
    variant?: StatCardVariant;
    subtext?: string;
    trend?: { value: string; positive: boolean };
}

const variantClasses: Record<StatCardVariant, string> = {
    blue: 'from-blue-600/20 to-blue-800/10 border-blue-500/20',
    green: 'from-emerald-600/20 to-emerald-800/10 border-emerald-500/20',
    red: 'from-red-600/20 to-red-800/10 border-red-500/20',
    amber: 'from-amber-600/20 to-amber-800/10 border-amber-500/20',
};

const iconBg: Record<StatCardVariant, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/20 text-red-400',
    amber: 'bg-amber-500/20 text-amber-400',
};

const valueColor: Record<StatCardVariant, string> = {
    blue: 'text-blue-300',
    green: 'text-emerald-300',
    red: 'text-red-300',
    amber: 'text-amber-300',
};

export default function StatCard({ label, value, icon, variant = 'blue', subtext, trend }: StatCardProps) {
    return (
        <div
            className={`
        relative overflow-hidden rounded-xl border bg-gradient-to-br p-5
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover
        shadow-card group cursor-default
        ${variantClasses[variant]}
      `}
        >
            {/* Background glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-2xl opacity-20 ${variant === 'blue' ? 'bg-blue-500' :
                        variant === 'green' ? 'bg-emerald-500' :
                            variant === 'red' ? 'bg-red-500' : 'bg-amber-500'
                    }`} />
            </div>

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${iconBg[variant]}`}>
                        {icon}
                    </div>
                    {trend && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                            }`}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </span>
                    )}
                </div>

                <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-2xl font-bold font-mono ${valueColor[variant]}`}>{value}</p>
                {subtext && <p className="text-text-muted text-xs mt-1">{subtext}</p>}
            </div>
        </div>
    );
}
