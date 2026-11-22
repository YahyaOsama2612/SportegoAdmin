/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { getTenantInfoApi } from '../api/endpoints';

export function useTenantInfo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTenantInfoApi();
      const info = res.data?.success === true ? res.data.data : null;
      if (!info) {
        throw new Error(res.data?.message || 'Invalid tenant information response');
      }
      setData(info);
      return info;
    } catch (requestError) {
      setError(requestError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  return {
    data,
    loading,
    error,
    refetch: fetchInfo,
  };
}

