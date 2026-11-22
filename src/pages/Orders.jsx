import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { DataTable } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { InvoiceModal } from '../components/orders/InvoiceModal';
import { UploadProofModal } from '../components/orders/UploadProofModal';
import { useToast } from '../context/ToastContext';
import { Receipt, UploadCloud, Search, FileText, CheckCircle2 } from 'lucide-react';

export function Orders() {
  const { addToast } = useToast();
  const {
    items,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    invoice,
    invoiceHtml,
    fetchInvoice,
    fetchInvoiceHtml,
    uploadProof,
  } = useOrders();

  // Modals state
  const [, setSelectedOrderForInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [selectedOrderForProof, setSelectedOrderForProof] = useState(null);
  const [isProofOpen, setIsProofOpen] = useState(false);

  const handleOpenInvoice = async (order) => {
    setSelectedOrderForInvoice(order);
    setIsInvoiceOpen(true);
    try {
      await fetchInvoice(order._id);
      await fetchInvoiceHtml(order._id);
    } catch (requestError) {
      addToast(requestError.response?.data?.error?.message || requestError.message || 'Unable to load invoice', 'error');
    }
  };

  const handleOpenProof = (order) => {
    setSelectedOrderForProof(order);
    setIsProofOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid / Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="neutral">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="neutral">Refunded</Badge>;
      default:
        return <Badge variant="warning">Pending Approval</Badge>;
    }
  };

  const columns = [
    {
      header: 'Order Number',
      accessor: 'order_number',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-purple-950 block font-mono">
              {item.order_number}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Package & Cycle',
      accessor: 'package_id',
      render: (item) => {
        const pkgName = item.package_id?.name || 'Pro Club Package';
        const cycleName = item.cycle_name || item.cycle?.name || 'Annual (12 Months)';
        return (
          <div>
            <span className="font-bold text-purple-950 block text-xs">{pkgName}</span>
            <span className="text-[11px] text-purple-700 font-semibold">{cycleName}</span>
          </div>
        );
      },
    },
    {
      header: 'Amount Paid',
      accessor: 'final_price',
      sortable: true,
      render: (item) => (
        <div>
          <span className="font-black text-purple-950 text-sm">{item.final_price} EGP</span>
          {item.discount > 0 && (
            <span className="text-[10px] text-emerald-600 block font-medium">
              Saved {item.discount} EGP
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => getStatusBadge(item.status),
    },
    {
      header: 'Payment Method',
      accessor: 'payment_method_id',
      render: (item) => (
        <span className="text-xs font-semibold text-slate-700">
          {item.payment_method_id?.name || 'InstaPay'}
        </span>
      ),
    },
    {
      header: 'Receipt Proof',
      accessor: 'payment_proof',
      render: (item) => (
        <div>
          {item.payment_proof ? (
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <button
                onClick={() => handleOpenProof(item)}
                className="hover:underline text-[11px]"
              >
                View / Replace
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleOpenProof(item)}
              className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-bold hover:underline"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Proof
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenInvoice(item)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Invoice</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Club Subscription Orders & Invoices"
        subtitle="Historical orders, payment receipts, status verifications, and printable invoices"
        columns={columns}
        data={items}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={(page) => setFilters({ page })}
        onLimitChange={(limit) => setFilters({ limit, page: 1 })}
        filterControls={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
                className="pl-9 pr-3 py-1.5 border border-purple-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 w-44"
              />
            </div>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
              className="border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-purple-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        }
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoice={invoice}
        invoiceHtml={invoiceHtml}
      />

      {/* Upload Payment Proof Modal */}
      <UploadProofModal
        isOpen={isProofOpen}
        onClose={() => setIsProofOpen(false)}
        order={selectedOrderForProof}
        onUpload={uploadProof}
      />
    </div>
  );
}

