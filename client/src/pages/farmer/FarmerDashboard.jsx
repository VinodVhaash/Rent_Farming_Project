import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSeedling, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import landService from '../../services/landService';
import StatusBadge from '../../components/StatusBadge';
import StatsCard from '../../components/StatsCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const FarmerDashboard = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyLands = async () => {
      try {
        const { data } = await landService.getMyLands();
        setLands(data.lands);
      } catch (err) {
        console.error('Failed to fetch lands:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyLands();
  }, []);

  const approved = lands.filter((l) => l.approvalStatus === 'approved').length;
  const pending = lands.filter((l) => l.approvalStatus === 'pending').length;
  const rejected = lands.filter((l) => l.approvalStatus === 'rejected').length;

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your land listings</p>
        </div>
        <Link
          to="/farmer/add-land"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm no-underline"
        >
          <FaPlus /> Add New Land
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<FaSeedling />} label="Total Listings" value={lands.length} color="green" />
        <StatsCard icon={<FaCheckCircle />} label="Approved" value={approved} color="blue" />
        <StatsCard icon={<FaClock />} label="Pending" value={pending} color="amber" />
        <StatsCard icon={<FaTimesCircle />} label="Rejected" value={rejected} color="red" />
      </div>

      {/* Listings Table */}
      {lands.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FaSeedling className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Land Listings Yet</h3>
          <p className="text-gray-400 mb-4">Start by adding your first land listing.</p>
          <Link
            to="/farmer/add-land"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 text-sm no-underline"
          >
            <FaPlus /> Add Land
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Area</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lands.map((land) => (
                  <tr key={land.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">
                        {land.village || land.district}
                      </p>
                      <p className="text-xs text-gray-500">
                        {[land.taluka, land.district, land.state].filter(Boolean).join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{land.area} {land.landUnit}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{Number(land.expectedRent).toLocaleString('en-IN')}/{land.rentDuration === 'monthly' ? 'mo' : 'yr'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={land.approvalStatus} />
                      {land.rejectionReason && (
                        <p className="text-xs text-red-500 mt-1">Reason: {land.rejectionReason}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/farmer/edit-land/${land.id}`}
                        className="text-sm text-green-600 hover:text-green-700 font-medium no-underline"
                      >
                        Edit
                      </Link>
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

export default FarmerDashboard;
