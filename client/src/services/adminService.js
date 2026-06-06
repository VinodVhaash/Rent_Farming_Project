import API from './api';

const adminService = {
  getDashboardStats: () => API.get('/admin/dashboard'),
  getPendingLands: () => API.get('/admin/lands/pending'),
  approveLand: (id) => API.put(`/admin/lands/${id}/approve`),
  rejectLand: (id, reason) => API.put(`/admin/lands/${id}/reject`, { reason }),
  getAllUsers: (role) => API.get(`/admin/users${role ? `?role=${role}` : ''}`),
  blockUser: (id) => API.put(`/admin/users/${id}/block`),
  unblockUser: (id) => API.put(`/admin/users/${id}/unblock`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getReports: () => API.get('/admin/reports'),
};

export default adminService;
