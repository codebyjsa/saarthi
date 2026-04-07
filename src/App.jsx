import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import HealthRecords from './pages/HealthRecords.jsx';
import Monitoring from './pages/Monitoring.jsx';
import Notifications from './pages/Notifications.jsx';
import { ToastProvider } from './components/Toast.jsx';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/records" element={<HealthRecords />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </ToastProvider>
  );
}
