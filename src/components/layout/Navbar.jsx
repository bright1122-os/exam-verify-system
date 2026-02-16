import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  GraduationCap,
  Home,
  QrCode,
  ScanLine,
  LayoutDashboard
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, userType } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = {
    student: [
      { to: '/student/dashboard', label: 'Dashboard', icon: Home },
      { to: '/student/qr-code', label: 'My QR Code', icon: QrCode },
    ],
    examiner: [
      { to: '/examiner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/examiner/scan', label: 'Scan QR', icon: ScanLine },
    ],
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  };

  const links = isAuthenticated ? navLinks[userType] || [] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-parchment-dark h-16 no-print">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-anthracite border-2 border-terracotta rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-terracotta text-lg">EV</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-heading font-bold text-anthracite">
                ExamVerify
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-heading font-medium transition-colors relative ${active
                    ? 'text-terracotta'
                    : 'text-stone hover:text-parchment'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-terracotta rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F2F0E9] rounded-full border border-[#EBEAE5]">
                  <div className="w-8 h-8 bg-[#D97757] rounded-full flex items-center justify-center text-[#FAF9F5] font-heading font-semibold text-sm">
                    {user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-heading font-medium text-[#141413] pr-2">
                    {user?.user_metadata?.name || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-[#666660] hover:text-[#CC5555] hover:bg-[#CC5555]/10 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 px-5 py-2 text-sm font-heading font-medium text-[#141413] hover:text-[#D97757] transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/auth/signup">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#141413] hover:bg-[#333331] text-[#FAF9F5] text-sm font-heading font-medium rounded-full transition-colors shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#141413] hover:bg-[#F2F0E9] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slide-in from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-anthracite z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="mb-6 p-2 rounded-lg text-stone hover:text-parchment transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="space-y-2">
                  {!isAuthenticated && (
                    <>
                      <Link
                        to="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone hover:text-parchment hover:bg-white/5 transition-colors"
                      >
                        <LogIn className="w-5 h-5" />
                        <span className="font-heading font-medium">Sign In</span>
                      </Link>
                      <Link
                        to="/auth/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-terracotta text-parchment font-heading font-medium"
                      >
                        <UserPlus className="w-5 h-5" />
                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}

                  {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.to);
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                          ? 'text-terracotta bg-white/5'
                          : 'text-stone hover:text-parchment hover:bg-white/5'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-heading font-medium">{link.label}</span>
                      </Link>
                    );
                  })}

                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-50 transition-colors mt-4"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-heading font-medium">Logout</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
