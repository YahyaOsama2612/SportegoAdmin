import { useState, useCallback } from 'react';
import { useApiCrud } from './useApiCrud';
import {
  getOrdersApi,
  directPurchaseOrderApi,
  getOrderByIdApi,
  uploadPaymentProofApi,
  getOrderInvoiceApi,
  getOrderInvoiceHtmlApi,
} from '../api/endpoints';

export function useOrders(initialFilters = {}) {
  const crud = useApiCrud({
    fetchFn: getOrdersApi,
    defaultFilters: initialFilters,
  });

  const [currentOrder, setCurrentOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [invoiceHtml, setInvoiceHtml] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  // Buy Now direct purchase
  const directPurchase = async (payload) => {
    setLoadingAction(true);
    try {
      const res = await directPurchaseOrderApi(payload);
      await crud.fetchItems();
      return res.data;
    } finally {
      setLoadingAction(false);
    }
  };

  // Get order by id
  const getOrder = useCallback(async (id) => {
    setLoadingAction(true);
    try {
      const res = await getOrderByIdApi(id);
      const order = res.data?.data?.order || res.data?.data || res.data;
      setCurrentOrder(order);
      return order;
    } finally {
      setLoadingAction(false);
    }
  }, []);

  // Upload Payment Proof
  const uploadProof = async (orderId, file) => {
    setLoadingAction(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadPaymentProofApi(orderId, formData);
      await crud.fetchItems();
      return res.data;
    } finally {
      setLoadingAction(false);
    }
  };

  // Fetch structured invoice
  const fetchInvoice = async (orderId) => {
    setLoadingAction(true);
    try {
      const res = await getOrderInvoiceApi(orderId, 'json');
      const data = res.data?.data?.invoice || res.data?.data || res.data;
      setInvoice(data);
      return data;
    } finally {
      setLoadingAction(false);
    }
  };

  // Fetch HTML Invoice
  const fetchInvoiceHtml = async (orderId) => {
    setLoadingAction(true);
    try {
      const res = await getOrderInvoiceHtmlApi(orderId);
      setInvoiceHtml(res.data);
      return res.data;
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    ...crud,
    currentOrder,
    invoice,
    invoiceHtml,
    loadingAction,
    directPurchase,
    getOrder,
    uploadProof,
    fetchInvoice,
    fetchInvoiceHtml,
  };
}

