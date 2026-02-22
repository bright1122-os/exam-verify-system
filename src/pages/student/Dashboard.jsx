import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { PageTransition } from '../../components/layout/PageTransition';
import { ClearanceTicket } from '../../components/student/ClearanceTicket';
import { INITI_EASE } from '../../lib/motion';

export default function Dashboard() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState('pending'); // 'pending', 'verified'
  const [loading, setLoading] = useState(true);

  // Intiri-style scroll parallax logic
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 250]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!user) return;

        const res = await api.get('/student/dashboard');
        const data = res.data;

        if (studentData) {
          setStudent(studentData);
          if (studentData.qr_generated && studentData.qr_code_token) {
            setStatus('verified');
          } else if (studentData.payment_verified) {
            setStatus('paid');
          }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  const handleActionClick = () => {
    if (!student || !student.registration_complete) {
      navigate('/student/register');
    } else if (!student.payment_verified) {
      navigate('/student/payment');
    } else {
      navigate('/student/qr-code');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f0e9] text-charcoal font-body">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-charcoal/10 border-t-charcoal animate-spin" />
          <span className="text-lg font-medium">Validating connection...</span>
        </div>
      </div>
    );
  }

  // Merging auth metadata with DB student profile for presentation
  const profileData = {
    name: user?.user_metadata?.name,
    ...student
  };

  return (
    <PageTransition>
      {/* 
        Intiri Layout Transition: 
        Removed max-h constraints, opened up padding exponentially (py-40), 
        and added the massive 'Clearance Portal' parallax text.
      */}
      <div className="min-h-screen bg-[#f2f0e9] py-40 lg:py-64 px-6 flex flex-col justify-start items-center selection:bg-charcoal selection:text-[#f2f0e9] relative overflow-hidden">

        {/* Massive Parallax Typography Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          style={{ y: backgroundY }}
        >
          <span className="text-[clamp(10rem,22vw,28rem)] font-heading leading-none text-charcoal opacity-[0.03] whitespace-nowrap tracking-tighter">
            CLEARANCE PORTAL
          </span>
        </motion.div>

        <div className="w-full max-w-[1400px] z-10 relative">
          {/* Network / Status Indicator Top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: INITI_EASE }}
            className="w-full max-w-lg mx-auto flex justify-between items-center mb-16 text-sm font-medium text-charcoal/70 px-4"
          >
            <div className="flex items-center gap-3 tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-charcoal opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-charcoal"></span>
              </span>
              Connection Secure
            </div>
            <span className="font-mono text-xs opacity-60 bg-charcoal/5 px-3 py-1.5 rounded-full tracking-wider border border-charcoal/10">
              {new Date().toISOString().split('T')[0]}
            </span>
          </motion.div>

          {/* The Clearance Ticket - Core Interaction */}
          {/* The component already has motion logic built in */}
          <ClearanceTicket
            student={profileData}
            status={status}
            onActionClick={handleActionClick}
          />

          {/* Support Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: INITI_EASE, delay: 0.4 }}
            className="w-full max-w-lg mx-auto mt-20 text-center text-[13px] text-charcoal/50 font-medium px-6 leading-[1.8] tracking-wide"
          >
            <p>This portal issues cryptographically secure examination clearances. If your academic status appears incorrect, please consult your department's registry.</p>
          </motion.div>
        </div>

      </div>
    </PageTransition>
  );
}
