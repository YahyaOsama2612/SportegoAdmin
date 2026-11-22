import { useState } from 'react';
import { useAdmins } from '../hooks/useAdmins';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, Search, UserCog, Mail } from 'lucide-react';

export function Staff() {
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
  } = useAdmins();

  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'coach',
    status: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete dialogs
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'coach',
      status: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      role: admin.role || 'coach',
      status: admin.status !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || (!editingAdmin && !formData.email)) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editingAdmin) {
        await updateItem(editingAdmin._id, {
          name: formData.name,
          role: formData.role,
          status: formData.status,
        });
        addToast('Staff member updated successfully');
      } else {
        await createItem({
          name: formData.name,
          email: formData.email,
          password: formData.password || 'Coach@123456',
          role: formData.role,
          status: formData.status,
        });
        addToast('Staff member account created');
      }
      setIsModalOpen(false);
    } catch {
      addToast('Error saving staff account', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteItem(deleteTargetId);
      addToast('Staff account deleted successfully');
      setDeleteTargetId(null);
    } catch {
      addToast('Failed to delete staff account', 'error');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await bulkDelete();
      addToast(`${selectedIds.length} staff member(s) removed`);
      setIsBulkDeleteModal(false);
    } catch {
      addToast('Error deleting selected accounts', 'error');
    }
  };

  const columns = [
    {
      header: 'Staff Member',
      accessor: 'name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
            <UserCog className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-purple-950 block">{item.name}</span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              {item.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      accessor: 'role',
      sortable: true,
      render: (item) => {
        const role = item.role || 'coach';
        return (
          <Badge variant={role === 'admin' ? 'purple' : role === 'coach' ? 'active' : 'neutral'}>
            {role.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Account Status',
      accessor: 'status',
      render: (item) => (
        <Badge variant={item.status !== false ? 'success' : 'neutral'}>
          {item.status !== false ? 'Active Access' : 'Suspended'}
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
            title="Edit Staff Member"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item._id)}
            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            title="Delete Staff Member"
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
        title="Club Staff, Coaches & Admins"
        subtitle="Manage access permissions for coaches, analytical viewers, and sub-administrators"
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
                placeholder="Search staff..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
                className="pl-9 pr-3 py-1.5 border border-purple-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 w-44"
              />
            </div>
            <select
              value={filters.role || ''}
              onChange={(e) => setFilters({ role: e.target.value, page: 1 })}
              className="border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-purple-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="coach">Coach</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        }
        headerAction={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Add Staff Member
          </button>
        }
      />

      {/* Create / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAdmin ? 'Edit Staff Account' : 'Create Staff Member Account'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Coach Hossam, Assistant Tamer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="coach@ahly.com"
              value={formData.email}
              disabled={!!editingAdmin}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 disabled:bg-slate-100 disabled:text-slate-500"
              required
            />
          </div>

          {!editingAdmin && (
            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Initial Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Access Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs text-purple-950 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
              >
                <option value="coach">Coach (Matches & Scouting)</option>
                <option value="admin">Admin (Full Control)</option>
                <option value="viewer">Viewer (Read-Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Account Status
              </label>
              <select
                value={formData.status ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs text-purple-950 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
              >
                <option value="true">Active Access</option>
                <option value="false">Suspended</option>
              </select>
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
              {submitting ? 'Saving...' : editingAdmin ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Single Account */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Staff Account"
        message="Are you sure you want to delete this staff member account? Their active JWT tokens will be invalidated."
      />

      {/* Bulk Delete */}
      <ConfirmDialog
        isOpen={isBulkDeleteModal}
        onClose={() => setIsBulkDeleteModal(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Staff Accounts"
        message={`Are you sure you want to delete ${selectedIds.length} selected staff member(s)?`}
      />
    </div>
  );
}

