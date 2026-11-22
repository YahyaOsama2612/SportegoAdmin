/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useApiCrud } from './useApiCrud';
import {
  getTeamsApi,
  createTeamApi,
  updateTeamApi,
  deleteTeamApi,
  bulkDeleteTeamsApi,
  getTeamsSelectApi,
} from '../api/endpoints';

export function useTeams(initialFilters = {}, loadSelectOptions = true) {
  const crud = useApiCrud({
    fetchFn: getTeamsApi,
    createFn: createTeamApi,
    updateFn: updateTeamApi,
    deleteFn: deleteTeamApi,
    bulkDeleteFn: bulkDeleteTeamsApi,
    defaultFilters: initialFilters,
  });

  const [selectOptions, setSelectOptions] = useState([]);
  const [selectError, setSelectError] = useState(null);

  const fetchSelectTeams = useCallback(async (gameId) => {
    setSelectError(null);
    try {
      const res = await getTeamsSelectApi({ game_id: gameId });
      const data = res.data?.data?.teams || res.data?.data?.items || res.data?.data || [];
      setSelectOptions(data);
      return data;
    } catch (requestError) {
      setSelectError(requestError);
      setSelectOptions([]);
      return null;
    }
  }, []);

  useEffect(() => {
    if (loadSelectOptions) {
      fetchSelectTeams();
    }
  }, [fetchSelectTeams, loadSelectOptions]);

  return {
    ...crud,
    selectOptions,
    selectError,
    fetchSelectTeams,
  };
}

