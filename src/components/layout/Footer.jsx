import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-[#f2f0e9] pt-32 pb-12 px-6 lg:px-12 w-full font-body overflow-hidden rounded-t-[3rem] lg:rounded-t-[4rem] mx-4 lg:mx-8 -mt-20 relative z-30">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-12 lg:gap-16 pb-32">
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <Link to="/" className="flex items-center gap-3 group text-[#f2f0e9] hover:text-white transition-colors w-max mb-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-float">
              <ShieldCheck className="w-6 h-6 text-charcoal" strokeWidth={1.5} />
            </div>
            <span className="text-2xl font-heading tracking-tight mt-1">
              ExamVerify
            </span>
          </Link>
          <p className="text-lg text-[#f2f0e9]/60 leading-[1.6] max-w-sm mb-12">
            The definitive architectural standard for cryptographic, zero-friction academic verification.
          </p>
          <div className="flex gap-4 items-center mt-auto">
            <a href="mailto:contact@examverify.com" className="text-xs font-semibold tracking-widest uppercase text-[#f2f0e9]/50 hover:text-[#f2f0e9] transition-colors border-b border-transparent hover:border-[#f2f0e9]/40 pb-1">
              contact@examverify.com
            </a>
          </div>
        </div>

        <nav className="col-span-12 lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pt-4">
          <div className="flex flex-col gap-5">
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#f2f0e9]/30 mb-2">Platform</h4>
            <Link to="/about" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors flex items-center gap-2 group">
              Architecture <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-charcoal mt-0.5" />
            </Link>
            <Link to="/auth/signup?role=student" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors flex items-center gap-2 group">
              Student Portal <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-charcoal mt-0.5" />
            </Link>
            <Link to="/auth/signup?role=examiner" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors flex items-center gap-2 group">
              Institution Node <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-charcoal mt-0.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#f2f0e9]/30 mb-2">System</h4>
            <Link to="/pricing" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors">Integration</Link>
            <Link to="/contact" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors">API Reference</Link>
            <div className="text-sm text-sage-light hover:text-sage transition-colors flex items-center gap-2 mt-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
              </span>
              All Systems Active
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#f2f0e9]/30 mb-2">Legal</h4>
            <a href="#" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors">Privacy Lexicon</a>
            <a href="#" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors">Service Terms</a>
            <a href="#" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors">GDPR & Compliance</a>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#f2f0e9]/30 mb-2">Social</h4>
            <a href="#" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors">Twitter // X</a>
            <a href="#" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-sm text-[#f2f0e9]/70 hover:text-white transition-colors">Github OS</a>
          </div>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-mono text-[#f2f0e9]/40 tracking-wider">
          © {currentYear} EXAMVERIFY SYSTEMS. ALL RIGHTS RESERVED.
        </p>
        <p className="text-[10px] tracking-widest font-semibold text-[#f2f0e9]/30 uppercase">
          Crafted with exactitude.
        </p>
      </div>
    </footer>
  );
};
