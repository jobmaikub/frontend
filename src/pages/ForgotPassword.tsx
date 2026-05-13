import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import Toast, { ToastType } from '../components/Toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
  const navigate = useNavigate()

  // Step 1: Send OTP via backend
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setLoading(false)

      if (!data.success) {
        setToast({ message: data.error || 'Failed to send OTP', type: 'error' })
        return
      }

      setToast({ message: 'OTP sent to your email', type: 'success' })
      setStep('otp')
    } catch (err) {
      setLoading(false)
      setToast({
        message: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        type: 'error'
      })
    }
  }

  // Step 2: Verify OTP via backend
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await response.json()
      setLoading(false)

      if (!data.success) {
        setToast({ message: data.error || 'Invalid or expired OTP', type: 'error' })
        return
      }

      setToast({ message: 'OTP verified successfully', type: 'success' })
      setStep('password')
    } catch (err) {
      setLoading(false)
      setToast({ message: 'Error verifying OTP', type: 'error' })
    }
  }

  // Step 3: Reset password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/otp/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, password }),
      })

      const data = await response.json()

      if (!data.success) {
        setLoading(false)
        setToast({ message: data.error || 'Failed to reset password', type: 'error' })
        return
      }

      setToast({ message: 'Password reset successful! Redirecting to login...', type: 'success' })
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (err) {
      setLoading(false)
      setToast({ message: 'Error resetting password', type: 'error' })
    }
  }

  // Step 1: Email input
  if (step === 'email') {
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
          <div className="text-center flex flex-col items-center">
            <Link 
              to="/home" 
              className="group flex flex-col items-center gap-3 mb-2 transition-transform hover:scale-105 active:scale-95"
            >
              <img 
                src="/jobmaikub-logo.png" 
                alt="Jobmaikub Logo" 
                className="h-16 w-auto object-contain"
              />
              <h2 className="text-2xl font-black text-[#4A5DF9] tracking-tighter uppercase">
                Jobmaikub
              </h2>
            </Link>
            <p className="mt-2 text-sm sm:text-base text-slate-500 font-medium">Reset your password</p>
          </div>

          <form className="space-y-5 sm:space-y-6" onSubmit={handleSendOtp}>
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

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-slate-600">
            Back to{' '}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // Step 2: OTP input
  if (step === 'otp') {
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
          <div className="text-center">
            <div className="text-5xl mb-4">📬</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              Verify Code
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              We sent a 6-digit code to<br />
              <span className="font-semibold text-slate-700">{email}</span>
            </p>
          </div>

          <form className="space-y-5 sm:space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full px-4 py-3 sm:py-4 text-center text-3xl sm:text-4xl font-bold rounded-lg border-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          <button
            onClick={() => {
              setStep('email')
              setOtp('')
            }}
            className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Send code again
          </button>
        </div>
      </div>
    )
  }

  // Step 3: Password reset
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
        <div className="text-center flex flex-col items-center">
          <Link 
            to="/home" 
            className="group flex flex-col items-center gap-3 mb-2 transition-transform hover:scale-105 active:scale-95"
          >
            <img 
              src="/jobmaikub-logo.png" 
              alt="Jobmaikub Logo" 
              className="h-16 w-auto object-contain"
            />
            <h2 className="text-2xl font-black text-[#4A5DF9] tracking-tighter uppercase">
              Jobmaikub
            </h2>
          </Link>
          <p className="mt-2 text-sm sm:text-base text-slate-500 font-medium">Create a new password</p>
        </div>

        <form className="space-y-5 sm:space-y-6" onSubmit={handleUpdatePassword}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>
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
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-500">
          Code verified • Ready to create new password
        </p>
      </div>
    </div>
  )
}