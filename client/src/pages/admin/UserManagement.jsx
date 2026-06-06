import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUsers, FaBan, FaUnlock, FaTrash } from 'react-icons/fa';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');

  const fetchUsers = async (role = '') => {
    try {
      setLoading(true);
      const { data } = await adminService.getAllUsers(role || undefined);
      setUsers(data.users);
    } catch (err) {
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id) => {
    try {
      await adminService.blockUser(id);
      toast.success('User blocked.');
      fetchUsers(filterRole);
    } catch (err) {
      toast.error('Failed to block user.');
    }
  };

  const handleUnblock = async (id) => {
    try {
      await adminService.unblockUser(id);
      toast.success('User unblocked.');
      fetchUsers(filterRole);
    } catch (err) {
      toast.error('Failed to unblock user.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted.');
      fetchUsers(filterRole);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">View, block, unblock, or delete users</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter:</label>
          <select
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); fetchUsers(e.target.value); }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Roles</option>
            <option value="farmer">Farmers</option>
            <option value="buyer">Buyers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <FaUsers className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto -mx-px">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{u.firstName} {u.lastName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.userId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                        u.role === 'farmer' ? 'bg-green-50 text-green-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isBlocked ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700">Blocked</span>
                      ) : u.isVerified ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700">Unverified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      {u.role !== 'admin' && (
                        <div className="flex items-center gap-2">
                          {u.isBlocked ? (
                            <button onClick={() => handleUnblock(u.id)} title="Unblock"
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
                              <FaUnlock />
                            </button>
                          ) : (
                            <button onClick={() => handleBlock(u.id)} title="Block"
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
                              <FaBan />
                            </button>
                          )}
                          <button onClick={() => handleDelete(u.id)} title="Delete"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
