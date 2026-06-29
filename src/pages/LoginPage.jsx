import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Login Successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid Credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full max-w-4xl animate-fadeIn">
                {/* Visual Side */}
                <div className="hidden md:flex md:w-1/2 bg-blue-50 p-12 flex-col justify-center items-center text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
                        <LogIn size={48} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
                    <p className="text-gray-600 mb-8">Access your vehicle dashboard and manage your services seamlessly.</p>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Log In</h3>
                    <p className="text-gray-500 mb-8">Enter your credentials to continue</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
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

                        <div className="space-y-2">
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

                        <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2 py-3">
                            <span>Sign In</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
