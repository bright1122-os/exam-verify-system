import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, MoveRight, Shield, Fingerprint, Activity, Clock, Layers } from 'lucide-react';
import { useMotionVariants, INITI_EASE } from '../lib/motion';

export default function Home() {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const heroTextY = useTransform(scrollY, [0, 1000], [0, shouldReduceMotion ? 0 : 300]);
  const imageY = useTransform(scrollY, [0, 1000], [0, shouldReduceMotion ? 0 : -100]);

  const v = useMotionVariants();

  return (
    <main className="bg-[#f2f0e9] min-h-screen overflow-hidden text-charcoal font-body selection:bg-charcoal selection:text-[#f2f0e9]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-charcoal focus:text-white z-50">
        Skip to main content
      </a>

      {/* ── 1. Hero Section (Parallax Authority) ── */}
      <section id="main-content" className="relative min-h-screen flex flex-col pt-32 lg:pt-48 pb-20 px-6 lg:px-12 w-full max-w-[1600px] mx-auto">
        <motion.div className="relative z-0" style={{ y: heroTextY }}>
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: INITI_EASE }}
            className="text-[clamp(4.5rem,14vw,16rem)] font-heading leading-[0.85] tracking-tighter text-charcoal -ml-2 lg:-ml-4 mb-4 lg:mb-16"
          >
            Clearance <br /> Artistry.
          </motion.h1>
        </motion.div>

        <div className="grid grid-cols-12 gap-8 lg:gap-16 relative z-10 items-end mt-8 lg:mt-24">
          <motion.div
            className="col-span-12 lg:col-span-5 flex flex-col"
            variants={v.staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={v.slideUpReveal} className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-charcoal/60 mb-8 border-b border-charcoal/10 pb-4 w-max">
              <Sparkles className="w-4 h-4" />
              Academic Security Protocol
            </motion.div>

            <motion.p variants={v.slideUpReveal} className="text-xl sm:text-2xl text-charcoal font-body max-w-md leading-[1.6] mb-12">
              We eliminate the friction of examination security, so you can focus entirely on your academic pursuit. Secure, quiet, and profoundly reliable.
            </motion.p>

            <motion.div variants={v.slideUpReveal} className="flex flex-col sm:flex-row gap-6 items-center">
              <Link to="/auth/signup?role=student" className="group relative overflow-hidden bg-charcoal text-[#f2f0e9] px-10 py-5 rounded-full font-medium transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] flex items-center gap-3 w-full sm:w-auto justify-center">
                <span className="relative z-10 text-[15px] uppercase tracking-wider">Initialize Profile</span>
                <MoveRight className="w-4 h-4 relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                <div className="absolute inset-0 bg-clay translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="col-span-12 lg:col-start-8 lg:col-span-5 mt-16 lg:mt-0"
            style={{ y: imageY }}
            initial="hidden"
            animate="visible"
            variants={v.scaleReveal}
          >
            <div className="relative w-full aspect-[4/5] overflow-hidden group">
              <img
                src="/academic_verification_mock.png"
                alt="Minimalist verification interface resting gently near an acoustic scanner"
                className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-[1.02] group-hover:scale-100"
                loading="eager"
              />
            </div>
            <figcaption className="sr-only">A photorealistic editorial shot of a glowing ID hovering over a scanner.</figcaption>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Feature Architecture (Zero Friction) ── */}
      <section className="py-40 lg:py-64 px-6 lg:px-12 bg-white relative border-y border-charcoal/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-12 lg:gap-16">
          <motion.article
            className="col-span-12 lg:col-span-6 flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={v.staggerContainer}
          >
            <motion.h2 variants={v.slideUpReveal} className="text-[clamp(3.5rem,10vw,7rem)] font-heading leading-[0.9] tracking-tighter text-charcoal mb-10">
              Zero <br /> Friction.
            </motion.h2>
            <motion.p variants={v.slideUpReveal} className="text-xl sm:text-2xl text-charcoal/70 leading-[1.6] max-w-lg mb-12">
              Walk to the hall, present your digital cryptographic pass, and proceed. A highly optimized handshake verifies your identity in under ~300ms.
            </motion.p>
            <motion.div variants={v.slideUpReveal} className="w-full h-px bg-charcoal/10 relative overflow-hidden">
              <motion.div className="absolute top-0 left-0 h-full w-full bg-charcoal origin-left" variants={v.expandX} />
            </motion.div>
            <motion.div variants={v.slideUpReveal} className="flex justify-between items-center mt-6 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-charcoal/50">
              <span>01</span>
              <span>Sub-second Validation</span>
            </motion.div>
          </motion.article>

          <motion.article
            className="col-span-12 lg:col-span-5 lg:col-start-8 mt-16 lg:mt-64 flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={v.staggerContainer}
          >
            <motion.h2 variants={v.slideUpReveal} className="text-[clamp(3.5rem,10vw,7rem)] font-heading leading-[0.9] tracking-tighter text-charcoal mb-10">
              Admin <br /> Clarity.
            </motion.h2>
            <motion.p variants={v.slideUpReveal} className="text-xl sm:text-2xl text-charcoal/70 leading-[1.6] max-w-lg mb-12">
              A calm, high-efficiency interface for examiners. Process hundreds of students seamlessly without specialized, unreliable hardware.
            </motion.p>
            <motion.div variants={v.slideUpReveal} className="w-full h-px bg-charcoal/10 relative overflow-hidden">
              <motion.div className="absolute top-0 left-0 h-full w-full bg-charcoal origin-left" variants={v.expandX} />
            </motion.div>
            <motion.div variants={v.slideUpReveal} className="flex justify-between items-center mt-6 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-charcoal/50">
              <span>02</span>
              <span>Institutional Control</span>
            </motion.div>
          </motion.article>
        </div>
      </section>

      {/* ── 3. Application Flow ("How It Works") ── */}
      <section className="py-40 lg:py-64 px-6 lg:px-12 w-full max-w-[1600px] mx-auto">
        <motion.div
          className="grid grid-cols-12 gap-8 lg:gap-16 border-b border-charcoal/10 pb-16 lg:pb-32 mb-16 lg:mb-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={v.staggerContainer}
        >
          <motion.div variants={v.slideUpReveal} className="col-span-12 lg:col-span-4">
            <h3 className="text-2xl font-semibold tracking-[0.1em] uppercase text-charcoal/50 mb-4 font-mono">Operations</h3>
            <h2 className="text-5xl lg:text-7xl font-heading leading-[0.9] tracking-tighter text-charcoal">The Flow.</h2>
          </motion.div>
          <motion.div variants={v.slideUpReveal} className="col-span-12 lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-xl text-charcoal/70 leading-[1.6]">
              From enrollment to hall entry, the architecture isolates processes sequentially to guarantee total data integrity and absolute zero queue blockage.
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
          {[
            { step: '01', title: 'Student Onboarding', desc: 'Secure institutional identity validation directly from the central database, completely paperless.', icon: Fingerprint },
            { step: '02', title: 'Token Issuance', desc: 'A volatile, encrypted QR token is generated locally upon final financial & academic clearance.', icon: Layers },
            { step: '03', title: 'Optical Verification', desc: 'Examiner optical scanning instantly verifies the token against the core, recording the ledger permanently.', icon: Activity }
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={v.slideUpReveal}
              custom={i}
            >
              <item.icon className="w-8 h-8 text-charcoal/30 mb-8" strokeWidth={1.5} />
              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-charcoal/50 mb-4">{item.step}</div>
              <h4 className="text-3xl font-heading text-charcoal mb-6">{item.title}</h4>
              <p className="text-lg text-charcoal/70 leading-[1.7]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. Trust & Institutional Credibility ── */}
      <section className="py-40 lg:py-64 bg-charcoal text-[#f2f0e9] px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            className="col-span-12 lg:col-span-6 flex flex-col justify-center"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={v.staggerContainer}
          >
            <motion.div variants={v.slideUpReveal} className="w-16 h-16 rounded-full bg-[#f2f0e9]/10 flex items-center justify-center mb-12">
              <Shield className="w-6 h-6 text-[#f2f0e9]" />
            </motion.div>
            <motion.h2 variants={v.slideUpReveal} className="text-[clamp(4rem,10vw,6.5rem)] font-heading leading-[0.9] tracking-tighter text-[#f2f0e9] mb-12">
              Absolute <br /> Authority.
            </motion.h2>
            <motion.p variants={v.slideUpReveal} className="text-xl sm:text-2xl text-[#f2f0e9]/60 leading-[1.6] max-w-lg mb-16">
              Powered by an unalterable PostgreSQL backbone with strict Row-Level Security, guaranteeing that clearances cannot be forged, transferred, or bypassed.
            </motion.p>
            <motion.div variants={v.slideUpReveal} className="grid grid-cols-2 gap-8 w-full max-w-sm">
              <div>
                <div className="text-4xl font-heading mb-2 text-[#f2f0e9]">99.9%</div>
                <div className="text-xs uppercase tracking-widest text-[#f2f0e9]/50 font-semibold">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-4xl font-heading mb-2 text-[#f2f0e9]">SHA-256</div>
                <div className="text-xs uppercase tracking-widest text-[#f2f0e9]/50 font-semibold">Token Encoding</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Abstract representation of ledger log */}
          <motion.div
            className="col-span-12 lg:col-span-5 lg:col-start-8 mt-12 lg:mt-0 flex flex-col justify-center"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={v.staggerContainer}
          >
            <div className="border border-[#f2f0e9]/10 rounded-3xl p-8 lg:p-12 bg-[#f2f0e9]/[0.02]">
              {[1, 2, 3].map((entry) => (
                <motion.div key={entry} variants={v.slideUpReveal} className="flex justify-between items-center py-6 border-b border-[#f2f0e9]/5 last:border-0 last:pb-0 first:pt-0">
                  <div className="flex gap-4 items-center">
                    <Clock className="w-4 h-4 text-[#f2f0e9]/30" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#f2f0e9]/90">Validation Signed</span>
                      <span className="text-xs text-[#f2f0e9]/40 font-mono mt-1">UUID-{entry}9A-40F1</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-sage/20 text-sage rounded-full text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                    Secure
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. Value Differentiation CTA ── */}
      <section className="py-40 lg:py-56 bg-white px-6 lg:px-12 flex flex-col justify-center items-center text-center">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={v.staggerContainer}
          className="w-full max-w-5xl flex flex-col items-center"
        >
          <motion.h2 variants={v.slideUpReveal} className="text-[clamp(4rem,10vw,8rem)] font-heading text-charcoal mb-12 tracking-tighter leading-[0.9]">
            The standard <br /> for academia.
          </motion.h2>

          <motion.p variants={v.slideUpReveal} className="text-xl sm:text-2xl text-charcoal/60 max-w-2xl font-body leading-[1.6] mb-20">
            Step away from manual paperwork and queue-induced anxiety. Embrace a deeply secure, beautifully simple integration today.
          </motion.p>

          <motion.div variants={v.slideUpReveal} className="flex flex-col sm:flex-row gap-6 items-center">
            <Link to="/auth/signup?role=student" className="group relative overflow-hidden bg-charcoal text-[#f2f0e9] px-12 py-6 rounded-full font-medium transition-transform duration-700 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-charcoal">
              <span className="relative z-10 text-[15px] uppercase tracking-wider">Enroll as Student</span>
              <div className="absolute inset-0 bg-clay translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
            </Link>
            <Link to="/auth/signup?role=examiner" className="px-12 py-6 text-charcoal font-medium hover:opacity-60 transition-opacity tracking-widest uppercase text-[13px] border border-charcoal/20 rounded-full hover:bg-charcoal/5">
              Institution Staff
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </main>
  );
}
