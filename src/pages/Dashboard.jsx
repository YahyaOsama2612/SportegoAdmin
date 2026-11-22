import { useTenantInfo } from '../hooks/useTenantInfo';
import { StatCard } from '../components/dashboard/StatCard';
import { SubscriptionBanner } from '../components/dashboard/SubscriptionBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Shield, Users, Trophy, Activity, ShoppingCart, UserCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { data, loading, error } = useTenantInfo();

  if (loading && !data) {
    return <LoadingSpinner text="Loading club dashboard..." />;
  }

  if (error && !data) {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
        Unable to load tenant information: {error.message}
      </div>
    );
  }

  const counts = data?.counts || {
    teams: 0,
    players: 0,
    matches: 0,
    player_progress: 0,
    cart: 0,
    admins: 0,
  };

  return (
    <div className="space-y-8">
      {/* Club Subscription Status Header */}
      <SubscriptionBanner club={data?.club} subscription={data?.subscription} />

      {/* Primary Statistics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-purple-950 uppercase tracking-wider text-xs">
            Club Overview & Statistics
          </h3>
          <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Database: {data?.database || 'ahly'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Link to="/teams">
            <StatCard
              title="Active Teams"
              value={counts.teams}
              icon={Shield}
              change="+1 squad"
              trend="up"
            />
          </Link>
          <Link to="/players">
            <StatCard
              title="Total Players"
              value={counts.players}
              icon={Users}
              change="Scouted"
              trend="up"
            />
          </Link>
          <Link to="/matches">
            <StatCard
              title="Club Matches"
              value={counts.matches}
              icon={Trophy}
              change="Played"
            />
          </Link>
          <Link to="/scouting">
            <StatCard
              title="Actions Logged"
              value={counts.player_progress}
              icon={Activity}
              change="Events"
              trend="up"
            />
          </Link>
          <Link to="/cart">
            <StatCard
              title="Cart Lines"
              value={counts.cart}
              icon={ShoppingCart}
              change="Ready"
            />
          </Link>
          <Link to="/staff">
            <StatCard
              title="Coaches / Admins"
              value={counts.admins}
              icon={UserCheck}
              change="Staff"
            />
          </Link>
        </div>
      </div>

      {/* Quick Launch & Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-6 rounded-3xl border border-purple-100 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-purple-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-purple-950">Squads & Formations</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Create teams for different age groups and sports (e.g. Under-19, First Team).
            </p>
          </div>
          <Link
            to="/teams"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 group"
          >
            <span>Manage Teams</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-6 rounded-3xl border border-purple-100 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-purple-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-purple-950">Scouting Action Progress</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Log match goals, assists, key passes, and defensive events per player with instant aggregations.
            </p>
          </div>
          <Link
            to="/scouting"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 group"
          >
            <span>Open Scouting Console</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-6 rounded-3xl border border-purple-100 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-purple-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-purple-950">Subscription Store</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Upgrade team capacity or renew your annual cycle with calculated savings and direct proof checkout.
            </p>
          </div>
          <Link
            to="/packages"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 group"
          >
            <span>Browse Packages</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

