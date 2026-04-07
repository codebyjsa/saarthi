import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { LineChart, BarChart, DonutChart } from '../components/Charts.jsx';
import { useToast } from '../components/Toast.jsx';
import { adminStats, patientFlowData, queueLoadData, doctors } from '../data.js';

export default function AdminDashboard() {
  const toast = useToast();
  const [stats, setStats] = useState(adminStats);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate live stat updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeQueue: prev.activeQueue + Math.floor(Math.random() * 3) - 1,
        avgWaitTime: Math.max(5, prev.avgWaitTime + Math.floor(Math.random() * 5) - 2),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Total Patients', value: stats.totalPatients.toLocaleString(), icon: 'fa-users', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20', change: '+12%', up: true },
    { label: 'Active Queue', value: stats.activeQueue, icon: 'fa-clock', color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20', change: `${stats.activeQueue} patients`, up: null },
    { label: 'Avg Wait Time', value: `${stats.avgWaitTime} min`, icon: 'fa-hourglass-half', color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20', change: '-8%', up: false },
    { label: 'Bed Occupancy', value: `${Math.round((stats.bedsOccupied / stats.totalBeds) * 100)}%`, icon: 'fa-bed', color: 'from-purple-500 to-indigo-500', shadow: 'shadow-purple-500/20', change: `${stats.bedsOccupied}/${stats.totalBeds}`, up: null },
  ];

  const chartData = patientFlowData.map(d => ({ label: d.hour, value: d.patients }));
  const barData = queueLoadData.map(d => ({ label: d.dept, value: d.load }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Hospital operations overview</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              All Systems Operational
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
              <i className="fas fa-download text-xs"></i>
              Export Report
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center shadow-lg ${s.shadow}`}>
                  <i className={`fas ${s.icon} text-white text-sm`}></i>
                </div>
                {s.up !== null && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${s.up ? 'text-emerald-600' : 'text-red-600'}`}>
                    <i className={`fas fa-arrow-${s.up ? 'up' : 'down'} text-[10px]`}></i>
                    {s.change}
                  </span>
                )}
                {s.up === null && <span className="text-xs font-medium text-slate-400">{s.change}</span>}
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Patient Flow Chart */}
          <div className="lg:col-span-2 animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900">Patient Flow</h3>
                <p className="text-sm text-slate-500 mt-0.5">Hourly patient visits today</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                {['Today', 'Week', 'Month'].map(t => (
                  <button key={t} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    t === 'Today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}>{t}</button>
                ))}
              </div>
            </div>
            <LineChart data={chartData} color="#2563eb" height={220} />
          </div>

          {/* Queue Load */}
          <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '100ms' }}>
            <div className="mb-6">
              <h3 className="font-bold text-slate-900">Queue Load</h3>
              <p className="text-sm text-slate-500 mt-0.5">By department</p>
            </div>
            <BarChart data={barData} height={220} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Doctors on Duty */}
          <div className="lg:col-span-2 animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900">Doctors on Duty</h3>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                Manage <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 pl-3">Doctor</th>
                    <th className="pb-3">Specialty</th>
                    <th className="pb-3">Patients Today</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {doctors.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                            {d.avatar}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{d.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-slate-600">{d.specialty}</td>
                      <td className="py-3 text-sm font-semibold text-slate-900">{d.patientsToday}</td>
                      <td className="py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          d.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                          d.status === 'busy' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>{d.status.charAt(0).toUpperCase() + d.status.slice(1)}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-slate-700 flex items-center gap-1">
                          <i className="fas fa-star text-amber-400 text-xs"></i>{d.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Capacity */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '100ms' }}>
              <h3 className="font-bold text-slate-900 mb-5">Hospital Capacity</h3>
              <div className="flex items-center justify-around">
                <DonutChart value={stats.bedsOccupied} max={stats.totalBeds} color="#2563eb" size={90} label="Beds" />
                <DonutChart value={stats.doctorsOnDuty} max={18} color="#22c55e" size={90} label="Doctors" />
                <DonutChart value={stats.satisfactionRate} max={100} color="#f59e0b" size={90} label="Satisfaction" />
              </div>
            </div>

            {/* Quick Controls */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '200ms' }}>
              <h3 className="font-bold text-slate-900 mb-4">Quick Controls</h3>
              <div className="space-y-2">
                {[
                  { icon: 'fa-user-md', label: 'Manage Doctors', color: 'text-blue-500' },
                  { icon: 'fa-sliders-h', label: 'Configure Queue Rules', color: 'text-amber-500' },
                  { icon: 'fa-bell', label: 'Alert Thresholds', color: 'text-red-500' },
                  { icon: 'fa-chart-bar', label: 'View Reports', color: 'text-purple-500' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => toast.addToast({ type: 'info', title: item.label, message: 'Settings panel would open here' })}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center ${item.color}`}>
                      <i className={`fas ${item.icon} text-sm`}></i>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <i className="fas fa-chevron-right text-xs text-slate-300 ml-auto group-hover:text-blue-500 transition-colors"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
