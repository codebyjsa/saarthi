import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const features = [
  { icon: 'fa-clock', title: 'Real-time Queue Tracking', desc: 'Live token updates, ETA countdown, and smart queue prioritization for minimal wait times.', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
  { icon: 'fa-calendar-alt', title: 'Smart Scheduling', desc: 'AI-powered appointment scheduling with conflict detection and resource optimization.', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
  { icon: 'fa-file-medical-alt', title: 'Digital Health Records', desc: 'Secure, timeline-based medical records with instant access to prescriptions and reports.', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50' },
  { icon: 'fa-heartbeat', title: 'Live Monitoring', desc: 'ICU-grade real-time vitals monitoring with intelligent alerts and trend analysis.', color: 'from-red-400 to-rose-500', bg: 'bg-red-50' },
];

const stats = [
  { value: '50K+', label: 'Patients Served', icon: 'fa-users' },
  { value: '99.9%', label: 'Uptime', icon: 'fa-server' },
  { value: '200+', label: 'Hospitals', icon: 'fa-hospital' },
  { value: '< 8min', label: 'Avg Wait Time', icon: 'fa-clock' },
];

const workflowSteps = [
  { step: '01', title: 'Patient Check-in', desc: 'Digital registration with QR code and smart queue assignment', icon: 'fa-qrcode', color: 'bg-blue-500' },
  { step: '02', title: 'Queue Management', desc: 'Real-time priority-based queue with live ETA tracking', icon: 'fa-list-ol', color: 'bg-amber-500' },
  { step: '03', title: 'Consultation', desc: 'Doctor access to complete patient history and digital prescriptions', icon: 'fa-stethoscope', color: 'bg-emerald-500' },
  { step: '04', title: 'Smart Follow-up', desc: 'Automated reminders, record updates, and health trend monitoring', icon: 'fa-chart-line', color: 'bg-purple-500' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-100 to-blue-50 rounded-full opacity-60 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-28">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-blue-100">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Live System — Real-time Connected
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
                Smart Hospital
                <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>
              <p className="text-xl text-slate-500 max-w-xl mb-10 leading-relaxed">
                Real-time queue tracking, digital health records, and intelligent monitoring — all in one platform designed for modern healthcare.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/patient" className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300">
                  <i className="fas fa-calendar-check"></i>
                  Book Appointment
                  <i className="fas fa-arrow-right text-sm opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"></i>
                </Link>
                <Link to="/doctor" className="group flex items-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-2xl font-semibold text-base border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <i className="fas fa-user-md"></i>
                  Doctor Login
                </Link>
              </div>
            </div>

            {/* Right - Floating Cards */}
            <div className="flex-1 relative w-full max-w-lg" style={{ animationDelay: '300ms' }}>
              <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <i className="fas fa-hospital text-white"></i>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Saarthi Dashboard</p>
                        <p className="text-xs text-slate-400">Live Overview</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Queue', value: '23', icon: 'fa-users', color: 'text-amber-600 bg-amber-50' },
                      { label: 'Active', value: '12', icon: 'fa-user-md', color: 'text-blue-600 bg-blue-50' },
                      { label: 'Critical', value: '2', icon: 'fa-heartbeat', color: 'text-red-600 bg-red-50' },
                    ].map((s, i) => (
                      <div key={i} className="bg-slate-50 rounded-2xl p-3 text-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${s.color}`}>
                          <i className={`fas ${s.icon} text-xs`}></i>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{s.value}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Mini chart mockup */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-600">Patient Flow Today</p>
                      <span className="text-xs text-emerald-600 font-medium">+12.5%</span>
                    </div>
                    <svg viewBox="0 0 300 60" className="w-full h-12">
                      <defs>
                        <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,45 Q30,40 60,35 T120,20 T180,25 T240,10 T300,15 L300,60 L0,60 Z" fill="url(#heroGrad)" />
                      <path d="M0,45 Q30,40 60,35 T120,20 T180,25 T240,10 T300,15" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="300" cy="15" r="4" fill="#2563eb" />
                      <circle cx="300" cy="15" r="8" fill="#2563eb" opacity="0.2" className="animate-pulse" />
                    </svg>
                  </div>
                </div>

                {/* Floating mini cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 animate-float z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-check-circle text-emerald-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Appointment</p>
                      <p className="text-[10px] text-emerald-500 font-medium">Confirmed</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 animate-float z-20" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center animate-heartbeat">
                      <i className="fas fa-heartbeat text-red-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Heart Rate</p>
                      <p className="text-[10px] text-slate-500">72 bpm <span className="text-emerald-500">Normal</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <i className={`fas ${s.icon} text-blue-400`}></i>
                </div>
                <p className="text-3xl font-extrabold text-white mb-1">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Features</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 mb-4">Everything Your Hospital Needs</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A complete digital ecosystem designed to streamline hospital operations and improve patient care
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {features.map((f, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`fas ${f.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">How It Works</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 mb-4">Seamless Hospital Workflow</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              From check-in to follow-up, every step is digitized and connected
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 stagger">
            {workflowSteps.map((s, i) => (
              <div key={i} className="relative group">
                {i < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-40px)] h-0.5">
                    <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100"></div>
                  </div>
                )}
                <div className="text-center">
                  <div className={`w-20 h-20 ${s.color} rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <i className={`fas ${s.icon} text-white text-2xl`}></i>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {s.step}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Transform Your Hospital?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 200+ hospitals already using Saarthi to deliver world-class patient care.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link to="/admin" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-base hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
              Get Started Free
            </Link>
            <a href="#" className="text-white/90 font-medium flex items-center gap-2 hover:text-white transition-colors">
              <i className="fas fa-play-circle text-xl"></i>
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <i className="fas fa-hospital text-white text-xs"></i>
                </div>
                <span className="text-base font-bold text-white">Saarthi</span>
              </div>
              <p className="text-sm leading-relaxed">Smart Hospital Management System for modern healthcare delivery.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Updates'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
              { title: 'Support', links: ['Documentation', 'API Status', 'Contact', 'Help Center'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 Saarthi. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {['fa-twitter', 'fa-linkedin', 'fa-github'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all">
                  <i className={`fab ${icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
