import { useState, useEffect } from 'react';
import { usePlayerProgress } from '../hooks/usePlayerProgress';
import { useMatches } from '../hooks/useMatches';
import { usePlayers } from '../hooks/usePlayers';
import { getActionsSelectApi } from '../api/endpoints';
import { DataTable } from '../components/common/DataTable';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { RecordProgressModal } from '../components/scouting/RecordProgressModal';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, Trophy, User, Target, BarChart2 } from 'lucide-react';

export function Scouting() {
  const {
    items,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    selectedIds,
    toggleSelect,
    selectAll,
    createItem,
    deleteItem,
    bulkDelete,
    summary,
    fetchSummary,
  } = usePlayerProgress();

  const { items: matches } = useMatches({ limit: 100 });
  const { items: players } = usePlayers({ limit: 100 });
  const { addToast } = useToast();

  const [actions, setActions] = useState([]);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);

  useEffect(() => {
    fetchSummary().catch((error) => {
      addToast(error.response?.data?.error?.message || error.message || 'Unable to load progress summary', 'error');
    });
    const loadActions = async () => {
      try {
        const res = await getActionsSelectApi();
        setActions(res.data?.data?.items || res.data?.data || []);
      } catch (error) {
        addToast(error.response?.data?.error?.message || error.message || 'Unable to load actions', 'error');
      }
    };
    loadActions();
  }, [fetchSummary, addToast]);

  const handleRecord = async (payload) => {
    await createItem(payload);
    await fetchSummary();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteItem(deleteTargetId);
      await fetchSummary();
      addToast('Player progress event deleted successfully');
      setDeleteTargetId(null);
    } catch {
      addToast('Failed to delete event', 'error');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await bulkDelete();
      await fetchSummary();
      addToast(`${selectedIds.length} event(s) deleted successfully`);
      setIsBulkDeleteModal(false);
    } catch {
      addToast('Error deleting selected events', 'error');
    }
  };

  const columns = [
    {
      header: 'Player',
      accessor: 'player_id',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-purple-950 block">
              {item.player_id?.name || 'Player'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Match Event',
      accessor: 'match_id',
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-purple-900 font-semibold">
          <Trophy className="w-3.5 h-3.5 text-purple-500" />
          <span>{item.match_id?.name || 'Match'}</span>
        </div>
      ),
    },
    {
      header: 'Action Logged',
      accessor: 'action_id',
      render: (item) => {
        const actionName = item.action_id?.name || 'Action';
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100/80 text-purple-800 text-xs font-bold rounded-xl border border-purple-200">
            <Target className="w-3.5 h-3.5 text-purple-600" />
            <span>{actionName}</span>
          </span>
        );
      },
    },
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-500">
          {item.createdAt ? new Date(item.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (item) => (
        <button
          onClick={() => setDeleteTargetId(item._id)}
          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
          title="Delete Event"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary KPI Bar */}
      {summary && (
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-purple-950">Action Summary & Progress Analytics</h3>
                <p className="text-xs text-slate-500">Total {summary.total_events || 0} scouted events</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {summary.date_range?.from} — {summary.date_range?.to}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {summary.by_action?.map((act, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/50 to-indigo-50/30 border border-purple-100 flex flex-col justify-between"
              >
                <span className="text-xs font-semibold text-purple-800/80 truncate">
                  {act.action_name}
                </span>
                <span className="text-2xl font-black text-purple-950 mt-1">{act.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Events Table */}
      <DataTable
        title="Player Match Actions Log"
        subtitle="Individual play events, goals, assists, and disciplinary events during matches"
        columns={columns}
        data={items}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={(page) => setFilters({ page })}
        onLimitChange={(limit) => setFilters({ limit, page: 1 })}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onSelectAll={selectAll}
        onBulkDelete={() => setIsBulkDeleteModal(true)}
        filterControls={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.match_id || ''}
              onChange={(e) => setFilters({ match_id: e.target.value, page: 1 })}
              className="border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-purple-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All Matches</option>
              {matches.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>

            <select
              value={filters.player_id || ''}
              onChange={(e) => setFilters({ player_id: e.target.value, page: 1 })}
              className="border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-purple-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All Players</option>
              {players.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={filters.action_id || ''}
              onChange={(e) => setFilters({ action_id: e.target.value, page: 1 })}
              className="border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-purple-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All Actions</option>
              {actions.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        }
        headerAction={
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Record Action
          </button>
        }
      />

      {/* Record Progress Modal */}
      <RecordProgressModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onRecord={handleRecord}
      />

      {/* Delete Single Event Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Progress Event"
        message="Are you sure you want to delete this recorded action? The player summary counters will update immediately."
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteModal}
        onClose={() => setIsBulkDeleteModal(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Action Events"
        message={`Are you sure you want to delete ${selectedIds.length} selected action events?`}
      />
    </div>
  );
}

