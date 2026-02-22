import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { INITI_EASE, useMotionVariants } from '../lib/motion';

export default function Contact() {
    const v = useMotionVariants();
    return (
        <div className="bg-[#f2f0e9] min-h-screen pt-40 pb-32 px-6 lg:px-12 font-body text-charcoal">
            <div className="max-w-[1200px] mx-auto text-center mb-24">
                <motion.div initial="hidden" animate="visible" variants={v.staggerContainer}>
                    <motion.div variants={v.slideUpReveal} className="inline-flex justify-center flex items-center mb-6">
                        <span className="px-5 py-2 rounded-full border border-charcoal/30 text-charcoal text-xs font-bold uppercase tracking-widest bg-charcoal/5">
                            Secure Communications
                        </span>
                    </motion.div>
                    <motion.h1 variants={v.slideUpReveal} className="text-5xl lg:text-[5.5rem] font-heading leading-tight tracking-tight mb-8">
                        Establish <br /> Connection.
                    </motion.h1>
                    <motion.p variants={v.slideUpReveal} className="text-xl text-charcoal-light leading-[1.7] max-w-2xl mx-auto">
                        Schedule a technical walkthrough of the verification architecture or request support for an active deployment node.
                    </motion.p>
                </motion.div>
            </div>

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">

                {/* Contact Info Sidebar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: INITI_EASE }}
                    className="col-span-1 md:col-span-5 flex flex-col gap-8"
                >
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(41,40,38,0.03)] border border-charcoal/10 flex items-start gap-5 group">
                        <div className="w-12 h-12 rounded-xl bg-[#f2f0e9] flex items-center justify-center border border-charcoal/10 group-hover:border-charcoal/30 transition-colors">
                            <Mail className="w-5 h-5 text-charcoal" />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading text-charcoal mb-1">Architecture Desk</h3>
                            <p className="text-charcoal-light text-sm mb-3">Direct inquiries & deployments</p>
                            <a href="mailto:deploy@examverify.com" className="text-sm font-semibold tracking-wide text-charcoal border-b border-charcoal/20 hover:border-charcoal hover:text-charcoal pb-0.5 transition-colors">
                                deploy@examverify.com
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(41,40,38,0.03)] border border-charcoal/10 flex items-start gap-5 group">
                        <div className="w-12 h-12 rounded-xl bg-[#f2f0e9] flex items-center justify-center border border-charcoal/10 group-hover:border-charcoal/30 transition-colors">
                            <Phone className="w-5 h-5 text-charcoal" />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading text-charcoal mb-1">Institutional Support</h3>
                            <p className="text-charcoal-light text-sm mb-3">Active nodes 24/7 SL</p>
                            <a href="tel:+18005550199" className="text-sm font-semibold tracking-wide text-charcoal border-b border-charcoal/20 hover:border-charcoal hover:text-charcoal pb-0.5 transition-colors">
                                +1 (800) 555-0199
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(41,40,38,0.03)] border border-charcoal/10 flex items-start gap-5 group">
                        <div className="w-12 h-12 rounded-xl bg-[#f2f0e9] flex items-center justify-center border border-charcoal/10 group-hover:border-charcoal/30 transition-colors">
                            <MapPin className="w-5 h-5 text-charcoal" />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading text-charcoal mb-1">Global Headquarters</h3>
                            <p className="text-charcoal-light text-sm mb-1">Floor 42, Terminus Building</p>
                            <p className="text-charcoal-light text-sm">San Francisco, CA 94105</p>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: INITI_EASE, delay: 0.15 }}
                    className="col-span-1 md:col-span-7 bg-charcoal p-10 lg:p-14 rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(41,40,38,0.15)] text-[#f2f0e9]"
                >
                    <h3 className="text-3xl font-heading mb-2 text-white">Transmit Request</h3>
                    <p className="text-[#f2f0e9]/60 mb-10 text-sm">Secure transmission channel strictly monitored by our deployment ops.</p>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#f2f0e9]/50 mb-3">Identity Name</label>
                                <input type="text" placeholder="Dr. Alan Turing" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-charcoal/50 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#f2f0e9]/50 mb-3">Institution</label>
                                <input type="text" placeholder="University Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-charcoal/50 transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#f2f0e9]/50 mb-3">Institutional Email</label>
                            <input type="email" placeholder="dean@university.edu" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-charcoal/50 transition-colors" />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#f2f0e9]/50 mb-3">Transmission Payload</label>
                            <textarea rows="4" placeholder="Request details..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-charcoal/50 transition-colors resize-none"></textarea>
                        </div>

                        <button type="button" className="group relative w-full overflow-hidden bg-charcoal text-[#f2f0e9] py-5 rounded-2xl font-medium transition-all duration-700 hover:shadow-[0_20px_40px_-10px_rgba(204,125,99,0.3)]">
                            <div className="relative z-10 flex items-center justify-center gap-3 text-sm uppercase tracking-widest font-semibold">
                                Engage Connection <MessageSquare className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                            <div className="absolute inset-0 bg-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-organic z-0" />
                        </button>
                    </form>
                </motion.div>

            </div>
        </div>
    );
}
