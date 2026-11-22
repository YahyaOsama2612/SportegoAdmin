/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { getPaymentMethodsApi } from '../api/endpoints';

export function usePaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPaymentMethodsApi();
      const list = res.data?.data?.payment_methods || res.data?.data || [];
      setMethods(list);
      return list;
    } catch (requestError) {
      setError(requestError);
      setMethods([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  return {
    methods,
    loading,
    error,
    refetch: fetchMethods,
  };
}

