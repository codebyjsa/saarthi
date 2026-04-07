import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { to: '/doctor', icon: 'fa-th-large', label: 'Dashboard' },
  { to: '/doctor', icon: 'fa-users', label: 'Queue', hash: '#queue' },
  { to: '/records', icon: 'fa-folder-open', label: 'Records' },
  { to: '/monitoring', icon: 'fa-heartbeat', label: 'Monitoring' },
  { to: '/notifications', icon: 'fa-bell', label: 'Alerts' },
];

const bottomItems = [
  { to: '#', icon: 'fa-cog', label: 'Settings' },
  { to: '/', icon: 'fa-sign-out-alt', label: 'Logout' },
];

export default function Sidebar({ collapsed = false }) {
  const location = useLocation();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 ${
      collapsed ? 'w-[72px]' : 'w-[260px]'
    }`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800/60">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
          <i className="fas fa-hospital text-white text-sm"></i>
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight whitespace-nowrap">
            Saar<span className="text-blue-400">thi</span>
          </span>
        )}
      </div>

      {/* Doctor Profile */}
      <div className={`px-4 py-5 border-b border-slate-800/60 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
            AS
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-emerald-500/20">
              AS
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Dr. Anika Sharma</p>
              <p className="text-xs text-slate-400">Cardiology</p>
            </div>
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-slate-900 flex-shrink-0"></span>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!collapsed && <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Menu</p>}
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={i}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <i className={`fas ${item.icon} text-sm ${collapsed ? '' : 'w-5 text-center'} ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
              } transition-colors`}></i>
              {!collapsed && item.label}
              {!collapsed && item.label === 'Queue' && (
                <span className="ml-auto bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">8</span>
              )}
              {!collapsed && item.label === 'Alerts' && (
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-800/60 space-y-1">
        {bottomItems.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all ${
              collapsed ? 'justify-center' : ''
            } ${item.label === 'Logout' ? 'hover:bg-red-600/10 hover:text-red-400' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <i className={`fas ${item.icon} text-sm ${collapsed ? '' : 'w-5 text-center'}`}></i>
            {!collapsed && item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
