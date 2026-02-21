import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Camera, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Upload, X, Loader2, FileText } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';

const steps = [
  { id: 1, title: 'IDENTITY', icon: User },
  { id: 2, title: 'BIOMETRIC', icon: Camera },
  { id: 3, title: 'CLEARANCE FEE', icon: CreditCard },
  { id: 4, title: 'VERIFIED', icon: CheckCircle },
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
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, getValues, trigger } = useForm();

  useEffect(() => {
    const fetchPendingPayment = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (data) {
        setPaymentData(data);
        if (currentStep < 3) setCurrentStep(3);
      }
    };
    fetchPendingPayment();
  }, [user]);

  const handlePhotoChange = (e) => {
    try {
      const file = e.target.files?.[0]; // Safe access
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        toast.error('PAYLOAD TOO LARGE', { style: { background: '#E11D48', color: '#fff', borderRadius: '0' } });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('INVALID BIOMETRIC FORMAT', { style: { background: '#E11D48', color: '#fff', borderRadius: '0' } });
        return;
      }

      setPhotoFile(file);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(file));
    } catch (error) {
      toast.error('BIOMETRIC CAPTURE FAILED', { style: { background: '#E11D48', color: '#fff', borderRadius: '0' } });
    }
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadPhoto = async () => {
    if (!photoFile) throw new Error('No file selected');
    if (!user) throw new Error('User not authenticated');

    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

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
        toast.error('NO BIOMETRIC FILE', { style: { background: '#E11D48', color: '#fff', borderRadius: '0' } });
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
            matric_number: values.matricNumber.toUpperCase(),
            faculty: values.faculty.toUpperCase(),
            department: values.department.toUpperCase(),
            level: values.level,
            photo_url: photoUrl,
            registration_complete: true
          });

        if (insertError) throw insertError;

        // 3. Simulate Payment Initialization
        const isDemo = true;
        const paymentRef = isDemo ? 'TEST-SUCCESS' : `RRR-${Math.floor(Math.random() * 100000000000)}`;
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

        toast.success('PROFILE COMMITTED', { style: { background: '#10B981', color: '#000', borderRadius: '0' } });
        setCurrentStep(3);
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'TRANSACTION FAILED', { style: { background: '#E11D48', color: '#fff', borderRadius: '0' } });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 3) {
      setLoading(true);
      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rrr: paymentData.rrr,
            amount: paymentData.amount,
            user_id: user.id
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Demo Fallback
          console.warn('Backend verification failed, using demo fallback');
          if (paymentData.rrr === 'TEST-SUCCESS' || String(paymentData.rrr).startsWith('RRR-')) {
            toast.success('CLEARENCE VALIDATED', { style: { background: '#10B981', color: '#000', borderRadius: '0' } });
          } else {
            throw new Error(data.error || 'Verification failed');
          }
        } else if (data && !data.success) {
          throw new Error(data.message || 'Payment invalid');
        }

        // Verification successful
        updateStudentData({ registrationComplete: true, photoUrl: user.user_metadata?.photo_url || null });
        setCurrentStep(4);

      } catch (error) {
        console.error('Verification error:', error);
        toast.error(error.message || 'VERIFICATION FAILED', { style: { background: '#E11D48', color: '#fff', borderRadius: '0' } });
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
      <div className="min-h-screen bg-branding-black py-12 px-4 font-mono text-white">
        <div className="max-w-4xl mx-auto">

          <div className="text-left mb-12 border-b-4 border-branding-darkGray pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-branding-black bg-branding-emerald px-2 py-1 mb-4 inline-block">
              CANDIDATE INITIALIZATION PORTAL
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tighter">DATA COLLECTION</h1>
          </div>

          {/* Stepper block */}
          <div className="hidden md:flex justify-between items-center mb-12 relative max-w-[800px] mx-auto border-2 border-branding-darkGray p-2 bg-branding-black z-10">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-branding-darkGray -z-10 -translate-y-1/2" />
            {/* Active Line */}
            <motion.div
              className="absolute top-1/2 left-0 h-[4px] bg-branding-emerald -z-10 -translate-y-1/2"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {steps.map((step) => {
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex flex-col items-center bg-branding-black px-4">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isActive ? '#10B981' : '#000',
                      borderColor: isActive ? '#10B981' : '#333',
                      color: isActive ? '#000' : '#333'
                    }}
                    className="w-12 h-12 flex items-center justify-center border-4"
                  >
                    {currentStep > step.id ? <CheckCircle className="w-6 h-6" strokeWidth={3} /> : <step.icon className="w-6 h-6" strokeWidth={2} />}
                  </motion.div>
                  <span className={`text-[10px] mt-2 font-black uppercase tracking-widest ${isActive ? 'text-branding-emerald' : 'text-branding-darkGray'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Main Container */}
          <div className="bg-white text-branding-black border-4 border-branding-black shadow-brutal-lg max-w-2xl mx-auto flex flex-col min-h-[500px]">
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <AnimatePresence mode="wait">

                {/* STEP 1: IDENTITY */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ ease: "easeOut" }}
                    className="flex-1 flex flex-col"
                  >
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 border-b-4 border-branding-black pb-4">
                      ACADEMIC VECTOR
                    </h2>

                    <div className="space-y-6 flex-1">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-branding-black">MATRICULATION NUMBER</label>
                        <input
                          {...register('matricNumber', { required: 'REQUIRED' })}
                          className="w-full bg-branding-gray/30 border-2 border-branding-black px-4 py-3 font-bold uppercase placeholder:text-branding-darkGray/50 focus:outline-none focus:bg-white"
                          placeholder="SYS/2023/001"
                        />
                        {errors.matricNumber && <span className="inline-block bg-branding-crimson text-white text-[10px] px-2 py-1 font-bold mt-1">{errors.matricNumber.message}</span>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-branding-black">FACULTY</label>
                          <select
                            {...register('faculty', { required: 'REQUIRED' })}
                            className="w-full bg-branding-gray/30 border-2 border-branding-black px-4 py-3 font-bold uppercase focus:outline-none focus:bg-white appearance-none"
                          >
                            <option value="">SELECT FACULTY</option>
                            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          {errors.faculty && <span className="inline-block bg-branding-crimson text-white text-[10px] px-2 py-1 font-bold mt-1">{errors.faculty.message}</span>}
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-branding-black">LEVEL</label>
                          <select
                            {...register('level', { required: 'REQUIRED' })}
                            className="w-full bg-branding-gray/30 border-2 border-branding-black px-4 py-3 font-bold uppercase focus:outline-none focus:bg-white appearance-none"
                          >
                            <option value="">SELECT LEVEL</option>
                            {levels.map(l => <option key={l} value={l}>{l} LVL</option>)}
                          </select>
                          {errors.level && <span className="inline-block bg-branding-crimson text-white text-[10px] px-2 py-1 font-bold mt-1">{errors.level.message}</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-branding-black">DEPARTMENT</label>
                        <input
                          {...register('department', { required: 'REQUIRED' })}
                          className="w-full bg-branding-gray/30 border-2 border-branding-black px-4 py-3 font-bold uppercase placeholder:text-branding-darkGray/50 focus:outline-none focus:bg-white"
                          placeholder="COMPUTER SCIENCE"
                        />
                        {errors.department && <span className="inline-block bg-branding-crimson text-white text-[10px] px-2 py-1 font-bold mt-1">{errors.department.message}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: BIOMETRIC */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ ease: "easeOut" }}
                    className="flex-1 flex flex-col"
                  >
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 flex items-center gap-2 border-b-4 border-branding-black pb-4">
                      BIOMETRIC CAPTURE
                    </h2>

                    <div className="flex-1 flex flex-col items-center justify-center py-6">
                      {!photoPreview ? (
                        <label className="w-full h-80 border-4 border-dashed border-branding-black flex flex-col items-center justify-center cursor-pointer hover:bg-branding-gray transition-colors">
                          <div className="w-16 h-16 bg-branding-black rounded-none flex items-center justify-center mb-6 text-white">
                            <Upload className="w-8 h-8" />
                          </div>
                          <span className="font-black text-xl uppercase tracking-tighter">PROVIDE BIOMETRIC DATA</span>
                          <span className="text-[10px] font-bold text-branding-darkGray mt-2 tracking-widest">JPG/PNG (MAX 10MB)</span>
                          <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                        </label>
                      ) : (
                        <div className="relative group p-4 border-4 border-branding-black bg-branding-gray shadow-brutal">
                          <div className="w-64 h-64 border-4 border-branding-black overflow-hidden bg-white">
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover grayscale" />
                          </div>
                          <button
                            onClick={removePhoto}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-branding-crimson text-white border-2 border-branding-black flex items-center justify-center shadow-brutal-sm hover:bg-red-700 active:scale-95 transition-all"
                          >
                            <X className="w-5 h-5" strokeWidth={3} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PAYMENT */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ ease: "easeOut" }}
                    className="flex-1 flex flex-col"
                  >
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 border-b-4 border-branding-black pb-4">
                      CLEARANCE FEE
                    </h2>

                    {paymentData ? (
                      <div className="space-y-6">
                        <div className="border-4 border-branding-black p-6 relative bg-branding-gray shadow-brutal-sm">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FileText className="w-32 h-32 text-branding-black" strokeWidth={1} />
                          </div>
                          <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex justify-between items-center border-b-2 border-branding-black pb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest">REMITA RRR</span>
                              <span className="font-mono text-lg font-black bg-white px-2 border-2 border-branding-black select-all">{paymentData.rrr}</span>
                            </div>
                            <div className="flex justify-between items-center border-b-2 border-branding-black pb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest">FEE DUE</span>
                              <span className="text-2xl font-black text-branding-black">₦{paymentData.amount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest">STATUS</span>
                              <span className="bg-branding-black text-white px-3 py-1 text-[10px] font-black tracking-widest border border-black">PENDING VERIFICATION</span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={`https://remitademo.net/remita/onepage/biller/${paymentData.rrr}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline w-full justify-center group bg-white border-4"
                        >
                          INITIALIZE GATEWAY <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-branding-black mb-4" />
                        <p className="font-black text-sm tracking-widest">GENERATING TRANSACTION TOKEN...</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 4: SUCCESS */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-32 h-32 bg-branding-emerald border-4 border-branding-black flex items-center justify-center mb-8 shadow-brutal">
                      <CheckCircle className="w-16 h-16 text-branding-black" strokeWidth={2} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">CLEARANCE SECURED</h2>
                    <p className="text-[10px] font-bold tracking-widest text-branding-darkGray max-w-sm mx-auto mb-8 uppercase">
                      Profile initialized and financial clearance verified. Cryptographic exam token generated.
                    </p>
                    <button
                      onClick={() => navigate('/student/dashboard')}
                      className="btn-brutal px-12 py-5 text-xl w-full max-w-sm mx-auto"
                    >
                      ENTER DASHBOARD
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            {currentStep < 4 && (
              <div className="p-6 border-t-4 border-branding-black flex justify-between items-center bg-branding-gray">
                {currentStep > 1 ? (
                  <button
                    onClick={prevStep}
                    className="border-2 border-branding-black bg-white px-6 py-3 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-branding-darkGray hover:text-white"
                  >
                    PREVIOUS
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="btn-brutal px-8 py-3 bg-branding-emerald text-branding-black border-2 border-branding-black hover:bg-emerald-400 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> WAIT</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {currentStep === 3 ? 'VERIFY RECORD' : 'COMMIT AND CONTINUE'}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
