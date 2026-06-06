import { useState, useEffect } from 'react';
import { FaHeart, FaSeedling, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import landService from '../../services/landService';
import LandCard from '../../components/LandCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatsCard from '../../components/StatsCard';

const SavedListingsPage = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const { data } = await landService.getSavedLands();
      setLands(data.lands);
    } catch (err) {
      console.error('Failed to fetch saved lands:', err);
      toast.error('Failed to load saved listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (landId) => {
    try {
      await landService.unsaveLand(landId);
      setLands(lands.filter((l) => l.id !== landId));
      toast.success('Listing removed from saved.');
    } catch (err) {
      toast.error('Failed to remove listing.');
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Listings</h1>
        <p className="text-gray-500 text-sm mt-1">Your bookmarked agricultural land listings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard icon={<FaHeart />} label="Saved Lands" value={lands.length} color="red" />
      </div>

      {/* Saved Lands */}
      {loading ? (
        <LoadingSpinner text="Loading saved listings..." />
      ) : lands.length === 0 ? (
        <div className="text-center py-20">
          <FaSeedling className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Saved Listings</h3>
          <p className="text-gray-400 mt-1">
            Browse land listings and click the heart icon to save them here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => (
            <div key={land.id} className="relative group">
              <LandCard land={land} />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnsave(land.id);
                }}
                className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-all cursor-pointer border border-gray-100 group-hover:scale-110"
                title="Remove from saved"
              >
                <FaTrash className="text-red-500 text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedListingsPage;
