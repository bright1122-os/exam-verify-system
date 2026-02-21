import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import jsQR from 'jsqr';
import { Shield, Search, X, Check, XCircle, FileWarning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { PageTransition } from '../../components/layout/PageTransition';
import { decryptQRData } from '../../utils/crypto';

export default function ScanPortal() {
  const { user } = useStore();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // success, student, message
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('scan'); // 'scan' or 'manual'
  const [manualInput, setManualInput] = useState('');

  // Verification States
  const [examHall, setExamHall] = useState('');
  const [denialReason, setDenialReason] = useState('');
  const [bottomSheetMode, setBottomSheetMode] = useState('none'); // 'none', 'approve', 'deny'

  const startCamera = useCallback(async () => {
    try {
      if (mode !== 'scan') return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
        requestAnimationFrame(tick);
      }
    } catch (err) {
      toast.error('Unable to access camera', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      console.error('Camera error:', err);
    }
  }, [mode]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setScanning(false);
  }, []);

  const tick = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleQRDetected(code.data);
        return;
      }
    }

    animationRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (mode === 'scan' && !result) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, result, startCamera, stopCamera]);

  const handleQRDetected = async (qrDataString) => {
    stopCamera();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Strong haptic feedback

    setLoading(true);
    try {
      const qrData = decryptQRData(qrDataString);
      if (!qrData) throw new Error('Cryptographic signature is invalid.');
      if (qrData.verifier !== 'exam-verify-system') throw new Error('Authority mismatch. Unrecognized issuer.');

      await verifyStudent(qrData.id);

    } catch (error) {
      setResult({
        success: false,
        message: error?.message || 'Verification completely failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setLoading(true);
    try {
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .ilike('matric_number', manualInput.trim())
        .single();

      if (error || !student) throw new Error('Identity not found in network.');

      await verifyStudent(student.id);

    } catch (error) {
      setResult({
        success: false,
        message: error?.message || 'Verification completely failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyStudent = async (studentId) => {
    const { data: student, error } = await supabase
      .from('students')
      .select(`
            *,
            profiles:profiles!user_id (full_name)
        `)
      .eq('id', studentId)
      .single();

    if (error || !student) throw new Error('Identity not found.');
    if (!student.registration_complete) throw new Error('Registration is incomplete.');
    if (!student.payment_verified) throw new Error('Financial clearance pending.');
    if (!student.qr_generated) throw new Error('Access pass not actively generated.');

    setResult({
      success: true,
      student: {
        ...student,
        name: student.profiles?.full_name || 'Student Identity'
      },
      message: 'Cryptographic Clearance Granted',
    });
    setBottomSheetMode('approve');
  };

  const handleApprove = async () => {
    if (!examHall) {
      toast.error('Please assign an exam hall.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('verifications')
        .insert({
          student_id: result.student.id,
          examiner_id: user.id,
          status: 'approved',
          exam_hall: examHall,
          scanned_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Entry formally approved.', { style: { background: '#7A8F7C', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      resetScan();
    } catch (error) {
      toast.error('Network sync error.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!denialReason) {
      toast.error('A denial reason must be recorded.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('verifications')
        .insert({
          student_id: result.student.id,
          examiner_id: user.id,
          status: 'denied',
          exam_hall: examHall || 'N/A',
          denial_reason: denialReason,
          scanned_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Denial forcibly logged.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
      resetScan();
    } catch (error) {
      toast.error('Network sync error.', { style: { background: '#B85C4F', color: '#F5F2E9', borderRadius: '100px', padding: '16px 24px' } });
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setBottomSheetMode('none');
    setExamHall('');
    setDenialReason('');
    setManualInput('');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-charcoal text-parchment font-body flex flex-col pt-0 pb-0 overflow-hidden relative">

        {/* Top Control Bar (Soft Floating) */}
        <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-center">
          <Link to="/examiner/dashboard" className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-float">
            <X className="w-6 h-6" />
          </Link>
          <div className="flex bg-white/10 backdrop-blur-xl p-1 rounded-full shadow-float">
            <button onClick={() => setMode('scan')} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ease-organic ${mode === 'scan' ? 'bg-white text-charcoal' : 'text-white/70 hover:text-white'}`}>
              Scan
            </button>
            <button onClick={() => setMode('manual')} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ease-organic ${mode === 'manual' ? 'bg-white text-charcoal' : 'text-white/70 hover:text-white'}`}>
              Manual
            </button>
          </div>
        </div>

        {/* Camera or Manual View */}
        <AnimatePresence mode="wait">
          {!result && mode === 'scan' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'organic' }}
              className="flex-1 relative flex flex-col justify-center items-center bg-charcoal"
            >
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-80" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* Soft Editorial Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[80vw] max-w-sm aspect-square relative">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-parchment rounded-tl-[3rem] opacity-70" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-parchment rounded-tr-[3rem] opacity-70" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-parchment rounded-bl-[3rem] opacity-70" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-parchment rounded-br-[3rem] opacity-70" />

                  {/* Scanning indicator pulse */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-[3rem] border border-parchment/30 shadow-[inset_0_0_40px_rgba(245,242,233,0.1)]"
                  />
                </div>
              </div>

              <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none flex justify-center">
                <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-3 shadow-float border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-parchment animate-pulse" />
                  <span className="text-sm font-medium text-parchment tracking-wide">
                    {loading ? 'Processing cipher...' : 'Align pass within frame'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {!result && mode === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'organic' }}
              className="flex-1 flex flex-col justify-center items-center p-6 bg-parchment text-charcoal relative"
            >
              <div className="w-full max-w-md container-editorial p-10 bg-white shadow-float text-center">
                <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-clay" />
                </div>
                <h2 className="text-4xl font-heading mb-3 text-charcoal">Verify Identity</h2>
                <p className="text-charcoal-light text-sm mb-10 font-medium">Secondary lookup layer for offline or unreadable access tokens.</p>

                <form onSubmit={handleManualSubmit} className="space-y-6 text-left">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2 ml-2">Matriculation Identifier</label>
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="input-editorial bg-charcoal/5 text-center text-lg uppercase tracking-wider font-mono placeholder:lowercase"
                      placeholder="sys/23/001"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-clay shadow-none hover:shadow-soft">
                    {loading ? 'Interrogating Network...' : 'Query Identity Matrix'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Detailed Verification Overlay (The Narrative Pass) */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`absolute inset-0 z-[100] flex flex-col justify-end ${result.success ? 'bg-sage/90' : 'bg-rust/90'} backdrop-blur-sm`}
            >
              <div className="flex-1 flex flex-col items-center justify-center text-white px-6 mt-10">
                {result.success ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-float">
                    <Check className="w-12 h-12 text-sage" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-float">
                    <XCircle className="w-12 h-12 text-rust" strokeWidth={3} />
                  </motion.div>
                )}
                <span className="text-5xl font-heading text-center tracking-tight leading-tight mix-blend-overlay">
                  {result.success ? 'Clearance Verified' : 'Access Denied'}
                </span>
                <span className="text-lg font-medium text-white/80 mt-4 text-center max-w-sm">
                  {result.message}
                </span>
              </div>

              {/* Information Drawer */}
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.3 }}
                className="bg-parchment text-charcoal rounded-t-[3rem] w-full min-h-[50vh] flex flex-col p-8 sm:p-12 shadow-[0_-20px_40px_rgba(0,0,0,0.15)] relative max-h-[85vh] overflow-y-auto"
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-charcoal/10 rounded-full" />

                {result.success ? (
                  <>
                    <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start mb-10 pb-10 border-b border-charcoal/10">
                      <div className="w-32 h-32 rounded-3xl bg-white shadow-soft overflow-hidden flex-shrink-0 border border-parchment-dark">
                        {result.student.photo_url ? (
                          <img src={result.student.photo_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : <div className="w-full h-full flex items-center justify-center font-medium text-charcoal-light/50">No Image</div>}
                      </div>
                      <div className="flex flex-col text-center sm:text-left h-full justify-center">
                        <span className="text-3xl font-heading text-charcoal mb-2">{result.student.name}</span>
                        <span className="text-lg font-mono text-charcoal-light tracking-wide mb-4">{result.student.matric_number}</span>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 bg-clay/10 text-clay rounded-full">{result.student.level} Level</span>
                          <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 border border-charcoal/10 rounded-full">{result.student.department}</span>
                        </div>
                      </div>
                    </div>

                    {bottomSheetMode === 'approve' && (
                      <div className="flex-1 flex flex-col gap-6">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-3 ml-2">Assign Examination Hall</label>
                          <input
                            value={examHall}
                            onChange={(e) => setExamHall(e.target.value)}
                            className="input-editorial"
                            placeholder="e.g. Main Auditorium"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-auto">
                          <button onClick={() => setBottomSheetMode('deny')} className="flex-1 py-4 text-rust font-medium rounded-full hover:bg-rust/10 transition-colors">
                            Initiate Denial
                          </button>
                          <button onClick={handleApprove} disabled={loading} className="flex-1 bg-charcoal text-parchment font-medium py-4 rounded-full shadow-float hover:scale-[1.02] active:scale-[0.98] transition-all">
                            {loading ? 'Syncing...' : 'Log Validation & Admit'}
                          </button>
                        </div>
                      </div>
                    )}

                    {bottomSheetMode === 'deny' && (
                      <div className="flex-1 flex flex-col gap-6 animate-fade-in">
                        <div>
                          <label className="block text-sm font-medium text-rust mb-3 ml-2">Provide Denial Rationale</label>
                          <div className="relative">
                            <select
                              value={denialReason}
                              onChange={(e) => setDenialReason(e.target.value)}
                              className="input-editorial bg-white focus:border-rust/30 appearance-none pr-10"
                            >
                              <option value="">Select contextual reason...</option>
                              <option value="photo_mismatch">Identity mismatch (Photo anomaly)</option>
                              <option value="expired_qr">Invalid or expired demographic signature</option>
                              <option value="wrong_exam">Candidate logged for different sector</option>
                              <option value="other">Other institutional anomaly</option>
                            </select>
                            <FileWarning className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rust/50 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-auto">
                          <button onClick={() => setBottomSheetMode('approve')} className="flex-1 py-4 text-charcoal font-medium rounded-full hover:bg-charcoal/5 transition-colors">
                            Cancel Action
                          </button>
                          <button onClick={handleDeny} disabled={loading} className="flex-1 bg-rust text-white font-medium py-4 rounded-full shadow-float hover:bg-rust-dark active:scale-[0.98] transition-all">
                            {loading ? 'Filing Report...' : 'Finalize Rejection'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-10">
                    <div className="w-16 h-16 rounded-full bg-rust/10 flex items-center justify-center mb-6">
                      <XCircle className="w-8 h-8 text-rust" />
                    </div>
                    <p className="font-medium text-center text-charcoal-light text-lg max-w-md leading-relaxed mb-10">
                      The provided cryptographic signature is invalid, expired, or belongs to a candidate lacking institutional clearance.
                    </p>
                    <button onClick={resetScan} className="w-full sm:w-auto px-10 btn-clay bg-white border border-charcoal/5">
                      Dismiss & Rescan
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
