import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, CheckCircle, XCircle, TrendingUp, Clock, Shield, RefreshCw, Activity, Wifi } from 'lucide-react';
import api from '../../services/api';
import { initSocket, onEvent, offEvent } from '../../services/socket';
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
        const [statsRes, historyRes] = await Promise.all([
          api.get('/examiner/stats').catch(() => null),
          api.get('/examiner/history?limit=10').catch(() => null),
        ]);

        // Map backend response shape to what the UI expects
        const statsData = statsRes?.data || null;
        if (statsData) {
          setStats({
            todayScans: statsData.today?.total || 0,
            todayApproved: statsData.today?.approved || 0,
            todayDenied: statsData.today?.denied || 0,
            totalScans: statsData.allTime?.total || 0,
            totalApproved: statsData.allTime?.approved || 0,
            totalDenied: statsData.allTime?.denied || 0,
            successRate: statsData.allTime?.total > 0
              ? Math.round((statsData.allTime.approved / statsData.allTime.total) * 100) : 0,
          });
        }

        setHistory(historyRes?.data?.verifications || []);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Initialize socket
    const socket = initSocket('examiner');

    const handleVerificationApproved = (data) => {
      setLiveUpdates(prev => [{
        type: 'approved',
        message: `Student ${data.matricNumber || 'unknown'} approved`,
        time: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 20));
    };

    const handleVerificationDenied = (data) => {
      setLiveUpdates(prev => [{
        type: 'denied',
        message: `Student ${data.matricNumber || 'unknown'} denied`,
        time: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 20));
    };

    onEvent('verification:approved', handleVerificationApproved);
    onEvent('verification:denied', handleVerificationDenied);

    return () => {
      offEvent('verification:approved', handleVerificationApproved);
      offEvent('verification:denied', handleVerificationDenied);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Scans Today',
      value: stats?.todayScans || 0,
      icon: QrCode,
      color: 'from-primary-500 to-primary-700',
      bgLight: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      title: 'Approved Today',
      value: stats?.todayApproved || 0,
      icon: CheckCircle,
      color: 'from-success-500 to-success-700',
      bgLight: 'bg-success-50 dark:bg-success-900/20',
    },
    {
      title: 'Denied Today',
      value: stats?.todayDenied || 0,
      icon: XCircle,
      color: 'from-red-500 to-red-700',
      bgLight: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Success Rate',
      value: stats?.successRate ? `${stats.successRate}%` : '0%',
      icon: TrendingUp,
      color: 'from-secondary-500 to-secondary-700',
      bgLight: 'bg-secondary-50 dark:bg-secondary-900/20',
    },
  ];

  const allTimeApproved = stats?.totalApproved || 0;
  const allTimeTotal = stats?.totalScans || 1;
  const successPercent = Math.round((allTimeApproved / allTimeTotal) * 100);

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white">
                Examiner Dashboard
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">Real-time verification statistics</p>
            </div>
            <Link
              to="/examiner/scan"
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${card.bgLight} rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800`}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-display font-bold text-neutral-900 dark:text-white">{card.value}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{card.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* All-Time Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
              >
                <h2 className="text-lg font-display font-semibold text-neutral-900 dark:text-white mb-4">
                  All-Time Performance
                </h2>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-600 dark:text-neutral-400">Success Rate</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{successPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${successPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-neutral-900 dark:text-white">{stats?.totalScans || 0}</p>
                    <p className="text-xs text-neutral-500">Total Scans</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-success-600">{stats?.totalApproved || 0}</p>
                    <p className="text-xs text-neutral-500">Approved</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-red-600">{stats?.totalDenied || 0}</p>
                    <p className="text-xs text-neutral-500">Denied</p>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
              >
                <h2 className="text-lg font-display font-semibold text-neutral-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'approved'
                              ? 'bg-success-100 dark:bg-success-900/30 text-success-600'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                          }`}>
                            {item.status === 'approved' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {item.studentId?.matricNumber || 'Unknown'}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {item.examHall || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {item.verifiedAt ? new Date(item.verifiedAt).toLocaleTimeString() : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-neutral-500 py-4">No recent activity</p>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live Updates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                  <h3 className="font-display font-semibold text-neutral-900 dark:text-white">Live Updates</h3>
                </div>
                {liveUpdates.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {liveUpdates.map((update, index) => (
                      <div key={index} className="text-sm p-2 rounded bg-neutral-50 dark:bg-neutral-800/50">
                        <span className={update.type === 'approved' ? 'text-success-600' : 'text-red-600'}>
                          {update.type === 'approved' ? '+ ' : '- '}
                        </span>
                        <span className="text-neutral-700 dark:text-neutral-300">{update.message}</span>
                        <span className="text-xs text-neutral-400 ml-2">{update.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-4">
                    Waiting for live events...
                  </p>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
              >
                <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/examiner/scan"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <QrCode className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Scan QR Code</span>
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors w-full"
                  >
                    <RefreshCw className="w-5 h-5 text-secondary-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Refresh Data</span>
                  </button>
                </div>
              </motion.div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
              >
                <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Real-time Sync</span>
                    </div>
                    <span className="badge-success">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">AES Encryption</span>
                    </div>
                    <span className="badge-success">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">API Status</span>
                    </div>
                    <span className="badge-success">Online</span>
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
