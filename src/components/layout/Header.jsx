import { Menu, LogOut, ShoppingCart, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';

export function Header({ onMenuClick, isSidebarCollapsed }) {
  const { user, subdomain, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left Side: Mobile toggle & Subdomain indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-purple-900 hover:bg-purple-50 transition"
            aria-label="Toggle sidebar"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 transition text-xs font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            <span>Club: <strong className="text-purple-700 uppercase">{subdomain}</strong></span>
          </div>
        </div>

        {/* Right Side: Cart quick link, profile & actions */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 rounded-xl text-purple-900 hover:bg-purple-50 transition"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center animate-bounce">
                {count}
              </span>
            )}
          </Link>

          {/* User Profile Info */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-purple-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left text-xs">
              <p className="font-bold text-purple-950 leading-tight">{user?.name || 'Ahly Admin'}</p>
              <p className="text-purple-600/70 font-medium capitalize">{user?.role || 'admin'}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </header>
  );
}

