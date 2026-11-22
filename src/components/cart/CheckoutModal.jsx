import { useState } from 'react';
import { Modal } from '../common/Modal';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import { useToast } from '../../context/ToastContext';
import { uploadImageApi } from '../../api/endpoints';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export function CheckoutModal({ isOpen, onClose, total, onCheckout, loading }) {
  const { methods, error: methodsError } = usePaymentMethods();
  const { addToast } = useToast();

  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [proofFile, setProofFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMethodId) {
      addToast('Please select a payment method', 'error');
      return;
    }
    try {
      if (!proofUrl && !proofFile) {
        addToast('Please provide a payment proof URL or upload a receipt', 'error');
        return;
      }

      let finalProof = proofUrl;
      if (proofFile) {
        const formData = new FormData();
        formData.append('image', proofFile);
        const uploadResponse = await uploadImageApi(formData);
        const uploadedFile = uploadResponse.data?.data?.file;
        finalProof = uploadedFile?.absolute_url || uploadedFile?.url;
        if (!finalProof) {
          throw new Error('Image upload response did not include a URL');
        }
      }

      await onCheckout(selectedMethodId, finalProof);
      addToast('Order placed successfully! Pending Super Admin approval.');
      onClose();
    } catch (requestError) {
      addToast(requestError.response?.data?.error?.message || requestError.message || 'Failed to complete checkout', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Subscription Checkout" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Total Summary */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-300 font-semibold uppercase">Total Due</p>
            <h3 className="text-2xl font-black mt-0.5">{total} EGP</h3>
          </div>
          <span className="text-xs bg-purple-500/30 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full font-bold">
            Club Checkout
          </span>
        </div>

        {/* Payment Methods Selection */}
        <div>
          <label className="block text-xs font-semibold text-purple-950 mb-2">
            1. Select Payment Method & Transfer Instructions
          </label>
          <div className="space-y-2">
            {methodsError && (
              <p role="alert" className="text-xs text-rose-700">
                Unable to load payment methods: {methodsError.response?.data?.error?.message || methodsError.message}
              </p>
            )}
            {methods.map((method) => {
              const isSelected = selectedMethodId === method._id;
              return (
                <div
                  key={method._id}
                  onClick={() => setSelectedMethodId(method._id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600/30'
                      : 'border-purple-100 hover:border-purple-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-purple-950">{method.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{method.description}</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Proof Field */}
        <div>
          <label className="block text-xs font-semibold text-purple-950 mb-1.5">
            2. Payment Proof Receipt (URL or Upload)
          </label>
          <input
            type="text"
            placeholder="e.g. https://example.com/proofs/receipt.jpg"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 mb-2"
          />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">or upload screenshot:</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-purple-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !selectedMethodId}
            className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Confirm Order ({total} EGP)
          </button>
        </div>
      </form>
    </Modal>
  );
}

