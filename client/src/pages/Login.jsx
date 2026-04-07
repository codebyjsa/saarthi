import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Activity, ShieldCheck, Stethoscope } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      const from = location.state?.from?.pathname || `/${result.role || 'patient'}`;
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  const roles = [
    { id: 'patient', name: 'Patient', icon: Activity, color: 'bg-emerald-100 text-emerald-600', hover: 'hover:bg-emerald-50' },
    { id: 'doctor', name: 'Doctor', icon: Stethoscope, color: 'bg-blue-100 text-blue-600', hover: 'hover:bg-blue-50' },
    { id: 'admin', name: 'Admin', icon: ShieldCheck, color: 'bg-indigo-100 text-indigo-600', hover: 'hover:bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row border border-slate-100">
        
        {/* Left Side - Visuals */}
        <div className="md:w-1/2 bg-teal-600 p-12 flex flex-col justify-between text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Saarthi Portal</h1>
            <p className="text-teal-50 text-lg font-medium leading-relaxed opacity-90">
              Access your digital healthcare ecosystem. Manage appointments, records, and real-time monitoring.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-200 mb-4 text-center">Fast Login for Demo</p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => { setUsername(`${role.id}1`); setPassword('pass123'); }}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all ${role.color} ${role.hover} backdrop-blur-sm shadow-sm`}
                >
                  <role.icon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{role.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-teal-600 text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all placeholder:text-slate-400 font-medium"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-teal-600 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all placeholder:text-slate-400 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 animate-shake">
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-700 hover:shadow-teal-200 active:transform active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            Forgot password? <a href="#" className="text-teal-600 font-bold hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
