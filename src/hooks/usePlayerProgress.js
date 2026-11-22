import { useState, useCallback } from 'react';
import { useApiCrud } from './useApiCrud';
import {
  getPlayerProgressApi,
  createPlayerProgressApi,
  updatePlayerProgressApi,
  deletePlayerProgressApi,
  bulkDeletePlayerProgressApi,
  getPlayerProgressSummaryApi,
} from '../api/endpoints';

export function usePlayerProgress(initialFilters = {}) {
  const crud = useApiCrud({
    fetchFn: getPlayerProgressApi,
    createFn: createPlayerProgressApi,
    updateFn: updatePlayerProgressApi,
    deleteFn: deletePlayerProgressApi,
    bulkDeleteFn: bulkDeletePlayerProgressApi,
    defaultFilters: initialFilters,
  });

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchSummary = useCallback(async (params = {}) => {
    setLoadingSummary(true);
    try {
      const res = await getPlayerProgressSummaryApi(params);
      const data = res.data?.data || res.data;
      setSummary(data);
      return data;
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  return {
    ...crud,
    summary,
    loadingSummary,
    fetchSummary,
  };
}

