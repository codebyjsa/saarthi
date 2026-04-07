import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/Toast.jsx';

// Simulated ICU patient data
const icuPatients = [
  { id: 1, name: 'Karan Malhotra', bed: 'ICU-01', age: 40, condition: 'Post-Cardiac Surgery', avatar: 'KM' },
  { id: 2, name: 'Devesh Tiwari', bed: 'ICU-02', age: 56, condition: 'Diabetic Ketoacidosis', avatar: 'DT' },
  { id: 3, name: 'Rahul Verma', bed: 'ICU-03', age: 45, condition: 'Severe Trauma', avatar: 'RV' },
  { id: 4, name: 'Aarav Kumar', bed: 'ICU-04', age: 34, condition: 'Respiratory Distress', avatar: 'AK' },
];

function generateVitals(patientId) {
  const abnormal = patientId === 3; // Patient 3 has abnormal vitals
  return {
    heartRate: abnormal ? 115 + Math.floor(Math.random() * 15) : 68 + Math.floor(Math.random() * 12),
    systolic: abnormal ? 155 + Math.floor(Math.random() * 20) : 115 + Math.floor(Math.random() * 15),
    diastolic: abnormal ? 95 + Math.floor(Math.random() * 10) : 72 + Math.floor(Math.random() * 12),
    oxygen: abnormal ? 86 + Math.floor(Math.random() * 5) : 96 + Math.floor(Math.random() * 4),
    temperature: abnormal ? 101.2 + Math.random() * 1.5 : 97.8 + Math.random() * 1.5,
    respRate: abnormal ? 24 + Math.floor(Math.random() * 6) : 14 + Math.floor(Math.random() * 5),
  };
}

function VitalChart({ history, color, height = 60, width = '100%' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length < 2) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    const max = Math.max(...history) * 1.05;
    const min = Math.min(...history) * 0.95;
    const range = max - min || 1;

    ctx.clearRect(0, 0, w, h);

    // Fill
    ctx.beginPath();
    ctx.moveTo(0, h);
    history.forEach((v, i) => {
      const x = (i / (history.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '30');
    grad.addColorStop(1, color + '05');
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    history.forEach((v, i) => {
      const x = (i / (history.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // End dot
    const lastX = w;
    const lastY = h - ((history[history.length - 1] - min) / range) * (h - 4);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [history, color]);

  return <canvas ref={canvasRef} style={{ width, height: `${height}px` }} className="rounded" />;
}

export default function Monitoring() {
  const toast = useToast();
  const [selectedPatient, setSelectedPatient] = useState(icuPatients[0]);
  const [vitalsMap, setVitalsMap] = useState({});
  const [historyMap, setHistoryMap] = useState({});

  // Initialize and update vitals
  useEffect(() => {
    // Init
    const initVitals = {};
    const initHistory = {};
    icuPatients.forEach(p => {
      initVitals[p.id] = generateVitals(p.id);
      initHistory[p.id] = {
        heartRate: Array.from({ length: 20 }, () => generateVitals(p.id).heartRate),
        oxygen: Array.from({ length: 20 }, () => generateVitals(p.id).oxygen),
        systolic: Array.from({ length: 20 }, () => generateVitals(p.id).systolic),
        temperature: Array.from({ length: 20 }, () => generateVitals(p.id).temperature),
      };
    });
    setVitalsMap(initVitals);
    setHistoryMap(initHistory);

    // Update every 2 seconds
    const interval = setInterval(() => {
      setVitalsMap(prev => {
        const next = { ...prev };
        icuPatients.forEach(p => {
          next[p.id] = generateVitals(p.id);
        });
        return next;
      });
      setHistoryMap(prev => {
        const next = { ...prev };
        icuPatients.forEach(p => {
          const v = generateVitals(p.id);
          next[p.id] = {
            heartRate: [...(prev[p.id]?.heartRate || []).slice(-29), v.heartRate],
            oxygen: [...(prev[p.id]?.oxygen || []).slice(-29), v.oxygen],
            systolic: [...(prev[p.id]?.systolic || []).slice(-29), v.systolic],
            temperature: [...(prev[p.id]?.temperature || []).slice(-29), v.temperature],
          };
        });
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Alert for abnormal vitals
  useEffect(() => {
    const alertTimer = setTimeout(() => {
      toast.addToast({ type: 'error', title: '⚠️ Critical Alert — ICU-03', message: 'Rahul Verma: Oxygen saturation dropped to 87%', duration: 6000 });
    }, 5000);
    return () => clearTimeout(alertTimer);
  }, []);

  const vitals = vitalsMap[selectedPatient.id] || generateVitals(selectedPatient.id);
  const history = historyMap[selectedPatient.id] || { heartRate: [], oxygen: [], systolic: [], temperature: [] };

  const isAbnormal = (key, val) => {
    const thresholds = {
      heartRate: [60, 100], oxygen: [95, 100], systolic: [90, 140],
      temperature: [97, 99.5], respRate: [12, 20],
    };
    const [min, max] = thresholds[key] || [0, 999];
    return val < min || val > max;
  };

  const vitalCards = [
    { key: 'heartRate', label: 'Heart Rate', value: vitals.heartRate, unit: 'bpm', icon: 'fa-heartbeat', color: '#ef4444', historyKey: 'heartRate' },
    { key: 'bp', label: 'Blood Pressure', value: `${vitals.systolic}/${vitals.diastolic}`, unit: 'mmHg', icon: 'fa-tachometer-alt', color: '#2563eb', historyKey: 'systolic', checkKey: 'systolic', checkVal: vitals.systolic },
    { key: 'oxygen', label: 'SpO₂', value: vitals.oxygen, unit: '%', icon: 'fa-lungs', color: '#14b8a6', historyKey: 'oxygen' },
    { key: 'temperature', label: 'Temperature', value: vitals.temperature.toFixed(1), unit: '°F', icon: 'fa-thermometer-half', color: '#f59e0b', historyKey: 'temperature' },
    { key: 'respRate', label: 'Resp. Rate', value: vitals.respRate, unit: '/min', icon: 'fa-wind', color: '#8b5cf6', historyKey: null },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="#/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fas fa-hospital text-white text-sm"></i>
            </div>
            <span className="text-lg font-bold tracking-tight">Saar<span className="text-blue-400">thi</span></span>
          </a>
          <span className="text-slate-600 ml-2">|</span>
          <span className="text-sm font-semibold text-slate-400">ICU Monitoring</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            1 Critical Alert
          </span>
          <span className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Live Monitoring
          </span>
        </div>
      </div>

      <main className="p-6 lg:p-8">
        {/* Patient Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
          {icuPatients.map(p => {
            const pVitals = vitalsMap[p.id] || generateVitals(p.id);
            const hasAlert = p.id === 3;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`relative text-left p-4 rounded-2xl border transition-all duration-300 ${
                  selectedPatient.id === p.id
                    ? 'bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/10'
                    : hasAlert
                    ? 'bg-slate-800/50 border-red-500/50 animate-flash-red'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                {hasAlert && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                    <i className="fas fa-exclamation text-[10px] text-white"></i>
                  </span>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    hasAlert ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {p.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.bed}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <i className="fas fa-heartbeat text-red-400"></i> {pVitals.heartRate}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <i className="fas fa-lungs text-teal-400"></i> {pVitals.oxygen}%
                  </span>
                  <span className={`font-medium px-2 py-0.5 rounded-full ${
                    hasAlert ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {hasAlert ? 'Critical' : 'Stable'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 stagger">
          {vitalCards.map((v, i) => {
            const checkKey = v.checkKey || v.key;
            const checkVal = v.checkVal || (typeof v.value === 'number' ? v.value : parseFloat(v.value));
            const abnormal = isAbnormal(checkKey, checkVal);
            return (
              <div key={i} className={`bg-slate-800 rounded-2xl p-5 border transition-all ${
                abnormal ? 'border-red-500/50 animate-flash-red' : 'border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    abnormal ? 'bg-red-500/20' : 'bg-slate-700'
                  }`}>
                    <i className={`fas ${v.icon} text-sm`} style={{ color: abnormal ? '#ef4444' : v.color }}></i>
                  </div>
                  {abnormal && (
                    <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <i className="fas fa-exclamation-triangle text-[10px]"></i>
                      Alert
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-1">{v.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-extrabold tabular-nums ${abnormal ? 'text-red-400' : 'text-white'}`}>
                    {v.value}
                  </span>
                  <span className="text-xs text-slate-500">{v.unit}</span>
                </div>
                {v.historyKey && history[v.historyKey] && history[v.historyKey].length > 1 && (
                  <div className="mt-3">
                    <VitalChart history={history[v.historyKey]} color={abnormal ? '#ef4444' : v.color} height={48} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Patient Info */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 animate-fade-in-up">
            <h3 className="font-bold text-white mb-4">Patient Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Name', value: selectedPatient.name },
                { label: 'Bed', value: selectedPatient.bed },
                { label: 'Age', value: `${selectedPatient.age} yrs` },
                { label: 'Condition', value: selectedPatient.condition },
              ].map((d, i) => (
                <div key={i} className="bg-slate-900/50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">{d.label}</p>
                  <p className="text-sm font-medium text-white">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-bold text-white mb-4">Alert Log</h3>
            <div className="space-y-3">
              {[
                { time: '21:15', msg: 'ICU-03: SpO₂ dropped below 90%', level: 'critical' },
                { time: '20:45', msg: 'ICU-03: Heart rate elevated to 125 bpm', level: 'warning' },
                { time: '19:30', msg: 'ICU-01: Vitals stabilized post-surgery', level: 'info' },
                { time: '18:15', msg: 'ICU-04: Blood pressure within normal range', level: 'info' },
              ].map((alert, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
                  alert.level === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
                  alert.level === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                  'bg-slate-700/50'
                }`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    alert.level === 'critical' ? 'bg-red-500' :
                    alert.level === 'warning' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">{alert.msg}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
