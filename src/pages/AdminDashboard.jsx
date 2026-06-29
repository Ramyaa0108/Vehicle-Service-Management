import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Users, Calendar, Car, CheckCircle, Clock, Wrench, Shield, ChevronDown, X } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, aptRes, techRes] = await Promise.all([
                api.get('/services/stats'),
                api.get('/appointments'),
                api.get('/auth/technicians')
            ]);
            
            setStats(statsRes.data);
            setAppointments(aptRes.data);
            setTechnicians(techRes.data);

        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (aptId, techId) => {
        try {
            await api.patch(`/appointments/${aptId}/assign`, { technicianId: techId });
            toast.success('Technician assigned successfully');
            fetchData();
        } catch (error) {
            toast.error('Assignment failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Admin Oversight</h1>
                    <p className="text-gray-500 mt-2">Manage all system operations and service tracking.</p>
                </div>
                <div className="flex space-x-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">System Status</p>
                            <p className="text-sm font-bold text-green-600">Operational</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard title="Total Vehicles" value={stats?.totalVehicles} icon={<Car />} color="text-blue-600" bg="bg-blue-50" />
                <AdminStatCard title="Appointments" value={stats?.totalAppointments} icon={<Calendar />} color="text-purple-600" bg="bg-purple-50" />
                <AdminStatCard title="Pending" value={stats?.pendingServices} icon={<Clock />} color="text-yellow-600" bg="bg-yellow-50" />
                <AdminStatCard title="Completed" value={stats?.completedServices} icon={<CheckCircle />} color="text-green-600" bg="bg-green-50" />
            </div>

            {/* Appointment Management Table */}
            <div className="glass rounded-3xl overflow-hidden shadow-huge">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Manage Appointments</h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span>Assign Technicians</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Vehicle</th>
                                <th className="px-8 py-4">Customer</th>
                                <th className="px-8 py-4">Service</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Assign Technician</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {appointments.map((apt) => (
                                <tr key={apt._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-gray-800">{apt.vehicle?.model}</div>
                                        <div className="text-xs text-gray-400 font-mono uppercase">{apt.vehicle?.number}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-medium text-gray-700">{apt.customer?.name}</div>
                                        <div className="text-xs text-gray-400">{apt.customer?.email}</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-600">{apt.serviceType}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                            apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {apt.status === 'Cancelled' ? (
                                            <div className="flex items-center space-x-2 text-red-500 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg w-fit">
                                                <X size={16} />
                                                <span>Booking Cancelled</span>
                                            </div>
                                        ) : apt.technician ? (
                                            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm">
                                                <Wrench size={16} />
                                                <span>{apt.technician.name}</span>
                                            </div>
                                        ) : (
                                            <select 
                                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                                onChange={(e) => handleAssign(apt._id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Select Technician</option>
                                                {technicians.map(t => (
                                                    <option key={t._id} value={t._id}>{t.name}</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AdminStatCard = ({ title, value, icon, color, bg }) => (
    <div className="glass rounded-3xl p-6 flex items-center space-x-4 border-none shadow-sm hover:shadow-md transition-all">
        <div className={`p-4 rounded-2xl ${bg} ${color}`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
            <h4 className="text-2xl font-extrabold text-gray-800 mt-1">{value || 0}</h4>
        </div>
    </div>
);

export default AdminDashboard;
