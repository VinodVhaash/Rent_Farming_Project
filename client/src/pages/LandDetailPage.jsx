import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaMapMarkerAlt, FaSeedling, FaRulerCombined, FaPhoneAlt,
  FaWater, FaCalendarAlt, FaArrowLeft, FaFileAlt, FaUser,
  FaHeart, FaRegHeart
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import landService from '../services/landService';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const LandDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);
  const isBuyer = isAuthenticated && user?.role === 'buyer';

  const maskPhone = (phone) => {
    if (!phone || phone.length < 4) return 'XXXXXXXXXX';
    return phone.substring(0, 2) + 'XXXXXX' + phone.substring(phone.length - 2);
  };

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const { data } = await landService.getLandById(id);
        setLand(data.land);
      } catch (err) {
        console.error('Failed to fetch land:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLand();
  }, [id]);

  useEffect(() => {
    if (isBuyer && id) {
      landService.checkSaved(id)
        .then(({ data }) => setIsSaved(data.isSaved))
        .catch(() => {});
    }
  }, [id, isBuyer]);

  const handleSaveToggle = async () => {
    if (savingInProgress) return;
    setSavingInProgress(true);
    try {
      if (isSaved) {
        await landService.unsaveLand(land.id);
        setIsSaved(false);
        toast.success('Removed from saved listings.');
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

  if (loading) return <LoadingSpinner text="Loading land details..." />;

  if (!land) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Land Not Found</h2>
        <Link to="/lands" className="text-green-600 hover:underline">← Back to Listings</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link to="/lands" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 mb-4 sm:mb-6 text-sm font-medium no-underline">
          <FaArrowLeft /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* Image Gallery - 3 cols */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Main Image */}
              <div className="h-56 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
                {land.images && land.images.length > 0 ? (
                  <img
                    src={land.images[selectedImage]?.imagePath}
                    alt={`Land view ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaSeedling className="text-6xl text-green-200" />
                )}
              </div>

              {/* Thumbnails */}
              {land.images && land.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {land.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 cursor-pointer ${
                        i === selectedImage ? 'border-green-600' : 'border-transparent'
                      }`}
                    >
                      <img src={img.imagePath} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {land.description && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-4 sm:mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{land.description}</p>
              </div>
            )}
          </div>

          {/* Details - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-green-700">
                    ₹{Number(land.expectedRent).toLocaleString('en-IN')}
                    <span className="text-base font-normal text-gray-500">
                      /{land.rentDuration === 'monthly' ? 'month' : 'year'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isBuyer && (
                    <button
                      onClick={handleSaveToggle}
                      disabled={savingInProgress}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                        isSaved
                          ? 'bg-red-50 border-red-200 hover:bg-red-100'
                          : 'bg-gray-50 border-gray-200 hover:bg-red-50'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save listing'}
                    >
                      {isSaved ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-400" />
                      )}
                    </button>
                  )}
                  <StatusBadge status={land.approvalStatus} />
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <FaMapMarkerAlt className="text-green-600" />
                <span className="text-sm">
                  {[land.village, land.taluka, land.district, land.state].filter(Boolean).join(', ')}
                </span>
              </div>

              {/* Contact */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-green-600" />
                  <span className="font-semibold text-gray-900">
                    {land.firstName} {land.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhoneAlt className="text-green-600" />
                  <span className="font-medium text-gray-700">
                    {isAuthenticated ? land.ownerPhone : maskPhone(land.ownerPhone)}
                  </span>
                </div>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="mt-3 block w-full text-center py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors no-underline"
                  >
                    Login to View Full Number
                  </Link>
                )}
                {isAuthenticated && land.ownerPhone && (
                  <a
                    href={`tel:${land.ownerPhone}`}
                    className="mt-3 block w-full text-center py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors no-underline"
                  >
                    📞 Call Farmer
                  </a>
                )}
              </div>
            </div>

            {/* Land Details */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Land Details</h3>
              <div className="space-y-3">
                {[
                  { icon: <FaRulerCombined className="text-blue-500" />, label: 'Area', value: `${land.area} ${land.landUnit}` },
                  { icon: <FaSeedling className="text-amber-500" />, label: 'Soil Type', value: land.soilType },
                  { icon: <FaWater className="text-cyan-500" />, label: 'Water', value: land.waterAvailability },
                  { icon: <FaCalendarAlt className="text-purple-500" />, label: 'Rent Duration', value: land.rentDuration },
                ].filter(item => item.value).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {item.icon} {item.label}
                    </div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Crops */}
            {land.crops && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Suitable Crops</h3>
                <div className="flex flex-wrap gap-2">
                  {land.crops.split(',').map((crop, i) => (
                    <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-full border border-green-100 font-medium">
                      {crop.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Document */}
            {land.documentPath && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">7/12 Document</h3>
                <a
                  href={land.documentPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <FaFileAlt /> View Document
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetailPage;
