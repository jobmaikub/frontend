import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Toast, { ToastType } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('banned') !== '1') return;

    const reason = params.get('reason') || 'Your account has been suspended by admin';
    const until = params.get('until');

    const untilText = until
      ? ` You can login again after ${new Date(until).toLocaleString()}.`
      : ' This ban is permanent until admin unbans your account.';

    setToast({ message: `${reason}.${untilText}`, type: 'error' });
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('banned') === '1') return;

    const syncSession = async () => {
      const code = params.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('OAuth code exchange failed:', error);
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        navigate('/', { replace: true });
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate('/', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location.search, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('🔐 Login attempt:', { email, passwordLength: password.length });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('📊 Login response:', {
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        error: error?.message
      });

      if (error) {
        console.error('❌ Login error detail:', error);
        setToast({ message: `Login failed: ${error.message}`, type: 'error' });
        setLoading(false);
        return;
      }

      if (data?.session) {
        console.log('✅ Session created, navigating...');
        setToast({ message: "Logged in successfully!", type: 'success' });
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/', { replace: true });
      } else {
        console.warn('⚠️ No session despite no error');
        setToast({ message: 'Failed to create session', type: 'error' });
        setLoading(false);
      }
    } catch (err) {
      console.error('💥 Unexpected error:', err);
      setToast({ message: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' });
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/login` }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Job<span className="text-blue-600">maikub</span>
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs sm:text-sm text-slate-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Google Account</span>
        </button>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}