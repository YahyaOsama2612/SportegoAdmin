import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  Users,
  Trophy,
  Activity,
  Package,
  ShoppingCart,
  Receipt,
  UserCog,
  Palette,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

export function Sidebar({ isOpen, isCollapsed, onClose }) {
  const { subdomain } = useAuth();
  const { count } = useCart();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Teams', path: '/teams', icon: Shield },
    { name: 'Players', path: '/players', icon: Users },
    { name: 'Matches', path: '/matches', icon: Trophy },
    { name: 'Player Progress', path: '/scouting', icon: Activity },
    { name: 'Packages Store', path: '/packages', icon: Package },
    {
      name: 'Cart & Checkout',
      path: '/cart',
      icon: ShoppingCart,
      badge: count > 0 ? count : null,
    },
    { name: 'Orders & Invoices', path: '/orders', icon: Receipt },
    { name: 'Staff & Admins', path: '/staff', icon: UserCog },
    { name: 'Branding & Settings', path: '/settings', icon: Palette },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-purple-950/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 text-white flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 border-r border-purple-800/40 shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`p-6 border-b border-purple-800/50 flex items-center justify-between ${
            isCollapsed ? 'md:p-4 md:justify-center' : ''
          }`}
        >
          <div className={`flex items-center gap-3 ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-400 p-0.5 shadow-lg shadow-purple-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-purple-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
            </div>
            <div className={isCollapsed ? 'md:hidden' : ''}>
              <h1 className="font-bold text-lg text-white tracking-wider flex items-center gap-1.5">
                SPROTEGO
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-purple-300/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono uppercase">{subdomain || 'ahly'} portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-800 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          <div className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-purple-400/70 ${isCollapsed ? 'md:hidden' : ''}`}>
            Main Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isCollapsed ? 'md:justify-center md:px-2' : ''
                  } ${
                    isActive
                      ? 'bg-purple-600/40 text-white font-semibold shadow-inner border border-purple-500/30'
                      : 'text-purple-200/80 hover:bg-purple-800/40 hover:text-white'
                  }`
                }
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? 'md:justify-center' : ''}`}>
                  <Icon className="w-4 h-4 text-purple-300 group-hover:text-purple-100 transition-colors" />
                  <span className={isCollapsed ? 'md:hidden' : ''}>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold bg-purple-500 text-white rounded-full shadow-xs ${
                      isCollapsed ? 'md:absolute md:-right-1 md:-top-1 md:px-1.5 md:py-0' : ''
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className={`p-4 border-t border-purple-800/50 bg-purple-950/40 ${isCollapsed ? 'md:p-3' : ''}`}>
          <div className="p-3 bg-purple-900/40 rounded-xl border border-purple-700/30 text-xs text-purple-300 flex items-center justify-between">
            <div className={isCollapsed ? 'md:hidden' : ''}>
              <p className="font-semibold text-white">Tenant Isolated</p>
              <p className="text-[11px] text-purple-300/70">{subdomain}.sportego.org</p>
            </div>
            <div className={`w-2 h-2 bg-purple-400 rounded-full ${isCollapsed ? 'md:mx-auto' : ''}`} />
          </div>
        </div>
      </aside>
    </>
  );
}

