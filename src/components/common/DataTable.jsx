import { ArrowUpDown, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

export function DataTable({
  columns,
  data = [],
  loading = false,
  error = null,
  pagination,
  onPageChange,
  onLimitChange,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onBulkDelete,
  onSort,
  sortBy,
  filterControls,
  headerAction,
  title,
  subtitle,
}) {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-5 border-b border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-50/50 via-white to-purple-50/20">
        <div>
          {title && <h2 className="text-xl font-bold text-purple-950 tracking-tight">{title}</h2>}
          {subtitle && <p className="text-xs text-purple-800/60 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {filterControls}
          {headerAction}
        </div>
      </div>

      {/* Bulk Actions Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-purple-100/70 border-b border-purple-200 px-6 py-2.5 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 text-sm font-semibold text-purple-900">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
              {selectedIds.length}
            </span>
            <span>item(s) selected</span>
          </div>
          {onBulkDelete && (
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Bulk Delete ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        {error ? (
          <div role="alert" className="p-6 text-sm text-rose-700">
            Unable to load records: {error.response?.data?.error?.message || error.message || 'Request failed'}
          </div>
        ) : loading ? (
          <LoadingSpinner text="Fetching records..." />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-purple-50/80 border-b border-purple-100 text-purple-900 font-semibold text-xs tracking-wider uppercase">
                {onToggleSelect && (
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={onSelectAll}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-purple-300 accent-purple-600 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`p-4 ${col.sortable ? 'cursor-pointer select-none hover:text-purple-700' : ''}`}
                    onClick={() => col.sortable && onSort && onSort(col.accessor)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown
                          className={`w-3.5 h-3.5 ${
                            sortBy === col.accessor ? 'text-purple-600' : 'text-slate-400'
                          }`}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 text-slate-700">
              {data.map((item, rowIndex) => {
                const isSelected = selectedIds.includes(item._id);
                return (
                  <tr
                    key={item._id || rowIndex}
                    className={`transition-colors hover:bg-purple-50/40 ${
                      isSelected ? 'bg-purple-50/60' : rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    {onToggleSelect && (
                      <td className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(item._id)}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-purple-300 accent-purple-600 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="p-4 align-middle">
                        {col.render ? col.render(item) : item[col.accessor]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-6 py-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/40 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <strong className="text-purple-950 font-semibold">
                {data.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
              </strong>{' '}
              to{' '}
              <strong className="text-purple-950 font-semibold">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{' '}
              of <strong className="text-purple-950 font-semibold">{pagination.total}</strong> results
            </span>
            {onLimitChange && (
              <select
                value={pagination.limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="ml-2 border border-purple-200 rounded-lg px-2 py-1 bg-white text-xs text-purple-900 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 mr-2">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage && pagination.page <= 1}
              className="p-1.5 border border-purple-200 rounded-lg bg-white text-purple-900 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage && pagination.page >= pagination.totalPages}
              className="p-1.5 border border-purple-200 rounded-lg bg-white text-purple-900 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

