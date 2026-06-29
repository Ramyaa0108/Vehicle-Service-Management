import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Car, Plus, Trash2, Edit2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const VehicleManager = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ model: '', number: '', type: 'Car' });
    const [editingId, setEditingId] = useState(null);

    const fetchVehicles = async () => {
        try {
            const { data } = await api.get('/vehicles');
            setVehicles(data);
        } catch (error) {
            toast.error('Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/vehicles/${editingId}`, formData);
                toast.success('Vehicle updated');
            } else {
                await api.post('/vehicles', formData);
                toast.success('Vehicle added');
            }
            setShowModal(false);
            setFormData({ model: '', number: '', type: 'Car' });
            setEditingId(null);
            fetchVehicles();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this vehicle?')) {
            try {
                await api.delete(`/vehicles/${id}`);
                toast.success('Vehicle removed');
                fetchVehicles();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const handleEdit = (v) => {
        setFormData({ model: v.model, number: v.number, type: v.type });
        setEditingId(v._id);
        setShowModal(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Vehicle Management</h1>
                    <p className="text-gray-500 mt-2">Add or manage your registered vehicles.</p>
                </div>
                <button 
                    onClick={() => { setEditingId(null); setFormData({ model: '', number: '', type: 'Car' }); setShowModal(true); }}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add Vehicle</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vehicles.length > 0 ? (
                    vehicles.map((v) => (
                        <div key={v._id} className="glass rounded-3xl p-8 hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                                    <Car size={32} />
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(v)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(v._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800">{v.model}</h3>
                            <p className="text-gray-500 font-mono mt-1 text-lg">{v.number}</p>
                            
                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600 uppercase tracking-tighter">
                                    {v.type}
                                </span>
                                <Link to={`/service-history/${v._id}`} className="text-blue-600 text-sm font-bold hover:underline">
                                    View History →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center glass rounded-3xl">
                        <AlertCircle className="mx-auto text-gray-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-400">No vehicles found</h3>
                        <p className="text-gray-500">Add your first vehicle to get started with bookings.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-10 shadow-huge animate-scaleIn">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Vehicle Model</label>
                                <input 
                                    className="input-field" 
                                    placeholder="e.g. Toyota Corolla 2022"
                                    value={formData.model}
                                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">License Plate Number</label>
                                <input 
                                    className="input-field uppercase font-mono" 
                                    placeholder="ABC-1234"
                                    value={formData.number}
                                    onChange={(e) => setFormData({...formData, number: e.target.value.toUpperCase()})}
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Vehicle Type</label>
                                <select 
                                    className="input-field"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary w-full py-3 mt-4">
                                {editingId ? 'Update Vehicle' : 'Save Vehicle'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleManager;
