import { useState, useEffect } from 'react';
import {
  FaChartBar, FaMapMarkerAlt, FaUsers, FaSeedling,
  FaCheckCircle, FaClock, FaTimesCircle, FaHistory
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatsCard from '../../components/StatsCard';

const ReportsPage = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await adminService.getReports();
        setReports(data.reports);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        toast.error('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <LoadingSpinner text="Loading reports..." />;

  if (!reports) {
    return (
      <div className="text-center py-20">
        <FaChartBar className="text-5xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Unable to Load Reports</h3>
        <p className="text-gray-400 mt-1">Please try again later.</p>
      </div>
    );
  }

  const { stateWise, registrationTrend, statusSummary, recentActions, topDistricts } = reports;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Detailed platform analytics and insights</p>
      </div>

      {/* Land Status Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<FaSeedling />}
          label="Total Listings"
          value={(statusSummary.approved || 0) + (statusSummary.pending || 0) + (statusSummary.rejected || 0)}
          color="blue"
        />
        <StatsCard icon={<FaCheckCircle />} label="Approved" value={statusSummary.approved || 0} color="green" />
        <StatsCard icon={<FaClock />} label="Pending" value={statusSummary.pending || 0} color="yellow" />
        <StatsCard icon={<FaTimesCircle />} label="Rejected" value={statusSummary.rejected || 0} color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* State-wise Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Lands by State</h2>
          </div>
          {stateWise.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No data available yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {stateWise.map((item, i) => {
                const maxTotal = stateWise[0]?.total || 1;
                const widthPercent = (item.total / maxTotal) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{item.state}</span>
                      <span className="text-gray-500">{item.total} listings</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="h-full rounded-full flex overflow-hidden" style={{ width: `${widthPercent}%` }}>
                        {item.approved > 0 && (
                          <div
                            className="bg-green-500 h-full"
                            style={{ width: `${(item.approved / item.total) * 100}%` }}
                            title={`Approved: ${item.approved}`}
                          />
                        )}
                        {item.pending > 0 && (
                          <div
                            className="bg-yellow-400 h-full"
                            style={{ width: `${(item.pending / item.total) * 100}%` }}
                            title={`Pending: ${item.pending}`}
                          />
                        )}
                        {item.rejected > 0 && (
                          <div
                            className="bg-red-400 h-full"
                            style={{ width: `${(item.rejected / item.total) * 100}%` }}
                            title={`Rejected: ${item.rejected}`}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> {item.approved}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block" /> {item.pending}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-400 rounded-full inline-block" /> {item.rejected}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Legend */}
          <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block" /> Approved</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block" /> Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-400 rounded-full inline-block" /> Rejected</span>
          </div>
        </div>

        {/* Top Districts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Top Districts (Approved)</h2>
          </div>
          {topDistricts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No data available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2.5 px-3 text-gray-500 font-medium">#</th>
                    <th className="text-left py-2.5 px-3 text-gray-500 font-medium">District</th>
                    <th className="text-left py-2.5 px-3 text-gray-500 font-medium">State</th>
                    <th className="text-right py-2.5 px-3 text-gray-500 font-medium">Listings</th>
                  </tr>
                </thead>
                <tbody>
                  {topDistricts.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 text-gray-400">{i + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-900">{item.district}</td>
                      <td className="py-2.5 px-3 text-gray-600">{item.state}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                          {item.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Registration Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FaUsers className="text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Registration Trend (Last 6 Months)</h2>
        </div>
        {registrationTrend.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No registration data available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Month</th>
                  <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Role</th>
                  <th className="text-right py-2.5 px-3 text-gray-500 font-medium">Registrations</th>
                </tr>
              </thead>
              <tbody>
                {registrationTrend.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{item.month}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        item.role === 'farmer'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Admin Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaHistory className="text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">Recent Admin Activity</h2>
        </div>
        {recentActions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No admin actions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Admin</th>
                  <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Action</th>
                  <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Target</th>
                  <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Reason</th>
                  <th className="text-right py-2.5 px-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActions.map((action, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 text-gray-900">
                      {action.adminFirstName} {action.adminLastName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        action.actionType === 'approve'
                          ? 'bg-green-50 text-green-700'
                          : action.actionType === 'reject'
                          ? 'bg-red-50 text-red-700'
                          : action.actionType === 'block'
                          ? 'bg-orange-50 text-orange-700'
                          : action.actionType === 'unblock'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {action.actionType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {action.listingId ? `Land #${action.listingId}` : ''}
                      {action.targetUserId ? `User #${action.targetUserId}` : ''}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 max-w-48 truncate">
                      {action.reason || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-400 whitespace-nowrap">
                      {new Date(action.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
