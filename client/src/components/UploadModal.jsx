import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'saarthi_preset';

const UploadModal = ({ isOpen, onClose, onUploadSuccess, patientId, userToken }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Report');
  const [isPublic, setIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    
    setUploading(true);
    setError('');

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const cloudResponse = await axios.post(CLOUDINARY_URL, formData);
      const fileUrl = cloudResponse.data.secure_url;
      const fileType = cloudResponse.data.resource_type;

      // 2. Save metadata to our server
      await axios.post(`${API_URL}/records/upload`, {
        patientId,
        title,
        url: fileUrl,
        type: fileType,
        category,
        isPublic
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Upload failed. Check your Cloudinary config.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
          <X size={24} />
        </button>

        <h3 className="text-2xl font-black text-slate-800 mb-2">Upload Health Record</h3>
        <p className="text-slate-500 font-medium mb-8">Securely add prescriptions, scans, or reports to your digital folder.</p>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Record Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blood Test Report - Jan 2024"
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-teal-50 focus:border-teal-600 transition-all font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-teal-50 focus:border-teal-600 transition-all font-bold text-slate-800 appearance-none"
                >
                  <option>Report</option>
                  <option>Prescription</option>
                  <option>Scan</option>
                  <option>Lab Result</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Visibility</label>
                <div className="flex bg-slate-50 p-2 rounded-2xl gap-2">
                   <button 
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${isPublic ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400'}`}
                   >Public</button>
                   <button 
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${!isPublic ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400'}`}
                   >Private</button>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">File attachment</label>
            <div className="relative group border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-teal-400 transition-all text-center">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-all">
                    <Upload size={24} />
                 </div>
                 <p className="text-sm font-bold text-slate-800">{file ? file.name : 'Select or drop file here'}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Images or PDFs up to 10MB</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={uploading}
            className="w-full bg-teal-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            {uploading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <CheckCircle size={20} />
                Save Record
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
