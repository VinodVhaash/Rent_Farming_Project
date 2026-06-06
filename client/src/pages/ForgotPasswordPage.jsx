import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import authService from '../services/authService';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = reset password
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ userId: '', phone: '', otp: '', newPassword: '', confirmPassword: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await authService.forgotPassword({ userId: form.userId, phone: form.phone });
      toast.success(data.message);
      if (data.otp) toast.info(`Dev OTP: ${data.otp}`, { autoClose: 10000 });
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await authService.resetPassword({
        userId: form.userId,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 py-8 sm:py-12 px-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-2xl text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-500 text-sm">
            {step === 1
              ? 'Enter your User ID and registered phone number to receive an OTP.'
              : 'Enter the OTP and set your new password.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sm:p-8">
          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label htmlFor="fp-userId" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input
                  id="fp-userId"
                  type="text"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  required
                  placeholder="Your user ID"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="fp-phone" className="block text-sm font-medium text-gray-700 mb-1">Registered Phone</label>
                <input
                  id="fp-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="10-digit phone number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer text-sm"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="fp-otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                <input
                  id="fp-otp"
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="fp-newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  id="fp-newPassword"
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Min 8 chars"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="fp-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  id="fp-confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer text-sm"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            <Link to="/login" className="text-green-600 hover:text-green-700 no-underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
