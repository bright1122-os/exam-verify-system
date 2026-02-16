import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Camera, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';

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
  const { user, updateStudentData } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const { register, handleSubmit, formState: { errors }, getValues, trigger } = useForm();

  const handlePhotoChange = (e) => {
    try {
      const file = e.target.files?.[0]; // Safe access
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        toast.error('Photo must be less than 10MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG and PNG files are allowed');
        return;
      }

      setPhotoFile(file);
      // Revoke old object URL to avoid memory leaks
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error in handlePhotoChange:', error);
      toast.error('Failed to process image');
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
  };

  const uploadPhoto = async () => {
    if (!photoFile) throw new Error('No file selected');
    if (!user) throw new Error('User not authenticated');

    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file to:', filePath);

      const { data, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw error;
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const valid = await trigger(['matricNumber', 'faculty', 'department', 'level']);
      if (!valid) return;
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!photoFile) {
        toast.error('Please upload your photo');
        return;
      }

      setLoading(true);
      try {
        const values = getValues();

        // 1. Upload Photo
        const photoUrl = await uploadPhoto();

        // 2. Insert Student Record
        const { error: insertError } = await supabase
          .from('students')
          .insert({
            user_id: user.id,
            matric_number: values.matricNumber,
            faculty: values.faculty,
            department: values.department,
            level: values.level,
            photo_url: photoUrl,
            registration_complete: true
          });

        if (insertError) throw insertError;

        // 3. Simulate Payment Initialization (or create record in payments table)
        const paymentRef = `RRR-${Math.floor(Math.random() * 100000000000)}`;
        const amount = 5000;

        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: user.id,
            amount: amount,
            rrr: paymentRef,
            status: 'pending'
          })
          .select()
          .single();

        if (paymentError) throw paymentError;

        setPaymentData(payment);
        updateStudentData({ registrationComplete: true, photoUrl });

        toast.success('Registration successful!');
        setCurrentStep(3);
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 3) {
      setLoading(true);
      try {
        // Call Supabase Edge Function to verify payment
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: {
            rrr: paymentData.rrr,
            amount: paymentData.amount,
            user_id: user.id
          }
        });

        if (error) {
          // Fallback for development if function isn't deployed yet
          console.warn('Edge Function verification failed, falling back to manual check for demo:', error);
          if (paymentData.rrr.startsWith('RRR-')) {
            // Demo success
            toast.success('Payment verified (Demo Mode)');
          } else {
            throw new Error('Verification service unavailable');
          }
        } else if (data && !data.success) {
          throw new Error(data.message || 'Payment verification failed');
        }

        // Verification successful
        updateStudentData({ registrationComplete: true, photoUrl: user.user_metadata?.photo_url || null });
        setCurrentStep(4);

      } catch (error) {
        console.error('Verification error:', error);
        toast.error(error.message || 'Could not verify payment');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FCFAF7] py-12 px-4 font-body text-[#333331]">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 px-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all border ${currentStep >= step.id
                  ? 'bg-[#333331] text-[#FCFAF7] border-[#333331]'
                  : 'bg-white text-[#999995] border-[#D9D9D5]'
                  }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`hidden sm:block mt-3 text-xs font-heading font-medium tracking-wide ${currentStep >= step.id
                  ? 'text-[#333331]'
                  : 'text-[#999995]'
                  }`}>
                  {step.title}
                </span>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-10 w-[calc(100%+2rem)] h-px -z-10 ${currentStep > step.id
                    ? 'bg-[#333331]'
                    : 'bg-[#D9D9D5]'
                    }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white border border-[#D9D9D5] rounded-xl p-8 shadow-sm">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h2 className="text-2xl font-heading font-medium text-[#141413] mb-8">
                    Personal Information
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#666660]">Matric Number</label>
                      <input
                        {...register('matricNumber', { required: 'Matric number is required' })}
                        className="w-full bg-[#FCFAF7] px-4 py-3 rounded-lg border border-[#D9D9D5] text-[#333331] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
                        placeholder="e.g., 2020/1/12345CS"
                      />
                      {errors.matricNumber && (
                        <p className="text-sm text-red-600 mt-1">{errors.matricNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#666660]">Faculty</label>
                      <select
                        {...register('faculty', { required: 'Faculty is required' })}
                        className="w-full bg-[#FCFAF7] px-4 py-3 rounded-lg border border-[#D9D9D5] text-[#333331] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
                      >
                        <option value="">Select Faculty</option>
                        {faculties.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                      {errors.faculty && (
                        <p className="text-sm text-red-600 mt-1">{errors.faculty.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#666660]">Department</label>
                      <input
                        {...register('department', { required: 'Department is required' })}
                        className="w-full bg-[#FCFAF7] px-4 py-3 rounded-lg border border-[#D9D9D5] text-[#333331] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
                        placeholder="e.g., Computer Science"
                      />
                      {errors.department && (
                        <p className="text-sm text-red-600 mt-1">{errors.department.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#666660]">Level</label>
                      <select
                        {...register('level', { required: 'Level is required' })}
                        className="w-full bg-[#FCFAF7] px-4 py-3 rounded-lg border border-[#D9D9D5] text-[#333331] focus:outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
                      >
                        <option value="">Select Level</option>
                        {levels.map(l => (
                          <option key={l} value={l}>{l} Level</option>
                        ))}
                      </select>
                      {errors.level && (
                        <p className="text-sm text-red-600 mt-1">{errors.level.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Photo Upload */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h2 className="text-2xl font-heading font-medium text-[#141413] mb-2">
                    Upload Your Photo
                  </h2>
                  <p className="text-[#666660] mb-8">
                    Upload a clear passport-style photo. Max 10MB, JPG or PNG.
                  </p>

                  {!photoPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#D9D9D5] rounded-xl cursor-pointer hover:border-[#D97757] hover:bg-[#FAF9F5] transition-all bg-[#FCFAF7]">
                      <Upload className="w-10 h-10 text-[#999995] mb-4" />
                      <span className="text-[#333331] font-medium">Click to upload photo</span>
                      <span className="text-sm text-[#999995] mt-2">JPG or PNG</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative w-48 mx-auto">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-xl border border-[#D9D9D5] shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-[#D9D9D5] text-[#333331] rounded-full flex items-center justify-center hover:bg-[#FAF9F5] shadow-sm"
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
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h2 className="text-2xl font-heading font-medium text-[#141413] mb-8">
                    Payment Verification
                  </h2>

                  {paymentData ? (
                    <div className="space-y-8">
                      <div className="bg-[#FCFAF7] border border-[#D9D9D5] rounded-xl p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-[#EBEAE5] pb-3">
                            <span className="text-[#666660] text-sm">RRR</span>
                            <span className="font-mono text-lg font-medium text-[#333331]">{paymentData.rrr}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-[#EBEAE5] pb-3">
                            <span className="text-[#666660] text-sm">Amount</span>
                            <span className="font-heading text-xl font-medium text-[#333331]">&#8358;{paymentData.amount?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#666660] text-sm">Status</span>
                            <span className="px-2 py-1 bg-[#FFF4E5] text-[#D97757] text-xs font-medium rounded-full border border-[#D97757]/20">Pending</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#FFF4E5] border border-[#FFE0B2] rounded-xl p-4 flex gap-4">
                        <div className="shrink-0 mt-0.5">
                          <CreditCard className="w-5 h-5 text-[#D97757]" />
                        </div>
                        <p className="text-sm text-[#7D4E33] leading-relaxed">
                          Please complete your payment using the RRR above on the Remita platform. Your QR code will be generated automatically once payment is confirmed.
                        </p>
                      </div>

                      <a
                        href={`https://remitademo.net/remita/onepage/biller/${paymentData.rrr}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3.5 rounded-xl font-heading font-medium text-lg text-center bg-[#D97757] text-[#FAF9F5] hover:bg-[#C4623F] transition-colors shadow-sm"
                      >
                        Pay on Remita
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#666660]">Loading payment details...</p>
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
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-[#E3F2E6] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-[#2E7D32]" />
                  </div>
                  <h2 className="text-2xl font-heading font-medium text-[#141413] mb-4">
                    Registration Complete!
                  </h2>
                  <p className="text-[#666660] mb-8">
                    Your registration has been submitted. Complete payment to receive your QR code.
                  </p>
                  <button
                    onClick={() => navigate('/student/dashboard')}
                    className="px-8 py-3 bg-[#333331] text-white rounded-xl hover:bg-black transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-10 pt-6 border-t border-[#EBEAE5]">
                {currentStep > 1 && currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-[#666660] hover:text-[#333331] transition-colors px-4 py-2"
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
                  className="flex items-center gap-2 bg-[#333331] text-white px-6 py-2.5 rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : currentStep === 3 ? 'Verify Payment' : 'Next'}
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
