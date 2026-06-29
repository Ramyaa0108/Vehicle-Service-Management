import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Car, Settings, CheckCircle } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

const AppointmentBooking = () => {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        vehicle: '',
        serviceType: 'Oil Change',
        date: '',
        time: '10:00'
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const { data } = await api.get('/vehicles');
                setVehicles(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, vehicle: data[0]._id }));
                }
            } catch (error) {
                toast.error('Failed to load vehicles');
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments', formData);
            toast.success('Appointment booked successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-gray-900">Book a Service</h1>
                <p className="text-gray-500 mt-2">Choose your vehicle and preferred slot.</p>
            </header>

            <div className="glass rounded-3xl p-10 shadow-huge">
                {vehicles.length === 0 ? (
                    <div className="text-center py-10">
                        <Car size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">No Vehicles Registered</h3>
                        <p className="text-gray-600 mb-6">You need to add a vehicle before booking a service.</p>
                        <button onClick={() => navigate('/vehicles')} className="btn-primary">Add Vehicle Now</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Vehicle Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                                    <Car size={18} className="text-blue-600" />
                                    <span>Select Vehicle</span>
                                </label>
                                <select 
                                    className="input-field h-14"
                                    value={formData.vehicle}
                                    onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                                    required
                                >
                                    {vehicles.map(v => (
                                        <option key={v._id} value={v._id}>{v.model} ({v.number})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Service Type */}
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                                    <Settings size={18} className="text-blue-600" />
                                    <span>Service Type</span>
                                </label>
                                <select 
                                    className="input-field h-14"
                                    value={formData.serviceType}
                                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                                    required
                                >
                                    <option value="Oil Change">Oil Change</option>
                                    <option value="Brake Repair">Brake Repair</option>
                                    <option value="General Maintenance">General Maintenance</option>
                                    <option value="Engine Tuning">Engine Tuning</option>
                                    <option value="Tire Rotation">Tire Rotation</option>
                                    <option value="Other">Other (Describe in notes)</option>
                                </select>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                                    <Calendar size={18} className="text-blue-600" />
                                    <span>Preferred Date</span>
                                </label>
                                <input 
                                    type="date" 
                                    className="input-field h-14"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    required
                                />
                            </div>

                            {/* Time Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                                    <Clock size={18} className="text-blue-600" />
                                    <span>Preferred Time</span>
                                </label>
                                <select 
                                    className="input-field h-14"
                                    value={formData.time}
                                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    required
                                >
                                    {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(t => (
                                        <option key={t} value={t}>{formatTime(t)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 text-lg">
                                <CheckCircle size={24} />
                                <span>Confirm Booking</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AppointmentBooking;
