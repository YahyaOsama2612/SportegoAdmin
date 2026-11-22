/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from 'react';
import { getPackagesApi, getPackageByIdApi } from '../api/endpoints';

export function usePackages(params = {}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const fetchPackages = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPackagesApi({ ...paramsRef.current, ...customParams });
      const list = res.data?.data?.packages || res.data?.data?.items || res.data?.data || [];
      setPackages(list);
      return list;
    } catch (requestError) {
      setError(requestError);
      setPackages([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const getPackageById = async (id) => {
    const res = await getPackageByIdApi(id);
    return res.data?.data?.package || res.data?.data;
  };

  return {
    packages,
    loading,
    error,
    fetchPackages,
    getPackageById,
  };
}

