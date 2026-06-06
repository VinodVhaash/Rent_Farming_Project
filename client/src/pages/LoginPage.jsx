import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSeedling, FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ userId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { data } = await authService.login(form);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      toast.success('Login successful!');

      // Redirect based on role
      const role = data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'farmer') navigate('/farmer/dashboard');
      else navigate('/buyer/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      dispatch(loginFailure(msg));
      toast.error(msg);

      // If needs verification, redirect to OTP page
      if (err.response?.data?.needsVerification) {
        navigate('/verify-otp', { state: { userId: err.response.data.userId } });
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 py-8 sm:py-12 px-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 text-green-700 text-2xl sm:text-3xl font-bold">
            <FaSeedling className="text-3xl sm:text-4xl" />
            Rent Farming
          </div>
          <p className="text-gray-500 text-sm sm:text-base mt-1">Welcome back! Login to your account.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 text-center">Login</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="login-userId" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                id="login-userId"
                type="text"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                required
                placeholder="Enter your user ID"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base pr-10"
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
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 mb-5 sm:mb-6 gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium no-underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer text-sm sm:text-base"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-5 sm:mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:text-green-700 no-underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
