import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSeedling, FaEdit, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import landService from '../../services/landService';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import StatsCard from '../../components/StatsCard';

const ListingStatusPage = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMyLands = async () => {
      try {
        const { data } = await landService.getMyLands();
        setLands(data.lands);
      } catch (err) {
        console.error('Failed to fetch lands:', err);
        toast.error('Failed to load your listings.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyLands();
  }, []);

  const counts = {
    all: lands.length,
    pending: lands.filter((l) => l.approvalStatus === 'pending').length,
    approved: lands.filter((l) => l.approvalStatus === 'approved').length,
    rejected: lands.filter((l) => l.approvalStatus === 'rejected').length,
  };

  const filteredLands = filter === 'all'
    ? lands
    : lands.filter((l) => l.approvalStatus === filter);

  if (loading) return <LoadingSpinner text="Loading your listings..." />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Listing Status</h1>
        <p className="text-gray-500 text-sm mt-1">Track the approval status of all your land listings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<FaSeedling />} label="Total Listings" value={counts.all} color="blue" />
        <StatsCard icon={<FaClock />} label="Pending" value={counts.pending} color="yellow" />
        <StatsCard icon={<FaCheckCircle />} label="Approved" value={counts.approved} color="green" />
        <StatsCard icon={<FaTimesCircle />} label="Rejected" value={counts.rejected} color="red" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'pending', label: 'Pending', count: counts.pending },
          { key: 'approved', label: 'Approved', count: counts.approved },
          { key: 'rejected', label: 'Rejected', count: counts.rejected },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
              filter === tab.key
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Listings */}
      {filteredLands.length === 0 ? (
        <div className="text-center py-16">
          <FaSeedling className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Listings Found</h3>
          <p className="text-gray-400 mt-1">
            {filter === 'all'
              ? 'You haven\'t added any land listings yet.'
              : `No ${filter} listings.`}
          </p>
          {filter === 'all' && (
            <Link
              to="/farmer/add-land"
              className="inline-block mt-4 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors no-underline"
            >
              + Add Your First Land
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLands.map((land) => (
            <div
              key={land.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left – Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {land.area} {land.landUnit} – {land.village || land.district || 'Land'}
                    </h3>
                    <StatusBadge status={land.approvalStatus} />
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                    <span>📍 {[land.village, land.taluka, land.district, land.state].filter(Boolean).join(', ')}</span>
                    <span>💰 ₹{Number(land.expectedRent).toLocaleString('en-IN')}/{land.rentDuration === 'monthly' ? 'mo' : 'yr'}</span>
                    {land.soilType && <span>🌱 {land.soilType}</span>}
                  </div>

                  {land.crops && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {land.crops.split(',').slice(0, 4).map((crop, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                          {crop.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {land.approvalStatus === 'rejected' && land.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <div className="flex items-start gap-2">
                        <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-700">Rejection Reason</p>
                          <p className="text-sm text-red-600 mt-0.5">{land.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Submitted: {new Date(land.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                    {land.updatedAt && land.updatedAt !== land.createdAt && (
                      <> · Updated: {new Date(land.updatedAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}</>
                    )}
                  </p>
                </div>

                {/* Right – Actions */}
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  {(land.approvalStatus === 'pending' || land.approvalStatus === 'rejected') && (
                    <Link
                      to={`/farmer/edit-land/${land.id}`}
                      className="px-4 py-2 text-sm font-medium text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors no-underline flex items-center gap-1.5 justify-center"
                    >
                      <FaEdit /> Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingStatusPage;
