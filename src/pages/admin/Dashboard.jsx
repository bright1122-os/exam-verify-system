import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Users,
  CheckCircle,
  Clock,
  QrCode,
  Search,
  BarChart3,
  TrendingUp,
  Shield
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';

// Mock data for admin dashboard
const mockStudents = [
  { id: 'STU-001', name: 'John Doe', matricNumber: 'CSC/2020/001', department: 'Computer Science', level: '400', course: 'CSC 401', paymentVerified: true, qrGenerated: true, registeredAt: '2025-01-15T10:30:00Z' },
  { id: 'STU-002', name: 'Jane Smith', matricNumber: 'CSC/2020/002', department: 'Computer Science', level: '400', course: 'CSC 401', paymentVerified: true, qrGenerated: true, registeredAt: '2025-01-15T11:00:00Z' },
  { id: 'STU-003', name: 'Mike Johnson', matricNumber: 'IT/2021/015', department: 'Information Technology', level: '300', course: 'IT 301', paymentVerified: true, qrGenerated: false, registeredAt: '2025-01-16T09:00:00Z' },
  { id: 'STU-004', name: 'Sarah Williams', matricNumber: 'SE/2020/008', department: 'Software Engineering', level: '400', course: 'SE 402', paymentVerified: false, qrGenerated: false, registeredAt: '2025-01-16T14:30:00Z' },
  { id: 'STU-005', name: 'David Brown', matricNumber: 'CSC/2021/020', department: 'Computer Science', level: '300', course: 'CSC 301', paymentVerified: true, qrGenerated: true, registeredAt: '2025-01-17T08:15:00Z' },
  { id: 'STU-006', name: 'Emily Davis', matricNumber: 'EE/2020/003', department: 'Electrical Engineering', level: '400', course: 'EE 405', paymentVerified: true, qrGenerated: true, registeredAt: '2025-01-17T10:45:00Z' },
  { id: 'STU-007', name: 'Chris Wilson', matricNumber: 'ME/2021/011', department: 'Mechanical Engineering', level: '300', course: 'ME 302', paymentVerified: false, qrGenerated: false, registeredAt: '2025-01-18T13:00:00Z' },
  { id: 'STU-008', name: 'Lisa Anderson', matricNumber: 'BA/2020/005', department: 'Business Administration', level: '400', course: 'BA 401', paymentVerified: true, qrGenerated: true, registeredAt: '2025-01-18T15:30:00Z' },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { registeredStudents } = useStore();

  const allStudents = [...mockStudents, ...registeredStudents];

  const stats = useMemo(() => ({
    total: allStudents.length,
    verified: allStudents.filter(s => s.paymentVerified).length,
    pending: allStudents.filter(s => !s.paymentVerified).length,
    qrGenerated: allStudents.filter(s => s.qrGenerated).length,
  }), [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const matchesSearch =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === 'all' ||
        (filterStatus === 'verified' && student.paymentVerified) ||
        (filterStatus === 'pending' && !student.paymentVerified) ||
        (filterStatus === 'qr' && student.qrGenerated);

      return matchesSearch && matchesFilter;
    });
  }, [allStudents, searchTerm, filterStatus]);

  const statCards = [
    { label: 'Total Students', value: stats.total, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Payment Verified', value: stats.verified, icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { label: 'Pending Payment', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
    { label: 'QR Generated', value: stats.qrGenerated, icon: QrCode, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Overview of student registrations and verifications
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Placeholder */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-brand-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Registration Trend</h3>
                </div>
                <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chart visualization</p>
                    <p className="text-xs text-gray-400">Registrations over time</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-brand-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Verification Status</h3>
                </div>
                <div className="h-48 flex items-center justify-center">
                  <div className="space-y-4 w-full">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Payment Verified</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.total > 0 ? (stats.verified / stats.total) * 100 : 0}%` }}
                          transition={{ delay: 0.6, duration: 1 }}
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">QR Generated</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stats.total > 0 ? Math.round((stats.qrGenerated / stats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.total > 0 ? (stats.qrGenerated / stats.total) * 100 : 0}%` }}
                          transition={{ delay: 0.8, duration: 1 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Pending</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                          transition={{ delay: 1, duration: 1 }}
                          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Student Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Registered Students
                  </h3>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:w-64">
                      <Input
                        icon={Search}
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="input-field w-auto"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="qr">QR Generated</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matric No.</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Department</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">QR Code</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-700 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                {student.name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">{student.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{student.course}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{student.matricNumber}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{student.department}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge status={student.paymentVerified ? 'success' : 'pending'}>
                            {student.paymentVerified ? 'Verified' : 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <Badge status={student.qrGenerated ? 'success' : 'pending'}>
                            {student.qrGenerated ? 'Generated' : 'Not Yet'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {student.registeredAt ? format(new Date(student.registeredAt), 'MMM dd, yyyy') : 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No students found</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
