import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Camera, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import api from '../../services/api';
import { PageTransition } from '../../components/layout/PageTransition';

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Photo Upload', icon: Camera },
  { id: 3, title: 'Payment', icon: CreditCard },
  { id: 4, title: 'Complete', icon: CheckCircle },
];

const faculties = [
  'Science', 'Engineering', 'Arts', 'Social Sciences', 'Law',
  'Medicine', 'Education', 'Agriculture', 'Management Sciences',
  'Environmental Sciences', 'Pharmacy',
];

const levels = ['100', '200', '300', '400', '500', '600'];

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const { register, handleSubmit, formState: { errors }, getValues, trigger } = useForm();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Photo must be less than 10MB');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG files are allowed');
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const valid = await trigger(['matricNumber', 'faculty', 'department', 'level']);
      if (!valid) return;
    }

    if (currentStep === 2) {
      if (!photoFile) {
        toast.error('Please upload your photo');
        return;
      }

      // Submit registration
      setLoading(true);
      try {
        const values = getValues();
        const formData = new FormData();
        formData.append('matricNumber', values.matricNumber);
        formData.append('faculty', values.faculty);
        formData.append('department', values.department);
        formData.append('level', values.level);
        formData.append('photo', photoFile);

        const response = await api.post('/student/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Initiate payment
        const paymentResponse = await api.post('/payment/initiate');
        setPaymentData(paymentResponse.data);

        toast.success('Registration successful!');
        setCurrentStep(3);
      } catch (error) {
        toast.error(error?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                  currentStep >= step.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`hidden sm:block ml-2 text-sm font-medium ${
                  currentStep >= step.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    currentStep > step.id
                      ? 'bg-primary-600'
                      : 'bg-neutral-200 dark:bg-neutral-800'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-6">
                    Personal Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Matric Number
                      </label>
                      <input
                        {...register('matricNumber', { required: 'Matric number is required' })}
                        className="input-field"
                        placeholder="e.g., 2020/1/12345CS"
                      />
                      {errors.matricNumber && (
                        <p className="text-sm text-red-500 mt-1">{errors.matricNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Faculty
                      </label>
                      <select
                        {...register('faculty', { required: 'Faculty is required' })}
                        className="input-field"
                      >
                        <option value="">Select Faculty</option>
                        {faculties.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                      {errors.faculty && (
                        <p className="text-sm text-red-500 mt-1">{errors.faculty.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Department
                      </label>
                      <input
                        {...register('department', { required: 'Department is required' })}
                        className="input-field"
                        placeholder="e.g., Computer Science"
                      />
                      {errors.department && (
                        <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Level
                      </label>
                      <select
                        {...register('level', { required: 'Level is required' })}
                        className="input-field"
                      >
                        <option value="">Select Level</option>
                        {levels.map(l => (
                          <option key={l} value={l}>{l} Level</option>
                        ))}
                      </select>
                      {errors.level && (
                        <p className="text-sm text-red-500 mt-1">{errors.level.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Photo Upload */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-6">
                    Upload Your Photo
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Upload a clear passport-style photo. Max 10MB, JPG or PNG only.
                  </p>

                  {!photoPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl cursor-pointer hover:border-primary-500 transition-colors bg-neutral-50 dark:bg-neutral-800/50">
                      <Upload className="w-12 h-12 text-neutral-400 mb-4" />
                      <span className="text-neutral-600 dark:text-neutral-400 font-medium">Click to upload photo</span>
                      <span className="text-sm text-neutral-400 mt-1">JPG, PNG - Max 10MB</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative w-64 mx-auto">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-64 h-64 object-cover rounded-2xl border-2 border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-6">
                    Payment Details
                  </h2>

                  {paymentData ? (
                    <div className="space-y-4">
                      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-neutral-500">Order ID</p>
                            <p className="font-semibold text-neutral-900 dark:text-white">{paymentData.orderId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">RRR</p>
                            <p className="font-semibold text-primary-600">{paymentData.rrr}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">Amount</p>
                            <p className="font-semibold text-neutral-900 dark:text-white">
                              &#8358;{paymentData.amount?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">Status</p>
                            <span className="badge-warning">Pending</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl p-4">
                        <p className="text-sm text-warning-800 dark:text-warning-200">
                          Please complete your payment using the RRR above on the Remita platform. Your QR code will be generated automatically once payment is confirmed.
                        </p>
                      </div>

                      <a
                        href={`https://remitademo.net/remita/onepage/biller/${paymentData.rrr}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center btn-primary"
                      >
                        Pay on Remita
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-neutral-500">Loading payment details...</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Complete */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-success-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-4">
                    Registration Complete!
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                    Your registration has been submitted. Complete payment to receive your QR code.
                  </p>
                  <button
                    onClick={() => navigate('/student/dashboard')}
                    className="btn-primary"
                  >
                    Go to Dashboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                {currentStep > 1 && currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : currentStep === 3 ? 'Continue' : 'Next'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
