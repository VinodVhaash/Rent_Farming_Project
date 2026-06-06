import { useState } from 'react';
import { FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa';

const SearchFilters = ({ onSearch, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    village: '',
    soilType: '',
    cropType: '',
    minArea: '',
    maxArea: '',
    minRent: '',
    maxRent: '',
  });

  const soilTypes = [
    'Alluvial', 'Black (Regur)', 'Red', 'Laterite', 'Arid (Desert)',
    'Forest', 'Peaty', 'Saline', 'Clay', 'Sandy', 'Loamy',
  ];

  const states = [
    'Maharashtra', 'Karnataka', 'Gujarat', 'Rajasthan', 'Madhya Pradesh',
    'Uttar Pradesh', 'Punjab', 'Haryana', 'Tamil Nadu', 'Andhra Pradesh',
    'Telangana', 'Bihar', 'West Bengal', 'Odisha', 'Kerala',
  ];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const empty = Object.fromEntries(Object.keys(filters).map((k) => [k, '']));
    setFilters(empty);
    onSearch(empty);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 md:p-6">
      {/* Quick search bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="cropType"
            value={filters.cropType}
            onChange={handleChange}
            placeholder="Search by crop type (e.g., Rice, Sugarcane)..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2.5 border rounded-xl flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
            isOpen
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FaSlidersH />
          Filters
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Expandable Filters */}
      {isOpen && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-[fadeIn_0.2s_ease-out]">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
            <select
              name="state"
              value={filters.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">District</label>
            <input
              type="text"
              name="district"
              value={filters.district}
              onChange={handleChange}
              placeholder="Enter district"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Village</label>
            <input
              type="text"
              name="village"
              value={filters.village}
              onChange={handleChange}
              placeholder="Enter village"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Soil Type</label>
            <select
              name="soilType"
              value={filters.soilType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Soil Types</option>
              {soilTypes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Min Area (acres)</label>
            <input
              type="number"
              name="minArea"
              value={filters.minArea}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Max Area (acres)</label>
            <input
              type="number"
              name="maxArea"
              value={filters.maxArea}
              onChange={handleChange}
              placeholder="No limit"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Min Rent (₹)</label>
            <input
              type="number"
              name="minRent"
              value={filters.minRent}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Max Rent (₹)</label>
            <input
              type="number"
              name="maxRent"
              value={filters.maxRent}
              onChange={handleChange}
              placeholder="No limit"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1.5 cursor-pointer"
            >
              <FaTimes /> Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
