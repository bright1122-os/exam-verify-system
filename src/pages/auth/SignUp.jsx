import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, GraduationCap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const { signUp, signInWithGoogle } = useStore();

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      return;
    }

    setLoading(true);
    try {
      const user = await signUp(email, password, { name, role });
      setSuccess(true);
      toast.success('Registration successful.', { style: { background: '#7A8F7C', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      setTimeout(() => {
        if (user.role === 'examiner') navigate('/examiner/dashboard');
        else if (user.role === 'admin') navigate('/admin/dashboard');
        else navigate('/student/register');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Registration failed.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Google sign-in failed.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clay selection:bg-parchment/30 selection:text-white px-6 font-body py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'organic' }}
        className="w-full max-w-[480px]"
      >
        <div className="container-editorial p-10 lg:p-12">

          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-parchment rounded-3xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-clay" strokeWidth={1} />
              </div>
            </div>

            <h1 className="text-4xl font-heading text-charcoal mb-3">
              Join ExamVerify
            </h1>
            <p className="text-charcoal-light font-body text-base px-4">
              Experience secure, elegant examination management.
            </p>
          </div>

          {/* Role Selector (Soft Pill) */}
          <div className="flex bg-parchment p-1 rounded-full mb-8">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-full transition-all duration-500 ease-organic ${role === 'student' ? 'bg-white shadow-soft text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
            >
              <GraduationCap className="w-4 h-4" strokeWidth={2} />
              Student
            </button>
            <button
              onClick={() => setRole('examiner')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-full transition-all duration-500 ease-organic ${role === 'examiner' ? 'bg-white shadow-soft text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
            >
              <User className="w-4 h-4" strokeWidth={2} />
              Staff
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 ml-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-editorial"
                placeholder="Jane Austen"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 ml-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-editorial"
                placeholder="jane@university.edu"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2 ml-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-editorial"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2 ml-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-editorial"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full ${loading || success ? 'bg-parchment text-charcoal-light cursor-not-allowed shadow-none' : 'btn-primary'} py-4 rounded-full font-medium text-lg transition-all duration-500`}
              >
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-sage">
                      Profile Created
                    </motion.div>
                  ) : loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-charcoal-light border-t-transparent rounded-full animate-spin" /> Registering
                    </motion.div>
                  ) : (
                    <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                      Create Account
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-parchment-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-charcoal-light font-medium rounded-full">or sign up with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-parchment text-charcoal py-4 rounded-full font-medium hover:bg-parchment-dark/50 hover:shadow-soft transition-all duration-500 ease-organic"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <p className="text-center mt-10 text-charcoal-light text-sm font-medium">
            Already have clearance?{' '}
            <Link to="/auth/login" className="text-charcoal hover:text-clay transition-colors underline decoration-charcoal/20 hover:decoration-clay/50 underline-offset-4 pl-1">
              Sign in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
