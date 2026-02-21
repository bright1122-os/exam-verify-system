import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Supabase implicitly parses the URL hash containing the OAuth token 
        // before we even hit this block, registering the session globally.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session) {
          setError('No authentication token received.');
          setTimeout(() => navigate('/auth/login'), 2000);
          return;
        }

        // Pulling role logic similar to our store
        let userRole = null;

        // 1. Check Profiles Table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          userRole = profile.role;
        } else {
          // 2. Check Provider Metadata
          userRole = session.user.user_metadata?.role || 'student';
        }

        // Update the central store
        useStore.setState({
          user: session.user,
          session: session,
          isAuthenticated: true,
          userType: userRole,
          loading: false
        });

        if (userRole === 'examiner') navigate('/examiner/dashboard', { replace: true });
        else if (userRole === 'admin') navigate('/admin/dashboard', { replace: true });
        else navigate('/student/dashboard', { replace: true });

      } catch (err) {
        console.error('Core Auth Callback Exception:', err);
        setError(err.message || 'Identity Handshake Failed.');
        setTimeout(() => navigate('/auth/login'), 3000);
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f0e9] selection:bg-charcoal selection:text-[#f2f0e9]">
      <div className="text-center font-body flex flex-col items-center">
        {!error ? (
          <>
            <div className="w-8 h-8 rounded-full border border-charcoal border-t-transparent animate-spin mb-6" />
            <span className="text-xs tracking-[0.2em] font-semibold text-charcoal uppercase">
              Verifying Cryptographic Ledger...
            </span>
          </>
        ) : (
          <p className="mt-4 text-[#B85C4F] font-medium max-w-sm px-4">
            Security Exception: {error}. Disconnecting...
          </p>
        )}
      </div>
    </div>
  );
}
