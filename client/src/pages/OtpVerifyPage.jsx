import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShieldAlt } from 'react-icons/fa';
import authService from '../services/authService';

const OtpVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!userId) {
      navigate('/register');
      return;
    }
    inputRefs.current[0]?.focus();
  }, [userId, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (pasted.length === 6) inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await authService.verifyOtp({ userId, otp: otpString });
      toast.success(data.message || 'Account verified successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await authService.resendOtp({ userId });
      toast.success('OTP resent!');
      if (data.otp) {
        toast.info(`Dev OTP: ${data.otp}`, { autoClose: 10000 });
      }
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 py-8 sm:py-12 px-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-2xl text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
          <p className="text-gray-500 text-sm">
            We've sent a 6-digit OTP to your registered phone number.
            <br />
            <span className="font-medium text-gray-700">User: {userId}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sm:p-8"
        >
          <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer text-sm"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center mt-4">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-400">Resend OTP in {resendTimer}s</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-green-600 hover:text-green-700 font-semibold bg-transparent border-none cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/login" className="text-green-600 hover:text-green-700 no-underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
