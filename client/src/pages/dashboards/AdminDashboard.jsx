import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Activity, ShieldCheck, Users, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">Saarthi</span>
          </div>

          <nav className="space-y-2">
            <NavItem icon={Activity} label="System Health" active />
            <NavItem icon={Users} label="User Management" />
            <NavItem icon={Settings} label="Global Settings" />
          </nav>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-3 text-slate-500 font-bold hover:text-red-600 transition-colors p-4 rounded-2xl hover:bg-red-50"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Admin Console</h1>
            <p className="text-slate-500 font-medium tracking-wide">Managing the digital heart of the hospital.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{user?.name}</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Total Users" value="1,204" icon={Users} color="bg-indigo-600" />
          <StatCard title="Active Sockets" value="156" icon={Activity} color="bg-emerald-600" />
          <StatCard title="System Alerts" value="00" icon={ShieldCheck} color="bg-blue-600" />
        </div>

        <div className="mt-12 bg-white rounded-3xl p-10 border border-slate-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-wide">Admin Dashboard Ready</h3>
           <p className="text-slate-500 max-w-sm font-medium leading-relaxed">Full system control and analytics for hospital operations.</p>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg`}>
      <Icon className="text-white w-8 h-8" />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
