import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload, FaImage, FaFileAlt } from 'react-icons/fa';
import landService from '../../services/landService';
import LoadingSpinner from '../../components/LoadingSpinner';

const soilTypes = ['Alluvial', 'Black (Regur)', 'Red', 'Laterite', 'Arid (Desert)', 'Forest', 'Peaty', 'Saline', 'Clay', 'Sandy', 'Loamy'];
const states = ['Maharashtra', 'Karnataka', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Bihar', 'West Bengal', 'Odisha', 'Kerala'];

const EditLandPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [document, setDocument] = useState(null);
  const [form, setForm] = useState({
    area: '', landUnit: 'acre', crops: '', soilType: '', waterAvailability: '',
    village: '', taluka: '', district: '', state: '',
    expectedRent: '', rentDuration: 'yearly', description: '',
  });

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const { data } = await landService.getLandById(id);
        const land = data.land;
        setForm({
          area: land.area || '',
          landUnit: land.landUnit || 'acre',
          crops: land.crops || '',
          soilType: land.soilType || '',
          waterAvailability: land.waterAvailability || '',
          village: land.village || '',
          taluka: land.taluka || '',
          district: land.district || '',
          state: land.state || '',
          expectedRent: land.expectedRent || '',
          rentDuration: land.rentDuration || 'yearly',
          description: land.description || '',
        });
      } catch (err) {
        toast.error('Failed to load land details.');
        navigate('/farmer/dashboard');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchLand();
  }, [id, navigate]);

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

      await landService.updateLand(id, formData);
      toast.success('Land listing updated! It will be re-reviewed by admin.');
      navigate('/farmer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await landService.deleteLand(id);
      toast.success('Land listing deleted.');
      navigate('/farmer/dashboard');
    } catch (err) {
      toast.error('Failed to delete listing.');
    }
  };

  if (fetchLoading) return <LoadingSpinner text="Loading land details..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Land Listing</h1>
          <p className="text-gray-500 text-sm mt-1">Update your land details. Changes will require re-approval.</p>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer font-medium"
        >
          Delete Listing
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {/* Same form fields as AddLandPage */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">📐 Land Measurements</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
            <input type="number" name="area" value={form.area} onChange={handleChange} required min="0.01" step="0.01"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
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

        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">🌱 Crops & Water</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suitable Crops</label>
            <input type="text" name="crops" value={form.crops} onChange={handleChange}
              placeholder="e.g., Rice, Sugarcane, Cotton" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
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

        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">📍 Location</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
            <input type="text" name="village" value={form.village} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
            <input type="text" name="taluka" value={form.taluka} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input type="text" name="district" value={form.district} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
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

        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">💰 Rent Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Rent (₹) *</label>
            <input type="number" name="expectedRent" value={form.expectedRent} onChange={handleChange} required min="1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
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

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">📎 Replace Uploads</h3>
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><FaImage className="inline mr-1" /> New Images (replaces existing)</label>
            <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-colors">
              <FaUpload className="text-xl text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload</p>
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
            </label>
            {images.length > 0 && <p className="text-xs text-green-600 mt-2">✓ {images.length} image(s) selected</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><FaFileAlt className="inline mr-1" /> New 7/12 Document</label>
            <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-colors">
              <FaUpload className="text-xl text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload</p>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setDocument(e.target.files[0])} />
            </label>
            {document && <p className="text-xs text-green-600 mt-2">✓ {document.name}</p>}
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isLoading}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer text-sm">
            {isLoading ? 'Updating...' : 'Update & Resubmit'}
          </button>
          <button type="button" onClick={() => navigate('/farmer/dashboard')}
            className="px-8 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLandPage;
