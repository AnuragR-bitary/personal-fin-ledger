import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface PageLayoutProps {
    children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    return (
        <div className="min-h-screen bg-bg-base flex">
            <Sidebar />
            {/* Main content — offset by the sidebar width */}
            <div className="flex-1 ml-60 min-h-screen flex flex-col">
                <main className="flex-1 p-6 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
