import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechDashboard from './pages/TechDashboard';
import VehicleManager from './pages/VehicleManager';
import AppointmentBooking from './pages/AppointmentBooking';
import ServiceHistory from './pages/ServiceHistory';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

const Layout = ({ children }) => {
    const { user } = useAuth();
    return (
        <div className="flex min-h-screen bg-gray-50">
            {user && <Sidebar />}
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 transition-all duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout><DashboardHome /></Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/vehicles" element={
                        <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
                            <Layout><VehicleManager /></Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/book-appointment" element={
                        <ProtectedRoute allowedRoles={['Customer']}>
                            <Layout><AppointmentBooking /></Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/service-history/:vehicleId" element={
                        <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
                            <Layout><ServiceHistory /></Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <Layout><AdminDashboard /></Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/technician" element={
                        <ProtectedRoute allowedRoles={['Technician']}>
                            <Layout><TechDashboard /></Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const DashboardHome = () => {
    const { user } = useAuth();
    if (user?.role === 'Admin') return <AdminDashboard />;
    if (user?.role === 'Technician') return <TechDashboard />;
    return <CustomerDashboard />;
};

export default App;
