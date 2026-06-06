import { useState, useEffect } from 'react';
import { FaSearch, FaSeedling, FaMapMarkerAlt } from 'react-icons/fa';
import landService from '../../services/landService';
import LandCard from '../../components/LandCard';
import SearchFilters from '../../components/SearchFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatsCard from '../../components/StatsCard';

const SearchLandsPage = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLands, setTotalLands] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const fetchLands = async (pageNum = 1) => {
    try {
      setLoading(true);
      const { data } = await landService.getApprovedLands(pageNum);
      setLands(data.lands);
      setTotalLands(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error('Failed to fetch lands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setIsSearching(true);
      const { data } = await landService.searchLands({ ...filters, page: 1 });
      setLands(data.lands);
      setTotalLands(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
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
        <h1 className="text-2xl font-bold text-gray-900">Search Lands</h1>
        <p className="text-gray-500 text-sm mt-1">Find the perfect agricultural land for your needs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard icon={<FaSeedling />} label="Available Lands" value={totalLands} color="green" />
        <StatsCard icon={<FaSearch />} label="Results Found" value={lands.length} color="blue" />
        <StatsCard icon={<FaMapMarkerAlt />} label="States Covered" value="15+" color="purple" />
      </div>

      {/* Search & Filters */}
      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} isLoading={loading} />
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner text="Searching lands..." />
      ) : lands.length === 0 ? (
        <div className="text-center py-20">
          <FaSeedling className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Lands Found</h3>
          <p className="text-gray-400 mt-1">
            {isSearching ? 'Try adjusting your search filters.' : 'No approved land listings yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lands.map((land) => (
              <LandCard key={land.id} land={land} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => fetchLands(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p;
                if (totalPages <= 5) {
                  p = i + 1;
                } else if (page <= 3) {
                  p = i + 1;
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => fetchLands(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                      p === page
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => fetchLands(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchLandsPage;
