import { useApiCrud } from './useApiCrud';
import {
  getPlayersApi,
  createPlayerApi,
  updatePlayerApi,
  deletePlayerApi,
  bulkDeletePlayersApi,
} from '../api/endpoints';

export function usePlayers(initialFilters = {}) {
  const crud = useApiCrud({
    fetchFn: getPlayersApi,
    createFn: createPlayerApi,
    updateFn: updatePlayerApi,
    deleteFn: deletePlayerApi,
    bulkDeleteFn: bulkDeletePlayersApi,
    defaultFilters: initialFilters,
  });

  return crud;
}

