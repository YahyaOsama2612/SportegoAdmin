import { useState } from 'react';
import { usePlayers } from '../hooks/usePlayers';
import { useTeams } from '../hooks/useTeams';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, Search, User, Shield } from 'lucide-react';

export function Players() {
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
  } = usePlayers();

  const { selectOptions: teamOptions, selectError: teamOptionsError } = useTeams();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    height: 175,
    weight: 70,
    age: 24,
    team_id: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete dialogs
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);

  const handleOpenCreate = () => {
    setEditingPlayer(null);
    setFormData({
      name: '',
      height: 175,
      weight: 70,
      age: 24,
      team_id: teamOptions[0]?._id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name || '',
      height: player.height || 175,
      weight: player.weight || 70,
      age: player.age || 24,
      team_id: player.team_id?._id || player.team_id || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.team_id) {
      addToast('Please fill player name and assign to a team', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        height: Number(formData.height),
        weight: Number(formData.weight),
        age: Number(formData.age),
        team_id: formData.team_id,
      };

      if (editingPlayer) {
        await updateItem(editingPlayer._id, payload);
        addToast('Player details updated successfully');
      } else {
        await createItem(payload);
        addToast('Player created and added to squad');
      }
      setIsModalOpen(false);
    } catch {
      addToast('Error saving player', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteItem(deleteTargetId);
      addToast('Player deleted successfully');
      setDeleteTargetId(null);
    } catch {
      addToast('Failed to delete player', 'error');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await bulkDelete();
      addToast(`${selectedIds.length} player(s) deleted successfully`);
      setIsBulkDeleteModal(false);
    } catch {
      addToast('Error deleting selected players', 'error');
    }
  };

  const columns = [
    {
      header: 'Player Name',
      accessor: 'name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-purple-950 block">{item.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Team',
      accessor: 'team_id',
      render: (item) => {
        const teamName = item.team_id?.name || 'Club Squad';
        return (
          <div className="flex items-center gap-1.5 text-xs text-purple-900 font-medium">
            <Shield className="w-3.5 h-3.5 text-purple-500" />
            <span>{teamName}</span>
          </div>
        );
      },
    },
    {
      header: 'Physical Attributes',
      accessor: 'attributes',
      render: (item) => (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
            {item.height || '--'} cm
          </span>
          <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
            {item.weight || '--'} kg
          </span>
        </div>
      ),
    },
    {
      header: 'Age',
      accessor: 'age',
      sortable: true,
      render: (item) => (
        <span className="text-xs font-semibold text-slate-700">{item.age || '--'} yrs</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Badge variant={item.status !== false ? 'success' : 'neutral'}>
          {item.status !== false ? 'Active Roster' : 'Inactive'}
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
            title="Edit Player"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item._id)}
            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            title="Delete Player"
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
        title="Club Players Roster"
        subtitle="Track player demographics, physical statistics, and squad assignments"
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
                placeholder="Search players..."
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
            Add Player
          </button>
        }
      />

      {/* Create / Edit Player Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlayer ? 'Edit Player Information' : 'Register New Player'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-1.5">
              Player Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mohamed Salah, Emam Ashour"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-1.5">
              Assigned Team / Squad
            </label>
            <select
              value={formData.team_id}
              onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs text-purple-950 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          </div>

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
              {submitting ? 'Saving...' : editingPlayer ? 'Update Player' : 'Create Player'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Single Player */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Player Roster Record"
        message="Are you sure you want to delete this player? All historical scouting stats linked to this player will be affected."
      />

      {/* Bulk Delete */}
      <ConfirmDialog
        isOpen={isBulkDeleteModal}
        onClose={() => setIsBulkDeleteModal(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Players"
        message={`Are you sure you want to delete ${selectedIds.length} selected player(s)?`}
      />
    </div>
  );
}

