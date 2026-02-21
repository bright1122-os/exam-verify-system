import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, MoveRight, Users } from 'lucide-react';
import { INITI_EASE, REVEAL_VARIANTS, STAGGER_CONTAINER } from '../lib/motion';

export default function Home() {
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 1000], [0, 300]);
  const imageY = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <div className="bg-[#f2f0e9] min-h-screen overflow-hidden text-charcoal font-body">

      {/* ── Intiri-Style Hero Section (Unified Background, Massive Scale) ── */}
      <section className="relative min-h-screen flex flex-col pt-32 lg:pt-48 pb-20 px-6 lg:px-12 w-full max-w-[1600px] mx-auto">

        {/* Massive Parallax Hero Typography */}
        <motion.div
          className="relative z-0"
          style={{ y: heroTextY }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: INITI_EASE }}
            className="text-[clamp(5rem,14vw,16rem)] font-heading leading-[0.85] tracking-tighter text-charcoal -ml-2 lg:-ml-4 mb-16"
          >
            Clearance <br /> Artistry.
          </motion.h1>
        </motion.div>

        {/* Asymmetrical Grid For Content & Imagery */}
        <div className="grid grid-cols-12 gap-8 lg:gap-16 relative z-10 items-end mt-8 lg:mt-24">

          {/* Left Narrative */}
          <motion.div
            className="col-span-12 lg:col-span-5 flex flex-col"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={REVEAL_VARIANTS} className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] uppercase text-charcoal/60 mb-8 border-b border-charcoal/10 pb-4 w-max">
              <Sparkles className="w-4 h-4" />
              Academic Security
            </motion.div>

            <motion.p variants={REVEAL_VARIANTS} className="text-xl sm:text-2xl text-charcoal font-body max-w-md leading-[1.6] mb-12">
              We eliminate the friction of examination security, so you can focus entirely on your academic pursuit. Secure, quiet, and profoundly reliable.
            </motion.p>

            <motion.div variants={REVEAL_VARIANTS} className="flex flex-col sm:flex-row gap-6 items-center">
              <Link to="/auth/signup?role=student" className="group relative overflow-hidden bg-charcoal text-[#f2f0e9] px-10 py-5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] flex items-center gap-3">
                <span className="relative z-10 text-[15px] uppercase tracking-wider">Initialize Profile</span>
                <MoveRight className="w-4 h-4 relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                <div className="absolute inset-0 bg-clay translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
              </Link>
              <Link to="/auth/login" className="px-8 py-4 text-charcoal font-medium hover:opacity-60 transition-opacity tracking-widest uppercase text-sm">
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Floating Image (Parallax offset) */}
          <motion.div
            className="col-span-12 lg:col-start-8 lg:col-span-5 mt-16 lg:mt-0"
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: INITI_EASE, delay: 0.2 }}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <img
                src="/editorial_student_portrait.png"
                alt="Editorial student portrait"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-105"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Features Grid (Cardless, typography-driven) ── */}
      <section className="py-40 lg:py-64 px-6 lg:px-12 bg-white relative">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 lg:gap-16">

          <motion.div
            className="col-span-12 lg:col-span-6 flex flex-col justify-center"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: INITI_EASE }}
          >
            <h2 className="text-6xl lg:text-[7rem] font-heading leading-[0.9] tracking-tighter text-charcoal mb-12">
              Zero <br /> Friction.
            </h2>
            <p className="text-2xl text-charcoal/70 leading-[1.6] max-w-lg mb-12">
              Walk to the hall, present your digital pass, and proceed. Total validation takes less than a second.
            </p>
            <div className="w-full h-px bg-charcoal/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full w-full bg-charcoal origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: INITI_EASE, delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between items-center mt-6 text-xs font-semibold tracking-[0.2em] uppercase text-charcoal/50">
              <span>01</span>
              <span>Cryptographic Speed</span>
            </div>
          </motion.div>

          <motion.div
            className="col-span-12 lg:col-span-5 lg:col-start-8 mt-20 lg:mt-64 flex flex-col justify-center"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: INITI_EASE, delay: 0.2 }}
          >
            <h2 className="text-6xl lg:text-[7rem] font-heading leading-[0.9] tracking-tighter text-charcoal mb-12">
              Admin <br /> Clarity.
            </h2>
            <p className="text-2xl text-charcoal/70 leading-[1.6] max-w-lg mb-12">
              A calm, high-efficiency interface for examiners to process hundreds of students seamlessly without specialized hardware.
            </p>
            <div className="w-full h-px bg-charcoal/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full w-full bg-charcoal origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: INITI_EASE, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between items-center mt-6 text-xs font-semibold tracking-[0.2em] uppercase text-charcoal/50">
              <span>02</span>
              <span>Institutional Power</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Sub-CTA (Massive Footer Intro) ── */}
      <section className="py-40 lg:py-64 bg-charcoal text-[#f2f0e9] px-6 lg:px-12 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.6, ease: INITI_EASE }}
          className="w-full max-w-4xl flex flex-col items-center"
        >
          <div className="mb-12">
            <Users className="w-16 h-16 opacity-30" strokeWidth={1} />
          </div>

          <h2 className="text-7xl lg:text-[9rem] font-heading text-[#f2f0e9] mb-12 tracking-tighter leading-[0.9]">
            Join the <br /> network.
          </h2>

          <p className="text-2xl text-[#f2f0e9]/60 max-w-2xl font-body leading-[1.6] mb-20">
            Step away from manual paperwork and queue-induced anxiety. Embrace a deeply secure, beautifully simple academic process today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Link to="/auth/signup?role=student" className="group relative overflow-hidden bg-[#f2f0e9] text-charcoal px-12 py-6 rounded-full font-medium transition-all duration-700">
              <span className="relative z-10 text-[15px] uppercase tracking-wider">Enroll as Student</span>
              <div className="absolute inset-0 bg-clay translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
