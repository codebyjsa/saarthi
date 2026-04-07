import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import axios from 'axios';
import { LogOut, User, Calendar, Activity, ClipboardList, Stethoscope, ChevronRight, Play, CheckCircle, SkipForward, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePatient, setActivePatient] = useState(null);

  const { emitEvent, queueUpdate } = useSocket(user?._id);

  const fetchQueue = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/queue/status/${user?._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setQueue(data);
      
      // Sync active patient status
      const currentlyCalling = data.find(p => p.status === 'calling' || p.status === 'in-progress');
      setActivePatient(currentlyCalling || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchQueue();
  }, [user]);

  useEffect(() => {
    if (queueUpdate) {
      fetchQueue();
    }
  }, [queueUpdate]);

  const handleCallNext = () => {
    emitEvent('call-next', { doctorId: user._id });
  };

  const handleStartVisit = (appointmentId) => {
    emitEvent('start-visit', { appointmentId, doctorId: user._id });
  };

  const handleCompleteVisit = (appointmentId) => {
    emitEvent('complete-visit', { appointmentId, doctorId: user._id });
    setActivePatient(null);
  };

  const handleSkipPatient = (appointmentId) => {
    emitEvent('skip-patient', { appointmentId, doctorId: user._id });
    setActivePatient(null);
  };

  if (loading) return <div>Loading...</div>;

  const waitingPatients = queue.filter(p => p.status === 'waiting');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Existing) */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">Saarthi</span>
          </div>
          <nav className="space-y-2">
            <NavItem icon={Calendar} label="OPD Queue" active />
            <NavItem icon={Users} label="Patient Manager" />
            <NavItem icon={ClipboardList} label="Diagnosis Tool" />
            <NavItem icon={Activity} label="Live Vitals" />
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
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">OPD Console</h1>
            <p className="text-slate-500 font-medium tracking-wide">Doctor: **{user?.name}** | Room 104</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
               <Stethoscope className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{user?.name}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active Call Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-blue-100 shadow-2xl shadow-blue-50">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <Activity className="text-blue-600" />
                  Currently Serving
                </h3>
                {activePatient && (
                  <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                    Token #{activePatient.tokenNumber}
                  </div>
                )}
              </div>

              {activePatient ? (
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-40 h-40 bg-slate-50 rounded-full border-4 border-blue-100 flex items-center justify-center relative overflow-hidden">
                    <User className="w-20 h-20 text-slate-300" />
                    <div className="absolute bottom-0 inset-x-0 h-1/3 bg-blue-600/10 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-4xl font-black text-slate-800 mb-2">{activePatient.patientId.name}</h4>
                    <p className="text-slate-500 font-bold tracking-wide uppercase text-xs mb-8">Patient ID: PAT-12948-X</p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      {activePatient.status === 'calling' ? (
                        <button 
                          onClick={() => handleStartVisit(activePatient._id)}
                          className="bg-blue-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 flex items-center gap-3"
                        >
                          <Play size={20} fill="currentColor" />
                          Start Visit
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleCompleteVisit(activePatient._id)}
                          className="bg-emerald-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 flex items-center gap-3"
                        >
                          <CheckCircle size={20} />
                          Complete visit
                        </button>
                      )}
                      <button 
                        onClick={() => handleSkipPatient(activePatient._id)}
                        className="bg-slate-100 text-slate-600 font-black py-4 px-8 rounded-2xl hover:bg-slate-200 flex items-center gap-3"
                      >
                        <SkipForward size={20} />
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[240px] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                    <Calendar className="text-slate-300 w-10 h-10" />
                  </div>
                  <p className="text-slate-400 font-bold mb-6">No patient is currently in the room.</p>
                  <button 
                    onClick={handleCallNext}
                    disabled={waitingPatients.length === 0}
                    className="bg-blue-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
                  >
                    Call Next Patient
                  </button>
                </div>
              )}
            </div>

            {/* Vitals Feed (Placeholder) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               <VitalCard label="Heart Rate" value="72" unit="BPM" color="bg-red-50 text-red-600" />
               <VitalCard label="SpO2" value="98" unit="%" color="bg-blue-50 text-blue-600" />
               <VitalCard label="Blood Pressure" value="120/80" unit="mmHg" color="bg-emerald-50 text-emerald-600" />
               <VitalCard label="Temp" value="98.6" unit="°F" color="bg-amber-50 text-amber-600" />
            </div>
          </div>

          {/* Queue List Side Panel */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Queue List</h3>
              <p className="text-xl font-black text-slate-800">{waitingPatients.length} Waiting</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]">
              {waitingPatients.length > 0 ? waitingPatients.map((p, idx) => (
                <div key={p._id} className="p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all group shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg">#Token {p.tokenNumber}</span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(p.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <p className="font-black text-slate-800 truncate pr-4">{p.patientId.name}</p>
                     <ChevronRight className="text-slate-200 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" size={18} />
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                   <Users className="text-slate-100 w-20 h-20 mb-4" />
                   <p className="text-slate-400 font-bold text-sm">Every patient is saw. Good work!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const VitalCard = ({ label, value, unit, color }) => (
  <div className={`p-6 rounded-3xl ${color} shadow-sm flex flex-col items-center justify-center border font-bold h-full`}>
    <span className="text-[10px] uppercase tracking-widest mb-1 opacity-70">{label}</span>
    <span className="text-2xl font-black">{value}</span>
    <span className="text-[10px] uppercase tracking-tighter opacity-70">{unit}</span>
  </div>
);

export default DoctorDashboard;
