import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {user.role} Portal
                </h2>
            </div>
            
            <div className="flex items-center space-x-6">
                <button className="text-gray-500 hover:text-blue-600 transition-colors">
                    <Bell size={20} />
                </button>
                
                <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button 
                        onClick={logout}
                        className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
