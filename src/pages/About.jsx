import { motion } from 'framer-motion';
import { INITI_EASE, useMotionVariants } from '../lib/motion';

export default function About() {
    const v = useMotionVariants();
    return (
        <div className="bg-[#f2f0e9] min-h-screen pt-40 pb-20 px-6 lg:px-12 font-body text-charcoal">
            <div className="max-w-[1000px] mx-auto">
                <motion.div initial="hidden" animate="visible" variants={v.staggerContainer}>
                    <motion.div variants={v.slideUpReveal} className="inline-flex justify-center flex items-center mb-6">
                        <span className="px-5 py-2 rounded-full border border-charcoal/30 text-charcoal text-xs font-bold uppercase tracking-widest bg-charcoal/5">
                            Protocol Genesis
                        </span>
                    </motion.div>
                    <motion.h1 variants={v.slideUpReveal} className="text-5xl lg:text-[5rem] font-heading leading-tight tracking-tight mb-8">
                        The Architecture of <br /> Trust.
                    </motion.h1>
                    <motion.p variants={v.slideUpReveal} className="text-xl text-charcoal-light leading-[1.7] mb-16 max-w-2xl">
                        We are replacing anxiety-inducing manual exam validations with an open standard built on cryptographic immutability and calm algorithmic design.
                    </motion.p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: INITI_EASE }} className="bg-white p-10 lg:p-16 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(41,40,38,0.05)] border border-charcoal/10">
                    <h2 className="text-3xl font-heading mb-6">Our Mission</h2>
                    <p className="text-lg text-charcoal-light leading-[1.8] mb-8">
                        Historically, academic clearance has been handled using disjointed spreadsheets, stamped papers, and high-friction queues. We approach examination security not merely as a technical problem, but as a critical infrastructure challenge that requires sub-second execution without intimidation.
                    </p>
                    <p className="text-lg text-charcoal-light leading-[1.8]">
                        By leveraging edge-computed validation and PostgreSQL Row-Level Security, we decouple the validation of an identity from the environmental chaos of an examination hall.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
