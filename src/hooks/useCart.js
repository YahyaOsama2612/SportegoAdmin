/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  deleteCartItemApi,
  checkoutCartApi,
} from '../api/endpoints';

export function useCart() {
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCartApi();
      const data = res.data?.data || res.data;
      setCart(data.items || []);
      setCount(data.count ?? (data.items?.length || 0));
      setTotal(data.total ?? 0);
      return data;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart().catch((requestError) => setError(requestError));
  }, [fetchCart]);

  const addToCart = async (packageId, cycleId) => {
    setLoading(true);
    try {
      const res = await addToCartApi({ package_id: packageId, cycle_id: cycleId });
      await fetchCart();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (packageId, cycleId, notes = '') => {
    setLoading(true);
    try {
      const res = await updateCartItemApi({ package_id: packageId, cycle_id: cycleId, notes });
      await fetchCart();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (packageId) => {
    setLoading(true);
    try {
      const res = await deleteCartItemApi(packageId);
      await fetchCart();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const res = await deleteCartItemApi();
      await fetchCart();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const checkoutCart = async (paymentMethodId, paymentProof) => {
    setLoading(true);
    try {
      const res = await checkoutCartApi({
        payment_method_id: paymentMethodId,
        payment_proof: paymentProof,
      });
      await fetchCart();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    count,
    total,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkoutCart,
  };
}

