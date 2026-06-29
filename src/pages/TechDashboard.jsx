import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Wrench, CheckCircle, Clock, AlertTriangle, FileText, X } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

const TechDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [recordData, setRecordData] = useState({
        repairsDone: '',
        partsReplaced: '',
        maintenanceNotes: ''
    });

    const fetchAssigned = async () => {
        try {
            const { data } = await api.get('/appointments');
            setAppointments(data);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssigned();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            toast.success(`Status updated to ${status}`);
            fetchAssigned();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleCompleteService = (apt) => {
        setSelectedApt(apt);
        setShowRecordModal(true);
    };

    const handleSubmitRecord = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services', {
                appointmentId: selectedApt._id,
                ...recordData
            });
            toast.success('Service record saved and completed!');
            setShowRecordModal(false);
            setRecordData({ repairsDone: '', partsReplaced: '', maintenanceNotes: '' });
            fetchAssigned();
        } catch (error) {
            toast.error('Failed to save record');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-extrabold text-gray-900">Task Center</h1>
                <p className="text-gray-500 mt-2">Manage your assigned service requests and update progress.</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <div key={apt._id} className="glass rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between border-none shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center space-x-6 mb-4 md:mb-0">
                                <div className={`p-5 rounded-2xl ${
                                    apt.status === 'Completed' ? 'bg-green-50 text-green-600' : 
                                    apt.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                                }`}>
                                    <Wrench size={32} />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3 mb-1">
                                        <h3 className="text-xl font-bold text-gray-800">{apt.vehicle?.model}</h3>
                                        <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-widest">{apt.vehicle?.number}</span>
                                    </div>
                                    <p className="text-gray-500 font-medium">{apt.serviceType} • {new Date(apt.date).toLocaleDateString()}</p>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <Clock size={12} className="mr-1" /> {formatTime(apt.time)}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <AlertTriangle size={12} className="mr-1" /> Status: <span className="ml-1 text-indigo-600 font-bold uppercase">{apt.status}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 w-full md:w-auto">
                                {apt.status === 'Assigned' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(apt._id, 'In Progress')}
                                        className="btn-primary flex-1 md:flex-none flex items-center justify-center space-x-2"
                                    >
                                        <Clock size={18} />
                                        <span>Start Working</span>
                                    </button>
                                )}
                                
                                {apt.status === 'In Progress' && (
                                    <button 
                                        onClick={() => handleCompleteService(apt)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center space-x-2 flex-1 md:flex-none"
                                    >
                                        <CheckCircle size={18} />
                                        <span>Complete & Record</span>
                                    </button>
                                )}

                                {apt.status === 'Completed' && (
                                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl font-bold">
                                        <CheckCircle size={18} />
                                        <span>Task Completed</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center glass rounded-3xl">
                        <Wrench className="mx-auto text-gray-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-400">No tasks assigned yet</h3>
                        <p className="text-gray-500">New service requests will appear here once assigned by Admin.</p>
                    </div>
                )}
            </div>

            {/* Service Record Modal */}
            {showRecordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-10 shadow-huge animate-scaleIn">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Complete Service</h2>
                                <p className="text-gray-500 text-sm mt-1">Vehicle: {selectedApt?.vehicle?.model} ({selectedApt?.vehicle?.number})</p>
                            </div>
                            <button onClick={() => setShowRecordModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                        </div>

                        <form onSubmit={handleSubmitRecord} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center">
                                    <Wrench size={16} className="mr-2 text-blue-600" /> Repairs Done
                                </label>
                                <textarea 
                                    className="input-field min-h-[100px]" 
                                    placeholder="Describe the repairs performed..."
                                    value={recordData.repairsDone}
                                    onChange={(e) => setRecordData({...recordData, repairsDone: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center">
                                        <Settings size={16} className="mr-2 text-blue-600" /> Parts Replaced
                                    </label>
                                    <input 
                                        className="input-field" 
                                        placeholder="e.g. Brake pads, Oil filter"
                                        value={recordData.partsReplaced}
                                        onChange={(e) => setRecordData({...recordData, partsReplaced: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center">
                                        <FileText size={16} className="mr-2 text-blue-600" /> Maintenance Notes
                                    </label>
                                    <input 
                                        className="input-field" 
                                        placeholder="Add any additional notes..."
                                        value={recordData.maintenanceNotes}
                                        onChange={(e) => setRecordData({...recordData, maintenanceNotes: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-green-500/20 transition-all text-lg">
                                Finalize & Close Task
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

import { Settings } from 'lucide-react';

export default TechDashboard;
