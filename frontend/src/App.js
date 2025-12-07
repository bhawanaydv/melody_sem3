import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import './App.css';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <span className="loading-icon">🎵</span>
          <div className="loading-spinner-large"></div>
          <p>Loading V-Music...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};


const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <span className="loading-icon">🎵</span>
          <div className="loading-spinner-large"></div>
          <p>Loading V-Music...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/" /> : children;
};

function AppContent() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;