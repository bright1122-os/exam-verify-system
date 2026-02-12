import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';
import { useStore } from './store/useStore';

// Pages
import Home from './pages/Home';
import AuthCallback from './pages/auth/AuthCallback';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentRegister from './pages/student/Register';
import PrintQR from './pages/student/PrintQR';

// Examiner Pages
import ExaminerDashboard from './pages/examiner/Dashboard';
import ScanPortal from './pages/examiner/ScanPortal';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userType } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Student Routes */}
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/qr-code" element={
            <ProtectedRoute allowedRoles={['student']}>
              <PrintQR />
            </ProtectedRoute>
          } />

          {/* Examiner Routes */}
          <Route path="/examiner/dashboard" element={
            <ProtectedRoute allowedRoles={['examiner', 'admin']}>
              <ExaminerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/examiner/scan" element={
            <ProtectedRoute allowedRoles={['examiner', 'admin']}>
              <ScanPortal />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
