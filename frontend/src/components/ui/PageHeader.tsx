import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    icon?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions, icon }: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="p-2.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">
                        {icon}
                    </div>
                )}
                <div>
                    <h1 className="text-xl font-bold text-text-primary">{title}</h1>
                    {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
