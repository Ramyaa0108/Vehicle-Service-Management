import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Car, 
    Calendar, 
    History, 
    Users, 
    Settings,
    Wrench,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    const menuItems = {
        Customer: [
            { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/vehicles', name: 'My Vehicles', icon: <Car size={20} /> },
            { path: '/book-appointment', name: 'Book Service', icon: <Calendar size={20} /> },
        ],
        Technician: [
            { path: '/', name: 'My Tasks', icon: <Wrench size={20} /> },
        ],
        Admin: [
            { path: '/', name: 'Insights', icon: <LayoutDashboard size={20} /> },
            { path: '/vehicles', name: 'Vehicles', icon: <Car size={20} /> },
            { path: '/admin', name: 'Manage System', icon: <Users size={20} /> },
        ]
    };

    const currentMenu = menuItems[user?.role] || [];

    return (
        <aside className="w-64 bg-secondary text-white flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
                    <span className="bg-blue-600 p-1.5 rounded-lg">VS</span>
                    <span>Platform</span>
                </h1>
            </div>

            <nav className="flex-1 mt-4 px-3 space-y-1">
                {currentMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                            ${isActive 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                        `}
                    >
                        <div className="flex items-center space-x-3">
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronRight size={14} className="opacity-50" />
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div 
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-800/50 cursor-pointer hover:bg-gray-800 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
