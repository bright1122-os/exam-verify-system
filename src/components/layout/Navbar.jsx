import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  QrCode,
  ScanLine,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, signOut, userType } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = {
    student: [
      { to: '/student/dashboard', label: 'Portal', icon: LayoutDashboard },
      { to: '/student/qr-code', label: 'Exam Pass', icon: QrCode },
    ],
    examiner: [
      { to: '/examiner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/examiner/scan', label: 'Terminal', icon: ScanLine },
    ],
    admin: [
      { to: '/admin/dashboard', label: 'System Admin', icon: LayoutDashboard },
    ],
  };

  const links = isAuthenticated ? navLinks[userType] || [] : [];
  const isActive = (path) => location.pathname === path;

  // Adaptive palette based on page
  const isHome = location.pathname === '/';
  const navBackground = scrolled
    ? 'bg-[#f2f0e9]/90 backdrop-blur-xl border-b border-charcoal/5 shadow-soft'
    : 'bg-transparent border-b border-transparent';

  // The Intiri design uses a light background, so text is always dark charcoal.
  const textColor = 'text-charcoal';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] h-24 transition-all duration-700 ease-organic flex items-center ${navBackground} no-print`}>
      <div className="max-w-[1200px] w-full mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className={`flex items-center gap-3 group ${textColor} transition-colors duration-500`}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-current/10 group-hover:bg-current/20 transition-colors duration-500">
            <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-heading font-medium tracking-tight mt-1 hidden sm:block">
            ExamVerify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ease-organic ${active
                  ? 'bg-charcoal text-[#f2f0e9] shadow-soft'
                  : `${textColor} opacity-70 hover:opacity-100 hover:bg-current/5`
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center gap-4 pl-6 border-l border-current/10 py-1 ${textColor}`}>
                <div className="text-right">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.name || 'Authorized User'}
                  </p>
                  <p className="text-[11px] opacity-60 mt-1 capitalize font-medium">
                    {userType}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-current/10 text-current overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-heading font-medium text-lg">{user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || '?'}</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-rust hover:text-white transition-all duration-500 ease-organic opacity-70 hover:opacity-100 ${textColor}`}
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className={`hidden md:flex items-center gap-4 pl-6 border-l border-current/10 py-1 ${textColor}`}>
              <Link to="/auth/login" className="px-4 py-2 font-medium opacity-70 hover:opacity-100 transition-opacity tracking-widest uppercase text-xs">
                Sign In
              </Link>
              <Link to="/auth/signup" className={`bg-charcoal text-[#f2f0e9] px-7 py-3.5 rounded-full text-xs tracking-widest uppercase font-medium hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_15px_30px_-10px_rgba(41,40,38,0.3)]`}>
                Start Now
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden w-12 h-12 rounded-full flex items-center justify-center bg-current/10 transition-colors ${textColor}`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu (Soft Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[120] bg-charcoal md:hidden flex flex-col px-6 pt-10 pb-12 text-[#f2f0e9]"
          >
            <div className="flex justify-between items-center mb-16 px-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f2f0e9]/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#f2f0e9]" strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-heading tracking-tight mt-1">
                  ExamVerify
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f2f0e9]/10 text-[#f2f0e9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              {!isAuthenticated && (
                <div className="flex flex-col gap-3 mb-12">
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-between items-center p-6 rounded-3xl bg-charcoal-light/30 text-[#f2f0e9] font-medium text-lg"
                  >
                    Sign In
                    <ChevronRight className="w-5 h-5 opacity-40" />
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-between items-center p-6 rounded-3xl bg-[#f2f0e9] text-charcoal font-medium text-lg"
                  >
                    Start Now
                    <ChevronRight className="w-5 h-5 opacity-40" />
                  </Link>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {links.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-6 rounded-3xl transition-colors ${active
                        ? 'bg-[#f2f0e9] text-charcoal'
                        : 'text-[#f2f0e9] bg-charcoal-light/10 hover:bg-charcoal-light/30'
                        }`}
                    >
                      <link.icon className="w-5 h-5 opacity-80" />
                      <span className="font-medium text-lg">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 p-6 mt-12 rounded-full bg-rust/20 text-rust-light font-medium"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
