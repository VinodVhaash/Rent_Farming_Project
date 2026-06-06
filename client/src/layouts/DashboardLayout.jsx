import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
  FaSeedling, FaSignOutAlt, FaUser, FaTachometerAlt, FaPlus,
  FaList, FaUsers, FaClipboardCheck, FaHome, FaBars, FaTimes,
  FaSearch, FaHeart, FaChartBar
} from 'react-icons/fa';
import { useState } from 'react';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavItems = () => {
    const role = user?.role;

    if (role === 'farmer') {
      return [
        { to: '/farmer/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { to: '/farmer/add-land', icon: <FaPlus />, label: 'Add Land' },
        { to: '/farmer/listing-status', icon: <FaList />, label: 'Listing Status' },
        { to: '/farmer/profile', icon: <FaUser />, label: 'My Profile' },
      ];
    }

    if (role === 'buyer') {
      return [
        { to: '/buyer/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { to: '/buyer/search', icon: <FaSearch />, label: 'Search Lands' },
        { to: '/buyer/saved-listings', icon: <FaHeart />, label: 'Saved Listings' },
        { to: '/buyer/profile', icon: <FaUser />, label: 'My Profile' },
      ];
    }

    if (role === 'admin') {
      return [
        { to: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { to: '/admin/land-approval', icon: <FaClipboardCheck />, label: 'Land Approvals' },
        { to: '/admin/users', icon: <FaUsers />, label: 'Users' },
        { to: '/admin/reports', icon: <FaChartBar />, label: 'Reports' },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 shadow-sm transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-lg no-underline">
            <FaSeedling className="text-xl" />
            Rent Farming
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 cursor-pointer bg-transparent border-none">
            <FaTimes />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                location.pathname === item.to
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <Link to="/" onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all no-underline">
              <FaHome /> Go to Website
            </Link>
          </div>
        </nav>
      </aside>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-green-700 cursor-pointer bg-transparent border-none"
            >
              <FaBars className="text-xl" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-green-600 text-sm" />
                </div>
                <span className="hidden sm:inline">
                  {user?.firstName} <span className="text-gray-400 capitalize">({user?.role})</span>
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer bg-transparent"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
