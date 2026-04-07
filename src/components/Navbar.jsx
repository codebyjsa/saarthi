import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar({ variant = 'default' }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isLanding = variant === 'landing';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isLanding
        ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100'
        : 'bg-white border-b border-slate-200 shadow-sm'
    }`}>
      <div className={`${isLanding ? 'max-w-7xl' : 'max-w-full'} mx-auto px-6 lg:px-8`}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <i className="fas fa-hospital text-white text-sm"></i>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Saar<span className="text-blue-600">thi</span>
            </span>
          </Link>

          {/* Nav Links */}
          {isLanding ? (
            <div className="hidden md:flex items-center gap-1">
              {[
                { to: '/patient', label: 'Patient Portal', icon: 'fa-user' },
                { to: '/doctor', label: 'Doctor Portal', icon: 'fa-user-md' },
                { to: '/admin', label: 'Admin', icon: 'fa-chart-line' },
                { to: '/monitoring', label: 'Monitoring', icon: 'fa-heartbeat' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <i className={`fas ${link.icon} mr-2 text-xs`}></i>
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!isLanding && (
              <>
                {/* Search */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2 gap-2 w-64 hover:bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-lg transition-all">
                  <i className="fas fa-search text-slate-400 text-sm"></i>
                  <input
                    type="text"
                    placeholder="Search patients, records..."
                    className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
                  />
                  <kbd className="text-xs text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
                </div>

                {/* Notification bell */}
                <div className="relative">
                  <button
                    onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                    className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <i className="fas fa-bell text-lg"></i>
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-fade-in-down overflow-hidden">
                      <div className="p-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {[
                          { icon: 'fa-exclamation-triangle', color: 'text-red-500 bg-red-50', msg: 'ICU Bed 3: O₂ below 90%', time: '2m' },
                          { icon: 'fa-clock', color: 'text-amber-500 bg-amber-50', msg: 'Queue update: T-001 attending', time: '5m' },
                          { icon: 'fa-calendar-check', color: 'text-green-500 bg-green-50', msg: 'Appointment confirmed 2:00 PM', time: '10m' },
                        ].map((n, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.color}`}>
                              <i className={`fas ${n.icon} text-xs`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-700">{n.msg}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{n.time} ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link to="/notifications" className="block p-3 text-center text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  AK
                </div>
                {!isLanding && (
                  <span className="hidden md:block text-sm font-medium text-slate-700">Aarav K.</span>
                )}
                <i className="fas fa-chevron-down text-[10px] text-slate-400"></i>
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-fade-in-down overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 text-sm">Aarav Kumar</p>
                    <p className="text-xs text-slate-500">aarav.kumar@email.com</p>
                  </div>
                  <div className="p-2">
                    {[
                      { icon: 'fa-user', label: 'My Profile' },
                      { icon: 'fa-cog', label: 'Settings' },
                      { icon: 'fa-file-medical', label: 'My Records', to: '/records' },
                    ].map((item, i) => (
                      <Link
                        key={i}
                        to={item.to || '#'}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <i className={`fas ${item.icon} text-xs w-4 text-center text-slate-400`}></i>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-100">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <i className="fas fa-sign-out-alt text-xs w-4 text-center"></i>
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
