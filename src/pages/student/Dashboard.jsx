import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, QrCode, CreditCard, User, ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { PageTransition } from '../../components/layout/PageTransition';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { generateAvatar } from '../../utils/mockImages';

export default function Dashboard() {
  const { user } = useStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/student/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const student = dashboardData?.student;
  const payment = dashboardData?.payment;

  const progressSteps = [
    {
      title: 'Registration',
      completed: student?.registrationComplete,
      icon: User,
    },
    {
      title: 'Payment Verified',
      completed: student?.paymentVerified,
      icon: CreditCard,
    },
    {
      title: 'QR Generated',
      completed: student?.qrCodeGenerated,
      icon: QrCode,
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 sm:p-8 text-white mb-8"
          >
            <div className="flex items-center gap-6">
              <img
                src={student?.photoUrl || generateAvatar(user?.name || 'Student')}
                alt="Student"
                className="w-20 h-20 rounded-xl object-cover border-2 border-white/30"
              />
              <div>
                <h1 className="text-2xl font-display font-bold">{user?.name || 'Student'}</h1>
                <p className="text-primary-200">{student?.matricNumber}</p>
                <p className="text-primary-200 text-sm">{student?.department} - {student?.faculty}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
              >
                <h2 className="text-lg font-display font-semibold text-neutral-900 dark:text-white mb-6">
                  Your Progress
                </h2>
                <div className="flex items-center justify-between">
                  {progressSteps.map((step, index) => (
                    <div key={step.title} className="flex items-center">
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          step.completed
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-600'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <step.icon className="w-6 h-6" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          {step.title}
                        </span>
                      </div>
                      {index < progressSteps.length - 1 && (
                        <div className={`w-12 sm:w-24 h-0.5 mx-2 mb-6 ${
                          step.completed ? 'bg-success-500' : 'bg-neutral-200 dark:bg-neutral-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* QR Code Ready Banner */}
              {student?.qrCodeGenerated && !student?.qrCodeUsed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/student/qr-code"
                    className="block bg-gradient-to-r from-success-500 to-success-700 rounded-2xl p-6 text-white hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <QrCode className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-lg">QR Code Ready!</h3>
                          <p className="text-success-100 text-sm">Click to view and print your exam QR code</p>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* QR Used Warning */}
              {student?.qrCodeUsed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-6 h-6 text-warning-600" />
                    <div>
                      <h3 className="font-semibold text-warning-800 dark:text-warning-200">QR Code Used</h3>
                      <p className="text-sm text-warning-600 dark:text-warning-300">Your QR code has already been scanned and verified.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Details */}
              {payment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
                >
                  <h2 className="text-lg font-display font-semibold text-neutral-900 dark:text-white mb-4">
                    Payment Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">RRR</p>
                      <p className="font-semibold text-neutral-900 dark:text-white">{payment.rrr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Amount</p>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        &#8358;{payment.amount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Status</p>
                      <span className={payment.status === 'completed' ? 'badge-success' : 'badge-warning'}>
                        {payment.status === 'completed' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Date</p>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Exam Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
              >
                <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-4">Exam Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Session</span>
                    <span className="font-medium text-neutral-900 dark:text-white">2024/2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Semester</span>
                    <span className="font-medium text-neutral-900 dark:text-white">First</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Level</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{student?.level || '-'}</span>
                  </div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
              >
                <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-4">Next Steps</h3>
                <div className="space-y-3">
                  {!student?.registrationComplete && (
                    <Link to="/student/register" className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <User className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Complete registration</span>
                    </Link>
                  )}
                  {!student?.paymentVerified && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                      <CreditCard className="w-5 h-5 text-warning-500" />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Complete payment</span>
                    </div>
                  )}
                  {student?.qrCodeGenerated && !student?.qrCodeUsed && (
                    <Link to="/student/qr-code" className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <QrCode className="w-5 h-5 text-success-500" />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Print QR code</span>
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Help */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800"
              >
                <Shield className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="font-display font-semibold text-primary-900 dark:text-primary-100 mb-2">Need Help?</h3>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Contact your department or the ICT center for support with exam verification.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
