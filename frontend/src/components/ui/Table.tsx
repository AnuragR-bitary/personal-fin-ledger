import type { ReactNode } from 'react';

interface Column<T> {
    key: string;
    header: string;
    render?: (row: T) => ReactNode;
    className?: string;
}

interface TableProps<T extends { id: string }> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
}

export default function Table<T extends { id: string }>({
    columns,
    data,
    loading,
    emptyMessage = 'No data found.',
    onRowClick,
}: TableProps<T>) {
    if (loading) {
        return (
            <div className="rounded-xl border border-border overflow-hidden">
                <div className="animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 border-b border-border bg-bg-surface last:border-0" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-bg-surface">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left text-text-muted font-semibold uppercase text-[11px] tracking-wider ${col.className ?? ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-text-muted">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted text-lg">
                                            ○
                                        </div>
                                        <p>{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row.id}
                                    onClick={() => onRowClick?.(row)}
                                    className={`
                    bg-bg-card transition-colors duration-150 hover:bg-bg-hover
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className={`px-4 py-3.5 text-text-primary ${col.className ?? ''}`}>
                                            {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as ReactNode}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
