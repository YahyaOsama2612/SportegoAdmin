import { Calendar, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubscriptionBanner({ club, subscription }) {
  if (!subscription) return null;

  const isActive = subscription.status === 'active';
  const daysLeft = subscription.days_left ?? 0;
  const isExpiringSoon = daysLeft <= 14;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-purple-700/40">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              {club?.name || 'Club'} Subscription
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {subscription.status}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {club?.name || 'Al Ahly SC'}
          </h2>
          <p className="text-sm text-purple-200/80 mt-1 max-w-xl">
            Managing athletes, teams, match analytics, and tactical progress in your isolated tenant database ({club?.subdomain}).
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-purple-200/90 font-medium">
            <div className="flex items-center gap-1.5 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-700/40">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>
                {subscription.days_left !== undefined ? `${subscription.days_left} Days Remaining` : 'Active'}
              </span>
            </div>
            {isExpiringSoon && (
              <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-400/30 text-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-300" />
                <span>Renewal due soon</span>
              </div>
            )}
            {subscription.allowed_days && (
              <div className="flex items-center gap-1.5 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-700/40">
                <AlertCircle className="w-4 h-4 text-purple-400" />
                <span>Grace Window: {subscription.allowed_days} Days</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            to="/packages"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 font-bold text-sm shadow-lg hover:shadow-xl transition transform active:scale-95"
          >
            <span>Renew / Upgrade Plan</span>
            <ArrowRight className="w-4 h-4 text-purple-700" />
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-purple-800/60 hover:bg-purple-800 text-purple-100 font-semibold text-sm border border-purple-600/40 transition"
          >
            View Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}

