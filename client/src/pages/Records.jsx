import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import UploadModal from '../components/UploadModal';
import { LogOut, User, Calendar, Activity, ClipboardList, Plus, Search, FileText, Trash2, Eye, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Records = () => {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/records/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`${API_URL}/records/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchRecords();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredRecords = records.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Same as Dashboard) */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">Saarthi</span>
          </div>
          <nav className="space-y-2">
            <NavItem icon={Calendar} label="Dashboard" onClick={() => window.location.href='/patient'} />
            <NavItem icon={ClipboardList} label="My Records" active />
            <NavItem icon={Activity} label="Monitoring" />
            <NavItem icon={User} label="Profile" />
          </nav>
        </div>
        <button onClick={logout} className="flex items-center gap-3 text-slate-500 font-bold hover:text-red-600 transition-colors p-4 rounded-2xl hover:bg-red-50">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Digital Health Folder</h1>
            <p className="text-slate-500 font-medium">Your centralized vault for all medical documents.</p>
          </div>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-teal-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center gap-3"
          >
            <Plus size={20} />
            Add New Record
          </button>
        </header>

        {/* Search & Filter */}
        <div className="mb-8 relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={20} />
           <input 
            type="text" 
            placeholder="Search records by title, category, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 p-6 pl-16 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-teal-50 focus:border-teal-600 transition-all font-bold text-slate-800"
           />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecords.length > 0 ? filteredRecords.map((record) => (
              <RecordCard key={record._id} record={record} onDelete={() => handleDelete(record._id)} />
            )) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-slate-100">
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No records found matching your search</p>
              </div>
            )}
          </div>
        )}

        <UploadModal 
          isOpen={isUploadOpen} 
          onClose={() => setIsUploadOpen(false)} 
          onUploadSuccess={fetchRecords} 
          patientId={user?._id}
          userToken={user?.token}
        />
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const RecordCard = ({ record, onDelete }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
        record.category === 'Prescription' ? 'bg-blue-50 text-blue-600' :
        record.category === 'Scan' ? 'bg-indigo-50 text-indigo-600' :
        'bg-teal-50 text-teal-600'
      }`}>
        <FileText size={28} />
      </div>
      <div className="flex gap-2">
         {record.isPublic ? (
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter px-3 py-1 bg-emerald-50 rounded-full">Shared</span>
         ) : (
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter px-3 py-1 bg-slate-50 rounded-full text-slate-200">Private</span>
         )}
         <button onClick={onDelete} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
         </button>
      </div>
    </div>
    
    <h4 className="text-xl font-black text-slate-800 mb-2 truncate">{record.title}</h4>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{record.category} | {new Date(record.uploadedAt).toLocaleDateString()}</p>
    
    <a 
      href={record.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full py-4 bg-slate-50 text-slate-800 rounded-2xl flex items-center justify-center gap-3 font-black hover:bg-teal-600 hover:text-white transition-all shadow-sm"
    >
      <Eye size={18} />
      View Document
      <ExternalLink size={14} className="opacity-50" />
    </a>
  </div>
);

export default Records;
