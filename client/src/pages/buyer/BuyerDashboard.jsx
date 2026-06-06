import { useState, useEffect } from 'react';
import { FaSearch, FaSeedling } from 'react-icons/fa';
import landService from '../../services/landService';
import LandCard from '../../components/LandCard';
import SearchFilters from '../../components/SearchFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatsCard from '../../components/StatsCard';

const BuyerDashboard = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLands, setTotalLands] = useState(0);

  const fetchLands = async () => {
    try {
      const { data } = await landService.getApprovedLands(1, 12);
      setLands(data.lands);
      setTotalLands(data.total);
    } catch (err) {
      console.error('Failed to fetch lands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      const { data } = await landService.searchLands(filters);
      setLands(data.lands);
      setTotalLands(data.total);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Browse and search for agricultural lands across India</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard icon={<FaSeedling />} label="Available Lands" value={totalLands} color="green" />
        <StatsCard icon={<FaSearch />} label="States Covered" value="15+" color="blue" />
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} isLoading={loading} />
      </div>

      {/* Land Cards */}
      {loading ? (
        <LoadingSpinner text="Searching lands..." />
      ) : lands.length === 0 ? (
        <div className="text-center py-16">
          <FaSeedling className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Lands Found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => (
            <LandCard key={land.id} land={land} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
