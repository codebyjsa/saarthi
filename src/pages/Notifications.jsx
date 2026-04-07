import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/Toast.jsx';
import { notifications as initialNotifications } from '../data.js';

export default function Notifications() {
  const toast = useToast();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');
  const [smsForm, setSmsForm] = useState({ phone: '+91 98765 43210', message: 'Your appointment with Dr. Sharma is confirmed for tomorrow at 2:00 PM.' });
  const [smsSent, setSmsSent] = useState(false);

  const typeConfig = {
    alert: { icon: 'fa-exclamation-triangle', color: 'bg-red-50 text-red-500', badge: 'bg-red-100 text-red-700' },
    queue: { icon: 'fa-clock', color: 'bg-amber-50 text-amber-500', badge: 'bg-amber-100 text-amber-700' },
    appointment: { icon: 'fa-calendar-check', color: 'bg-emerald-50 text-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
    system: { icon: 'fa-cog', color: 'bg-blue-50 text-blue-500', badge: 'bg-blue-100 text-blue-700' },
    sms: { icon: 'fa-sms', color: 'bg-purple-50 text-purple-500', badge: 'bg-purple-100 text-purple-700' },
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.addToast({ type: 'success', title: 'Done', message: 'All notifications marked as read' });
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sendSms = () => {
    setSmsSent(true);
    toast.addToast({ type: 'success', title: 'SMS Sent', message: `Message delivered to ${smsForm.phone}` });
    setTimeout(() => setSmsSent(false), 3000);
  };

  const triggerToast = (type) => {
    const messages = {
      success: { title: 'Appointment Confirmed', message: 'Dr. Sharma confirmed your 2:00 PM slot' },
      error: { title: 'Critical Alert', message: 'ICU Bed 3: Oxygen level critical' },
      warning: { title: 'Queue Delay', message: 'Average wait time increased to 25 min' },
      info: { title: 'System Update', message: 'Health records module v2.1 deployed' },
    };
    toast.addToast({ type, ...messages[type] });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-500 mt-1">{unreadCount} unread notifications</p>
          </div>
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <i className="fas fa-check-double text-xs"></i>
            Mark all as read
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Tabs */}
            <div className="animate-fade-in-up flex items-center gap-2 overflow-x-auto pb-1" style={{ animationDelay: '80ms' }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'alert', label: 'Alerts' },
                { key: 'queue', label: 'Queue' },
                { key: 'appointment', label: 'Appointments' },
                { key: 'system', label: 'System' },
                { key: 'sms', label: 'SMS' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    filter === t.key
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {t.label}
                  {t.key !== 'all' && (
                    <span className="ml-1.5 text-xs opacity-70">
                      {notifications.filter(n => n.type === t.key).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notification Cards */}
            <div className="space-y-3 stagger">
              {filtered.map(n => {
                const cfg = typeConfig[n.type];
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                      n.read ? 'bg-white border-slate-100' : 'bg-white border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <i className={`fas ${cfg.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h3>
                        {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
                      </div>
                      <p className="text-sm text-slate-500">{n.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-400">{n.time}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
                          {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-500 transition-colors p-1">
                      <i className="fas fa-ellipsis-v text-xs"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Toast Demo */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '100ms' }}>
              <h3 className="font-bold text-slate-900 mb-4">Toast Notifications</h3>
              <p className="text-sm text-slate-500 mb-4">Click to trigger real-time toasts</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'success', label: 'Success', color: 'bg-emerald-500 hover:bg-emerald-600' },
                  { type: 'error', label: 'Error', color: 'bg-red-500 hover:bg-red-600' },
                  { type: 'warning', label: 'Warning', color: 'bg-amber-500 hover:bg-amber-600' },
                  { type: 'info', label: 'Info', color: 'bg-blue-500 hover:bg-blue-600' },
                ].map(t => (
                  <button
                    key={t.type}
                    onClick={() => triggerToast(t.type)}
                    className={`${t.color} text-white py-2.5 rounded-xl text-sm font-medium transition-colors`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SMS Simulation */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '200ms' }}>
              <h3 className="font-bold text-slate-900 mb-1">SMS Confirmation</h3>
              <p className="text-sm text-slate-500 mb-4">Send appointment reminders</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Phone Number</label>
                  <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-4 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <i className="fas fa-phone text-sm text-slate-400 mr-2"></i>
                    <input
                      type="text"
                      value={smsForm.phone}
                      onChange={e => setSmsForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-transparent outline-none text-sm text-slate-700 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Message</label>
                  <textarea
                    value={smsForm.message}
                    onChange={e => setSmsForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full bg-slate-50 rounded-xl border border-slate-200 px-4 py-2.5 outline-none text-sm text-slate-700 resize-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button
                  onClick={sendSms}
                  disabled={smsSent}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    smsSent
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {smsSent ? (
                    <><i className="fas fa-check-circle"></i> Sent Successfully</>
                  ) : (
                    <><i className="fas fa-paper-plane"></i> Send SMS</>
                  )}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="animate-fade-in-up bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white" style={{ animationDelay: '300ms' }}>
              <h3 className="font-bold mb-4">Notification Summary</h3>
              <div className="space-y-3">
                {Object.entries(
                  notifications.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc; }, {})
                ).map(([type, count]) => {
                  const cfg = typeConfig[type];
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-blue-200 flex items-center gap-2">
                        <i className={`fas ${cfg.icon} text-xs`}></i>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
