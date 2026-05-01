import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import RecyclerDashboard from './pages/RecyclerDashboard';
import { AuthContext } from './context/AuthContext';

// Protected Route Wrapper for strict Role-Based Access Control
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useContext(AuthContext);
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Loading session...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};


function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar isAuthenticated={!!user} user={user} onLogout={logout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Redirect authenticated users away from the login page to their respective dashboards */}
            <Route path="/auth" element={
              !user ? <AuthPage /> : <Navigate to={user.role === 'recycler' ? '/recycler-dashboard' : '/dashboard'} />
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/recycler-dashboard" element={
              <ProtectedRoute allowedRoles={['recycler', 'admin']}>
                <RecyclerDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
