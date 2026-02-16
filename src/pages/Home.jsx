import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Zap, Lock, QrCode, Users, ArrowRight, Sparkles, GraduationCap, ScanLine, LogIn } from 'lucide-react';
import { heroMockups, mockStudentPhotos, generateAvatar } from '../utils/mockImages';

export default function Home() {
  const features = [
    { icon: Shield, title: 'AES-256 Encryption', description: 'Military-grade encryption protects every QR code with tamper-proof security', color: 'from-sky-500 to-sky-600' },
    { icon: QrCode, title: 'One-Time QR Codes', description: 'Each code self-destructs after a single scan, eliminating impersonation', color: 'from-terracotta-500 to-terracotta-600' },
    { icon: Zap, title: 'Instant Verification', description: 'Verify student identity in under 2 seconds with real-time validation', color: 'from-warning-500 to-warning-600' },
    { icon: Lock, title: 'Secure Payment', description: 'Seamless Remita integration for verified exam fee processing', color: 'from-sage-500 to-sage-600' },
  ];

  const stats = [
    { value: '10K+', label: 'Students Verified', color: 'text-terracotta' },
    { value: '99.9%', label: 'Success Rate', color: 'text-sage' },
    { value: '<2s', label: 'Avg. Scan Time', color: 'text-warning' },
    { value: '256-bit', label: 'Encryption', color: 'text-sky' },
  ];

  const steps = [
    { step: '01', title: 'Register & Upload', description: 'Create your profile with university credentials and a passport photo', icon: Users, accent: 'bg-sky-500' },
    { step: '02', title: 'Pay Exam Fees', description: 'Complete payment via Remita — instant confirmation, no delays', icon: Lock, accent: 'bg-sage-500' },
    { step: '03', title: 'Receive QR Pass', description: 'Get your unique, encrypted QR code — valid for one-time exam entry', icon: QrCode, accent: 'bg-terracotta-500' },
    { step: '04', title: 'Walk In Verified', description: 'Present your QR code at the hall — scanned, verified, admitted', icon: CheckCircle, accent: 'bg-warning-500' },
  ];

  const testimonialAvatars = mockStudentPhotos.slice(0, 4);

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroMockups.examHall})` }}
        />
        <div className="absolute inset-0 bg-anthracite/95" />
        <div className="absolute inset-0 pattern-grid opacity-10" />

        <div className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-parchment text-sm font-heading font-medium mb-8 border border-white/10"
              >
                <Sparkles className="w-4 h-4 text-terracotta" />
                Trusted by 50+ Nigerian Universities
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-heading font-bold leading-[1.1] mb-6 text-parchment">
                Stop Exam Fraud.{' '}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-terracotta via-terracotta-light to-warning">
                  Verify Instantly.
                </span>
              </h1>

              <p className="text-lg text-stone mb-10 max-w-xl leading-relaxed font-body">
                Encrypted, one-time-use QR codes that verify student identity at the exam hall door. No more impersonation. No more paper hassles.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/auth/signup?role=student"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-parchment rounded-xl font-heading font-semibold shadow-lg hover:shadow-xl hover:bg-terracotta-dark transition-all"
                >
                  <GraduationCap className="w-5 h-5" />
                  Get Started as Student
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/auth/login"
                  className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-white/10 text-parchment rounded-xl font-heading font-semibold hover:bg-white/5 transition-all"
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
                      className="w-10 h-10 rounded-full border-2 border-anthracite object-cover"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-anthracite bg-terracotta flex items-center justify-center text-parchment text-xs font-bold">
                    +9K
                  </div>
                </div>
                <div className="text-sm text-stone font-heading">
                  <span className="text-parchment font-semibold">10,000+</span> students verified this semester
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
                <div className="bg-parchment rounded-3xl shadow-2xl p-8 w-80 border border-sand">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-anthracite rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-anthracite text-base">Exam Pass</h3>
                      <p className="text-xs text-stone font-heading">2024/2025 Session</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-5 p-3 bg-sand/50 rounded-xl">
                    <img
                      src={generateAvatar('Adebayo Johnson')}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-heading font-semibold text-anthracite text-sm">Adebayo Johnson</p>
                      <p className="text-xs text-stone font-heading">CSC/2020/001 - Computer Science</p>
                    </div>
                  </div>

                  <div className="w-48 h-48 bg-white rounded-2xl mx-auto mb-5 flex items-center justify-center p-4 border-2 border-sand">
                    <QrCode className="w-full h-full text-anthracite" />
                  </div>

                  <div className="flex items-center justify-center gap-2 py-2 bg-sage-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-sage" />
                    <span className="text-sm font-heading font-semibold text-sage">Verified & Active</span>
                  </div>
                </div>
              </motion.div>

              {/* Background scan card */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-6 top-12 z-0"
              >
                <div className="bg-parchment/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 w-52 border border-sand">
                  <div className="flex items-center gap-2 mb-2">
                    <ScanLine className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-heading font-semibold text-anthracite">Live Scan</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sage" />
                      <span className="text-xs text-stone font-heading">CSC/2020/045 - Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sage" />
                      <span className="text-xs text-stone font-heading">ENG/2021/112 - Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                      <span className="text-xs text-stone font-heading">MED/2022/034 - Scanning...</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative blurs */}
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-terracotta-200 blur-3xl rounded-full opacity-20" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-sage-200 blur-3xl rounded-full opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-b border-sand">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
                <div className={`text-3xl sm:text-4xl font-heading font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-stone font-heading font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-parchment py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-heading font-semibold text-terracotta uppercase tracking-wide mb-3">Why ExamVerify</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-anthracite mb-4">
              Security at Every Layer
            </h2>
            <p className="text-lg text-stone font-body max-w-2xl mx-auto">
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
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-sand"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-anthracite mb-2 text-base">{feature.title}</h3>
                <p className="text-sm text-stone font-body leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24 border-y border-sand">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-heading font-semibold text-terracotta uppercase tracking-wide mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-anthracite mb-4">
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
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-sand flex items-center justify-center">
                      <span className="text-xs font-bold text-anthracite font-heading">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-anthracite mb-2">{step.title}</h3>
                  <p className="text-sm text-stone font-body leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[65%] w-[70%]">
                    <div className="border-t-2 border-dashed border-sand" />
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
        <div className="absolute inset-0 bg-anthracite/90" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-heading font-semibold text-terracotta uppercase tracking-wide mb-4">For Examiners</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-parchment mb-4">
              Real-time Dashboard. Instant Scanning.
            </h2>
            <p className="text-lg text-stone font-body mb-10 max-w-xl mx-auto">
              Examiners get a dedicated portal with live scan stats, student verification, and exam hall management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/signup?role=examiner"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-parchment rounded-xl font-heading font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <ScanLine className="w-5 h-5" />
                Join as Examiner
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/auth/login?role=examiner"
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-white/10 text-parchment rounded-xl font-heading font-semibold hover:bg-white/5 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Examiner Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white py-16 border-t border-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-12 h-12 text-terracotta mx-auto mb-4" />
          <h3 className="text-2xl font-heading font-bold text-anthracite mb-2">
            Ready to secure your exams?
          </h3>
          <p className="text-stone font-body mb-6">
            Create an account to get started. Students and examiners welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/auth/signup?role=student"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-terracotta hover:bg-terracotta-dark text-parchment rounded-xl font-heading font-semibold transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Student Sign Up
            </Link>
            <Link
              to="/auth/signup?role=examiner"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-stone text-stone hover:text-anthracite hover:bg-sand rounded-xl font-heading font-semibold transition-colors"
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
