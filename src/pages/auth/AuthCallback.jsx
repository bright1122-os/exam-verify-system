import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useStore();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const token = searchParams.get('token');
        const role = searchParams.get('role');

        if (!token) {
          toast.error('Authentication failed');
          navigate('/');
          return;
        }

        // Store token
        localStorage.setItem('token', token);

        // Get user data
        const response = await api.get('/auth/me');

        // Update store
        login(response.data.user, role);

        toast.success('Welcome back!');

        // Redirect based on role
        if (role === 'student') {
          navigate('/student/dashboard');
        } else if (role === 'examiner') {
          navigate('/examiner/dashboard');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Authentication failed');
        navigate('/');
      }
    };

    handleAuth();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment">
      <LoadingSpinner size="lg" text="Completing authentication..." />
    </div>
  );
}
