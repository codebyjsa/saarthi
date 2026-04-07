import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { patients, healthRecords } from '../data.js';

export default function HealthRecords() {
  const patient = patients[0];
  const records = healthRecords.filter(r => r.patientId === patient.id);
  const [filterType, setFilterType] = useState('all');

  const filtered = filterType === 'all' ? records : records.filter(r => r.type === filterType);

  const typeConfig = {
    Visit: { icon: 'fa-stethoscope', color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-600', lineColor: 'border-blue-300' },
    Prescription: { icon: 'fa-pills', color: 'bg-emerald-500', lightColor: 'bg-emerald-50 text-emerald-600', lineColor: 'border-emerald-300' },
    Report: { icon: 'fa-file-medical', color: 'bg-amber-500', lightColor: 'bg-amber-50 text-amber-600', lineColor: 'border-amber-300' },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        {/* Patient Profile Header */}
        <div className="animate-fade-in-up bg-white rounded-3xl border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-blue-500/20">
              {patient.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
              <p className="text-slate-500 mt-1">Patient ID: #{String(patient.id).padStart(6, '0')}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {[
                  { label: 'Age', value: `${patient.age} yrs` },
                  { label: 'Gender', value: patient.gender },
                  { label: 'Blood Group', value: patient.bloodGroup },
                  { label: 'Phone', value: patient.phone },
                ].map((d, i) => (
                  <span key={i} className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <span className="text-slate-400">{d.label}:</span> <span className="font-medium">{d.value}</span>
                  </span>
                ))}
              </div>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
              <i className="fas fa-upload"></i>
              Upload Record
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="animate-fade-in-up flex items-center gap-2 mb-6" style={{ animationDelay: '80ms' }}>
          {['all', 'Visit', 'Prescription', 'Report'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {type === 'all' ? 'All Records' : `${type}s`}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-400">{filtered.length} records</span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-200"></div>

          <div className="space-y-4 stagger">
            {filtered.map((record, i) => {
              const cfg = typeConfig[record.type];
              return (
                <div key={record.id} className="relative flex gap-6 group">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-12 h-12 rounded-xl ${cfg.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${cfg.icon} text-white text-sm`}></i>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group-hover:-translate-y-0.5 mb-2">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.lightColor}`}>
                            {record.type}
                          </span>
                          <span className="text-xs text-slate-400">{record.department}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{record.summary}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs font-medium text-slate-500">
                          {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <i className="fas fa-user-md"></i>{record.doctor}
                      </p>
                      <div className="flex items-center gap-2">
                        {record.fileType === 'PDF' && (
                          <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                            <i className="fas fa-file-pdf"></i>
                            View PDF
                          </button>
                        )}
                        <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
