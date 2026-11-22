/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';

/**
 * Shared API-backed CRUD state for Sprotego Admin.
 */
export function useApiCrud({
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  bulkDeleteFn,
  defaultFilters = {},
  autoFetch = true,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: defaultFilters.page || 1,
    limit: defaultFilters.limit || 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFiltersState] = useState({
    page: 1,
    limit: 10,
    search: '',
    sort_by: '',
    order: 'desc',
    status: '',
    ...defaultFilters,
  });

  const setFilters = useCallback((newFilters) => {
    setFiltersState((prev) => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : { ...prev, ...newFilters };
      return updated;
    });
  }, []);

  // Fetch Items
  const fetchItems = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError(null);
    const activeParams = { ...filters, ...customParams };

    try {
      if (!fetchFn) {
        throw new Error('List API is not configured');
      }
      const response = await fetchFn(activeParams);
      const data = response.data?.data || response.data;
      if (Array.isArray(data?.items)) {
        setItems(data.items);
        if (data.pagination) setPagination(data.pagination);
        return data;
      }
      if (Array.isArray(data)) {
        setItems(data);
        setPagination((current) => ({ ...current, total: data.length }));
        return data;
      }
      throw new Error(response.data?.error?.message || 'Unexpected list response from API');
    } catch (requestError) {
      setItems([]);
      setError(requestError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [fetchItems, autoFetch]);

  // Create Item
  const createItem = async (payload) => {
    setLoading(true);
    try {
      if (!createFn) {
        throw new Error('Create API is not configured');
      }
      const res = await createFn(payload);
      await fetchItems();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // Update Item
  const updateItem = async (id, payload) => {
    setLoading(true);
    try {
      if (!updateFn) {
        throw new Error('Update API is not configured');
      }
      const res = await updateFn(id, payload);
      await fetchItems();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // Delete Item
  const deleteItem = async (id) => {
    setLoading(true);
    try {
      if (!deleteFn) {
        throw new Error('Delete API is not configured');
      }
      const res = await deleteFn(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      await fetchItems();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // Bulk Delete
  const bulkDelete = async (ids = selectedIds) => {
    if (!ids || ids.length === 0) return;
    setLoading(true);
    try {
      if (!bulkDeleteFn) {
        throw new Error('Bulk delete API is not configured');
      }
      const res = await bulkDeleteFn(ids);
      setSelectedIds([]);
      await fetchItems();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // Selection handlers
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i._id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  return {
    items,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    bulkDelete,
  };
}

