import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MoveRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { INITI_EASE, useMotionVariants } from '../../lib/motion';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, userType } = useStore();
  const v = useMotionVariants();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await signIn(email, password);
      setSuccess(true);

      // Wait for Auth listener to populate userType
      setTimeout(() => {
        const currentRole = useStore.getState().userType;
        if (currentRole === 'examiner') navigate('/examiner/dashboard');
        else if (currentRole === 'admin') navigate('/admin/dashboard');
        else navigate('/student/dashboard');
      }, 1500);

    } catch (error) {
      toast.error(error.message || 'Authentication failed. Please verify credentials.', {
        style: { background: '#292826', color: '#F5F2E9', borderRadius: '0px', padding: '16px 24px', fontFamily: 'Inter' }
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Identity provider authentication failed.', {
        style: { background: '#292826', color: '#F5F2E9', borderRadius: '0px', padding: '16px 24px', fontFamily: 'Inter' }
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f2f0e9] font-body text-charcoal selection:bg-charcoal selection:text-[#f2f0e9]">

      {/* ── Left Column: Editorial Space ── */}
      <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-between relative overflow-hidden hidden lg:flex">
        <motion.div initial="hidden" animate="visible" variants={v.staggerContainer} className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-charcoal/10 bg-transparent group-hover:bg-charcoal/5 transition-colors">
              <Shield className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-heading tracking-tight">ExamVerify</span>
          </Link>

          <div className="mt-32">
            <motion.h1 variants={v.slideUpReveal} className="text-7xl xl:text-[6rem] font-heading leading-[0.9] tracking-tighter mb-8">
              Resume <br /> operations.
            </motion.h1>
            <motion.p variants={v.slideUpReveal} className="text-xl text-charcoal/60 max-w-sm leading-[1.6]">
              Secure authentication into the central academic ledger.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: INITI_EASE, delay: 0.2 }}
          className="absolute bottom-0 right-0 w-3/4 aspect-square translate-x-1/4 translate-y-1/4 opacity-40 mix-blend-multiply pointer-events-none"
        >
          <img src="/academic_verification_mock.png" alt="" className="w-full h-full object-cover rounded-full blur-xl" />
        </motion.div>
      </div>

      {/* ── Right Column: Unboxed Form Area ── */}
      <div className="w-full lg:w-1/2 min-h-screen bg-white p-8 lg:p-20 flex flex-col justify-center relative">
        <motion.div
          initial="hidden" animate="visible" variants={v.staggerContainer}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden mb-16">
            <Link to="/" className="inline-flex items-center gap-3 mb-10">
              <Shield className="w-6 h-6" strokeWidth={1.5} />
              <span className="text-xl font-heading tracking-tight">ExamVerify</span>
            </Link>
            <h1 className="text-5xl font-heading leading-[0.9] tracking-tighter mb-4">
              Sign In.
            </h1>
            <p className="text-charcoal/60">Reconnect to the institutional network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div variants={v.slideUpReveal}>
              <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-charcoal/50 mb-3">
                Institutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-charcoal/20 pb-4 text-xl font-medium text-charcoal focus:outline-none focus:border-charcoal transition-colors rounded-none placeholder:text-charcoal/20"
                placeholder="identity@university.edu"
                required
              />
            </motion.div>

            <motion.div variants={v.slideUpReveal}>
              <div className="flex justify-between items-baseline mb-3">
                <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-charcoal/50">
                  Cryptographic Key
                </label>
                <button type="button" className="text-[11px] font-semibold tracking-[0.1em] uppercase text-charcoal/40 hover:text-charcoal transition-colors">
                  Recovery
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-charcoal/20 pb-4 text-xl font-medium text-charcoal focus:outline-none focus:border-charcoal transition-colors rounded-none placeholder:text-charcoal/20"
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.div variants={v.slideUpReveal} className="pt-6">
              <button
                type="submit"
                disabled={loading || success}
                className="group relative w-full overflow-hidden bg-charcoal text-[#f2f0e9] py-5 font-medium transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex items-center justify-center gap-2 text-[#f2f0e9] uppercase tracking-widest text-xs">
                      Session Verified
                    </motion.div>
                  ) : loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
                      <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> Authenticating
                    </motion.div>
                  ) : (
                    <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex items-center justify-center gap-3 text-[13px] uppercase tracking-[0.15em]">
                      Initialize Access <MoveRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
              </button>
            </motion.div>
          </form>

          <motion.div variants={v.slideUpReveal} className="mt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-charcoal/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-charcoal/40">External Provider</span>
              <div className="flex-1 h-px bg-charcoal/10" />
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-[#f2f0e9]/50 text-charcoal py-4 font-medium hover:bg-[#f2f0e9] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-charcoal/5"
            >
              <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-xs uppercase tracking-[0.1em]">Google SSO</span>
            </button>
          </motion.div>

          <motion.p variants={v.slideUpReveal} className="text-center mt-12 text-sm text-charcoal/50">
            Unregistered Identity?{' '}
            <Link to="/auth/signup" className="text-charcoal hover:text-charcoal transition-colors font-medium border-b border-charcoal/20 hover:border-charcoal pb-0.5 ml-1">
              Enroll Here
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
