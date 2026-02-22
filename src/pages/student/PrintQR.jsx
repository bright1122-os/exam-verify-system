import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, QrCode, CheckCircle, AlertTriangle, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { PageTransition } from '../../components/layout/PageTransition';
import { QRCodeSVG } from 'qrcode.react';
import { encryptQRData } from '../../utils/crypto';

export default function PrintQR() {
  const { user } = useStore();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setStudentData(data);
        }
      } catch (error) {
        console.error('Fetch QR error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print(); // Quick print dialog for PDF saving
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f2f0e9] font-body text-charcoal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
          <span className="text-lg font-medium text-charcoal-light">Authorizing documents...</span>
        </div>
      </div>
    );
  }

  // Generate Encrypted QR Payload
  const qrPayloadRaw = {
    id: studentData?.id,
    matric: studentData?.matric_number,
    generatedAt: new Date().toISOString(),
    verifier: 'exam-verify-system'
  };

  const encryptedPayload = studentData ? encryptQRData(qrPayloadRaw) : '';

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-[6rem])] bg-[#f2f0e9] py-12 px-6 lg:px-8 font-body text-charcoal print:bg-white print:py-0 flex flex-col items-center">

        {/* Back Link */}
        <div className="w-full max-w-lg mb-8">
          <Link
            to="/student/dashboard"
            className="no-print inline-flex items-center gap-2 text-charcoal-light hover:text-charcoal font-medium text-sm transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>

        {/* Editorial Certificate (Pass) */}
        <div className="w-full max-w-lg relative perspective-1000 print:max-w-none print:shadow-none">

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'organic' }}
            className="bg-white rounded-[2.5rem] p-10 lg:p-12 shadow-float border border-charcoal/10 relative overflow-hidden print:border-none print:rounded-none"
          >
            {/* Elegant Background Texture / Shape */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-charcoal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none print:hidden" />

            {/* Header */}
            <div className="flex justify-between items-start mb-12 border-b border-[#f2f0e9] pb-8">
              <div>
                <div className="flex items-center gap-3 mb-2 opacity-60">
                  <Shield className="w-4 h-4 text-charcoal" />
                  <span className="text-sm font-semibold uppercase tracking-widest text-charcoal">Official Verification</span>
                </div>
                <h1 className="text-4xl font-heading text-charcoal leading-none">Examination Pass</h1>
              </div>
              <div className="w-12 h-12 rounded-full border border-sage/30 bg-sage/5 flex items-center justify-center shadow-soft">
                <CheckCircle className="w-5 h-5 text-sage" />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-8 sm:gap-12 items-center sm:items-start mb-12">
              {/* Cryptographic Key (QR) */}
              <div className="flex-shrink-0 relative">
                <div className="relative z-10 p-2 bg-white rounded-3xl shadow-soft border border-[#f2f0e9]/50">
                  {studentData?.qr_generated ? (
                    <div className="overflow-hidden rounded-2xl">
                      <QRCodeSVG value={encryptedPayload || ''} size={160} level="H" includeMargin={true} />
                    </div>
                  ) : (
                    <div className="w-[160px] h-[160px] rounded-2xl border border-dashed border-charcoal/20 flex flex-col items-center justify-center text-charcoal-light bg-[#f2f0e9]/30">
                      <AlertTriangle strokeWidth={1.5} className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Pending Output</span>
                    </div>
                  )}
                </div>
                {/* Absolute positioning badge for tech detail */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full whitespace-nowrap shadow-soft z-20 print:hidden">
                  AES-256 SYNC
                </div>
              </div>

              {/* Candidate Information */}
              <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-widest text-charcoal-light mb-2">Authenticated Identity</span>
                <h2 className="text-2xl font-heading text-charcoal mb-4">{user?.user_metadata?.name || 'Authorized Scholar'}</h2>

                <div className="space-y-3 w-full max-w-[200px] mx-auto sm:mx-0">
                  <div className="flex justify-between items-center border-b border-charcoal/10 pb-2">
                    <span className="text-xs text-charcoal-light">Identifier</span>
                    <span className="text-sm font-mono font-medium text-charcoal">{studentData?.matric_number || 'Pending'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-charcoal/10 pb-2">
                    <span className="text-xs text-charcoal-light">Level</span>
                    <span className="text-sm font-medium text-charcoal">{studentData?.level || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="text-xs text-charcoal-light">Department</span>
                    <span className="text-sm font-medium text-charcoal">{studentData?.department || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clearance Notice */}
            <div className="bg-[#f2f0e9]/50 rounded-2xl p-6 border border-charcoal/10 relative">
              <div className="w-1.5 absolute left-0 top-6 bottom-6 bg-charcoal rounded-r-full" />
              <p className="text-sm text-charcoal-light leading-relaxed pl-2 font-medium">
                This document holds a mathematically bound signature uniquely tied to your profile. Present this digital artifact at the examination doorway for frictionless clearance.
              </p>
            </div>

            {/* Print Footer Watermark */}
            <div className="mt-12 text-center opacity-40 text-[10px] font-medium tracking-widest uppercase">
              Authenticated & Secured by ExamVerify Architecture
            </div>

          </motion.div>

          {/* Quick Actions (Floating Pill Drawer) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="no-print flex justify-center mt-10"
          >
            <div className="bg-white p-2 rounded-full shadow-float border border-charcoal/10 flex gap-2">
              <button onClick={handleDownload} className="px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#f2f0e9] text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> Save Copy
              </button>
              <button onClick={handlePrint} className="bg-charcoal text-[#f2f0e9] px-6 py-3 rounded-full flex items-center gap-2 hover:bg-charcoal-light transition-colors text-sm font-medium">
                <Printer className="w-4 h-4" /> Print Ticket
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}
