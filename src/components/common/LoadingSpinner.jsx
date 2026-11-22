export function LoadingSpinner({ text = 'Loading data...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-purple-600 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="mt-3 text-sm font-medium text-purple-900/70">{text}</p>}
    </div>
  );
}

