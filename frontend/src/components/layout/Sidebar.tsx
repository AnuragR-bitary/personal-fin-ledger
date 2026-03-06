import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Receipt,
    ArrowLeftRight,
    CreditCard,
    BarChart3,
    Settings,
    Banknote,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Friends', path: '/friends', icon: Users },
    { label: 'Expenses', path: '/expenses', icon: Receipt },
    { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { label: 'Debts', path: '/debts', icon: CreditCard },
];

const bottomItems = [
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
    const location = useLocation();

    const isActive = (path: string) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col bg-gradient-to-b from-[#0a1020] to-bg-base border-r border-border z-40 shadow-sidebar">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-gradient-blue flex items-center justify-center shadow-glow-blue">
                    <Banknote size={16} className="text-white" />
                </div>
                <div>
                    <p className="text-text-primary font-semibold text-sm leading-tight">FinLedger</p>
                    <p className="text-text-muted text-[10px] uppercase tracking-widest">Personal Finance</p>
                </div>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                <p className="text-text-muted text-[10px] uppercase tracking-widest px-2 pb-2 font-semibold">
                    Main Menu
                </p>
                {navItems.map(({ label, path, icon: Icon }) => {
                    const active = isActive(path);
                    return (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === '/'}
                            className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 relative overflow-hidden
                ${active
                                    ? 'bg-accent-blue/10 text-accent-blue-light border border-accent-blue/20'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                                }
              `}
                        >
                            {active && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-blue rounded-r-full" />
                            )}
                            <Icon
                                size={17}
                                className={`flex-shrink-0 transition-colors ${active ? 'text-accent-blue' : 'text-text-muted group-hover:text-text-secondary'}`}
                            />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight size={13} className="text-accent-blue opacity-60" />}
                        </NavLink>
                    );
                })}

                {/* Bottom section */}
                <div className="pt-4 mt-2 border-t border-border">
                    <p className="text-text-muted text-[10px] uppercase tracking-widest px-2 pb-2 font-semibold">
                        Other
                    </p>
                    {bottomItems.map(({ label, path, icon: Icon }) => {
                        const active = isActive(path);
                        return (
                            <NavLink
                                key={path}
                                to={path}
                                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${active
                                        ? 'bg-accent-blue/10 text-accent-blue-light border border-accent-blue/20'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                                    }
                `}
                            >
                                <Icon
                                    size={17}
                                    className={`flex-shrink-0 transition-colors ${active ? 'text-accent-blue' : 'text-text-muted group-hover:text-text-secondary'}`}
                                />
                                <span>{label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* User zone */}
            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-gradient-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        U
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm font-medium truncate">My Account</p>
                        <p className="text-text-muted text-xs truncate">Personal Ledger</p>
                    </div>
                    <Settings size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
                </div>
            </div>
        </aside>
    );
}
