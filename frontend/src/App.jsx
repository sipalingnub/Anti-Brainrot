import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authcontext';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import AddActivity from './pages/addactivites';
import Activities from './pages/activites';
import Navbar from './components/navbar';
import LoadingRPG from './components/loadingrpg'; // <--- 1. Import ini

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    // 2. Ganti div spinner lama dengan komponen ini
    return <LoadingRPG />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ... sisa kode AppRoutes dan App biarkan sama ...
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* ... routes kamu ... */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/add-activity" 
          element={
            <PrivateRoute>
              <AddActivity />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/activities" 
          element={
            <PrivateRoute>
              <Activities />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="scanlines"></div>
      <div className="crt-flicker"></div>
      <div className="vignette"></div>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;