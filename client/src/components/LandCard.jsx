import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaSeedling, FaRulerCombined, FaPhoneAlt, FaWater, FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StatusBadge from './StatusBadge';
import landService from '../services/landService';

const LandCard = ({ land, showStatus = false, onUnsave = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isSaved, setIsSaved] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);
  const isBuyer = isAuthenticated && user?.role === 'buyer';

  useEffect(() => {
    if (isBuyer) {
      landService.checkSaved(land.id)
        .then(({ data }) => setIsSaved(data.isSaved))
        .catch(() => {});
    }
  }, [land.id, isBuyer]);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (savingInProgress) return;
    setSavingInProgress(true);
    try {
      if (isSaved) {
        await landService.unsaveLand(land.id);
        setIsSaved(false);
        toast.success('Removed from saved listings.');
        if (onUnsave) onUnsave(land.id);
      } else {
        await landService.saveLand(land.id);
        setIsSaved(true);
        toast.success('Saved to your listings!');
      }
    } catch (err) {
      toast.error('Failed to update saved status.');
    } finally {
      setSavingInProgress(false);
    }
  };

  const maskPhone = (phone) => {
    if (!phone || phone.length < 4) return 'XXXXXXXXXX';
    return phone.substring(0, 2) + 'XXXXXX' + phone.substring(phone.length - 2);
  };

  const firstImage = land.images && land.images.length > 0
    ? land.images[0].imagePath
    : null;

  return (
    <Link
      to={`/lands/${land.id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col no-underline"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-50 overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={`Land in ${land.village || land.district}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaSeedling className="text-5xl text-green-200" />
          </div>
        )}
        {showStatus && (
          <div className="absolute top-3 right-3">
            <StatusBadge status={land.approvalStatus} />
          </div>
        )}
        {/* Save Button (Buyers only) */}
        {isBuyer && (
          <button
            onClick={handleSaveToggle}
            disabled={savingInProgress}
            className={`absolute top-3 ${showStatus ? 'left-3' : 'right-3'} w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer border z-10 ${
              isSaved
                ? 'bg-red-50 border-red-200 hover:bg-red-100'
                : 'bg-white/90 backdrop-blur-sm border-gray-100 hover:bg-red-50'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save listing'}
          >
            {isSaved ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FaRegHeart className="text-gray-400 text-sm" />
            )}
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
          <p className="text-white text-lg font-bold">
            ₹{Number(land.expectedRent).toLocaleString('en-IN')}
            <span className="text-sm font-normal opacity-80">/{land.rentDuration === 'monthly' ? 'mo' : 'yr'}</span>
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start gap-2 text-gray-600 text-sm">
          <FaMapMarkerAlt className="text-green-600 mt-0.5 flex-shrink-0" />
          <span>
            {[land.village, land.taluka, land.district, land.state].filter(Boolean).join(', ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <FaRulerCombined className="text-blue-500" />
            <span>{land.area} {land.landUnit}</span>
          </div>
          {land.soilType && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <FaSeedling className="text-amber-500" />
              <span>{land.soilType}</span>
            </div>
          )}
          {land.waterAvailability && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <FaWater className="text-cyan-500" />
              <span>{land.waterAvailability}</span>
            </div>
          )}
        </div>

        {land.crops && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {land.crops.split(',').slice(0, 3).map((crop, i) => (
              <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                {crop.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-sm mt-auto">
          <FaPhoneAlt className="text-green-600" />
          <span className="text-gray-600 font-medium">
            {isAuthenticated ? land.ownerPhone : maskPhone(land.ownerPhone)}
          </span>
          {!isAuthenticated && (
            <span className="text-xs text-amber-600 ml-auto">Login to view</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LandCard;
