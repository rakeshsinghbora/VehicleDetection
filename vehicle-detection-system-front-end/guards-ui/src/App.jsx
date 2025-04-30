import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import GateDashboard from './Components/Dashboard/GateDashboard/GateDashboard'
import SearchVehicles from './Components/Dashboard/AdminDashboard/Search/SearchPage'
import Navbar from './Components/Navbar/Navbar'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from './Components/ContextAPI/GlobalContext'
import Home from './Components/Home/Home'
import GateLogin from './Components/Login/GateLogin'
import AdminLogin from './Components/Login/AdminLogin'
import { ToastContainer, toast } from 'react-toastify'
import BlockedDashboard from './Components/Dashboard/AdminDashboard/Blocked/BlockedDashboard'
// import SearchVehicles from './Components/Dashboard/AdminDashboard/Search/SearchVehicles'
import 'react-toastify/dist/ReactToastify.css'
import AdminDashboard from './Components/Dashboard/AdminDashboard/Dashboard/AdminDashboard';

// Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isLoggedIn } = useGlobalContext();
//   if (!isLoggedIn) {

//     return <Navigate to="/" />;
//   }
//   return children;
// };

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userType } = useGlobalContext();
  const location = useLocation();
  
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Check if trying to access admin routes without admin privileges
  const adminRoutes = ['/admin-dashboard', '/blocking', '/search-vehicles'];
  if (adminRoutes.includes(location.pathname) && userType !== 'admin') {
    return <Navigate to="/guard-dashboard" />;
  }

  return children;
};

// Public Route Component (accessible only when logged out)
const PublicRoute = ({ children }) => {
  const { isLoggedIn, userType } = useGlobalContext();
  
  // Only show toast if user is already logged in and trying to access public routes
  if (isLoggedIn && window.location.pathname === '/') {
    toast.info('Logout yourself first!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
  
  if (isLoggedIn) {
    return <Navigate to={userType === 'admin' ? '/admin-dashboard' : '/guard-dashboard'} />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public routes - only accessible when logged out */}
        <Route path="/" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path="/admin-login" element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        } />
        <Route path="/guard-login" element={
          <PublicRoute>
            <GateLogin />
          </PublicRoute>
        } />

        {/* Protected routes - only accessible when logged in */}
        <Route path="/guard-dashboard" element={
          <ProtectedRoute>
            <GateDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* New Admin Routes */}
        <Route path="/blocking" element={
          <ProtectedRoute>
            <BlockedDashboard />
          </ProtectedRoute>
        } />
        <Route path="/search-vehicles" element={
          <ProtectedRoute>
            <SearchVehicles />
          </ProtectedRoute>
        } />

        {/* Catch all other routes and redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App
