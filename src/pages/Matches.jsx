import { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import { useTeams } from '../hooks/useTeams';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, Search, Trophy, Calendar, BarChart3, Swords } from 'lucide-react';

export function Matches() {
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
    updateItem,
    deleteItem,
    bulkDelete,
    playersActions,
    fetchMatchPlayersActions,
    loadingActions,
  } = useMatches();

  const { selectOptions: teamOptions, selectError: teamOptionsError } = useTeams();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [matchType, setMatchType] = useState('external'); // 'external' or 'internal'

  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().substring(0, 16),
    team_id: '',
    opponent_name: '',
    team1_id: '',
    team2_id: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Actions breakdown modal
  const [breakdownMatch, setBreakdownMatch] = useState(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  // Delete dialogs
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);

  const handleOpenCreate = () => {
    setEditingMatch(null);
    setFormData({
      name: '',
      date: new Date().toISOString().substring(0, 16),
      team_id: teamOptions[0]?._id || '',
      opponent_name: '',
      team1_id: teamOptions[0]?._id || '',
      team2_id: teamOptions[1]?._id || '',
    });
    setMatchType('external');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      name: match.name || '',
      date: match.date ? new Date(match.date).toISOString().substring(0, 16) : '',
      team_id: match.team_id?._id || match.team_id || '',
      opponent_name: match.opponent_name || '',
      team1_id: match.team1_id?._id || match.team1_id || '',
      team2_id: match.team2_id?._id || match.team2_id || '',
    });
    setMatchType(match.team2_id ? 'internal' : 'external');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      addToast('Match name is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      let payload;
      if (matchType === 'internal') {
        payload = {
          name: formData.name,
          date: new Date(formData.date).toISOString(),
          team1_id: formData.team1_id,
          team2_id: formData.team2_id,
        };
      } else {
        payload = {
          name: formData.name,
          date: new Date(formData.date).toISOString(),
          team_id: formData.team_id,
          opponent_name: formData.opponent_name || 'External Opponent',
        };
      }

      if (editingMatch) {
        await updateItem(editingMatch._id, payload);
        addToast('Match updated successfully');
      } else {
        await createItem(payload);
        addToast('Match schedule created successfully');
      }
      setIsModalOpen(false);
    } catch {
      addToast('Error saving match', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewBreakdown = async (match) => {
    setBreakdownMatch(match);
    setIsBreakdownOpen(true);
    try {
      await fetchMatchPlayersActions(match._id);
    } catch (requestError) {
      addToast(requestError.response?.data?.error?.message || requestError.message || 'Unable to load match breakdown', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteItem(deleteTargetId);
      addToast('Match deleted successfully');
      setDeleteTargetId(null);
    } catch {
      addToast('Failed to delete match', 'error');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await bulkDelete();
      addToast(`${selectedIds.length} match(es) deleted successfully`);
      setIsBulkDeleteModal(false);
    } catch {
      addToast('Error deleting selected matches', 'error');
    }
  };

  const columns = [
    {
      header: 'Match Title',
      accessor: 'name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-purple-950 block">{item.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Matchup / Teams',
      accessor: 'matchup',
      render: (item) => {
        const ourTeam = item.team_id?.name || 'Our Team';
        const opponent = item.opponent_name || item.team2_id?.name || 'Opponent SC';
        return (
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              {ourTeam}
            </span>
            <span className="text-purple-400 font-bold text-[11px]">VS</span>
            <span className="text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {opponent}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Scheduled Date',
      accessor: 'date',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-purple-500" />
          <span>
            {item.date ? new Date(item.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Badge variant={item.status !== false ? 'success' : 'neutral'}>
          {item.status !== false ? 'Official' : 'Draft'}
        </Badge>
      ),
    },
    {
      header: 'Scouting Actions',
      accessor: 'scouting',
      render: (item) => (
        <button
          onClick={() => handleViewBreakdown(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>View Stats</span>
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-purple-600 hover:text-purple-900 hover:bg-purple-100/60 rounded-lg transition"
            title="Edit Match"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item._id)}
            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            title="Delete Match"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {teamOptionsError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load teams: {teamOptionsError.response?.data?.error?.message || teamOptionsError.message}
        </div>
      )}
      <DataTable
        title="Club Matches & Fixtures"
        subtitle="Manage official league games, friendly matches, and internal squad scrimmages"
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
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search matches..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
                className="pl-9 pr-3 py-1.5 border border-purple-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 w-44"
              />
            </div>
            <select
              value={filters.team_id || ''}
              onChange={(e) => setFilters({ team_id: e.target.value, page: 1 })}
              className="border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-purple-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All Teams</option>
              {teamOptions.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        }
        headerAction={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Add Match
          </button>
        }
      />

      {/* Create / Edit Match Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMatch ? 'Edit Match Fixture' : 'Schedule New Match'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-1.5">
              Match Title / Tournament Round
            </label>
            <input
              type="text"
              placeholder="e.g. League Final Round, Friendly Match"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-1.5">
              Date & Kickoff Time
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
              required
            />
          </div>

          {/* Match format toggle */}
          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-2">
              Match Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMatchType('external')}
                className={`py-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  matchType === 'external'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 text-purple-900 border-purple-200'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Vs External Opponent</span>
              </button>
              <button
                type="button"
                onClick={() => setMatchType('internal')}
                className={`py-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  matchType === 'internal'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 text-purple-900 border-purple-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Internal Squads (2 Teams)</span>
              </button>
            </div>
          </div>

          {matchType === 'external' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                  Our Team
                </label>
                <select
                  value={formData.team_id}
                  onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs text-purple-950 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
                  required
                >
                  <option value="">-- Choose Team --</option>
                  {teamOptions.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                  Opponent Club Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cairo Stars, Alexandria SC"
                  value={formData.opponent_name}
                  onChange={(e) => setFormData({ ...formData, opponent_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                  Team 1
                </label>
                <select
                  value={formData.team1_id}
                  onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs bg-white text-purple-950"
                  required
                >
                  <option value="">-- Choose Team 1 --</option>
                  {teamOptions.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                  Team 2
                </label>
                <select
                  value={formData.team2_id}
                  onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs bg-white text-purple-950"
                  required
                >
                  <option value="">-- Choose Team 2 --</option>
                  {teamOptions.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-purple-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-xs transition"
            >
              {submitting ? 'Saving...' : editingMatch ? 'Update Match' : 'Schedule Match'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Match Players & Actions Breakdown Modal */}
      <Modal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        title={`Match Performance - ${breakdownMatch?.name || ''}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Recorded events grouped by player and action count for this specific fixture.
          </p>

          {loadingActions ? (
            <div className="py-8 text-center text-xs text-purple-600">Calculating stats...</div>
          ) : !playersActions?.players_actions || playersActions.players_actions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-purple-50/50 rounded-xl border border-purple-100">
              No scouting actions logged yet for this match.
            </div>
          ) : (
            <div className="divide-y divide-purple-100 border border-purple-100 rounded-2xl overflow-hidden">
              {playersActions.players_actions.map((entry, idx) => (
                <div key={idx} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-purple-950 text-sm">
                      {entry.player?.name || 'Player'}
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.actions?.map((act, actIdx) => (
                      <span
                        key={actIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100/70 border border-purple-200 text-purple-900 rounded-lg text-xs font-bold"
                      >
                        <span>{act.name}:</span>
                        <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-[10px]">
                          {act.count}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-purple-100">
            <button
              onClick={() => setIsBreakdownOpen(false)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Match Fixture"
        message="Are you sure you want to delete this match? All logged scouting actions under this match will also be removed."
      />

      {/* Bulk Delete */}
      <ConfirmDialog
        isOpen={isBulkDeleteModal}
        onClose={() => setIsBulkDeleteModal(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Matches"
        message={`Are you sure you want to delete ${selectedIds.length} selected match(es)?`}
      />
    </div>
  );
}

