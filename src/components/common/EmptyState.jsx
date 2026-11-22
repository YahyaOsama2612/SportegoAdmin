import { FolderX } from 'lucide-react';

export function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search or filters, or add a new record.',
  actionText,
  onAction,
  icon: Icon = FolderX,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-purple-100 my-4">
      <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-purple-950 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl shadow-xs transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

