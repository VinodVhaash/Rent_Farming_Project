import { useState, useEffect } from 'react';
import { FaSeedling } from 'react-icons/fa';
import landService from '../services/landService';
import LandCard from '../components/LandCard';
import SearchFilters from '../components/SearchFilters';
import LoadingSpinner from '../components/LoadingSpinner';

const LandListingsPage = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const fetchLands = async (pageNum = 1) => {
    try {
      setLoading(true);
      const { data } = await landService.getApprovedLands(pageNum);
      setLands(data.lands);
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-700 pt-28 sm:pt-32 pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">Browse Agricultural Lands</h1>
          <p className="text-green-100/80 max-w-xl mx-auto">
            Discover approved land listings across India. Filter by location, soil type, crops, and budget.
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="mb-8">
            <SearchFilters onSearch={handleSearch} isLoading={loading} />
          </div>

          {/* Results */}
          {loading ? (
            <LoadingSpinner text="Loading land listings..." />
          ) : lands.length === 0 ? (
            <div className="text-center py-20">
              <FaSeedling className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Listings Found</h3>
              <p className="text-gray-400">
                {isSearching ? 'Try adjusting your search filters.' : 'No approved land listings yet. Check back soon!'}
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
                <div className="flex justify-center flex-wrap gap-2 mt-8 sm:mt-10">
                  <button
                    onClick={() => fetchLands(page - 1)}
                    disabled={page <= 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                  ))}
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
      </section>
    </div>
  );
};

export default LandListingsPage;
