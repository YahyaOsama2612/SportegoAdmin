import { useState, useCallback } from 'react';
import { useApiCrud } from './useApiCrud';
import {
  getMatchesApi,
  createMatchApi,
  updateMatchApi,
  deleteMatchApi,
  bulkDeleteMatchesApi,
  getMatchesPlayersActionsApi,
  getMatchPlayersActionsByIdApi,
} from '../api/endpoints';

export function useMatches(initialFilters = {}) {
  const crud = useApiCrud({
    fetchFn: getMatchesApi,
    createFn: createMatchApi,
    updateFn: updateMatchApi,
    deleteFn: deleteMatchApi,
    bulkDeleteFn: bulkDeleteMatchesApi,
    defaultFilters: initialFilters,
  });

  const [playersActions, setPlayersActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);

  const fetchMatchPlayersActions = useCallback(async (matchId) => {
    setLoadingActions(true);
    try {
      if (matchId) {
        const res = await getMatchPlayersActionsByIdApi(matchId);
        const data = res.data?.data || res.data;
        setPlayersActions(data);
        return data;
      } else {
        const res = await getMatchesPlayersActionsApi();
        const data = res.data?.data?.items || res.data?.data || [];
        setPlayersActions(data);
        return data;
      }
    } finally {
      setLoadingActions(false);
    }
  }, []);

  return {
    ...crud,
    playersActions,
    loadingActions,
    fetchMatchPlayersActions,
  };
}

