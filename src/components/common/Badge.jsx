export function Badge({ children, variant = 'purple', size = 'md' }) {
  const variants = {
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    active: 'bg-purple-50 text-purple-700 border-purple-300 ring-1 ring-purple-500/20',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.purple} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}

