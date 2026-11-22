import { useState, useEffect } from 'react';
import { useTeams } from '../hooks/useTeams';
import { getGamesSelectApi } from '../api/endpoints';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { useToast } from '../../src/context/ToastContext';
import { Plus, Edit2, Trash2, Search, Shield, Users } from 'lucide-react';

export function Teams() {
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
  } = useTeams({}, false);

  const { addToast } = useToast();

  // Games options for team creation
  const [games, setGames] = useState([]);
  const [gamesError, setGamesError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [gameId, setGameId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await getGamesSelectApi();
        const list = res.data?.data?.items || res.data?.data || [];
        setGames(list);
        setGameId((currentGameId) => currentGameId || list[0]?._id || '');
      } catch (requestError) {
        setGamesError(requestError);
      }
    };
    fetchGames();
  }, []);

  const handleOpenCreate = () => {
    setEditingTeam(null);
    setTeamName('');
    if (games.length > 0) setGameId(games[0]._id);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (team) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setGameId(team.game_id?._id || team.game_id || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!teamName) {
      addToast('Team name is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editingTeam) {
        await updateItem(editingTeam._id, { name: teamName });
        addToast('Team updated successfully');
      } else {
        await createItem({ name: teamName, game_id: gameId });
        addToast('Team created successfully');
      }
      setIsModalOpen(false);
    } catch {
      addToast('Error saving team', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteItem(deleteTargetId);
      addToast('Team deleted successfully');
      setDeleteTargetId(null);
    } catch {
      addToast('Cannot delete team containing players or matches', 'error');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await bulkDelete();
      addToast(`${selectedIds.length} team(s) deleted successfully`);
      setIsBulkDeleteModal(false);
    } catch {
      addToast('Error deleting selected teams', 'error');
    }
  };

  const columns = [
    {
      header: 'Team Name',
      accessor: 'name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-purple-950 block">{item.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Game / Sport',
      accessor: 'game_id',
      render: (item) => {
        const gameName = item.game?.name || item.game_id?.name || (games.find(g => g._id === item.game_id)?.name) || 'Football';
        return <Badge variant="purple">{gameName}</Badge>;
      },
    },
    {
      header: 'Players Count',
      accessor: 'players',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
          <Users className="w-3.5 h-3.5 text-purple-500" />
          <span>{item.players ?? 0} Players</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Badge variant={item.status !== false ? 'success' : 'neutral'}>
          {item.status !== false ? 'Active' : 'Inactive'}
        </Badge>
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
            title="Edit Team"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item._id)}
            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            title="Delete Team"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Club Teams"
        subtitle="Manage football, basketball, and sport squads with isolated roster records"
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
                placeholder="Search teams..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
                className="pl-9 pr-3 py-1.5 border border-purple-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 w-44"
              />
            </div>
            <select
              value={filters.game_id || ''}
              onChange={(e) => setFilters({ game_id: e.target.value, page: 1 })}
              className="border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-purple-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All Sports</option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
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
            Add Team
          </button>
        }
      />

      {/* Create / Edit Team Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeam ? 'Edit Team Name' : 'Create New Team Squad'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {gamesError && !editingTeam && (
            <p role="alert" className="text-xs text-rose-700">
              Unable to load sports: {gamesError.response?.data?.error?.message || gamesError.message}
            </p>
          )}
          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-1.5">
              Team Name
            </label>
            <input
              type="text"
              placeholder="e.g. Under 19 Team, First Football Team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              required
            />
          </div>

          {!editingTeam && (
            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Sport / Game
              </label>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs text-purple-950 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                required
              >
                {games.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
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
              {submitting ? 'Saving...' : editingTeam ? 'Update Team' : 'Create Team'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Single Team Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Team Squad"
        message="Are you sure you want to delete this team? Note: Teams containing active players or match history cannot be deleted."
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        isOpen={isBulkDeleteModal}
        onClose={() => setIsBulkDeleteModal(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Teams"
        message={`Are you sure you want to delete ${selectedIds.length} selected team(s)?`}
      />
    </div>
  );
}

