import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { Sparkline } from '../components/Charts.jsx';
import { useToast } from '../components/Toast.jsx';
import { patients, queueData, appointments, doctors, healthRecords } from '../data.js';

export default function PatientDashboard() {
  const toast = useToast();
  const patient = patients[0]; // Current logged-in patient
  const myToken = queueData[1]; // Patient is at position 2
  const [eta, setEta] = useState(720); // 12 minutes in seconds
  const [patientsAhead, setPatientsAhead] = useState(1);

  // Live ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => {
        if (prev <= 0) {
          toast.addToast({ type: 'success', title: 'Your Turn!', message: 'Please proceed to Room 4' });
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate queue updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setPatientsAhead(0);
      toast.addToast({ type: 'info', title: 'Queue Update', message: 'The patient before you is almost done!' });
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const myAppointment = appointments.find(a => a.patientId === patient.id);
  const myDoctor = doctors.find(d => d.id === myAppointment?.doctorId);
  const myRecords = healthRecords.filter(r => r.patientId === patient.id).slice(0, 3);
  const queueProgress = ((queueData.length - (myToken.position - 1)) / queueData.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-slate-900">
            Good Evening, <span className="text-blue-600">{patient.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's your queue status and health overview</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Token & Queue */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Card */}
            <div className="animate-fade-in-up bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-30 blur-3xl -translate-y-1/3 translate-x-1/3"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Your Token Number</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-extrabold tracking-tight">{myToken.tokenNo}</span>
                      <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                        Position #{myToken.position}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-200 text-sm font-medium">Estimated Wait</p>
                    <p className="text-3xl font-extrabold tabular-nums">{formatTime(eta)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <i className="fas fa-users text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">Ahead of you</p>
                      <p className="text-lg font-bold">{patientsAhead} patient{patientsAhead !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <i className="fas fa-door-open text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">Room</p>
                      <p className="text-lg font-bold">Room 4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <i className="fas fa-user-md text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">Doctor</p>
                      <p className="text-lg font-bold">Dr. Sharma</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Queue Progress */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900">Queue Progress</h2>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  {queueData.slice(0, 5).map((q, i) => (
                    <div key={i} className={`flex flex-col items-center ${q.position <= myToken.position ? '' : 'opacity-40'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        q.status === 'current' ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500' :
                        q.position === myToken.position ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' :
                        q.position < myToken.position ? 'bg-emerald-50 text-emerald-600' :
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {q.position <= myToken.position && q.status === 'current' ? (
                          <i className="fas fa-check text-xs"></i>
                        ) : q.position === myToken.position ? (
                          'You'
                        ) : (
                          q.tokenNo.replace('T-00', '')
                        )}
                      </div>
                      <span className="text-[10px] mt-1 text-slate-500 font-medium">{q.tokenNo}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center opacity-30">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm text-slate-400">
                      +{queueData.length - 5}
                    </div>
                    <span className="text-[10px] mt-1 text-slate-400">more</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000"
                    style={{ width: `${queueProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Health Records Preview */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">Recent Health Records</h2>
                <Link to="/records" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  View All <i className="fas fa-arrow-right text-xs"></i>
                </Link>
              </div>
              <div className="space-y-3">
                {myRecords.map((r, i) => {
                  const typeConfig = {
                    Visit: { icon: 'fa-stethoscope', color: 'text-blue-500 bg-blue-50' },
                    Prescription: { icon: 'fa-pills', color: 'text-emerald-500 bg-emerald-50' },
                    Report: { icon: 'fa-file-medical', color: 'text-amber-500 bg-amber-50' },
                  };
                  const cfg = typeConfig[r.type];
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                        <i className={`fas ${cfg.icon} text-sm`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{r.summary}</p>
                        <p className="text-xs text-slate-400">{r.doctor} · {r.department}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-500">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{r.type}</span>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-slate-300 group-hover:text-blue-500 transition-colors"></i>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Next Appointment */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '100ms' }}>
              <h2 className="font-bold text-slate-900 mb-4">Upcoming Appointment</h2>
              {myAppointment && myDoctor ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                      {myDoctor.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{myDoctor.name}</p>
                      <p className="text-xs text-slate-500">{myDoctor.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-2"><i className="fas fa-calendar text-slate-400"></i>Date</span>
                      <span className="text-sm font-medium text-slate-900">{new Date(myAppointment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-2"><i className="fas fa-clock text-slate-400"></i>Time</span>
                      <span className="text-sm font-medium text-slate-900">{myAppointment.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-2"><i className="fas fa-tag text-slate-400"></i>Type</span>
                      <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">{myAppointment.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-2"><i className="fas fa-info-circle text-slate-400"></i>Status</span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${myAppointment.status === 'confirmed' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
                        {myAppointment.status.charAt(0).toUpperCase() + myAppointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <i className="fas fa-calendar-xmark text-3xl mb-3"></i>
                  <p className="text-sm">No upcoming appointments</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '200ms' }}>
              <h2 className="font-bold text-slate-900 mb-4">Health Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: 'fa-heartbeat', color: 'text-red-500 bg-red-50', sparkData: [68, 72, 70, 74, 72, 71, 73, 72], sparkColor: '#ef4444' },
                  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'fa-tachometer-alt', color: 'text-blue-500 bg-blue-50', sparkData: [115, 120, 118, 122, 120, 119, 121, 120], sparkColor: '#2563eb' },
                  { label: 'Oxygen', value: '98', unit: '%', icon: 'fa-lungs', color: 'text-teal-500 bg-teal-50', sparkData: [97, 98, 98, 97, 98, 99, 98, 98], sparkColor: '#14b8a6' },
                  { label: 'Temperature', value: '98.6', unit: '°F', icon: 'fa-thermometer-half', color: 'text-amber-500 bg-amber-50', sparkData: [98.4, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6, 98.6], sparkColor: '#f59e0b' },
                ].map((v, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${v.color}`}>
                      <i className={`fas ${v.icon} text-xs`}></i>
                    </div>
                    <p className="text-xs text-slate-500">{v.label}</p>
                    <p className="text-lg font-bold text-slate-900">{v.value} <span className="text-xs font-normal text-slate-400">{v.unit}</span></p>
                    <div className="mt-1">
                      <Sparkline data={v.sparkData} color={v.sparkColor} width={100} height={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-6" style={{ animationDelay: '300ms' }}>
              <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { icon: 'fa-calendar-plus', label: 'Book Appointment', color: 'text-blue-500' },
                  { icon: 'fa-file-download', label: 'Download Records', color: 'text-emerald-500' },
                  { icon: 'fa-video', label: 'Video Consultation', color: 'text-purple-500' },
                  { icon: 'fa-pills', label: 'Prescription Refill', color: 'text-amber-500' },
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                    <div className={`w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center ${action.color} group-hover:bg-white transition-colors`}>
                      <i className={`fas ${action.icon} text-sm`}></i>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{action.label}</span>
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
