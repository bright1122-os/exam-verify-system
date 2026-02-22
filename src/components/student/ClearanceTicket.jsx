import { motion } from 'framer-motion';
import { CheckCircle, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { encryptQRData } from '../../utils/crypto';
import { QRCodeSVG } from 'qrcode.react';
import { INITI_EASE } from '../../lib/motion';

export const ClearanceTicket = ({ student, status, onActionClick }) => {
    const isCleared = status === 'verified';

    // Generate Encrypted QR Payload if cleared
    const qrPayloadRaw = {
        id: student?.id,
        matric: student?.matric_number,
        generatedAt: new Date().toISOString(),
        verifier: 'exam-verify-system'
    };

    const encryptedPayload = isCleared ? encryptQRData(qrPayloadRaw) : '';

    return (
        <motion.div
            layoutId={`ticket-${student?.id || 'new'}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: INITI_EASE }}
            className="w-full max-w-lg mx-auto container-editorial bg-[#f2f0e9] relative overflow-hidden shadow-[0_30px_70px_-20px_rgba(80,40,20,0.1)]"
        >
            {/* Elegant Background Texture / Flow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-charcoal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            {/* Header Block */}
            <div className={`relative z-10 px-8 py-6 border-b border-charcoal/5 flex justify-between items-center bg-white/40 backdrop-blur-sm`}>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-widest text-charcoal-light flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 opacity-60" /> Examination Pass
                    </span>
                    <span className="text-2xl font-heading tracking-tight text-charcoal">
                        {student?.faculty ? `${student.faculty.substring(0, 3)}-Hall` : 'Status Pending'}
                    </span>
                </div>
                {isCleared ? (
                    <div className="w-12 h-12 rounded-full border border-sage/30 bg-sage/5 flex items-center justify-center shadow-soft">
                        <CheckCircle className="text-sage w-5 h-5" strokeWidth={2} />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full border border-rust/20 bg-rust/5 flex items-center justify-center shadow-soft">
                        <Lock className="text-rust/60 w-5 h-5" strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {/* Identity Block */}
            <div className="relative z-10 px-8 py-10 flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left bg-white/20">
                <div className="w-24 h-24 rounded-[1.5rem] border border-charcoal/10 bg-white shadow-soft overflow-hidden shrink-0 flex items-center justify-center text-charcoal-light">
                    {student?.photo_url ? (
                        <img src={student.photo_url} alt="Profile" className="w-full h-full object-cover grayscale opacity-90 transition-opacity hover:opacity-100" />
                    ) : (
                        <span className="text-xs font-medium">No Image</span>
                    )}
                </div>
                <div className="flex flex-col justify-center h-full">
                    <h2 className="text-3xl font-heading text-charcoal leading-none mb-3">
                        {student?.name || 'Authorized Scholar'}
                    </h2>
                    <span className="font-mono text-sm tracking-wide text-charcoal-light mb-4">
                        {student?.matric_number || 'Identification Pending'}
                    </span>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        <span className="text-xs font-semibold px-3 py-1.5 bg-charcoal text-[#f2f0e9] rounded-full">Level {student?.level || 'N/A'}</span>
                        <span className="text-xs font-semibold px-3 py-1.5 border border-charcoal/10 text-charcoal rounded-full">{student?.department || 'Department N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Pass Generation Zone */}
            <div className={`
                relative z-10 px-8 py-12 flex flex-col items-center justify-center min-h-[250px]
                ${isCleared ? 'bg-white/60' : 'bg-charcoal/5'}
            `}>
                {isCleared ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 1.2, ease: INITI_EASE }}
                        className="flex flex-col items-center"
                    >
                        <div className="p-3 bg-white rounded-3xl shadow-float border border-[#f2f0e9]/50 relative z-20 mb-8 cursor-pointer hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" onClick={onActionClick}>
                            <div className="overflow-hidden rounded-2xl pointer-events-none">
                                <QRCodeSVG value={encryptedPayload || ''} size={150} level="H" includeMargin={true} />
                            </div>
                        </div>
                        <button onClick={onActionClick} className="btn-clay shadow-none hover:shadow-soft text-sm bg-white px-6 py-3 min-w-[200px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                            View Official Pass <ArrowRight className="w-4 h-4 ml-1 opacity-60" />
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center text-center w-full max-w-[280px]">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-soft text-charcoal-light">
                            <Lock className="w-5 h-5 opacity-50" />
                        </div>
                        <span className="text-lg font-heading text-charcoal mb-2">
                            Clearance Required
                        </span>
                        <p className="text-sm text-charcoal-light mb-8 font-medium">Complete your institutional profile and verify financial clearance to generate your access token.</p>
                        <button onClick={onActionClick} className="btn-primary w-full shadow-soft hover:shadow-float text-sm py-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                            Initialize Clearance
                        </button>
                    </div>
                )}
            </div>

            {/* Soft decorative bottom edge */}
            <div className="h-2 w-full bg-gradient-to-r from-charcoal via-sage to-charcoal opacity-20" />
        </motion.div>
    );
};
