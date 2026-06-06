import API from './api';

const authService = {
  register: (data) => API.post('/auth/register', data),
  verifyOtp: (data) => API.post('/auth/verify-otp', data),
  resendOtp: (data) => API.post('/auth/resend-otp', data),
  login: (data) => API.post('/auth/login', data),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export default authService;
