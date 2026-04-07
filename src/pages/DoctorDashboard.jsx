import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { useToast } from '../components/Toast.jsx';
import { patients, queueData, doctors } from '../data.js';

export default function DoctorDashboard() {
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [queue, setQueue] = useState(queueData);
  const currentQueueItem = queue[currentIndex];
  const currentPatient = currentQueueItem ? patients.find(p => p.id === currentQueueItem.patientId) : null;

  const handleNextPatient = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      toast.addToast({ type: 'success', title: 'Next Patient', message: `Now attending ${patients.find(p => p.id === queue[currentIndex + 1].patientId)?.name}` });
    } else {
      toast.addToast({ type: 'info', title: 'Queue Complete', message: 'All patients have been attended' });
    }
  };

  const getPriorityBadge = (priority) => {
    const config = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-green-100 text-green-700',
    };
    return config[priority] || config.low;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 ml-[260px]">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Doctor Dashboard</h1>
            <p className="text-xs text-slate-500">Cardiology · Room 4</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
              <i className="fas fa-users text-blue-500"></i>
              <span className="font-semibold">{queue.length - currentIndex}</span> in queue
            </span>
            <span className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              On Duty
            </span>
          </div>
        </header>

        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Current Patient Card */}
            <div className="lg:col-span-2 space-y-6">
              {currentPatient ? (
                <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                          {currentPatient.avatar}
                        </div>
                        <div>
                          <p className="text-sm text-blue-200 font-medium">Currently Attending</p>
                          <h2 className="text-2xl font-bold">{currentPatient.name}</h2>
                          <p className="text-blue-200 text-sm mt-0.5">{currentPatient.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-200">Token</p>
                        <p className="text-3xl font-extrabold">{currentQueueItem.tokenNo}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: 'Age', value: `${currentPatient.age} yrs`, icon: 'fa-user' },
                        { label: 'Gender', value: currentPatient.gender, icon: 'fa-venus-mars' },
                        { label: 'Blood Group', value: currentPatient.bloodGroup, icon: 'fa-tint' },
                        { label: 'Priority', value: currentPatient.priority.charAt(0).toUpperCase() + currentPatient.priority.slice(1), icon: 'fa-flag' },
                      ].map((d, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                            <i className={`fas ${d.icon}`}></i>{d.label}
                          </p>
                          <p className="text-sm font-semibold text-slate-900">{d.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleNextPatient}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-forward"></i>
                        Next Patient
                      </button>
                      <button className="px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                        <i className="fas fa-file-medical"></i>
                      </button>
                      <button className="px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                        <i className="fas fa-prescription"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check-circle text-emerald-500 text-3xl"></i>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">All Patients Attended!</h2>
                  <p className="text-slate-500">Queue is now empty. Great work today!</p>
                </div>
              )}

              {/* Patient Details Panel */}
              {selectedPatient && (
                <div className="animate-scale-in bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Patient Details</h3>
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                      {selectedPatient.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{selectedPatient.name}</p>
                      <p className="text-sm text-slate-500">{selectedPatient.condition}</p>
                    </div>
                    <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${getPriorityBadge(selectedPatient.priority)}`}>
                      {selectedPatient.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Phone', value: selectedPatient.phone, icon: 'fa-phone' },
                      { label: 'Blood Group', value: selectedPatient.bloodGroup, icon: 'fa-tint' },
                      { label: 'Age / Gender', value: `${selectedPatient.age} / ${selectedPatient.gender}`, icon: 'fa-user' },
                      { label: 'Condition', value: selectedPatient.condition, icon: 'fa-notes-medical' },
                    ].map((d, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                          <i className={`fas ${d.icon}`}></i>{d.label}
                        </p>
                        <p className="text-sm font-medium text-slate-700">{d.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Queue List */}
            <div className="animate-slide-in-right bg-white rounded-2xl border border-slate-200 overflow-hidden h-fit">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Patient Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">{queue.length - currentIndex} patients remaining</p>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {queue.map((q, i) => {
                  const patient = patients.find(p => p.id === q.patientId);
                  if (!patient) return null;
                  const isCurrent = i === currentIndex;
                  const isPast = i < currentIndex;
                  return (
                    <button
                      key={q.tokenNo}
                      onClick={() => !isPast && setSelectedPatient(patient)}
                      className={`w-full flex items-center gap-3 p-4 border-b border-slate-50 transition-all text-left ${
                        isCurrent ? 'bg-blue-50 border-l-4 border-l-blue-500' :
                        isPast ? 'opacity-40' :
                        'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isCurrent ? 'bg-blue-500 text-white' :
                        isPast ? 'bg-slate-100 text-slate-400' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {isPast ? <i className="fas fa-check text-xs"></i> : patient.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isCurrent ? 'text-blue-900' : 'text-slate-900'}`}>{patient.name}</p>
                        <p className="text-xs text-slate-400">{patient.condition}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-500'}`}>{q.tokenNo}</p>
                        {!isPast && <p className="text-[10px] text-slate-400">{q.estimatedTime}</p>}
                        {isCurrent && (
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Now</span>
                        )}
                      </div>
                    </button>
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
