import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, QrCode, CreditCard, User, ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { PageTransition } from '../../components/layout/PageTransition';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { generateAvatar } from '../../utils/mockImages';
import { Badge } from '../../components/ui/Badge';

export default function Dashboard() {
  const { user } = useStore();
  const [student, setStudent] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!user) return;

        // Fetch Student Data
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (studentData) {
          setStudent(studentData);
        }

        // Fetch Payment Data
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (paymentData) {
          setPayment(paymentData);
        }

      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const progressSteps = [
    {
      title: 'Registration',
      completed: student?.registration_complete,
      icon: User,
    },
    {
      title: 'Payment',
      completed: student?.payment_verified,
      icon: CreditCard,
    },
    {
      title: 'QR Ready',
      completed: student?.qr_generated,
      icon: QrCode,
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FCFAF7] py-8 px-4 font-body text-[#333331]">
        <div className="max-w-[1200px] mx-auto">
          {/* Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141413] rounded-2xl p-6 sm:p-8 text-[#FAF9F5] mb-8 shadow-md"
          >
            <div className="flex items-center gap-6">
              <img
                src={student?.photo_url || generateAvatar(user?.user_metadata?.name || 'Student')}
                alt="Student"
                className="w-20 h-20 rounded-xl object-cover border-2 border-[#D97757]"
              />
              <div>
                <h1 className="text-2xl font-heading font-medium text-[#FAF9F5]">{user?.user_metadata?.name || 'Student'}</h1>
                <p className="text-[#999995] font-heading">{student?.matric_number || 'No Matric Number'}</p>
                <div className="flex items-center gap-2 mt-1 text-[#999995]/80 text-sm font-body">
                  <span>{student?.department || 'Department'}</span>
                  <span>•</span>
                  <span>{student?.faculty || 'Faculty'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-[#D9D9D5] rounded-lg p-6"
              >
                <h2 className="text-lg font-heading font-semibold text-[#141413] mb-6 pl-2 border-l-4 border-[#D97757]">
                  Your Progress
                </h2>
                <div className="relative flex items-center justify-between px-4">
                  {/* Connecting Line background */}
                  <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-[#EBEAE5] -z-0" />

                  {progressSteps.map((step, index) => (
                    <div key={step.title} className="relative z-10 flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 border-2 ${step.completed
                        ? 'bg-[#788C5D] text-[#FAF9F5] border-[#788C5D]'
                        : 'bg-[#FCFAF7] text-[#999995] border-[#EBEAE5]'
                        }`}>
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>
                      <span className={`text-xs font-heading font-medium ${step.completed ? 'text-[#788C5D]' : 'text-[#999995]'
                        }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* QR Code Ready Banner */}
              {student?.qr_generated && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/student/qr-code"
                    className="block bg-gradient-to-r from-[#788C5D] to-[#8FA375] rounded-xl p-6 text-[#FAF9F5] hover:shadow-lg transition-all border border-[#788C5D]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                          <QrCode className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-lg text-white">QR Code Ready!</h3>
                          <p className="text-white/90 text-sm font-body">Click to view and print your exam pass</p>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Payment Details */}
              {payment && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white border border-[#D9D9D5] rounded-lg p-6"
                >
                  <h2 className="text-lg font-heading font-semibold text-[#141413] mb-4 pl-2 border-l-4 border-yellow-500">
                    Payment Details
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-[#999995] font-heading uppercase tracking-wider mb-1">RRR</p>
                      <p className="font-heading font-medium text-[#141413] text-lg">{payment.rrr}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#999995] font-heading uppercase tracking-wider mb-1">Amount</p>
                      <p className="font-heading font-medium text-[#141413] text-lg">
                        &#8358;{payment.amount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#999995] font-heading uppercase tracking-wider mb-1">Status</p>
                      <Badge status={payment.status === 'completed' ? 'success' : 'pending'}>
                        {payment.status === 'completed' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-[#999995] font-heading uppercase tracking-wider mb-1">Date</p>
                      <p className="font-body text-[#141413]">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#F2F0E9]/30 rounded-lg p-6 border border-[#EBEAE5]"
              >
                <h3 className="font-heading font-semibold text-[#141413] mb-4">Next Steps</h3>
                <div className="space-y-2">
                  {!student?.registration_complete && (
                    <Link to="/student/register" className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#EBEAE5] hover:border-[#D97757] transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-[#FCFAF7] flex items-center justify-center text-[#D97757] group-hover:bg-[#D97757] group-hover:text-[#FCFAF7] transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-heading font-medium text-[#141413]">Complete registration</span>
                    </Link>
                  )}
                  {!payment?.status && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#EBEAE5]">
                      <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-heading font-medium text-[#141413]">Payment Pending</span>
                    </div>
                  )}
                  {student?.qr_generated && (
                    <Link to="/student/qr-code" className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#EBEAE5] hover:border-[#D97757] transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-[#E3F2E6] flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-[#FCFAF7] transition-colors">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-heading font-medium text-[#141413]">Print QR code</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
