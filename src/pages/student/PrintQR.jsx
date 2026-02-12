import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, QrCode, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useStore } from '../../store/useStore';
import { PageTransition } from '../../components/layout/PageTransition';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { generateAvatar } from '../../utils/mockImages';

export default function PrintQR() {
  const { user } = useStore();
  const [qrData, setQrData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qrResponse, dashResponse] = await Promise.all([
          api.get('/qr/my-qr'),
          api.get('/student/dashboard'),
        ]);
        setQrData(qrResponse.data);
        setStudentData(dashResponse.data?.student);
      } catch (error) {
        console.error('Fetch QR error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const qrImage = document.querySelector('#qr-card');
    if (!qrImage) return;

    // Use html2canvas-like approach via canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 600);
    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 18px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Exam Verification Card', 200, 40);

    // Trigger download of the printable area
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading QR code..." />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Back Link */}
          <Link
            to="/student/dashboard"
            className="no-print inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* QR Card */}
          <div id="qr-card" className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-primary-900 p-6 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <QrCode className="w-6 h-6" />
                <h1 className="font-display font-bold text-xl">Exam Verification Card</h1>
              </div>
              <p className="text-primary-200 text-sm">2024/2025 Academic Session</p>
            </div>

            {/* Student Info */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={studentData?.photoUrl || generateAvatar(user?.name || 'Student')}
                  alt="Student"
                  className="w-20 h-20 rounded-xl object-cover border-2 border-neutral-200"
                />
                <div>
                  <h2 className="font-display font-bold text-lg text-neutral-900">{user?.name}</h2>
                  <p className="text-sm text-neutral-600">{studentData?.matricNumber}</p>
                  <p className="text-sm text-neutral-500">
                    {studentData?.level} Level - {studentData?.department}
                  </p>
                  <p className="text-xs text-neutral-400">{studentData?.faculty}</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                {qrData?.qrCode ? (
                  <div className="p-4 bg-white border-2 border-neutral-200 rounded-xl">
                    <img
                      src={qrData.qrCode}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-neutral-100 rounded-xl flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-neutral-300" />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="text-center mb-4">
                {studentData?.qrCodeUsed ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning-100 text-warning-800 rounded-full">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">QR Code Used</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-100 text-success-800 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Valid - Ready for Use</span>
                  </div>
                )}
              </div>

              {/* Print Instructions (visible only when printing) */}
              <div className="hidden print:block text-center text-xs text-neutral-500 mt-4 border-t border-neutral-200 pt-4">
                <p>Present this card at the exam hall for verification.</p>
                <p>This QR code is single-use and encrypted.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print flex gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              <Printer className="w-5 h-5" />
              Print Card
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
