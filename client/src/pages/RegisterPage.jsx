import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FaSeedling, FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../services/authService';
import LanguageSwitcher from '../components/LanguageSwitcher';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    address: '',
    surveyNumber: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error(t('register.errors.passwordMismatch', 'Passwords do not match.'));
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await authService.register(form);
      toast.success(data.message || t('register.success.registered', 'Registration successful! Please verify OTP.'));

      // In dev mode, show OTP for testing
      if (data.otp) {
        toast.info(`Dev OTP: ${data.otp}`, { autoClose: 10000 });
      }

      navigate('/verify-otp', { state: { userId: form.userId } });
    } catch (err) {
      toast.error(err.response?.data?.message || t('register.errors.registrationFailed', 'Registration failed.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 py-8 sm:py-12 px-4">
      <div className="w-full max-w-sm sm:max-w-xl lg:max-w-2xl">
        {/* ── Language Switcher (top-right) ── */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 text-green-700 text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            <FaSeedling className="text-3xl sm:text-4xl" />
            {t('register.brandName', 'Rent Farming')}
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            {t('register.tagline', 'Create your account and start your farming journey.')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 text-center">
            {t('register.pageTitle', 'Register')}
          </h2>

          {/* Role Selection */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('register.roleLabel', 'I want to')}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'farmer' })}
                className={`py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm border-2 transition-all cursor-pointer ${form.role === 'farmer'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
              >
                {t('register.roleFarmer', '🌾 List My Land (Farmer)')}
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'buyer' })}
                className={`py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm border-2 transition-all cursor-pointer ${form.role === 'buyer'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
              >
                {t('register.roleBuyer', '🔍 Find Land (Buyer)')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="reg-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('register.firstNameLabel', 'First Name *')}
              </label>
              <input
                id="reg-firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder={t('register.firstNamePlaceholder', 'First name')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="reg-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('register.lastNameLabel', 'Last Name *')}
              </label>
              <input
                id="reg-lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder={t('register.lastNamePlaceholder', 'Last name')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="reg-address" className="block text-sm font-medium text-gray-700 mb-1">
                {t('register.addressLabel', 'Address')}
              </label>
              <input
                id="reg-address"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={t('register.addressPlaceholder', 'Your full address')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            {form.role === 'farmer' && (
              <div className="sm:col-span-2">
                <label htmlFor="reg-survey" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('register.surveyLabel', '7/12 Survey Number')}
                </label>
                <input
                  id="reg-survey"
                  type="text"
                  name="surveyNumber"
                  value={form.surveyNumber}
                  onChange={handleChange}
                  placeholder={t('register.surveyPlaceholder', 'Land survey number')}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            )}
            <div>
              <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('register.phoneLabel', 'Phone Number *')}
              </label>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder={t('register.phonePlaceholder', '10-digit mobile number')}
                pattern="[6-9]\d{9}"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="reg-userId" className="block text-sm font-medium text-gray-700 mb-1">
                {t('register.userIdLabel', 'User ID *')}
              </label>
              <input
                id="reg-userId"
                type="text"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                required
                placeholder={t('register.userIdPlaceholder', 'Choose a user ID')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('register.passwordLabel', 'Password *')}
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder={t('register.passwordPlaceholder', 'Min 8 chars, A-z, 0-9, @#$')}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none p-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="reg-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('register.confirmPasswordLabel', 'Confirm Password *')}
              </label>
              <input
                id="reg-confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder={t('register.confirmPasswordPlaceholder', 'Repeat password')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 mt-5 sm:mt-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer text-sm sm:text-base"
          >
            {isLoading
              ? t('register.submittingButton', 'Creating Account...')
              : t('register.submitButton', 'Create Account')}
          </button>

          <p className="text-center text-sm text-gray-500 mt-5 sm:mt-6">
            {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 no-underline">
              {t('register.loginLink', 'Login here')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
