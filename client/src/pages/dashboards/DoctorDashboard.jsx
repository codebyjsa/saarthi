import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import axios from 'axios';
import QrScanner from '../../components/QrScanner';
import AiAssistant from '../../components/AiAssistant';
import { LogOut, User, Calendar, Activity, ClipboardList, Stethoscope, ChevronRight, Play, CheckCircle, SkipForward, Users, QrCode, XSquare, AlertCircle, Sparkles, SidebarOpen, ExternalLink, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePatient, setActivePatient] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [prescription, setPrescription] = useState('');
  const [liveVitals, setLiveVitals] = useState({
    heartRate: 72,
    spo2: 98,
    bp_sys: 120,
    bp_dia: 80,
    temp: 98.6,
    isCritical: false
  });

  const { socket, emitEvent, queueUpdate } = useSocket(user?._id);

  useEffect(() => {
    if (!socket) return;

    socket.on('vitals-feed', (data) => {
      const { vitals } = data;
      const isCritical = 
        vitals.heartRate > 120 || 
        vitals.heartRate < 50 || 
        vitals.spo2 < 92 || 
        vitals.bp_sys > 180 || 
        vitals.isCritical;

      setLiveVitals({ ...vitals, isCritical });
    });

    return () => socket.off('vitals-feed');
  }, [socket]);

  const handleScanSuccess = async (decodedText) => {
    try {
      setScanMessage({ type: 'loading', text: 'Verifying Token...' });
      const { data } = await axios.patch(`${API_URL}/queue/present/${decodedText}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setScanMessage({ type: 'success', text: `Verified: ${data.patientId.name}` });
      setTimeout(() => {
        setShowScanner(false);
        setScanMessage(null);
        fetchQueue();
      }, 1500);
    } catch (err) {
      setScanMessage({ type: 'error', text: 'Invalid or Expired QR' });
      setTimeout(() => setScanMessage(null), 3000);
    }
  };

  const fetchQueue = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/queue/status/${user?._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setQueue(data);
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

  const fetchPatientHistory = async (patientId) => {
    try {
      const { data } = await axios.get(`${API_URL}/records/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPatientRecords(data);
      setShowHistory(true);
    } catch (err) {
      alert('Error fetching patient history');
    }
  };

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
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between shadow-sm shrink-0">
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

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">OPD Console</h1>
            <p className="text-slate-500 font-medium tracking-wide">Doctor: **{user?.name}** | Room 104</p>
          </div>
          <div className="flex items-center gap-6">
            {activePatient && (
              <button 
                onClick={() => setShowAi(!showAi)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${showAi ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
              >
                <Sparkles size={20} className={showAi ? 'animate-pulse' : ''} />
                {showAi ? 'Close AI Assistant' : 'Open AI Co-pilot'}
              </button>
            )}
            <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="text-blue-600" />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{user?.role}</p>
               </div>
            </div>
          </div>
        </header>

        <div className="flex gap-12">
          <div className={`flex-1 transition-all duration-500 space-y-12 ${showAi ? 'max-w-[calc(100%-420px)]' : 'w-full'}`}>
            {liveVitals.isCritical && (
              <div className="bg-red-600 rounded-3xl p-6 mb-8 flex items-center justify-between shadow-2xl shadow-red-200 animate-pulse border-4 border-white/20">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <AlertCircle className="text-white w-10 h-10" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Emergency: Critical Vitals Detected</h3>
                      <p className="text-white/80 font-bold">Imminent risk — stabilize patient immediately and notify emergency team.</p>
                   </div>
                </div>
                <button onClick={() => setLiveVitals({ ...liveVitals, isCritical: false })} className="bg-white text-red-600 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-slate-100 transition-all">Dismiss Alert</button>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] p-10 border border-blue-100 shadow-2xl shadow-blue-50 relative overflow-hidden">
               {liveVitals.isCritical && <div className="absolute inset-0 bg-red-600/5 animate-pulse"></div>}
               <div className="flex justify-between items-center mb-10 relative z-10">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <Activity className="text-blue-600" />
                  Currently Serving
                </h3>
                {activePatient && (
                  <div className="flex gap-4">
                    <button onClick={() => emitEvent('trigger-emergency', { doctorId: user._id, patientId: activePatient.patientId._id })} className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">Simulate Emergency</button>
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">Token #{activePatient.tokenNumber}</div>
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
                        <button onClick={() => handleStartVisit(activePatient._id)} className="bg-blue-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 flex items-center gap-3"><Play size={20} fill="currentColor" />Start Visit</button>
                      ) : (
                        <>
                          <button onClick={() => handleCompleteVisit(activePatient._id)} className="bg-emerald-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 flex items-center gap-3"><CheckCircle size={20} />Complete visit</button>
                          <button onClick={() => fetchPatientHistory(activePatient.patientId._id)} className="bg-blue-50 text-blue-600 font-black py-4 px-8 rounded-2xl hover:bg-blue-100 flex items-center gap-3 transition-all"><ClipboardList size={20} />View Records</button>
                        </>
                      )}
                      <button onClick={() => handleSkipPatient(activePatient._id)} className="bg-slate-100 text-slate-600 font-black py-4 px-8 rounded-2xl hover:bg-slate-200 flex items-center gap-3"><SkipForward size={20} />Skip</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[240px] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6"><Calendar className="text-slate-300 w-10 h-10" /></div>
                  <p className="text-slate-400 font-bold mb-6">No patient is currently in the room.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setShowScanner(true)} className="bg-slate-900 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 flex items-center gap-3 transition-all transform hover:scale-105"><QrCode size={20} />Scan QR</button>
                    <button onClick={handleCallNext} disabled={waitingPatients.filter(p => p.isPresent).length === 0} className="bg-blue-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all flex items-center gap-2">Call Next Patient</button>
                  </div>
                  {waitingPatients.filter(p => p.isPresent).length === 0 && waitingPatients.length > 0 && <p className="mt-4 text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">* All waiting patients are currently marked "NOT PRESENT"</p>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               <VitalCard label="Heart Rate" value={liveVitals.heartRate} unit="BPM" color={liveVitals.heartRate > 120 || liveVitals.heartRate < 50 ? "bg-red-600 text-white border-red-400" : "bg-white text-slate-800 border-slate-100"} isCritical={liveVitals.heartRate > 120 || liveVitals.heartRate < 50} />
               <VitalCard label="SpO2" value={liveVitals.spo2} unit="%" color={liveVitals.spo2 < 92 ? "bg-red-600 text-white border-red-400" : "bg-white text-slate-800 border-slate-100"} isCritical={liveVitals.spo2 < 92} />
               <VitalCard label="BP Sys" value={liveVitals.bp_sys} unit="mmHg" color={liveVitals.bp_sys > 180 ? "bg-red-600 text-white border-red-400" : "bg-white text-slate-800 border-slate-100"} isCritical={liveVitals.bp_sys > 180} />
               <VitalCard label="Temp" value={liveVitals.temp} unit="°F" color={liveVitals.temp > 101 ? "bg-red-600 text-white border-red-400" : "bg-white text-slate-800 border-slate-100"} isCritical={liveVitals.temp > 101} />
            </div>

            {activePatient && activePatient.status === 'in-progress' && (
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl animate-in fade-in slide-in-from-bottom duration-500">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><ClipboardList size={24} /></div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Digital Prescription</h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></div>Drafting Mode</div>
                 </div>
                 <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Enter medicines, dosages, and diagnostic advice here..." className="w-full h-64 bg-slate-50 border border-slate-100 rounded-3xl p-8 font-bold text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 transition-all resize-none mb-8" />
                 <div className="flex justify-end gap-4 border-t border-slate-50 pt-8">
                    <button onClick={() => setPrescription('')} className="px-8 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl hover:bg-slate-100 transition-all">Clear Draft</button>
                    <button onClick={() => handleCompleteVisit(activePatient._id)} className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-3"><CheckCircle size={20} />Complete & Save Visit</button>
                 </div>
              </div>
            )}
          </div>

          {showAi && activePatient && (
            <div className="w-[400px] shrink-0 animate-in slide-in-from-right duration-500">
               <AiAssistant patientHistory={patientRecords} currentVitals={liveVitals} userToken={user.token} onApplySuggestion={(text) => setPrescription(prev => prev + '\n' + text)} />
            </div>
          )}
        </div>

        {!showAi && (
          <div className="mt-12">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Queue List</h3>
                <p className="text-xl font-black text-slate-800">{waitingPatients.length} Waiting</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]">
                {waitingPatients.length > 0 ? waitingPatients.map((p) => (
                  <div key={p._id} className={`p-5 bg-white border rounded-3xl transition-all group shadow-sm ${p.isPresent ? 'border-emerald-100 hover:border-emerald-200' : 'border-slate-100 opacity-60'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg">#Token {p.tokenNumber}</span>
                        {!p.isPresent && <span className="text-[10px] font-black text-red-600 uppercase tracking-widest px-2 py-1 bg-red-50 rounded-lg flex items-center gap-1"><XSquare size={10} />NOT PRESENT</span>}
                        {p.isPresent && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-1 bg-emerald-50 rounded-lg flex items-center gap-1"><CheckCircle size={10} />PRESENT</span>}
                      </div>
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
        )}
      </main>

      {showScanner && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowScanner(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"><XSquare size={32} /></button>
            <div className="text-center mb-8"><h3 className="text-2xl font-black text-slate-800 mb-2">Check-in Scanner</h3><p className="text-slate-500 font-medium">Scan the patient's digital token QR code</p></div>
            <div className="relative">
              <QrScanner onResult={handleScanSuccess} />
              {scanMessage && <div className={`absolute inset-x-0 bottom-8 mx-8 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs border shadow-2xl ${scanMessage.type === 'loading' ? 'bg-white text-slate-800 border-slate-200' : scanMessage.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-red-600 text-white border-red-500'}`}>{scanMessage.text}</div>}
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
           <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-4xl shadow-2xl relative max-h-[90vh] flex flex-col">
              <button onClick={() => setShowHistory(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><XSquare size={32} /></button>
              <div className="mb-10"><h3 className="text-2xl font-black text-slate-800 mb-2">Medical History</h3><p className="text-slate-500 font-medium">Patient: **{activePatient?.patientId.name}**</p></div>
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 pr-4">
                 {patientRecords.length > 0 ? patientRecords.map(record => (
                   <div key={record._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-blue-50 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><FileText size={24} /></div>
                         <div><p className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{record.title}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.category}</p></div>
                      </div>
                      <a href={record.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-blue-600 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"><ExternalLink size={18} /></a>
                   </div>
                 )) : <div className="col-span-full py-20 text-center flex flex-col items-center"><FileText className="text-slate-200 w-16 h-16 mb-4" /><p className="text-slate-400 font-black uppercase tracking-widest text-xs">No public records available for this patient</p></div>}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const VitalCard = ({ label, value, unit, color, isCritical }) => (
  <div className={`p-6 rounded-3xl ${color} shadow-sm flex flex-col items-center justify-center border font-bold h-full transition-all duration-500 scale-100 ${isCritical ? 'animate-bounce' : ''}`}>
    <span className={`text-[10px] uppercase tracking-widest mb-1 opacity-70 ${isCritical ? 'text-white' : 'text-slate-400'}`}>{label}</span>
    <span className="text-2xl font-black">{value}</span>
    <span className={`text-[10px] uppercase tracking-tighter opacity-70 ${isCritical ? 'text-white' : 'text-slate-400'}`}>{unit}</span>
  </div>
);

export default DoctorDashboard;
