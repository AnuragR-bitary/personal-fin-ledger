import { Search as SearchIcon } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    id?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...', id }: SearchInputProps) {
    return (
        <div className="relative">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
          bg-bg-surface border border-border rounded-lg pl-8 pr-3 py-2
          text-sm text-text-primary placeholder:text-text-muted
          focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20
          transition-all duration-200 w-full
        "
            />
        </div>
    );
}
