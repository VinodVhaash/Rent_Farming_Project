import { useState, useEffect } from 'react';
import { FaUsers, FaSeedling, FaCheckCircle, FaClock, FaTimesCircle, FaClipboardList } from 'react-icons/fa';
import adminService from '../../services/adminService';
import StatsCard from '../../components/StatsCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await adminService.getDashboardStats();
        setStats(data.stats);
        setRecentActions(data.recentActions);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatsCard icon={<FaUsers />} label="Total Farmers" value={stats.totalFarmers} color="green" />
          <StatsCard icon={<FaUsers />} label="Total Buyers" value={stats.totalBuyers} color="blue" />
          <StatsCard icon={<FaCheckCircle />} label="Approved Lands" value={stats.approvedLands} color="indigo" />
          <StatsCard icon={<FaClock />} label="Pending Approvals" value={stats.pendingLands} color="amber" />
          <StatsCard icon={<FaTimesCircle />} label="Rejected" value={stats.rejectedLands} color="red" />
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <a href="/admin/land-approval" className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all group no-underline">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <FaClipboardList className="text-xl" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Land Approvals</p>
              <p className="text-sm text-gray-500">{stats?.pendingLands || 0} pending review</p>
            </div>
          </div>
        </a>
        <a href="/admin/users" className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all group no-underline">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="font-bold text-gray-900">User Management</p>
              <p className="text-sm text-gray-500">Manage all platform users</p>
            </div>
          </div>
        </a>
      </div>

      {/* Recent Actions */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Admin Actions</h2>
        </div>
        {recentActions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No recent actions.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentActions.map((action) => (
              <div key={action.id} className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {action.actionType}
                    {action.listingId && <span className="text-gray-500"> – Land #{action.listingId}</span>}
                    {action.targetUserId && <span className="text-gray-500"> – User #{action.targetUserId}</span>}
                  </p>
                  {action.reason && <p className="text-xs text-gray-500 mt-0.5">Reason: {action.reason}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {new Date(action.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <p className="text-xs text-gray-500">{action.adminFirstName} {action.adminLastName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
