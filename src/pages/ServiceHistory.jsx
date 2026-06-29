import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { History, Wrench, Settings, FileText, Calendar, ArrowLeft, ChevronRight } from 'lucide-react';

const ServiceHistory = () => {
    const { vehicleId } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get(`/services/history/${vehicleId}`);
                setHistory(data);
            } catch (error) {
                console.error('Failed to load history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [vehicleId]);

    if (loading) return <div>Loading...</div>;

    const vehicle = history.length > 0 ? history[0].vehicle : null;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/vehicles" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Service History</h1>
                        <p className="text-gray-500 mt-1">Detailed record for {vehicle ? `${vehicle.model} (${vehicle.number})` : 'your vehicle'}</p>
                    </div>
                </div>
                <div className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-bold shadow-lg shadow-blue-500/20">
                    {history.length} Record{history.length !== 1 && 's'} Found
                </div>
            </header>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>

                <div className="space-y-12">
                    {history.length > 0 ? (
                        history.map((record, index) => (
                            <div key={record._id} className="relative pl-0 md:pl-20 group">
                                {/* Timeline Dot */}
                                <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-600 hidden md:block z-10 group-hover:scale-125 transition-transform"></div>
                                
                                <div className="glass rounded-3xl p-8 hover:shadow-xl transition-all border-none bg-white relative overflow-hidden">
                                    {/* Date Badge */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2 text-blue-600 font-bold">
                                            <Calendar size={18} />
                                            <span>{new Date(record.serviceDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium flex items-center">
                                            <Wrench size={14} className="mr-1" /> Serviced by {record.technician?.name}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-6">
                                            <section>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                                                    <Wrench size={14} className="mr-2" /> Repairs Performed
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    {record.repairsDone}
                                                </p>
                                            </section>

                                            {record.partsReplaced && (
                                                <section>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                                                        <Settings size={14} className="mr-2" /> Parts Replaced
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {record.partsReplaced.split(',').map((part, i) => (
                                                            <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                                                                {part.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}
                                        </div>

                                        <div className="lg:border-l lg:border-gray-100 lg:pl-8 space-y-6">
                                            {record.maintenanceNotes && (
                                                <section>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                                                        <FileText size={14} className="mr-2" /> Technician Notes
                                                    </h4>
                                                    <p className="text-sm text-gray-500 italic">
                                                        "{record.maintenanceNotes}"
                                                    </p>
                                                </section>
                                            )}
                                            
                                            <div className="pt-6 border-t border-gray-100 mt-auto">
                                                <div className="text-[10px] text-gray-300 font-mono uppercase">Reference ID</div>
                                                <div className="text-[10px] text-gray-300 font-mono italic truncate">{record._id}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center glass rounded-3xl col-span-full">
                            <History className="mx-auto text-gray-300 mb-4" size={64} />
                            <h3 className="text-xl font-bold text-gray-400">No service history found</h3>
                            <p className="text-gray-500">Service records will appear here once sessions are completed by a technician.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceHistory;
