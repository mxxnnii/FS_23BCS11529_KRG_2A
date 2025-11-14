import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HabitTrackerPage from './pages/HabitTrackerPage';
import RewardsPage from './pages/RewardsPage';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">Loading...</div>
        </div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Layout>
                                <DashboardPage />
                            </Layout>
                        </PrivateRoute>
                    } />

                    <Route path="/habits" element={
                        <PrivateRoute>
                            <Layout>
                                <HabitTrackerPage />
                            </Layout>
                        </PrivateRoute>
                    } />

                    <Route path="/rewards" element={
                        <PrivateRoute>
                            <Layout>
                                <RewardsPage />
                            </Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;