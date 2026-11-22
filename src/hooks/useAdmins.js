import { useApiCrud } from './useApiCrud';
import {
  getAdminsApi,
  createAdminApi,
  updateAdminApi,
  deleteAdminApi,
  bulkDeleteAdminsApi,
} from '../api/endpoints';

export function useAdmins(initialFilters = {}) {
  return useApiCrud({
    fetchFn: getAdminsApi,
    createFn: createAdminApi,
    updateFn: updateAdminApi,
    deleteFn: deleteAdminApi,
    bulkDeleteFn: bulkDeleteAdminsApi,
    defaultFilters: initialFilters,
  });
}

