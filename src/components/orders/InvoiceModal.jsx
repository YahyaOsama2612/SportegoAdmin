import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Printer } from 'lucide-react';

export function InvoiceModal({ isOpen, onClose, invoice, invoiceHtml }) {
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'html'

  if (!invoice && !invoiceHtml) return null;

  const items = invoice?.items || (invoice?.item ? [invoice.item] : []);
  const subtotal =
    invoice?.pricing?.subtotal ??
    items.reduce((total, item) => total + Number(item.unit_price || 0), 0);
  const discount =
    invoice?.pricing?.discount ??
    items.reduce((total, item) => total + Number(item.discount || 0), 0);
  const fine = invoice?.pricing?.fine ?? 0;
  const total =
    invoice?.pricing?.total ??
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.final_price ?? Number(item.unit_price || 0) - Number(item.discount || 0)),
      0
    ) +
      Number(fine);

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const printableHtml = invoiceHtml
      ? invoiceHtml
      : `
        <html>
          <head><title>Invoice</title></head>
          <body>${document.getElementById('invoice-printable')?.innerHTML || ''}</body>
        </html>
      `;

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => iframe.remove(), 1000);
    };
    iframe.srcdoc = printableHtml;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Invoice Details" maxWidth="max-w-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('summary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === 'summary'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Invoice Summary
          </button>
          <button
            onClick={() => setViewMode('html')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === 'html'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Printable HTML View
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-semibold rounded-lg transition"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / PDF
        </button>
      </div>

      {viewMode === 'summary' && invoice ? (
        <div id="invoice-printable" className="space-y-6 text-sm">
          {/* Header Info */}
          <div className="flex items-start justify-between bg-purple-50/50 p-4 rounded-xl border border-purple-100">
            <div>
              <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">
                Invoice Number
              </p>
              <h4 className="text-lg font-bold text-purple-950">{invoice.invoice_number}</h4>
              <p className="text-xs text-slate-500 mt-1">
                Order Ref: <span className="font-mono">{invoice.order_number}</span>
              </p>
              {invoice.issued_at && (
                <p className="text-xs text-slate-500 mt-1">
                  Issued: {new Date(invoice.issued_at).toLocaleString()}
                </p>
              )}
            </div>
            <div className="text-right">
              <Badge variant={invoice.is_paid ? 'success' : 'warning'}>
                {invoice.status?.toUpperCase()}
              </Badge>
              <p className="text-xs text-slate-600 mt-2 font-medium">{invoice.club?.name}</p>
              {invoice.provider?.name && (
                <p className="text-xs text-slate-500 mt-1">{invoice.provider.name}</p>
              )}
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-purple-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50 text-purple-900 font-semibold border-b border-purple-100">
                <tr>
                  <th className="p-3">Package</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Discount</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {items.map((item, index) => (
                  <tr key={`${item.package_id || item.package_name || 'invoice-item'}-${index}`}>
                    <td className="p-3 font-semibold text-purple-950">
                      {item.package_name}
                      {(item.game_name || item.teams_limit != null || item.players_limit != null) && (
                        <span className="block text-[11px] text-slate-500 font-normal mt-1">
                          {[item.game_name, item.teams_limit != null && `${item.teams_limit} teams`, item.players_limit != null && `${item.players_limit} players`]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600">
                      {item.cycle_name}
                      {item.months != null && (
                        <span className="block text-[11px] text-slate-500">{item.months} months</span>
                      )}
                    </td>
                    <td className="p-3 text-right">{item.unit_price} EGP</td>
                    <td className="p-3 text-right text-emerald-600">
                      -{item.discount || 0} EGP
                    </td>
                    <td className="p-3 text-right font-bold text-purple-950">
                      {item.final_price ?? Number(item.unit_price || 0) - Number(item.discount || 0)} EGP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{subtotal} EGP</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span>-{discount} EGP</span>
              </div>
              {fine > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Fine:</span>
                  <span>{fine} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-purple-950 pt-2 border-t border-purple-100">
                <span>Total Amount:</span>
                <span className="text-purple-600">
                  {total} {invoice.pricing?.currency || 'EGP'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {invoice.payment && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-purple-950">Payment Method:</span>{' '}
              {invoice.payment.method_name}
              {invoice.payment.payment_reference && (
                <span className="ml-4 font-mono text-slate-500">
                  Ref: {invoice.payment.payment_reference}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-purple-200 rounded-xl p-4 bg-white max-h-[60vh] overflow-y-auto">
          {invoiceHtml ? (
            <div dangerouslySetInnerHTML={{ __html: invoiceHtml }} />
          ) : (
            <p className="text-center text-xs text-slate-400 py-8">
              No HTML template rendered yet.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end pt-3 border-t border-purple-100">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition"
        >
          Close Invoice
        </button>
      </div>
    </Modal>
  );
}

