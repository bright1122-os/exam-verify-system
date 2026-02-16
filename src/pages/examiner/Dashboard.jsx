import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, CheckCircle, XCircle, TrendingUp, Clock, Shield, RefreshCw, Activity, Wifi } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PageTransition } from '../../components/layout/PageTransition';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function ExaminerDashboard() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCommonISO = today.toISOString();

        // 1. Fetch Today's Stats
        const { count: todayTotal } = await supabase
          .from('verifications')
          .select('*', { count: 'exact', head: true })
          .gte('scanned_at', todayCommonISO);

        const { count: todayApproved } = await supabase
          .from('verifications')
          .select('*', { count: 'exact', head: true })
          .gte('scanned_at', todayCommonISO)
          .eq('status', 'approved');

        const { count: todayDenied } = await supabase
          .from('verifications')
          .select('*', { count: 'exact', head: true })
          .gte('scanned_at', todayCommonISO)
          .eq('status', 'denied');

        // 2. Fetch All Time Stats
        const { count: allTimeTotal } = await supabase
          .from('verifications')
          .select('*', { count: 'exact', head: true });

        const { count: allTimeApproved } = await supabase
          .from('verifications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        const { count: allTimeDenied } = await supabase
          .from('verifications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'denied');


        setStats({
          todayScans: todayTotal || 0,
          todayApproved: todayApproved || 0,
          todayDenied: todayDenied || 0,
          totalScans: allTimeTotal || 0,
          totalApproved: allTimeApproved || 0,
          totalDenied: allTimeDenied || 0,
          successRate: allTimeTotal > 0 ? Math.round((allTimeApproved / allTimeTotal) * 100) : 0,
        });

        // 3. Fetch History (Recent 10)
        const { data: historyData } = await supabase
          .from('verifications')
          .select(`
                *,
                students (matric_number)
            `)
          .order('scanned_at', { ascending: false })
          .limit(10);

        if (historyData) {
          setHistory(historyData);
        }

      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Realtime Subscription
    const channel = supabase
      .channel('verifications-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'verifications',
        },
        async (payload) => {
          // Optimistic update or fetch details
          const { data: newVerification } = await supabase
            .from('verifications')
            .select(`*, students(matric_number)`)
            .eq('id', payload.new.id)
            .single();

          if (newVerification) {
            const update = {
              type: newVerification.status,
              message: `Student ${newVerification.students?.matric_number || 'Unknown'} ${newVerification.status}`,
              time: new Date(newVerification.scanned_at).toLocaleTimeString()
            };

            setLiveUpdates(prev => [update, ...prev].slice(0, 20));

            // Optimistically update stats (simplified)
            setStats(prev => {
              if (!prev) return prev;
              const isApproved = newVerification.status === 'approved';
              const isToday = new Date(newVerification.scanned_at).toDateString() === new Date().toDateString();

              return {
                ...prev,
                totalScans: prev.totalScans + 1,
                totalApproved: prev.totalApproved + (isApproved ? 1 : 0),
                totalDenied: prev.totalDenied + (!isApproved ? 1 : 0),
                todayScans: prev.todayScans + (isToday ? 1 : 0),
                todayApproved: prev.todayApproved + (isToday && isApproved ? 1 : 0),
                todayDenied: prev.todayDenied + (isToday && !isApproved ? 1 : 0),
              };
            });

            // Update history
            setHistory(prev => [newVerification, ...prev].slice(0, 10));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Scans Today',
      value: stats?.todayScans || 0,
      icon: QrCode,
      color: 'bg-[#D97757] text-[#FAF9F5]',
      iconColor: 'text-[#D97757]',
      border: 'border-[#D97757]'
    },
    {
      title: 'Approved Today',
      value: stats?.todayApproved || 0,
      icon: CheckCircle,
      color: 'bg-[#788C5D] text-[#FAF9F5]',
      iconColor: 'text-[#788C5D]',
      border: 'border-[#788C5D]'
    },
    {
      title: 'Denied Today',
      value: stats?.todayDenied || 0,
      icon: XCircle,
      color: 'bg-[#CC5555] text-[#FAF9F5]',
      iconColor: 'text-[#CC5555]',
      border: 'border-[#CC5555]'
    },
    {
      title: 'Success Rate',
      value: stats?.successRate ? `${stats.successRate}%` : '0%',
      icon: TrendingUp,
      color: 'bg-[#141413] text-[#FAF9F5]',
      iconColor: 'text-[#141413]',
      border: 'border-[#141413]'
    },
  ];

  const successPercent = stats?.successRate || 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FCFAF7] py-8 px-4 font-body text-[#333331]">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#EBEAE5]">
            <div>
              <h1 className="text-3xl font-heading font-medium text-[#141413]">
                Examiner Dashboard
              </h1>
              <p className="text-[#666660] font-body">Real-time verification statistics</p>
            </div>
            <Link
              to="/examiner/scan"
              className="flex items-center gap-2 px-6 py-3 bg-[#141413] text-[#FAF9F5] rounded-xl font-heading font-semibold hover:bg-[#333331] transition-colors shadow-md"
            >
              <QrCode className="w-5 h-5" />
              Scan QR
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 border-b-4 shadow-sm ${card.border}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#FCFAF7] ${card.iconColor}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-3xl font-heading font-bold text-[#141413] mb-1">{card.value}</p>
                <p className="text-sm font-heading font-medium text-[#666660] uppercase tracking-wide">{card.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* All-Time Performance */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-[#D9D9D5] rounded-xl p-6"
              >
                <h2 className="text-lg font-heading font-semibold text-[#141413] mb-6 pl-2 border-l-4 border-[#788C5D]">
                  All-Time Performance
                </h2>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2 font-heading">
                    <span className="text-[#666660]">Success Rate</span>
                    <span className="font-semibold text-[#141413]">{successPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#F2F0E9] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${successPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-[#788C5D] rounded-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center divide-x divide-[#EBEAE5]">
                  <div>
                    <p className="text-2xl font-heading font-bold text-[#141413]">{stats?.totalScans || 0}</p>
                    <p className="text-xs font-heading text-[#666660] uppercase mt-1">Total Scans</p>
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-[#788C5D]">{stats?.totalApproved || 0}</p>
                    <p className="text-xs font-heading text-[#666660] uppercase mt-1">Approved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-[#CC5555]">{stats?.totalDenied || 0}</p>
                    <p className="text-xs font-heading text-[#666660] uppercase mt-1">Denied</p>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border border-[#D9D9D5] rounded-xl p-6"
              >
                <h2 className="text-lg font-heading font-semibold text-[#141413] mb-4 pl-2 border-l-4 border-[#D97757]">
                  Recent Activity
                </h2>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#FCFAF7] border border-[#EBEAE5] hover:bg-[#F2F0E9] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'approved'
                            ? 'bg-[#E3F2E6] text-[#2E7D32]'
                            : 'bg-[#FFF4E5] text-[#CC5555]'
                            }`}>
                            {item.status === 'approved' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-heading font-semibold text-[#141413]">
                              {item.students?.matric_number || 'Unknown'}
                            </p>
                            <p className="text-xs text-[#666660] font-body">
                              {item.exam_hall || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-heading text-[#666660]/70">
                          {item.scanned_at ? new Date(item.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#666660] py-8 font-body italic">No recent activity recorded Today</p>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live Updates */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#141413] rounded-xl p-6 text-[#FAF9F5] border-none shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-2">
                  <div className="w-2 h-2 bg-[#D97757] rounded-full animate-pulse" />
                  <h3 className="font-heading font-semibold text-[#FAF9F5]">Live Updates</h3>
                </div>
                {liveUpdates.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {liveUpdates.map((update, index) => (
                      <div key={index} className="text-sm p-2 rounded bg-white/5 border border-white/10 font-body">
                        <div className="flex justify-between items-start">
                          <span className={update.type === 'approved' ? 'text-[#788C5D]' : 'text-[#CC5555]'}>
                            {update.type === 'approved' ? '✓ ' : '✗ '}
                            <span className="text-[#999995]">{update.message}</span>
                          </span>
                          <span className="text-xs text-[#666660] ml-2 whitespace-nowrap">{update.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#666660] text-center py-4 font-body italic">
                    Waiting for live events...
                  </p>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white border border-[#D9D9D5] rounded-xl p-6"
              >
                <h3 className="font-heading font-semibold text-[#141413] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/examiner/scan"
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#D97757]/10 text-[#D97757] hover:bg-[#D97757]/20 transition-colors font-heading font-medium"
                  >
                    <QrCode className="w-5 h-5" />
                    Scan QR Code
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#F2F0E9] text-[#141413] hover:bg-[#E6E4DC] transition-colors w-full font-heading font-medium"
                  >
                    <RefreshCw className="w-5 h-5 text-[#666660]" />
                    Refresh Data
                  </button>
                </div>
              </motion.div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-[#F2F0E9] rounded-xl p-6"
              >
                <h3 className="font-heading font-semibold text-[#141413] mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-[#788C5D]" />
                      <span className="text-sm font-body text-[#666660]">Real-time Sync</span>
                    </div>
                    <span className="text-xs font-heading font-bold text-[#788C5D] bg-[#E3F2E6] px-2 py-1 rounded">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#788C5D]" />
                      <span className="text-sm font-body text-[#666660]">Data Security</span>
                    </div>
                    <span className="text-xs font-heading font-bold text-[#788C5D] bg-[#E3F2E6] px-2 py-1 rounded">SECURE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#788C5D]" />
                      <span className="text-sm font-body text-[#666660]">System Uptime</span>
                    </div>
                    <span className="text-xs font-heading font-bold text-[#788C5D] bg-[#E3F2E6] px-2 py-1 rounded">100%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
