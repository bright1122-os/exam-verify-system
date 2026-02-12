import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import jsQR from 'jsqr';
import { Camera, QrCode, CheckCircle, XCircle, RefreshCw, User, Shield, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { PageTransition } from '../../components/layout/PageTransition';

export default function ScanPortal() {
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

  const handleQRDetected = async (qrData) => {
    stopCamera();

    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    setLoading(true);
    try {
      const response = await api.post('/examiner/scan', { qrData });
      setResult({
        success: true,
        student: response.data.student,
        message: response.data.message || 'Student verified successfully',
      });
      setShowApproveForm(true);
    } catch (error) {
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
      await api.post('/examiner/approve', {
        studentId: result.student._id,
        examHall,
        notes,
      });
      toast.success('Student approved!');
      resetScan();
    } catch (error) {
      toast.error(error?.message || 'Approval failed');
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
      await api.post('/examiner/deny', {
        studentId: result.student._id,
        examHall: examHall || 'N/A',
        notes,
        denialReason,
      });
      toast.success('Entry denied');
      resetScan();
    } catch (error) {
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
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white mb-2">
              QR Scanner
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Scan student QR codes for exam verification
            </p>
          </div>

          {/* Scanner Area */}
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
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
                    <div className="w-64 h-64 border-2 border-primary-500 rounded-2xl relative">
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-primary-500"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
                    </div>
                  </div>
                )}

                {!scanning && !loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80">
                    <Camera className="w-16 h-16 text-neutral-400 mb-4" />
                    <p className="text-neutral-400 mb-4">Camera is off</p>
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Start Scanning
                    </button>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-white">Verifying...</p>
                    </div>
                  </div>
                )}
              </div>

              {scanning && (
                <div className="p-4 text-center">
                  <button
                    onClick={stopCamera}
                    className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
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
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-success-500 p-6 text-white text-center">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                      <h2 className="font-display font-bold text-xl">Student Verified</h2>
                    </div>

                    {/* Student Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                          <User className="w-8 h-8 text-neutral-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 dark:text-white">
                            {result.student?.userId?.name || 'Student'}
                          </h3>
                          <p className="text-sm text-neutral-500">{result.student?.matricNumber}</p>
                          <p className="text-sm text-neutral-400">{result.student?.department} - {result.student?.level}</p>
                        </div>
                      </div>

                      {/* Approve Form */}
                      {showApproveForm && !showDenyForm && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Exam Hall *
                            </label>
                            <input
                              value={examHall}
                              onChange={(e) => setExamHall(e.target.value)}
                              className="input-field"
                              placeholder="e.g., Hall A, Room 101"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Notes (optional)
                            </label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="input-field"
                              rows={2}
                              placeholder="Any additional notes..."
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleApprove}
                              disabled={loading}
                              className="flex-1 px-4 py-3 bg-success-600 text-white rounded-xl font-semibold hover:bg-success-700 transition-colors disabled:opacity-50"
                            >
                              {loading ? 'Approving...' : 'Approve Entry'}
                            </button>
                            <button
                              onClick={() => setShowDenyForm(true)}
                              className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-colors"
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
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Denial Reason *
                            </label>
                            <select
                              value={denialReason}
                              onChange={(e) => setDenialReason(e.target.value)}
                              className="input-field"
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
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Notes
                            </label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="input-field"
                              rows={2}
                              placeholder="Additional details..."
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleDeny}
                              disabled={loading}
                              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {loading ? 'Denying...' : 'Confirm Deny'}
                            </button>
                            <button
                              onClick={() => setShowDenyForm(false)}
                              className="px-4 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-neutral-300 transition-colors"
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
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="bg-red-500 p-6 text-white text-center">
                      <XCircle className="w-12 h-12 mx-auto mb-2" />
                      <h2 className="font-display font-bold text-xl">Verification Failed</h2>
                    </div>
                    <div className="p-6 text-center">
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4">{result.message}</p>
                      <button
                        onClick={() => {
                          resetScan();
                          startCamera();
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
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
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
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
            <div className="inline-flex items-center gap-2 text-neutral-400 text-sm">
              <Shield className="w-4 h-4" />
              AES-256 Encrypted Verification
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
