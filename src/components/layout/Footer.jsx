import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useScroll, motion, useTransform, useReducedMotion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0.8, 1], [shouldReduceMotion ? 0 : 100, 0]);

  return (
    <motion.footer
      style={{ y }}
      className="bg-charcoal text-[#f2f0e9] border-t border-[#f2f0e9]/10 pt-32 pb-12 px-6 lg:px-12 w-full font-body overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-12 lg:gap-16 pb-32">
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <Link to="/" className="flex items-center gap-3 group text-[#f2f0e9] hover:opacity-80 transition-opacity w-max mb-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#f2f0e9]/5 border border-[#f2f0e9]/10">
              <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="text-2xl font-heading tracking-tight mt-1">
              ExamVerify
            </span>
          </Link>
          <p className="text-lg text-[#f2f0e9]/50 leading-[1.6] max-w-sm mb-12">
            The definitive architectural standard for cryptographic, zero-friction academic verification.
          </p>
          <div className="flex gap-4 items-center mt-auto">
            <a href="mailto:contact@examverify.com" className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f2f0e9]/40 hover:text-[#f2f0e9] transition-colors border-b border-transparent hover:border-[#f2f0e9]/40 pb-1">
              contact@examverify.com
            </a>
          </div>
        </div>

        <nav className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8 pt-4">
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f2f0e9]/30 mb-2">Platform</h4>
            <Link to="/about" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors flex items-center gap-2 group">
              Architecture <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#f2f0e9]/50 mt-1" />
            </Link>
            <Link to="/auth/signup?role=student" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors flex items-center gap-2 group">
              Student Portal <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#f2f0e9]/50 mt-1" />
            </Link>
            <Link to="/auth/signup?role=examiner" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors flex items-center gap-2 group">
              Institution Node <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#f2f0e9]/50 mt-1" />
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f2f0e9]/30 mb-2">System</h4>
            <Link to="/pricing" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors">Documentation</Link>
            <Link to="/contact" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors">API Reference</Link>
            <Link to="/status" className="text-base text-sage/80 hover:text-sage transition-colors flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
              </span>
              System Status
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f2f0e9]/30 mb-2">Legal</h4>
            <Link to="/privacy" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors">Privacy Lexicon</Link>
            <Link to="/terms" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors">Service Terms</Link>
            <Link to="/compliance" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors">GDPR & Compliance</Link>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f2f0e9]/30 mb-2">Social</h4>
            <a href="#" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors">Twitter // X</a>
            <a href="#" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors">LinkedIn</a>
            <a href="#" className="text-base text-[#f2f0e9]/70 hover:text-[#f2f0e9] transition-colors">Github OS</a>
          </div>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto pt-8 border-t border-[#f2f0e9]/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm font-medium text-[#f2f0e9]/40 font-mono tracking-wider">
          © {currentYear} EXAMVERIFY SYSTEMS. ALL RIGHTS RESERVED.
        </p>
        <p className="text-xs tracking-[0.2em] font-medium text-[#f2f0e9]/20 uppercase">
          Crafted with exactitude.
        </p>
      </div>
    </motion.footer>
  );
};
