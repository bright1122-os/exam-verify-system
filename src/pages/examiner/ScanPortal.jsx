import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import jsQR from 'jsqr';
import { Camera, QrCode, CheckCircle, XCircle, RefreshCw, User, Shield, ArrowLeft } from 'lucide-react';
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
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showDenyForm, setShowDenyForm] = useState(false);
  const [examHall, setExamHall] = useState('');
  const [notes, setNotes] = useState('');
  const [denialReason, setDenialReason] = useState('');

  const startCamera = useCallback(async () => {
    try {
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
      toast.error('Camera access denied. Please enable camera permissions.');
      console.error('Camera error:', err);
    }
  }, []);

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

  const handleQRDetected = async (qrDataString) => {
    stopCamera();

    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    setLoading(true);
    try {
      // 1. Decrypt QR Data
      console.log('Scanned Raw:', qrDataString);
      const qrData = decryptQRData(qrDataString);

      if (!qrData) {
        throw new Error('Invalid or Tampered QR Code. Decryption failed.');
      }

      if (qrData.verifier !== 'exam-verify-system') {
        throw new Error('QR Code issuing authority mismatch.');
      }

      const { id } = qrData;
      if (!id) throw new Error('Invalid QR Code data: Missing ID.');

      // Fetch Student
      const { data: student, error } = await supabase
        .from('students')
        .select(`
            *,
            profiles:profiles!user_id (full_name)
        `)
        .eq('id', id)
        .single();

      if (error || !student) throw new Error('Student not found.');
      if (!student.qr_generated) throw new Error('Student has not generated a valid exam pass.');

      setResult({
        success: true,
        student: {
          ...student,
          name: student.profiles?.full_name || 'Student'
        },
        message: 'Student verified successfully',
      });
      setShowApproveForm(true);

    } catch (error) {
      console.error('Scan Error:', error);
      setResult({
        success: false,
        message: error?.message || 'Verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!examHall) {
      toast.error('Please enter the exam hall');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('verifications')
        .insert({
          student_id: result.student.id,
          examiner_id: user.id, // Current logged-in examiner
          status: 'approved',
          exam_hall: examHall,
          notes: notes,
          scanned_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Student approved!');
      resetScan();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!denialReason) {
      toast.error('Please select a denial reason');
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
          notes: notes,
          denial_reason: denialReason,
          scanned_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Entry denied');
      resetScan();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Denial failed');
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setShowApproveForm(false);
    setShowDenyForm(false);
    setExamHall('');
    setNotes('');
    setDenialReason('');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FCFAF7] py-8 px-4 font-body text-[#333331]">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/examiner/dashboard" className="text-[#666660] hover:text-[#141413] transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-heading font-medium text-[#141413]">
                Scan Portal
              </h1>
            </div>
            <div className="w-6" /> {/* Spacer */}
          </div>

          {/* Scanner Area */}
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141413] rounded-2xl overflow-hidden border-4 border-[#D9D9D5] shadow-xl"
            >
              <div className="relative aspect-square bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scanning Overlay */}
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-[#D97757] rounded-2xl relative">
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-[#D97757] shadow-[0_0_10px_rgba(217,119,87,0.8)]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#D97757] rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D97757] rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#D97757] rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#D97757] rounded-br-lg" />
                    </div>
                  </div>
                )}

                {!scanning && !loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141413]/90">
                    <Camera className="w-16 h-16 text-[#999995] mb-4" />
                    <p className="text-[#999995] mb-6 font-heading">Camera is off</p>
                    <button
                      onClick={startCamera}
                      className="px-8 py-3 bg-[#D97757] text-[#FAF9F5] rounded-xl font-heading font-semibold hover:bg-[#C86546] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      Start Scanning
                    </button>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#141413]/90">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-[#D97757] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-[#FAF9F5] font-heading">Verifying...</p>
                    </div>
                  </div>
                )}
              </div>

              {scanning && (
                <div className="p-4 text-center bg-[#141413] border-t border-white/10">
                  <button
                    onClick={stopCamera}
                    className="text-sm text-[#999995] hover:text-[#FAF9F5] transition-colors font-heading uppercase tracking-wider"
                  >
                    Stop Camera
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {result.success ? (
                  <div className="bg-white rounded-2xl border border-[#D9D9D5] overflow-hidden shadow-lg">
                    {/* Success Header */}
                    <div className="bg-[#788C5D] p-6 text-[#FAF9F5] text-center">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                      <h2 className="font-heading font-bold text-xl">Student Verified</h2>
                    </div>

                    {/* Student Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-[#F2F0E9] rounded-xl flex items-center justify-center text-[#141413]">
                          <User className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-[#141413] text-lg">
                            {result.student.name}
                          </h3>
                          <p className="text-sm font-heading text-[#666660]">{result.student.matric_number}</p>
                          <p className="text-xs font-body text-[#666660]/80 mt-1">{result.student.department} • {result.student.level} Lvl</p>
                        </div>
                      </div>

                      {/* Approve Form */}
                      {showApproveForm && !showDenyForm && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-heading font-medium text-[#141413] mb-1">
                              Exam Hall
                            </label>
                            <input
                              value={examHall}
                              onChange={(e) => setExamHall(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-[#FCFAF7] border border-[#D9D9D5] text-[#141413] focus:outline-none focus:ring-1 focus:ring-[#D97757]"
                              placeholder="e.g., Hall A, Room 101"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-heading font-medium text-[#141413] mb-1">
                              Notes (optional)
                            </label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-[#FCFAF7] border border-[#D9D9D5] text-[#141413] focus:outline-none focus:ring-1 focus:ring-[#D97757]"
                              rows={2}
                              placeholder="Any additional notes..."
                            />
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={handleApprove}
                              disabled={loading}
                              className="flex-1 px-4 py-3 bg-[#788C5D] text-[#FAF9F5] rounded-xl font-heading font-semibold hover:bg-[#6A7B51] transition-colors disabled:opacity-50"
                            >
                              {loading ? 'Approving...' : 'Approve Entry'}
                            </button>
                            <button
                              onClick={() => setShowDenyForm(true)}
                              className="px-4 py-3 bg-[#CC5555]/10 text-[#CC5555] rounded-xl font-heading font-semibold hover:bg-[#CC5555]/20 transition-colors"
                            >
                              Deny
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Deny Form */}
                      {showDenyForm && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-heading font-medium text-[#141413] mb-1">
                              Denial Reason
                            </label>
                            <select
                              value={denialReason}
                              onChange={(e) => setDenialReason(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-[#FCFAF7] border border-[#D9D9D5] text-[#141413] focus:outline-none focus:ring-1 focus:ring-[#D97757]"
                            >
                              <option value="">Select reason</option>
                              <option value="photo_mismatch">Photo Mismatch</option>
                              <option value="expired_qr">Expired QR Code</option>
                              <option value="wrong_exam">Wrong Exam</option>
                              <option value="suspicious">Suspicious Activity</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-heading font-medium text-[#141413] mb-1">
                              Notes
                            </label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-[#FCFAF7] border border-[#D9D9D5] text-[#141413] focus:outline-none focus:ring-1 focus:ring-[#D97757]"
                              rows={2}
                              placeholder="Additional details..."
                            />
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={handleDeny}
                              disabled={loading}
                              className="flex-1 px-4 py-3 bg-[#CC5555] text-white rounded-xl font-heading font-semibold hover:bg-[#B34444] transition-colors disabled:opacity-50"
                            >
                              {loading ? 'Denying...' : 'Confirm Deny'}
                            </button>
                            <button
                              onClick={() => setShowDenyForm(false)}
                              className="px-4 py-3 bg-[#F2F0E9] text-[#141413] rounded-xl font-heading font-semibold hover:bg-[#E6E4DC] transition-colors"
                            >
                              Back
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Error Result */
                  <div className="bg-white rounded-2xl border border-[#D9D9D5] overflow-hidden shadow-lg cursor-pointer" onClick={() => { resetScan(); startCamera(); }}>
                    <div className="bg-[#CC5555] p-6 text-white text-center">
                      <XCircle className="w-12 h-12 mx-auto mb-2" />
                      <h2 className="font-heading font-bold text-xl">Verification Failed</h2>
                    </div>
                    <div className="p-8 text-center bg-[#FCFAF7]">
                      <p className="text-[#141413] mb-6 font-body font-medium">{result.message}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetScan();
                          startCamera();
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#141413] text-[#FAF9F5] rounded-xl font-heading font-semibold hover:bg-[#333331] transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Scan Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Reset Button */}
                {result.success && (
                  <button
                    onClick={() => {
                      resetScan();
                      startCamera();
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-[#F2F0E9] text-[#141413] border border-[#D9D9D5] rounded-xl font-heading font-semibold hover:bg-[#E6E4DC] transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Scan Next Student
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-[#999995] text-xs font-heading uppercase tracking-widest">
              <Shield className="w-3 h-3" />
              Secure Verification System
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
