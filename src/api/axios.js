import axios from 'axios';

// Get base URL and subdomain from localStorage or defaults
export const getStoredSubdomain = () => localStorage.getItem('tenant_subdomain') || 'ahly';
export const setStoredSubdomain = (subdomain) => localStorage.setItem('tenant_subdomain', subdomain);

export const getStoredToken = () => localStorage.getItem('tenant_token') || '';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sportego.org',
  headers: {
    'Content-Type': 'application/json',
  },
});

const pendingGetRequests = new Map();
const originalGet = api.get.bind(api);

// Share concurrent identical reads across Strict Mode mounts and repeated hook instances.
api.get = (url, config = {}) => {
  const requestKey = JSON.stringify([
    config.baseURL || api.defaults.baseURL,
    url,
    config.params || null,
    config.responseType || null,
    localStorage.getItem('tenant_token') || '',
    localStorage.getItem('tenant_subdomain') || 'ahly',
  ]);
  const pendingRequest = pendingGetRequests.get(requestKey);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = originalGet(url, config);
  pendingGetRequests.set(requestKey, request);
  request.then(
    () => {
      if (pendingGetRequests.get(requestKey) === request) {
        pendingGetRequests.delete(requestKey);
      }
    },
    () => {
      if (pendingGetRequests.get(requestKey) === request) {
        pendingGetRequests.delete(requestKey);
      }
    }
  );
  return request;
};

// Request interceptor: attach Authorization header and x-subdomain
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tenant_token');
    const subdomain = localStorage.getItem('tenant_subdomain') || 'ahly';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (subdomain) {
      config.headers['x-subdomain'] = subdomain;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tenant_token');
      localStorage.removeItem('tenant_user');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;

