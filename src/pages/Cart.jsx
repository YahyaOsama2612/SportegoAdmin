import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { CheckoutModal } from '../components/cart/CheckoutModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Trash2, ShoppingCart, ArrowRight, Shield, Users, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function Cart() {
  const { addToast } = useToast();
  const {
    cart,
    count,
    total,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkoutCart,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckoutSubmit = async (paymentMethodId, proof) => {
    setCheckingOut(true);
    try {
      await checkoutCart(paymentMethodId, proof);
      setIsCheckoutOpen(false);
    } finally {
      setCheckingOut(false);
    }
  };

  const showCartError = (requestError) => {
    addToast(requestError.response?.data?.error?.message || requestError.message || 'Cart request failed', 'error');
  };

  const handleUpdateCartItem = async (packageId, cycleId) => {
    try {
      await updateCartItem(packageId, cycleId);
    } catch (requestError) {
      showCartError(requestError);
    }
  };

  const handleRemoveFromCart = async (packageId) => {
    try {
      await removeFromCart(packageId);
    } catch (requestError) {
      showCartError(requestError);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (requestError) {
      showCartError(requestError);
    }
  };

  if (loading && cart.length === 0) {
    return <LoadingSpinner text="Loading cart lines..." />;
  }

  if (cart.length === 0) {
    if (error) {
      return (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load cart: {error.response?.data?.error?.message || error.message}
        </div>
      );
    }
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your subscription cart is empty"
        description="Browse available packages, upgrade capacity or renew current cycle."
        actionText="Browse Packages"
        onAction={() => (window.location.href = '/packages')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Cart request failed: {error.response?.data?.error?.message || error.message}
        </div>
      )}
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h2 className="text-2xl font-black text-purple-950 tracking-tight">Club Subscription Cart</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your package selections before sending for super admin approval.
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      {/* Cart Items List & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lines */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const pkg = item.package || {};
            const availableCycles = pkg.cycles || [];

            return (
              <div
                key={item._id || item.package_id}
                className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:border-purple-200 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </span>
                    <h4 className="text-base font-bold text-purple-950">{pkg.name || 'Package'}</h4>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-purple-500" />
                      {pkg.teams || 5} Teams
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-500" />
                      {pkg.players || 30} Players
                    </span>
                  </div>

                  {/* Cycle Switcher Dropdown */}
                  {availableCycles.length > 0 && (
                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-purple-950 mb-1">
                        Subscription Cycle:
                      </label>
                      <select
                        value={item.cycle_id}
                        onChange={(e) => handleUpdateCartItem(item.package_id, e.target.value)}
                        className="border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-purple-900 bg-purple-50/50 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
                      >
                        {availableCycles.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} — {c.final_price || c.price} EGP
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Pricing & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-purple-50">
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-black text-purple-950">
                      {item.final_price || item.price} EGP
                    </span>
                    {item.discount > 0 && (
                      <span className="block text-xs text-emerald-600 font-bold">
                        Save {item.discount} EGP ({item.cycle?.discount || 0}%)
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.package_id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-md space-y-5 sticky top-20">
            <h3 className="font-bold text-base text-purple-950 border-b border-purple-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items in Cart:</span>
                <span className="font-semibold text-purple-950">{count}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Setup & Subdomain Fee:</span>
                <span className="text-emerald-600 font-semibold">FREE (Included)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Late Renewal Fine:</span>
                <span className="font-semibold text-slate-900">0 EGP</span>
              </div>
              <div className="pt-3 border-t border-purple-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-purple-950">Total Amount:</span>
                <span className="text-2xl font-black text-purple-700">{total} EGP</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-purple-600/30 transition transform active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-purple-800 leading-relaxed">
              <Check className="w-3.5 h-3.5 text-purple-600 inline mr-1" />
              After submitting transfer proof, super admins review and activate your subscription period immediately.
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
        onCheckout={handleCheckoutSubmit}
        loading={checkingOut}
      />
    </div>
  );
}

