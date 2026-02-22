import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Zap, Building2, CheckCircle } from 'lucide-react';
import { INITI_EASE, useMotionVariants } from '../lib/motion';

export default function Pricing() {
    const v = useMotionVariants();
    return (
        <div className="bg-[#f2f0e9] min-h-screen pt-40 pb-32 px-6 lg:px-12 font-body text-charcoal">
            <div className="max-w-[1200px] mx-auto text-center mb-24">
                <motion.div initial="hidden" animate="visible" variants={v.staggerContainer}>
                    <motion.div variants={v.slideUpReveal} className="inline-flex justify-center flex items-center mb-6">
                        <span className="px-5 py-2 rounded-full border border-charcoal/30 text-charcoal text-xs font-bold uppercase tracking-widest bg-charcoal/5">
                            Acquisition
                        </span>
                    </motion.div>
                    <motion.h1 variants={v.slideUpReveal} className="text-5xl lg:text-[5.5rem] font-heading leading-tight tracking-tight mb-8">
                        Deploy Institutional <br /> Security.
                    </motion.h1>
                    <motion.p variants={v.slideUpReveal} className="text-xl text-charcoal-light leading-[1.7] max-w-2xl mx-auto">
                        Procure the complete validation stack. Transparent scaling optimized for both targeted department deployments and massive academic environments.
                    </motion.p>
                </motion.div>
            </div>

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                {/* Department Node Tier */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: INITI_EASE }}
                    className="bg-white p-10 lg:p-14 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(41,40,38,0.03)] border border-charcoal/10 relative group overflow-hidden flex flex-col"
                >
                    <div className="w-16 h-16 bg-[#f2f0e9] rounded-2xl flex items-center justify-center border border-charcoal/10 mb-10">
                        <Zap className="w-7 h-7 text-charcoal" />
                    </div>
                    <h2 className="text-4xl font-heading mb-4 text-charcoal">Department Node</h2>
                    <p className="text-charcoal-light text-lg mb-8 leading-[1.7]">
                        Rapid deployment for single faculties aiming to digitize their clearance flow.
                    </p>
                    <div className="text-5xl font-heading mb-10 text-charcoal tracking-tighter">
                        $4,500 <span className="text-base text-charcoal-light font-body font-normal tracking-wide">/yr</span>
                    </div>

                    <div className="flex flex-col gap-4 mb-16 flex-1">
                        {['Up to 5,000 active student nodes', 'Standard Scanner Application Access', 'Core Row-Level DB Security', 'Email Validation Support'].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-charcoal opacity-80" strokeWidth={2} />
                                <span className="text-charcoal-light text-base leading-none mt-1">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <button className="w-full bg-[#f2f0e9] text-charcoal font-medium py-5 rounded-full hover:bg-charcoal hover:text-white transition-colors duration-500 ease-organic tracking-wide flex items-center justify-center gap-2 group-hover:shadow-soft">
                        Initiate Deployment <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </motion.div>

                {/* Core Institutional Tier */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: INITI_EASE, delay: 0.15 }}
                    className="bg-charcoal text-[#f2f0e9] p-10 lg:p-14 rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(41,40,38,0.15)] relative flex flex-col"
                >
                    <div className="absolute top-0 right-10 bg-charcoal px-6 py-2 rounded-b-xl text-xs font-bold tracking-widest text-[#f2f0e9] uppercase shadow-lg">
                        Recommended
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-10">
                        <Building2 className="w-7 h-7 text-[#f2f0e9]" />
                    </div>
                    <h2 className="text-4xl font-heading mb-4 text-white">Institutional Core</h2>
                    <p className="text-[#f2f0e9]/60 text-lg mb-8 leading-[1.7]">
                        The full centralized ledger architecture for entire universities and campus blocks.
                    </p>
                    <div className="text-5xl font-heading mb-10 text-white tracking-tighter">
                        $18,000 <span className="text-base text-[#f2f0e9]/40 font-body font-normal tracking-wide">/yr</span>
                    </div>

                    <div className="flex flex-col gap-4 mb-16 flex-1">
                        {['Unlimited active student nodes', 'Full Edge-Environment API Access', 'Custom Hardware Fallback Integrity', 'Dedicated 24/7 SL Agreement', 'On-premise Cryptographic Keys'].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-charcoal opacity-90" strokeWidth={2} />
                                <span className="text-[#f2f0e9]/70 text-base leading-none mt-1">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <button className="w-full bg-charcoal text-[#f2f0e9] font-medium py-5 rounded-full hover:bg-charcoal transition-colors duration-500 tracking-wide flex items-center justify-center gap-2 hover:shadow-[0_20px_40px_-10px_rgba(204,125,99,0.3)]">
                        Contact Architecture Sales <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
