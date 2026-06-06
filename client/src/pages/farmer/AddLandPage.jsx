import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload, FaImage, FaFileAlt } from 'react-icons/fa';
import landService from '../../services/landService';

const soilTypes = ['Alluvial', 'Black (Regur)', 'Red', 'Laterite', 'Arid (Desert)', 'Forest', 'Peaty', 'Saline', 'Clay', 'Sandy', 'Loamy'];
const states = ['Maharashtra', 'Karnataka', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Bihar', 'West Bengal', 'Odisha', 'Kerala'];

const AddLandPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [document, setDocument] = useState(null);
  const [form, setForm] = useState({
    area: '', landUnit: 'acre', crops: '', soilType: '', waterAvailability: '',
    village: '', taluka: '', district: '', state: '',
    expectedRent: '', rentDuration: 'yearly', description: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      images.forEach((img) => formData.append('images', img));
      if (document) formData.append('document', document);

      await landService.addLand(formData);
      toast.success('Land listing submitted! It will be visible after admin approval.');
      navigate('/farmer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add land listing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Land Listing</h1>
      <p className="text-gray-500 text-sm mb-8">Fill in the details about your agricultural land. All fields marked * are required.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {/* Land Measurements */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">📐 Land Measurements</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
            <input type="number" name="area" value={form.area} onChange={handleChange} required min="0.01" step="0.01"
              placeholder="e.g., 5" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
            <select name="landUnit" value={form.landUnit} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option value="acre">Acre</option>
              <option value="hectare">Hectare</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
            <select name="soilType" value={form.soilType} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option value="">Select soil type</option>
              {soilTypes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Crop & Water */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">🌱 Crops & Water</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suitable Crops</label>
            <input type="text" name="crops" value={form.crops} onChange={handleChange}
              placeholder="e.g., Rice, Sugarcane, Cotton" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
            <p className="text-xs text-gray-400 mt-1">Separate multiple crops with commas</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Water Availability</label>
            <select name="waterAvailability" value={form.waterAvailability} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option value="">Select</option>
              <option value="Canal">Canal</option>
              <option value="Well">Well</option>
              <option value="Borewell">Borewell</option>
              <option value="River">River</option>
              <option value="Rain-fed">Rain-fed</option>
              <option value="Dam">Dam</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">📍 Location</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
            <input type="text" name="village" value={form.village} onChange={handleChange}
              placeholder="Village name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
            <input type="text" name="taluka" value={form.taluka} onChange={handleChange}
              placeholder="Taluka name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input type="text" name="district" value={form.district} onChange={handleChange}
              placeholder="District name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select name="state" value={form.state} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option value="">Select state</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Rent */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">💰 Rent Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Rent (₹) *</label>
            <input type="number" name="expectedRent" value={form.expectedRent} onChange={handleChange} required min="1"
              placeholder="e.g., 50000" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rent Duration *</label>
            <select name="rentDuration" value={form.rentDuration} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            placeholder="Additional details about your land..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none" />
        </div>

        {/* Uploads */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">📎 Uploads</h3>
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaImage className="inline mr-1" /> Land Images (max 5)
            </label>
            <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-colors">
              <FaUpload className="text-xl text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload images</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP – max 5MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
              />
            </label>
            {images.length > 0 && (
              <p className="text-xs text-green-600 mt-2">✓ {images.length} image(s) selected</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFileAlt className="inline mr-1" /> 7/12 Document
            </label>
            <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-colors">
              <FaUpload className="text-xl text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload document</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPEG, PNG – max 5MB</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setDocument(e.target.files[0])}
              />
            </label>
            {document && (
              <p className="text-xs text-green-600 mt-2">✓ {document.name}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer text-sm"
          >
            {isLoading ? 'Submitting...' : 'Submit for Approval'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/farmer/dashboard')}
            className="px-8 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLandPage;
