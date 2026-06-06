import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import FAQPage from '../pages/FAQPage';
import LandListingsPage from '../pages/LandListingsPage';
import LandDetailPage from '../pages/LandDetailPage';

// Auth Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OtpVerifyPage from '../pages/OtpVerifyPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

// Farmer Pages
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import AddLandPage from '../pages/farmer/AddLandPage';
import EditLandPage from '../pages/farmer/EditLandPage';
import FarmerProfilePage from '../pages/farmer/FarmerProfilePage';
import ListingStatusPage from '../pages/farmer/ListingStatusPage';

// Buyer Pages
import BuyerDashboard from '../pages/buyer/BuyerDashboard';
import BuyerProfilePage from '../pages/buyer/BuyerProfilePage';
import SavedListingsPage from '../pages/buyer/SavedListingsPage';
import SearchLandsPage from '../pages/buyer/SearchLandsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import LandApproval from '../pages/admin/LandApproval';
import ReportsPage from '../pages/admin/ReportsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ─── Public Routes ─────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/lands" element={<LandListingsPage />} />
        <Route path="/lands/:id" element={<LandDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* ─── Farmer Routes ─────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/add-land" element={<AddLandPage />} />
          <Route path="/farmer/edit-land/:id" element={<EditLandPage />} />
          <Route path="/farmer/listing-status" element={<ListingStatusPage />} />
          <Route path="/farmer/profile" element={<FarmerProfilePage />} />
        </Route>
      </Route>

      {/* ─── Buyer Routes ──────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/search" element={<SearchLandsPage />} />
          <Route path="/buyer/saved-listings" element={<SavedListingsPage />} />
          <Route path="/buyer/profile" element={<BuyerProfilePage />} />
        </Route>
      </Route>

      {/* ─── Admin Routes ──────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/land-approval" element={<LandApproval />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* ─── 404 ───────────────────────────────────────────────── */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
            <a href="/" className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors no-underline">
              Go Home
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
