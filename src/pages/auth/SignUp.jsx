import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const { signUp } = useStore();

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Pass name and role as metadata
      await signUp(email, password, { name, role });
      setSuccess(true);
      toast.success('Account created! Please check your email.');
      setTimeout(() => {
        // Redirect to login or verification page
        navigate('/auth/login?role=' + role);
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF7] px-4 font-body text-[#333331]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px]"
      >
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl font-medium tracking-tight mb-3 text-[#141413]">
            Create Account
          </h1>
          <p className="text-[#666660] text-lg">
            Join ExamVerify as a <span className="text-[#D97757] font-medium">{role === 'examiner' ? 'Examiner' : 'Student'}</span>
          </p>
        </div>

        {/* Minimal Role Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#F2F0E9] p-1 rounded-lg inline-flex">
            <button
              onClick={() => setRole('student')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${role === 'student' ? 'bg-white shadow-sm text-[#333331]' : 'text-[#666660] hover:text-[#333331]'}`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('examiner')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${role === 'examiner' ? 'bg-white shadow-sm text-[#333331]' : 'text-[#666660] hover:text-[#333331]'}`}
            >
              Examiner
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white px-4 py-3.5 rounded-xl border border-[#D9D9D5] text-lg placeholder:text-[#999995] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-all shadow-sm"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white px-4 py-3.5 rounded-xl border border-[#D9D9D5] text-lg placeholder:text-[#999995] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-all shadow-sm"
              placeholder="Email address"
              required
            />
          </div>

          <div className="space-y-1.5 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white px-4 py-3.5 rounded-xl border border-[#D9D9D5] text-lg placeholder:text-[#999995] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-all shadow-sm"
              placeholder="Password (min 6 chars)"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999995] hover:text-[#333331] transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="space-y-1.5">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white px-4 py-3.5 rounded-xl border border-[#D9D9D5] text-lg placeholder:text-[#999995] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-all shadow-sm"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3.5 rounded-xl font-heading font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2 mt-4
              ${success
                ? 'bg-[#E3F2E6] text-[#2E7D32] border border-[#2E7D32]/20'
                : 'bg-[#D97757] text-[#FAF9F5] hover:bg-[#C4623F] shadow-sm hover:shadow-md'
              }
              ${loading ? 'opacity-90 cursor-wait' : ''}
            `}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : success ? (
              <>
                <CheckCircle size={20} />
                Created!
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center gap-3 justify-center text-[#666660]">
            <div className="h-px bg-[#D9D9D5] w-12" />
            <span className="font-heading text-sm">Or log in</span>
            <div className="h-px bg-[#D9D9D5] w-12" />
          </div>

          <Link
            to={`/auth/login?role=${role}`}
            className="block text-[#D97757] font-heading font-medium hover:opacity-80 transition-opacity"
          >
            Sign in to existing account
          </Link>

          <Link to="/" className="block text-sm text-[#999995] hover:text-[#666660] transition-colors">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
