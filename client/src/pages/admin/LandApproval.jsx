import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaRulerCombined, FaSeedling, FaEye } from 'react-icons/fa';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const LandApproval = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ open: false, landId: null });
  const [rejectReason, setRejectReason] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchPending = async () => {
    try {
      const { data } = await adminService.getPendingLands();
      setLands(data.lands);
    } catch (err) {
      toast.error('Failed to fetch pending lands.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveLand(id);
      toast.success('Land listing approved!');
      setLands(lands.filter((l) => l.id !== id));
    } catch (err) {
      toast.error('Failed to approve listing.');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }
    try {
      await adminService.rejectLand(rejectModal.landId, rejectReason);
      toast.success('Land listing rejected.');
      setLands(lands.filter((l) => l.id !== rejectModal.landId));
      setRejectModal({ open: false, landId: null });
      setRejectReason('');
    } catch (err) {
      toast.error('Failed to reject listing.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading pending approvals..." />;

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Land Approval Management</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Review and approve/reject land listings – {lands.length} pending
        </p>
      </div>

      {lands.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <FaCheckCircle className="text-5xl text-green-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">All Caught Up!</h3>
          <p className="text-gray-400 mt-1">No pending land approvals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lands.map((land) => (
            <div key={land.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <StatusBadge status={land.approvalStatus} />
                      <span className="text-sm text-gray-500">
                        Listed by: <span className="font-medium text-gray-700">{land.firstName} {land.lastName}</span> ({land.ownerUserId})
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-green-600" />
                        {[land.village, land.district, land.state].filter(Boolean).join(', ')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaRulerCombined className="text-blue-500" />
                        {land.area} {land.landUnit}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaSeedling className="text-amber-500" />
                        {land.soilType || 'N/A'}
                      </div>
                      <div className="text-sm font-semibold text-green-700">
                        ₹{Number(land.expectedRent).toLocaleString('en-IN')}/{land.rentDuration === 'monthly' ? 'mo' : 'yr'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === land.id ? null : land.id)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleApprove(land.id)}
                      className="px-3 sm:px-4 py-2 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors cursor-pointer flex items-center gap-1.5 border-none"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => setRejectModal({ open: true, landId: land.id })}
                      className="px-3 sm:px-4 py-2 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5 border-none"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === land.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-2 gap-4 text-sm animate-[fadeIn_0.2s_ease-out]">
                    <div>
                      <p className="text-gray-500">Crops: <span className="text-gray-900">{land.crops || 'N/A'}</span></p>
                      <p className="text-gray-500 mt-1">Water: <span className="text-gray-900">{land.waterAvailability || 'N/A'}</span></p>
                      <p className="text-gray-500 mt-1">Phone: <span className="text-gray-900">{land.ownerPhone}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-500">Description:</p>
                      <p className="text-gray-700 mt-1">{land.description || 'No description provided.'}</p>
                    </div>
                    {land.images && land.images.length > 0 && (
                      <div className="sm:col-span-2">
                        <p className="text-gray-500 mb-2">Images:</p>
                        <div className="flex gap-2 overflow-x-auto">
                          {land.images.map((img, i) => (
                            <img key={i} src={img.imagePath} alt="" className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Listing</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this land listing.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectModal({ open: false, landId: null }); setRejectReason(''); }}
                className="px-5 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer text-sm"
              >
                Reject Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandApproval;
