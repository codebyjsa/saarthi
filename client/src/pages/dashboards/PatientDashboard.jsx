import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import axios from 'axios';
import { LogOut, User, Calendar, Activity, ClipboardList, Clock, Bell, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [myAppointment, setMyAppointment] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default doctor for MVP (doctor1 seeded)
  // In a real app, this would be a selection
  const DR_SAMEER_ID = 'doctor1_id_placeholder'; // We'll fetch or use a hardcoded demo ID

  const { queueUpdate } = useSocket(myAppointment?.doctorId?._id || null);

  const fetchStatus = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/queue/my-status`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMyAppointment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user]);

  useEffect(() => {
    if (queueUpdate && myAppointment) {
      // Refresh status if the update affects this doctor's queue
      fetchStatus();
    }
  }, [queueUpdate]);

  const handleBook = async () => {
    try {
      // Find the first available doctor for this demo
      const { data: doctors } = await axios.get(`${API_URL}/doctors`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      if (!doctors || doctors.length === 0) {
        alert('No doctors available at the moment.');
        return;
      }

      const { data } = await axios.post(`${API_URL}/queue/book`, {
        doctorId: doctors[0]._id, // Demo: Auto-pick first doctor
        department: 'General Medicine'
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMyAppointment(data);
      setShowBooking(false);
      fetchStatus();
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Existing) */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">Saarthi</span>
          </div>
          <nav className="space-y-2">
            <NavItem icon={Calendar} label="Appointments" active />
            <NavItem icon={ClipboardList} label="My Records" />
            <NavItem icon={Activity} label="Health Monitoring" />
            <NavItem icon={User} label="My Profile" />
          </nav>
        </div>
        <button onClick={logout} className="flex items-center gap-3 text-slate-500 font-bold hover:text-red-600 transition-colors p-4 rounded-2xl hover:bg-red-50">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Namaste, {user?.name}</h1>
            <p className="text-slate-500 font-medium">Your Health, Guided by Intelligence.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <User className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{user?.name}</p>
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none">{user?.role}</p>
            </div>
          </div>
        </header>

        {/* Live Queue Section */}
        {myAppointment ? (
          <div className="mb-12">
            <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
              <Activity className="text-teal-600 w-5 h-5" />
              Live OPD Status
            </h2>
            <div className="bg-white rounded-[2.5rem] border border-teal-100 shadow-2xl shadow-teal-50 overflow-hidden flex flex-col md:flex-row">
              <div className="bg-teal-600 p-10 text-white flex flex-col justify-center items-center md:w-1/3">
                <span className="text-teal-100 font-bold uppercase tracking-[0.2em] text-xs mb-2">Your Token</span>
                <span className="text-7xl font-black">{myAppointment.tokenNumber}</span>
                <div className="mt-6 bg-teal-500 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Clock size={16} />
                  Status: {myAppointment.status.toUpperCase()}
                </div>
              </div>
              <div className="p-10 flex-1 grid grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Position in Queue</span>
                  <span className="text-4xl font-black text-slate-800">{myAppointment.position}</span>
                  <span className="text-slate-500 text-sm font-medium mt-1">Patients ahead of you</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Estimated Arrival</span>
                  <span className="text-4xl font-black text-teal-600">~{myAppointment.position * 10} min</span>
                  <span className="text-slate-500 text-sm font-medium mt-1">Dynamic Calculation</span>
                </div>
                <div className="col-span-2 bg-slate-50 rounded-2xl p-6 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Bell className="text-teal-600 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{myAppointment.status === 'calling' ? 'Doctor is calling you!' : 'Relax'}</p>
                      <p className="text-xs text-slate-500 font-medium">{myAppointment.status === 'calling' ? 'Please proceed to Room 104' : 'We will notify you when it is your turn'}</p>
                    </div>
                  </div>
                  {myAppointment.status === 'calling' && (
                    <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center animate-bounce">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12 bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center mb-6">
              <Calendar className="text-teal-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">No Active Appointments</h2>
            <p className="text-slate-500 font-medium mb-8 max-w-sm">Need a checkup? Join the live queue now and get a digital token instantly.</p>
            <button 
              onClick={() => setShowBooking(true)}
              className="bg-teal-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all hover:scale-105"
            >
              Book New Appointment
            </button>
          </div>
        )}

        {/* Modal (Simplified for prototype) */}
        {showBooking && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Join live Queue</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">You are booking an appointment with **Dr. Sameer Khan** in General Medicine.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold">
                  <span className="text-slate-400 uppercase text-[10px] tracking-widest">Est. Wait Time</span>
                  <span className="text-teal-600 tracking-tighter">Calculating...</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold">
                  <span className="text-slate-400 uppercase text-[10px] tracking-widest">Consultation Fee</span>
                  <span className="text-slate-800 tracking-tighter">₹500 (Pay @ Clinic)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowBooking(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button onClick={handleBook} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all">Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Other Cards (StatCards existing) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Health Score" value="92 / 100" icon={Activity} color="bg-emerald-600" />
          <StatCard title="Active Prescriptions" value="03" icon={ClipboardList} color="bg-indigo-600" />
          <StatCard title="Insurance Status" value="Active" icon={Bell} color="bg-blue-600" />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
    <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-white/20`}>
      <Icon className="text-white w-6 h-6" />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-xl font-black text-slate-800 tracking-tighter">{value}</p>
    </div>
  </div>
);

export default PatientDashboard;
