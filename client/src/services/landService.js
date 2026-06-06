import API from './api';

const landService = {
  // Public
  getApprovedLands: (page = 1, limit = 12) =>
    API.get(`/lands/approved?page=${page}&limit=${limit}`),

  searchLands: (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, value);
      }
    });
    return API.get(`/lands/search?${params.toString()}`);
  },

  getLandById: (id) => API.get(`/lands/${id}`),

  // Farmer
  getMyLands: () => API.get('/lands/my/listings'),

  addLand: (formData) =>
    API.post('/lands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateLand: (id, formData) =>
    API.put(`/lands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteLand: (id) => API.delete(`/lands/${id}`),

  // Saved Listings (Buyer)
  getSavedLands: () => API.get('/lands/saved'),
  saveLand: (id) => API.post(`/lands/saved/${id}`),
  unsaveLand: (id) => API.delete(`/lands/saved/${id}`),
  checkSaved: (id) => API.get(`/lands/saved/check/${id}`),
};

export default landService;
