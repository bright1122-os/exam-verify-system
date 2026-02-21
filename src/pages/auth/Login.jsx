import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signInWithGoogle } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const user = await signIn(email, password);
      setAuthSuccess(true);

      // Navigate based on returned user role (not stale store value)
      setTimeout(() => {
        if (userType === 'examiner') navigate('/examiner/dashboard');
        else if (userType === 'admin') navigate('/admin/dashboard');
        else navigate('/student/dashboard');
      }, 1500);

    } catch (error) {
      toast.error(error.message || 'Authentication failed. Please try again.', {
        style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' }
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Google sign-in failed.', {
        style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clay selection:bg-parchment/30 selection:text-white px-6 font-body py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'organic' }}
        className="w-full max-w-[440px]"
      >
        <div className="container-editorial p-10 lg:p-12">

          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-parchment rounded-3xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-clay" strokeWidth={1} />
              </div>
            </div>

            <h1 className="text-4xl font-heading text-charcoal mb-3">
              Welcome back.
            </h1>
            <p className="text-charcoal-light font-body text-base px-4">
              Access your personalized examination portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 ml-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-editorial"
                placeholder="student@university.edu"
                required
              />
            </div>

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
              <div className="flex justify-start mt-4 ml-2">
                <button type="button" className="text-sm font-medium text-charcoal-light hover:text-charcoal transition-colors duration-300">
                  Forgot your password?
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || authSuccess}
                className={`w-full ${loading || authSuccess ? 'bg-parchment text-charcoal-light cursor-not-allowed shadow-none' : 'btn-primary'} py-4 rounded-full font-medium text-lg transition-all duration-500`}
              >
                <AnimatePresence mode="wait">
                  {authSuccess ? (
                    <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-sage">
                      Authenticated
                    </motion.div>
                  ) : loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-charcoal-light border-t-transparent rounded-full animate-spin" /> Verifying
                    </motion.div>
                  ) : (
                    <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                      Sign In
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-parchment-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-charcoal-light font-medium rounded-full">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
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

        </div>

        <p className="text-center mt-10 text-parchment/80 text-sm font-medium">
          First time here?{' '}
          <Link to="/auth/signup" className="text-white hover:text-parchment transition-colors underline decoration-parchment/40 underline-offset-4 pl-1">
            Create an account
          </Link>
        </p>

        <div className="text-center mt-8">
          <Link to="/" className="inline-block text-parchment/50 hover:text-parchment text-sm font-medium transition-colors">
            Return to homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
