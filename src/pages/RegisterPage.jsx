import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, User as UserIcon, Shield, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ name, email, password, role });
            toast.success('Registration Successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-500 p-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full max-w-4xl animate-fadeIn">
                {/* Form Side */}
                <div className="w-full md:w-1/2 p-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h3>
                    <p className="text-gray-500 mb-8">Join the vehicle service platform today</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    className="input-field pl-12" 
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input 
                                    type="email" 
                                    className="input-field pl-12" 
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input 
                                    type="password" 
                                    className="input-field pl-12" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Select Role</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select 
                                    className="input-field pl-12 appearance-none"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Technician">Technician</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2 py-3 mt-4">
                            <span>Register Now</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account? {' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Log In here
                        </Link>
                    </p>
                </div>

                {/* Visual Side */}
                <div className="hidden md:flex md:w-1/2 bg-indigo-50 p-12 flex-col justify-center items-center text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
                        <UserPlus size={48} className="text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Us!</h2>
                    <p className="text-gray-600 mb-8">Manage your vehicle health and get notified about every update.</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
