import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Zap, Lock, QrCode, Users, ArrowRight, Sparkles, GraduationCap, ScanLine, LogIn } from 'lucide-react';
import { heroMockups, mockStudentPhotos, generateAvatar } from '../utils/mockImages';

export default function Home() {
  const features = [
    { icon: Shield, title: 'AES-256 Encryption', description: 'Military-grade encryption protects every QR code with tamper-proof security', color: 'from-blue-500 to-indigo-600' },
    { icon: QrCode, title: 'One-Time QR Codes', description: 'Each code self-destructs after a single scan, eliminating impersonation', color: 'from-violet-500 to-purple-600' },
    { icon: Zap, title: 'Instant Verification', description: 'Verify student identity in under 2 seconds with real-time validation', color: 'from-amber-500 to-orange-600' },
    { icon: Lock, title: 'Secure Payment', description: 'Seamless Remita integration for verified exam fee processing', color: 'from-emerald-500 to-green-600' },
  ];

  const stats = [
    { value: '10K+', label: 'Students Verified', color: 'text-primary-600 dark:text-primary-400' },
    { value: '99.9%', label: 'Success Rate', color: 'text-emerald-600 dark:text-emerald-400' },
    { value: '<2s', label: 'Avg. Scan Time', color: 'text-amber-600 dark:text-amber-400' },
    { value: '256-bit', label: 'Encryption', color: 'text-violet-600 dark:text-violet-400' },
  ];

  const steps = [
    { step: '01', title: 'Register & Upload', description: 'Create your profile with university credentials and a passport photo', icon: Users, accent: 'bg-blue-500' },
    { step: '02', title: 'Pay Exam Fees', description: 'Complete payment via Remita — instant confirmation, no delays', icon: Lock, accent: 'bg-emerald-500' },
    { step: '03', title: 'Receive QR Pass', description: 'Get your unique, encrypted QR code — valid for one-time exam entry', icon: QrCode, accent: 'bg-violet-500' },
    { step: '04', title: 'Walk In Verified', description: 'Present your QR code at the hall — scanned, verified, admitted', icon: CheckCircle, accent: 'bg-amber-500' },
  ];

  const testimonialAvatars = mockStudentPhotos.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroMockups.examHall})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/90 to-neutral-950/95" />
        <div className="absolute inset-0 pattern-grid opacity-10" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary-300 text-sm font-medium mb-8 border border-white/10"
              >
                <Sparkles className="w-4 h-4" />
                Trusted by 50+ Nigerian Universities
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6 text-white">
                Stop Exam Fraud.{' '}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-blue-300 to-secondary-300">
                  Verify Instantly.
                </span>
              </h1>

              <p className="text-lg text-neutral-300 mb-10 max-w-xl leading-relaxed">
                Encrypted, one-time-use QR codes that verify student identity at the exam hall door. No more impersonation. No more paper hassles.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/auth/signup?role=student"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-neutral-50 transition-all"
                >
                  <GraduationCap className="w-5 h-5" />
                  Get Started as Student
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/auth/login"
                  className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {testimonialAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="w-10 h-10 rounded-full border-2 border-primary-900 object-cover"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-primary-900 bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                    +9K
                  </div>
                </div>
                <div className="text-sm text-neutral-400">
                  <span className="text-white font-semibold">10,000+</span> students verified this semester
                </div>
              </div>
            </motion.div>

            {/* Right: Floating Cards Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-center relative"
            >
              {/* Main QR Card */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-80 border border-neutral-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-base">Exam Pass</h3>
                      <p className="text-xs text-neutral-500">2024/2025 Session</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-5 p-3 bg-neutral-50 rounded-xl">
                    <img
                      src={generateAvatar('Adebayo Johnson')}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-neutral-900 text-sm">Adebayo Johnson</p>
                      <p className="text-xs text-neutral-500">CSC/2020/001 - Computer Science</p>
                    </div>
                  </div>

                  <div className="w-48 h-48 bg-neutral-900 rounded-2xl mx-auto mb-5 flex items-center justify-center p-4">
                    <QrCode className="w-full h-full text-white" />
                  </div>

                  <div className="flex items-center justify-center gap-2 py-2 bg-emerald-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Verified & Active</span>
                  </div>
                </div>
              </motion.div>

              {/* Background scan card */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-6 top-12 z-0"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 w-52 border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ScanLine className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-semibold text-neutral-700">Live Scan</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-neutral-600">CSC/2020/045 - Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-neutral-600">ENG/2021/112 - Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-xs text-neutral-600">MED/2022/034 - Scanning...</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative blurs */}
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-secondary-500/15 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl sm:text-4xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral-50 dark:bg-neutral-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">Why ExamVerify</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Security at Every Layer
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              From encryption to payment verification, every component is built for zero-compromise security.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-800"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 text-base">{feature.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white dark:bg-neutral-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Four Steps to Verified Entry
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-5">
                    <div className={`w-16 h-16 ${step.accent} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-neutral-800 rounded-full border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[65%] w-[70%]">
                    <div className="border-t-2 border-dashed border-neutral-200 dark:border-neutral-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Hall Preview */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroMockups.scanning})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 to-primary-900/80" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-primary-300 uppercase tracking-wide mb-4">For Examiners</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Real-time Dashboard. Instant Scanning.
            </h2>
            <p className="text-lg text-primary-100 mb-10 max-w-xl mx-auto">
              Examiners get a dedicated portal with live scan stats, student verification, and exam hall management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/signup?role=examiner"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <ScanLine className="w-5 h-5" />
                Join as Examiner
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/auth/login?role=examiner"
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Examiner Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white dark:bg-neutral-900 py-16 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Ready to secure your exams?
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Create an account to get started. Students and examiners welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/auth/signup?role=student"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Student Sign Up
            </Link>
            <Link
              to="/auth/signup?role=examiner"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <ScanLine className="w-4 h-4" />
              Examiner Sign Up
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
