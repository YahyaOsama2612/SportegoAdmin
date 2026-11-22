import { useState } from 'react';
import { usePackages } from '../hooks/usePackages';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Check, ShoppingCart, Zap, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Packages() {
  const { packages, loading, error } = usePackages();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Track chosen cycle per package
  const [selectedCycles, setSelectedCycles] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const getActiveCycle = (pkg) => {
    const chosenId = selectedCycles[pkg._id];
    if (chosenId && pkg.cycles) {
      const found = pkg.cycles.find((c) => c._id === chosenId);
      if (found) return found;
    }
    return pkg.cycles?.[0];
  };

  const handleSelectCycle = (pkgId, cycleId) => {
    setSelectedCycles((prev) => ({ ...prev, [pkgId]: cycleId }));
  };

  const handleAddToCart = async (pkg) => {
    const cycle = getActiveCycle(pkg);
    if (!cycle) return;
    setActionLoading(true);
    try {
      await addToCart(pkg._id, cycle._id);
      addToast(`Added ${pkg.name} (${cycle.name}) to cart!`);
    } catch {
      addToast('Error adding to cart', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async (pkg) => {
    const cycle = getActiveCycle(pkg);
    if (!cycle) return;
    setActionLoading(true);
    try {
      await addToCart(pkg._id, cycle._id);
      navigate('/cart');
    } catch {
      addToast('Error proceeding to checkout', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && packages.length === 0) {
    return <LoadingSpinner text="Loading subscription plans..." />;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load packages: {error.response?.data?.error?.message || error.message}
        </div>
      )}
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-xl border border-purple-700/40">
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30">
            Official Tenant Store
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Subscription Packages & Upgrades
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
            Scale your club's teams, active athlete capacity, and analytics cycles with dedicated discounts and instant super-admin approvals.
          </p>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {packages.map((pkg) => {
          const activeCycle = getActiveCycle(pkg);
          const isCurrentPlan = pkg.is_current;

          return (
            <div
              key={pkg._id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative border ${
                isCurrentPlan
                  ? 'bg-gradient-to-b from-purple-50/80 to-white border-purple-300 shadow-xl ring-2 ring-purple-600/20'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl hover:border-purple-200'
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Current Active Plan
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-purple-950">{pkg.name}</h3>
                  <Badge variant="purple">{pkg.game?.name || 'Football'}</Badge>
                </div>

                {/* Team & Player Capacity stats */}
                <div className="flex items-center gap-4 my-4 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>Up to {pkg.teams} Teams</span>
                  </div>
                  <div className="w-px h-4 bg-purple-200" />
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Up to {pkg.players} Players</span>
                  </div>
                </div>

                {/* Billing Cycle Picker */}
                <div className="mt-5 space-y-2">
                  <label className="block text-xs font-bold text-purple-950 uppercase tracking-wide">
                    Choose Duration Cycle:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.cycles?.map((cycle) => {
                      const isSelected = activeCycle?._id === cycle._id;
                      return (
                        <button
                          type="button"
                          key={cycle._id}
                          onClick={() => handleSelectCycle(pkg._id, cycle._id)}
                          className={`p-3 rounded-2xl border text-left transition ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-600/30'
                              : 'bg-white hover:bg-purple-50 text-purple-950 border-purple-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{cycle.name}</span>
                            {cycle.discount > 0 && (
                              <span
                                className={`text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                -{cycle.discount}%
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm font-black">
                            {cycle.final_price || cycle.price} EGP
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Display */}
                {activeCycle && (
                  <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-purple-100/60 to-indigo-100/30 border border-purple-200/60 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black text-purple-950">
                        {activeCycle.final_price || activeCycle.price} EGP
                      </span>
                      <span className="text-xs text-purple-800 font-semibold ml-2">
                        / {activeCycle.months} Months
                      </span>
                    </div>
                    {activeCycle.discount > 0 && (
                      <span className="text-xs line-through text-slate-400 font-medium">
                        {activeCycle.price} EGP
                      </span>
                    )}
                  </div>
                )}

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-slate-600 my-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Isolated Database Subdomain ({pkg.teams} squads allowed)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tactical Match Logging & Player Progress analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sub-Admins and Unlimited Coach Logins</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-purple-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAddToCart(pkg)}
                  disabled={actionLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-purple-300 hover:bg-purple-50 text-purple-900 font-bold text-xs shadow-xs transition"
                >
                  <ShoppingCart className="w-4 h-4 text-purple-600" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBuyNow(pkg)}
                  disabled={actionLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition transform active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>Checkout Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

