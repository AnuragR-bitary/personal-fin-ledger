import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`
          w-full bg-bg-surface border rounded-lg px-3 py-2.5 text-sm text-text-primary
          placeholder:text-text-muted outline-none transition-all duration-200
          focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-accent-red focus:border-accent-red focus:ring-accent-red/20' : 'border-border'}
          ${className}
        `}
                {...props}
            />
            {hint && !error && <p className="text-text-muted text-xs">{hint}</p>}
            {error && <p className="text-accent-red text-xs">{error}</p>}
        </div>
    );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export function Select({ label, error, options, placeholder, className = '', id, ...props }: SelectProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    {label}
                </label>
            )}
            <select
                id={id}
                className={`
          w-full bg-bg-surface border rounded-lg px-3 py-2.5 text-sm text-text-primary
          outline-none transition-all duration-200 appearance-none
          focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-accent-red' : 'border-border'}
          ${className}
        `}
                {...props}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <p className="text-accent-red text-xs">{error}</p>}
        </div>
    );
}

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
    primary: 'bg-accent-blue hover:bg-accent-blue-light text-white',
    secondary: 'bg-bg-elevated border border-border text-text-primary hover:bg-bg-hover',
    danger: 'bg-accent-red/15 border border-accent-red/30 text-accent-red-light hover:bg-accent-red/25',
    success: 'bg-accent-green/15 border border-accent-green/30 text-accent-green-light hover:bg-accent-green/25',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-hover',
};

const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-xl gap-2',
};

export function Button({
    variant = 'primary',
    size = 'md',
    loading,
    icon,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : icon}
            {children}
        </button>
    );
}
