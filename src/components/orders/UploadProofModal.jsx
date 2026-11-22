import { useState } from 'react';
import { Modal } from '../common/Modal';
import { UploadCloud } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function UploadProofModal({ isOpen, onClose, order, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  if (!order) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        addToast('File size exceeds 5MB limit', 'error');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      addToast('Please select a payment receipt image', 'error');
      return;
    }
    setLoading(true);
    try {
      await onUpload(order._id, file);
      addToast('Payment proof uploaded successfully!');
      onClose();
    } catch {
      addToast('Failed to upload receipt', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Payment Receipt" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 text-xs">
          <p className="font-semibold text-purple-950">Order #{order.order_number}</p>
          <p className="text-purple-700 font-bold mt-0.5">Amount: {order.final_price} EGP</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-purple-950 mb-2">
            Select Screenshot / Receipt (PNG, JPG, WEBP max 5MB)
          </label>
          <div className="border-2 border-dashed border-purple-200 rounded-2xl p-6 text-center hover:border-purple-400 transition bg-purple-50/20 cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {preview ? (
              <div className="space-y-2">
                <img
                  src={preview}
                  alt="Proof preview"
                  className="max-h-40 mx-auto rounded-lg shadow-xs object-contain border border-purple-200"
                />
                <p className="text-xs text-purple-600 font-medium">Click to choose a different image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-10 h-10 text-purple-500 mb-2" />
                <p className="text-xs font-semibold text-purple-950">
                  Drop receipt image here or <span className="text-purple-600 underline">browse</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Upload transfer proof (InstaPay, Vodafone Cash, Bank)</p>
              </div>
            )}
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
            disabled={!file || loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Upload Proof
          </button>
        </div>
      </form>
    </Modal>
  );
}

