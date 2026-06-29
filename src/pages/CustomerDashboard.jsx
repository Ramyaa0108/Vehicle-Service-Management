import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Car, Calendar, History, Plus, ChevronRight, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ vehicles: 0, appointments: 0, active: 0 });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [vehiclesRes, appointmentsRes] = await Promise.all([
                api.get('/vehicles'),
                api.get('/appointments')
            ]);
            
            setStats({
                vehicles: vehiclesRes.data.length,
                appointments: appointmentsRes.data.length,
                active: appointmentsRes.data.filter(a => ['Pending', 'Assigned', 'In Progress'].includes(a.status)).length
            });
            
            setRecentAppointments(appointmentsRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.patch(`/appointments/${id}/cancel`);
                toast.success('Appointment cancelled successfully');
                fetchDashboardData();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Cancellation failed');
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Assigned': return 'bg-indigo-100 text-indigo-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="animate-pulse flex space-x-4">...</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your vehicles.</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Vehicles" 
                    value={stats.vehicles} 
                    icon={<Car className="text-blue-600" size={24} />} 
                    color="bg-blue-50"
                />
                <StatCard 
                    title="Active Bookings" 
                    value={stats.active} 
                    icon={<Clock className="text-yellow-600" size={24} />} 
                    color="bg-yellow-50"
                />
                <StatCard 
                    title="Total Services" 
                    value={stats.appointments} 
                    icon={<CheckCircle className="text-green-600" size={24} />} 
                    color="bg-green-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Appointments */}
                <div className="lg:col-span-2 glass rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent Appointments</h2>
                        <Link to="/book-appointment" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1">
                            <Plus size={18} />
                            <span>Book New</span>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentAppointments.length > 0 ? (
                            recentAppointments.map((apt) => (
                                <div key={apt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl ${getStatusStyle(apt.status)}`}>
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{apt.serviceType}</p>
                                            <p className="text-sm text-gray-500">{apt.vehicle?.model} • {apt.vehicle?.number}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end space-y-2">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                        {apt.status === 'Pending' && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleCancel(apt._id); }}
                                                className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-tighter"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                        <p className="text-xs text-gray-400">{new Date(apt.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500 italic">No appointments booked yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar Placeholder */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Need a Repair?</h3>
                            <p className="text-blue-100 text-sm mb-6">Book an appointment in less than 2 minutes and get your vehicle serviced by professionals.</p>
                            <Link to="/book-appointment" className="bg-white text-blue-600 font-bold py-3 px-6 rounded-xl inline-block hover:shadow-lg transition-all">
                                Get Started
                            </Link>
                        </div>
                        <Car size={120} className="absolute -bottom-4 -right-8 opacity-20 transform -rotate-12" />
                    </div>
                    
                    <div className="glass rounded-3xl p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Link</h3>
                        <div className="space-y-3">
                            <Link to="/vehicles" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                                <ChevronRight size={16} />
                                <span>Manage My Vehicles</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-8 rounded-3xl flex items-center space-x-6 shadow-sm border border-transparent hover:shadow-md transition-all ${color}`}>
        <div className="bg-white p-4 rounded-2xl shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{title}</p>
            <h4 className="text-3xl font-extrabold text-gray-800">{value}</h4>
        </div>
    </div>
);

export default CustomerDashboard;
