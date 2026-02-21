import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, MoveRight, Users, CheckCircle, Smartphone } from 'lucide-react';
import { INITI_EASE, REVEAL_VARIANTS, STAGGER_CONTAINER } from '../lib/motion';

export default function Home() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <div className="bg-parchment min-h-screen overflow-hidden">

      {/* ── Hero Section (The Void + Parallax Depth) ── */}
      <section className="relative min-h-[90vh] bg-clay flex items-center rounded-b-[3rem] lg:rounded-b-[4rem] overflow-hidden">

        {/* Massive Parallax Typography Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          style={{ y: backgroundY }}
        >
          <span className="text-[clamp(10rem,20vw,24rem)] font-heading leading-none text-parchment opacity-5 whitespace-nowrap tracking-tighter">
            INTELLIGENT VALIDATION
          </span>
        </motion.div>

        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-20">

          {/* Asymmetrical Grid layout instead of 50/50 flex */}
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">

            <motion.div
              className="col-span-12 lg:col-span-5 flex flex-col justify-center"
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={REVEAL_VARIANTS} className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/10 text-charcoal backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-10 font-mono w-max">
                <Sparkles className="w-3.5 h-3.5 opacity-70" />
                Intelligent Verification
              </motion.div>

              <motion.h1 variants={REVEAL_VARIANTS} className="text-6xl sm:text-7xl lg:text-[6.5rem] font-heading text-parchment leading-[1.0] tracking-tighter mb-8">
                Keep <br />
                <span className="italic opacity-90 pr-4">thinking.</span>
              </motion.h1>

              <motion.p variants={REVEAL_VARIANTS} className="text-lg sm:text-xl text-parchment/80 font-body max-w-lg leading-[1.6] mb-14 tracking-wide">
                We handle the friction of examination security, so you can focus entirely on your academic pursuit. Secure, quiet, and profoundly reliable.
              </motion.p>

              <motion.div variants={REVEAL_VARIANTS} className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <Link to="/auth/signup?role=student" className="w-full sm:w-auto bg-parchment text-clay-dark px-10 py-5 rounded-full font-medium shadow-float hover:scale-[1.02] active:scale-[0.98] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-3">
                  Initialize Profile
                </Link>
                <Link to="/auth/login" className="w-full sm:w-auto px-10 py-5 text-parchment font-medium hover:bg-charcoal/10 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex justify-center items-center">
                  Sign In
                </Link>
              </motion.div>
            </motion.div>

            {/* Float right, using 7 columns but padded left to create massive negative space */}
            <motion.div
              className="col-span-12 lg:col-start-7 lg:col-span-6 w-full max-w-2xl mx-auto relative flex justify-center lg:justify-end mt-16 lg:mt-0"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.4,
                ease: INITI_EASE,
                delay: 0.3
              }}
            >
              {/* Anti-Gravity Floating Container */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [-1, -0.2, -1]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-full aspect-[4/5] max-w-[480px] rounded-[2.5rem] overflow-hidden
                            shadow-[0_30px_60px_-15px_rgba(80,40,20,0.08),_0_70px_120px_-20px_rgba(80,40,20,0.12)]
                            border border-white/10 isolate"
              >
                {/* The Mock Editorial Portrait */}
                <img
                  src="/editorial_student_portrait.png"
                  alt="Editorial thoughtful profile of a student"
                  className="w-full h-full object-cover object-center scale-[1.03]"
                />

                {/* Warm Tonal Gradient Overlay (Softens highlights, deepens shadows into clay) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#9c4c35]/25 via-transparent to-[#F5F2E9]/15 pointer-events-none mix-blend-overlay z-10" />

                {/* Soft Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(41,40,38,0.25)] pointer-events-none z-10" />
              </motion.div>

              {/* Soft Radial Glow behind the image for separation without harsh drop shadows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Feature Cards (The Narrative) ── */}
      <section className="py-40 px-6 lg:px-12 relative">
        <div className="max-w-[1400px] mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: INITI_EASE }}
            className="grid grid-cols-12 gap-8 mb-32"
          >
            <div className="col-span-12 lg:col-span-7">
              <h2 className="text-5xl lg:text-6xl font-heading text-charcoal leading-[1.1] tracking-tight mb-8">
                Designed for <br /><span className="italic text-clay">confidence.</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5 flex items-end">
              <p className="text-xl text-charcoal-light font-body leading-[1.7] max-w-md pb-2">
                Eliminating the stress of manual boarding procedures with an elegant, encrypted digital clearance system.
              </p>
            </div>
          </motion.div>

          {/* Asymmetrical Grid for Cards */}
          <div className="grid grid-cols-12 gap-8 lg:gap-12">

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: INITI_EASE }}
              className="col-span-12 lg:col-span-5 bg-white p-12 lg:p-16 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(41,40,38,0.03)] flex flex-col justify-between group h-full min-h-[480px]"
            >
              <div>
                <div className="w-16 h-16 rounded-full bg-parchment flex items-center justify-center mb-10 border border-parchment-dark">
                  <CheckCircle className="w-7 h-7 text-clay" strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-heading text-charcoal mb-6 leading-tight">Zero-friction <br />Entry</h3>
                <p className="text-charcoal-light font-body text-lg leading-[1.7] max-w-sm">
                  Walk to the hall, present your digital pass, and proceed. Total validation takes less than a second.
                </p>
              </div>
              <div className="pt-12 mt-12 border-t border-parchment-dark flex items-center justify-between text-charcoal font-medium text-sm tracking-wide">
                <span>Sub-second cryptographic validation</span>
                <MoveRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: INITI_EASE, delay: 0.15 }}
              className="col-span-12 lg:col-span-7 bg-charcoal p-12 lg:p-16 rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(41,40,38,0.1)] text-parchment flex flex-col justify-between group h-full min-h-[480px]"
            >
              <div>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-10">
                  <Smartphone className="w-7 h-7 text-parchment" strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-heading mb-6 leading-tight">The Supervisor <br />Toolkit</h3>
                <p className="text-parchment/60 font-body text-lg leading-[1.7] max-w-lg">
                  A calm, high-efficiency interface for examiners to process hundred of students seamlessly without specialized hardware.
                </p>
              </div>
              <div className="pt-12 mt-12 border-t border-white/10 flex items-center justify-between font-medium text-sm tracking-wide text-parchment/80">
                <span>Empowering institutional administration</span>
                <MoveRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] text-parchment" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Sub-CTA (Gentle Push) ── */}
      <section className="py-40 bg-white rounded-t-[5rem] px-6 lg:px-8 border-t border-parchment shadow-[0_-30px_60px_rgba(41,40,38,0.02)] relative z-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

          <div className="w-24 h-24 bg-clay/5 rounded-full flex justify-center items-center mb-12 border border-clay/10">
            <Users className="w-10 h-10 text-clay" strokeWidth={1.5} />
          </div>

          <h2 className="text-6xl lg:text-[5.5rem] font-heading text-charcoal mb-10 tracking-tighter leading-none">
            Join the network.
          </h2>

          <p className="text-xl lg:text-2xl text-charcoal-light max-w-2xl font-body leading-[1.6] mb-16 tracking-wide">
            Step away from manual paperwork and queue-induced anxiety. Embrace a deeply secure, beautifully simple academic process today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center w-full max-w-lg mx-auto">
            <Link to="/auth/signup?role=student" className="w-full bg-clay text-parchment py-6 rounded-full font-medium shadow-none hover:shadow-[0_20px_40px_-10px_rgba(204,125,99,0.3)] hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-wide">
              Enroll as Student
            </Link>
            <Link to="/auth/signup?role=examiner" className="w-full bg-parchment text-charcoal py-6 rounded-full font-medium shadow-none hover:shadow-[0_20px_40px_-10px_rgba(41,40,38,0.05)] border border-parchment-dark hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-wide">
              Institution Staff
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
