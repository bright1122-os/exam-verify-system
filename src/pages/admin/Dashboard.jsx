import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Users,
  CheckCircle,
  Clock,
  QrCode,
  Search,
  Shield,
  Download,
  Filter
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { useStore } from '../../store/useStore';

// Mock data for admin dashboard
const mockStudents = [
  { id: 'STU-001', name: 'John Doe', matricNumber: 'CSC/2020/001', department: 'Computer Science', level: '400', course: 'CSC 401', paymentVerified: true, qrGenerated: true, registeredAt: '2025-01-15T10:30:00Z' },
  { id: 'STU-002', name: 'Jane Smith', matricNumber: 'CSC/2020/002', department: 'Computer Science', level: '400', course: 'CSC 401', paymentVerified: true, qrGenerated: true, registeredAt: '2025-01-15T11:00:00Z' },
  { id: 'STU-003', name: 'Mike Johnson', matricNumber: 'IT/2021/015', department: 'Information Technology', level: '300', course: 'IT 301', paymentVerified: true, qrGenerated: false, registeredAt: '2025-01-16T09:00:00Z' },
  { id: 'STU-004', name: 'Sarah Williams', matricNumber: 'SE/2020/008', department: 'Software Engineering', level: '400', course: 'SE 402', paymentVerified: false, qrGenerated: false, registeredAt: '2025-01-16T14:30:00Z' },
  { id: 'STU-005', name: 'David Brown', matricNumber: 'CSC/2021/020', department: 'Computer Science', level: '300', course: 'CSC 301', paymentVerified: true, qrGenerated: true, registeredAt: '2025-01-17T08:15:00Z' },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
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
        filterStatus === 'ALL' ||
        (filterStatus === 'VERIFIED' && student.paymentVerified) ||
        (filterStatus === 'PENDING' && !student.paymentVerified) ||
        (filterStatus === 'QR' && student.qrGenerated);

      return matchesSearch && matchesFilter;
    });
  }, [allStudents, searchTerm, filterStatus]);

  const statCards = [
    { label: 'Total Enrolled', value: stats.total, icon: Users, color: 'text-charcoal', bg: 'bg-charcoal/10' },
    { label: 'Clearance Granted', value: stats.verified, icon: CheckCircle, color: 'text-sage', bg: 'bg-sage/10' },
    { label: 'Pending Action', value: stats.pending, icon: Clock, color: 'text-rust', bg: 'bg-rust/10' },
    { label: 'Passes Issued', value: stats.qrGenerated, icon: QrCode, color: 'text-charcoal-light', bg: 'bg-charcoal/5' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f2f0e9] py-32 px-6 font-body text-charcoal selection:bg-charcoal/20 selection:text-charcoal">
        <div className="max-w-[1200px] mx-auto">

          {/* Header Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'organic' }}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-charcoal/10"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft">
                  <Shield className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-charcoal-light tracking-wide">
                  Administrative Overview
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-heading tracking-tight leading-none text-charcoal">
                System Ledger.
              </h1>
            </div>

            <button className="bg-white text-charcoal-light px-6 py-3 rounded-full text-sm font-medium shadow-soft hover:shadow-float hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-organic flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </motion.div>

          {/* Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.8, ease: 'organic' }}>
                  <div className="bg-white p-8 rounded-[2rem] shadow-soft hover:shadow-float transition-all duration-500 ease-organic flex flex-col gap-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-4xl font-heading text-charcoal mb-1">{stat.value}</p>
                      <p className="text-sm font-medium text-charcoal-light">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Ledger Table Block */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: 'organic' }}>
            <div className="container-editorial">

              {/* Table Controls */}
              <div className="p-8 border-b border-charcoal/10 flex flex-col sm:flex-row gap-6 justify-between items-center bg-white/50">
                <h3 className="text-2xl font-heading text-charcoal flex items-center gap-3">
                  <Filter className="w-5 h-5 text-charcoal" strokeWidth={1.5} /> Network Audit
                </h3>

                <div className="flex w-full sm:w-auto gap-4">
                  <div className="relative flex-1 sm:w-72">
                    <input
                      className="w-full bg-[#f2f0e9] border border-transparent rounded-full px-5 py-3 text-sm font-medium placeholder:text-charcoal/40 focus:outline-none focus:bg-white focus:border-charcoal/20 focus:shadow-soft transition-all duration-500 ease-organic"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                  </div>

                  <select
                    className="bg-[#f2f0e9] border border-transparent rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:bg-white focus:border-charcoal/20 focus:shadow-soft transition-all duration-500 ease-organic appearance-none pr-10 relative"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="ALL">All Status</option>
                    <option value="VERIFIED">Cleared</option>
                    <option value="PENDING">Pending</option>
                    <option value="QR">Pass Generated</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f0e9]/30 border-b border-charcoal/10 text-charcoal-light text-xs font-semibold uppercase tracking-wider">
                      <th className="p-6 whitespace-nowrap">Identity</th>
                      <th className="p-6 whitespace-nowrap">Matriculation</th>
                      <th className="p-6 whitespace-nowrap hidden md:table-cell">Department</th>
                      <th className="p-6 whitespace-nowrap">Clearance</th>
                      <th className="p-6 whitespace-nowrap hidden sm:table-cell">Pass Status</th>
                      <th className="p-6 whitespace-nowrap hidden lg:table-cell">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-charcoal font-medium">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-[#f2f0e9] hover:bg-[#f2f0e9]/30 transition-colors duration-300">
                        <td className="p-6 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-charcoal text-[#f2f0e9] flex items-center justify-center font-heading text-lg">
                            {student.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-charcoal text-base">{student.name}</div>
                            <div className="text-xs text-charcoal-light mt-0.5">{student.course}</div>
                          </div>
                        </td>
                        <td className="p-6 font-mono text-charcoal-light tracking-tight whitespace-nowrap text-xs">
                          {student.matricNumber}
                        </td>
                        <td className="p-6 hidden md:table-cell text-charcoal-light max-w-[150px] truncate">
                          {student.department}
                        </td>
                        <td className="p-6 whitespace-nowrap">
                          {student.paymentVerified ? (
                            <span className="bg-sage/10 text-sage border border-sage/20 px-3 py-1 rounded-full text-xs font-medium">Verified</span>
                          ) : (
                            <span className="bg-rust/10 text-rust border border-rust/20 px-3 py-1 rounded-full text-xs font-medium">Pending</span>
                          )}
                        </td>
                        <td className="p-6 hidden sm:table-cell whitespace-nowrap">
                          {student.qrGenerated ? (
                            <span className="text-charcoal flex items-center gap-2 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-sage"></span> Active
                            </span>
                          ) : (
                            <span className="text-charcoal-light flex items-center gap-2 text-xs font-medium opacity-60">
                              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-light"></span> Awaiting
                            </span>
                          )}
                        </td>
                        <td className="p-6 hidden lg:table-cell text-charcoal-light whitespace-nowrap text-xs">
                          {student.registeredAt ? format(new Date(student.registeredAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-20 bg-[#f2f0e9]/10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f2f0e9] mb-4">
                      <Search className="w-6 h-6 text-charcoal-light opacity-50" />
                    </div>
                    <p className="text-charcoal-light font-medium">No records found matching your query.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
