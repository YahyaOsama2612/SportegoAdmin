import api from './axios';

// ================= AUTH =================
export const loginApi = async (credentials) => {
  return await api.post('/api/tenant/auth/login', credentials);
};

export const getMeApi = async () => {
  return await api.get('/api/tenant/auth/me');
};

export const changePasswordApi = async (data) => {
  return await api.put('/api/tenant/auth/change-password', data);
};

export const logoutApi = async () => {
  return await api.post('/api/tenant/auth/logout');
};

// ================= TENANT INFO & SETTINGS =================
export const getTenantInfoApi = async () => {
  return await api.get('/api/tenant/info');
};

export const getSettingsApi = async () => {
  return await api.get('/api/tenant/settings');
};

export const updateSettingsApi = async (data, isFormData = false) => {
  const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
  return await api.post('/api/tenant/settings', data, { headers });
};

// ================= GAMES & ACTIONS =================
export const getGamesApi = async (params) => {
  return await api.get('/api/tenant/games', { params });
};

export const getGamesSelectApi = async () => {
  return await api.get('/api/tenant/games/select');
};

export const getActionsApi = async (params) => {
  return await api.get('/api/tenant/actions', { params });
};

export const getActionsSelectApi = async (params) => {
  return await api.get('/api/tenant/actions/select', { params });
};

// ================= TEAMS =================
export const getTeamsApi = async (params) => {
  return await api.get('/api/tenant/teams', { params });
};

export const getTeamsSelectApi = async (params) => {
  return await api.get('/api/tenant/teams/select', { params });
};

export const getTeamByIdApi = async (id) => {
  return await api.get(`/api/tenant/teams/${id}`);
};

export const createTeamApi = async (data) => {
  return await api.post('/api/tenant/teams', data);
};

export const updateTeamApi = async (id, data) => {
  return await api.put(`/api/tenant/teams/${id}`, data);
};

export const deleteTeamApi = async (id) => {
  return await api.delete(`/api/tenant/teams/${id}`);
};

export const bulkDeleteTeamsApi = async (ids) => {
  return await api.post('/api/tenant/teams/bulk-delete', { ids });
};

// ================= PLAYERS =================
export const getPlayersApi = async (params) => {
  return await api.get('/api/tenant/players', { params });
};

export const getPlayerByIdApi = async (id) => {
  return await api.get(`/api/tenant/players/${id}`);
};

export const createPlayerApi = async (data) => {
  return await api.post('/api/tenant/players', data);
};

export const updatePlayerApi = async (id, data) => {
  return await api.put(`/api/tenant/players/${id}`, data);
};

export const deletePlayerApi = async (id) => {
  return await api.delete(`/api/tenant/players/${id}`);
};

export const bulkDeletePlayersApi = async (ids) => {
  return await api.post('/api/tenant/players/bulk-delete', { ids });
};

// ================= MATCHES =================
export const getMatchesApi = async (params) => {
  return await api.get('/api/tenant/matches', { params });
};

export const getMatchByIdApi = async (id) => {
  return await api.get(`/api/tenant/matches/${id}`);
};

export const createMatchApi = async (data) => {
  return await api.post('/api/tenant/matches', data);
};

export const updateMatchApi = async (id, data) => {
  return await api.put(`/api/tenant/matches/${id}`, data);
};

export const deleteMatchApi = async (id) => {
  return await api.delete(`/api/tenant/matches/${id}`);
};

export const bulkDeleteMatchesApi = async (ids) => {
  return await api.post('/api/tenant/matches/bulk-delete', { ids });
};

export const getMatchesPlayersActionsApi = async () => {
  return await api.get('/api/tenant/matches/players-actions');
};

export const getMatchPlayersActionsByIdApi = async (id) => {
  return await api.get(`/api/tenant/matches/${id}/players-actions`);
};

// ================= PLAYER PROGRESS =================
export const getPlayerProgressApi = async (params) => {
  return await api.get('/api/tenant/player-progress', { params });
};

export const getPlayerProgressByIdApi = async (id) => {
  return await api.get(`/api/tenant/player-progress/${id}`);
};

export const createPlayerProgressApi = async (data) => {
  return await api.post('/api/tenant/player-progress', data);
};

export const updatePlayerProgressApi = async (id, data) => {
  return await api.put(`/api/tenant/player-progress/${id}`, data);
};

export const deletePlayerProgressApi = async (id) => {
  return await api.delete(`/api/tenant/player-progress/${id}`);
};

export const bulkDeletePlayerProgressApi = async (ids) => {
  return await api.post('/api/tenant/player-progress/bulk-delete', { ids });
};

export const getPlayerProgressSummaryApi = async (params) => {
  return await api.get('/api/tenant/player-progress/summary', { params });
};

// ================= SUB-ADMINS (STAFF) =================
export const getAdminsApi = async (params) => {
  return await api.get('/api/tenant/admins', { params });
};

export const getAdminsSelectApi = async () => {
  return await api.get('/api/tenant/admins/select');
};

export const getAdminByIdApi = async (id) => {
  return await api.get(`/api/tenant/admins/${id}`);
};

export const createAdminApi = async (data) => {
  return await api.post('/api/tenant/admins', data);
};

export const updateAdminApi = async (id, data) => {
  return await api.put(`/api/tenant/admins/${id}`, data);
};

export const deleteAdminApi = async (id) => {
  return await api.delete(`/api/tenant/admins/${id}`);
};

export const bulkDeleteAdminsApi = async (ids) => {
  return await api.post('/api/tenant/admins/bulk-delete', { ids });
};

// ================= PACKAGES & STORE =================
export const getPackagesApi = async (params) => {
  return await api.get('/api/tenant/packages', { params });
};

export const getPackageByIdApi = async (id) => {
  return await api.get(`/api/tenant/packages/${id}`);
};

// ================= PAYMENT METHODS =================
export const getPaymentMethodsApi = async () => {
  return await api.get('/api/tenant/payment-methods');
};

// ================= CART =================
export const getCartApi = async () => {
  return await api.get('/api/tenant/cart');
};

export const addToCartApi = async (data) => {
  return await api.post('/api/tenant/cart', data);
};

export const replaceCartApi = async (items) => {
  return await api.put('/api/tenant/cart', { items });
};

export const updateCartItemApi = async (data) => {
  return await api.patch('/api/tenant/cart', data);
};

export const deleteCartItemApi = async (packageId) => {
  return await api.delete('/api/tenant/cart', {
    params: packageId ? { package_id: packageId } : {},
  });
};

export const checkoutCartApi = async (data) => {
  return await api.post('/api/tenant/cart/checkout', data);
};

// ================= ORDERS & INVOICES =================
export const getOrdersApi = async (params) => {
  const query = Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
  return await api.get('/api/tenant/orders', { params: query });
};

export const directPurchaseOrderApi = async (data) => {
  return await api.post('/api/tenant/orders', data);
};

export const getOrderByIdApi = async (id) => {
  return await api.get(`/api/tenant/orders/${id}`);
};

export const uploadPaymentProofApi = async (orderId, formData) => {
  return await api.post(`/api/tenant/orders/${orderId}/payment-proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getOrderInvoiceApi = async (orderId, format = 'json') => {
  return await api.get(`/api/tenant/orders/${orderId}/invoice`, {
    params: { format },
  });
};

export const getOrderInvoiceHtmlApi = async (orderId) => {
  return await api.get(`/api/tenant/orders/${orderId}/invoice/html`);
};

// ================= UPLOADS =================
export const uploadImageApi = async (formData) => {
  return await api.post('/api/tenant/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

