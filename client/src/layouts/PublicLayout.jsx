import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSeedling, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../store/slices/authSlice';
import { useState, useEffect } from 'react';

const PublicLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'farmer') return '/farmer/dashboard';
    return '/buyer/dashboard';
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/lands', label: 'Browse Lands' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">

      {/* ═══════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-0">
        <nav
          className="
                      w-full
                      mx-auto
                      bg-white/55
                      backdrop-blur-2xl
                      border border-white/60
                      shadow-[0_8px_40px_rgba(0,0,0,0.12)]
                      px-8
                      py-2
                      "
        >
          <div className="flex items-center justify-between h-10 sm:h-12 lg:h-12 xl:h-14">

            {/* ── Brand Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2 text-black font-bold text-lg sm:text-xl lg:text-2xl xl:text-2xl no-underline flex-shrink-0"
            >
              <div
                className="
                        h-10 w-10
                        rounded-2xl
                        bg-gradient-to-br
                        from-green-500
                        to-green-700

                        flex items-center justify-center

                        shadow-lg
                        "
              >
                <FaSeedling className="text-white text-2xl" />
              </div>
              <span className="text-black">Rent Farming</span>
            </Link>

            {/* ── Desktop Nav Links (md and above) ── */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 text-black">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1.5 font-medium transition-all duration-200 no-underline whitespace-nowrap
                    text-sm lg:text-sm xl:text-base 2xl:text-base
                    ${isActive(link.to)
                      ? 'text-black font-semibold'
                      : 'text-black hover:text-black'
                    }`}
                >
                  {link.label}
                  {/* Active underline indicator */}
                  {isActive(link.to) && (
                    <span
                      className="
                                  absolute
                                  left-0
                                  right-0
                                  -bottom-3

                                  h-[3px]

                                  bg-black

                                  rounded-full
                                  "
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Desktop Auth Buttons (md and above) ── */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="
                      inline-flex items-center justify-center
                      px-4 py-2
                      lg:px-5 lg:py-2.5
                      xl:px-6 xl:py-3
                      text-xs lg:text-sm xl:text-sm 2xl:text-base
                      font-semibold text-black
                      border border-green-200 rounded-xl
                      bg-white hover:bg-green-50 hover:border-green-400
                      transition-all duration-200 shadow-sm hover:shadow-md
                      no-underline whitespace-nowrap
                    "
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="
                      inline-flex items-center justify-center
                      px-4 py-2
                      lg:px-5 lg:py-2.5
                      xl:px-6 xl:py-3
                      text-xs lg:text-sm xl:text-sm 2xl:text-base
                      font-semibold text-red-600
                      border border-red-200 rounded-xl
                      bg-white hover:bg-red-50 hover:border-red-400
                      transition-all duration-200 shadow-sm hover:shadow-md
                      cursor-pointer whitespace-nowrap
                    "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="
                                px-8
                                py-3
                                font-semibold
                                rounded-full
                               bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5
                                text-white-900
                                shadow-sm
                                hover:bg-white
                                transition-all
                                "
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="
                                px-8
                                py-3
                                font-semibold
                                 rounded-full
                               bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5
                                text-gray-900
                                shadow-sm
                                hover:bg-white
                                transition-all
                                "
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile Hamburger (below md) ── */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 cursor-pointer bg-transparent border-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen
                ? <FaTimes className="text-xl" />
                : <FaBars className="text-xl" />
              }
            </button>

          </div>
        </nav>

        {/* ── Mobile Dropdown Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="border-t border-gray-100 bg-white px-4 pt-2 pb-4">
            {/* Nav Links */}
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block py-3 px-4 text-[15px] font-medium no-underline rounded-xl transition-colors ${isActive(link.to)
                    ? 'text-black bg-green-50'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100/70'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-center py-3 text-sm font-semibold text-black border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm no-underline"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="py-3 text-sm font-semibold text-red-600 border border-red-200 rounded-xl bg-white hover:bg-red-50 transition-all shadow-sm cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-center py-3 text-sm font-semibold text-black border-2 border-black rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm no-underline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-md hover:shadow-lg transition-all no-underline"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="bg-gray-900 text-gray-300 ">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-10 ">

          {/* 3-column grid — stacks to 1 on mobile, 2 on sm, 3 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 mb-8 lg:mb-10">

            {/* Brand */}
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-white font-bold text-lg xl:text-xl mb-3 text-center">
                <div
                  className="
                        h-10 w-10
                        rounded-2xl
                        bg-gradient-to-br
                        from-green-500
                        to-green-700
                        flex items-center justify-center
                        shadow-lg
                        "
                >
                  <FaSeedling className="text-white text-2xl" />
                </div>
                Rent Farming
              </div>
              <p className="text-sm xl:text-base text-gray-400 leading-relaxed max-w-xs mx-auto text-center">
                India's trusted agricultural land rental marketplace. Connecting
                landowners with farmers for better productivity.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center ">
              <h4 className="font-semibold text-white mb-4 text-xs xl:text-sm uppercase tracking-widest">
                Quick Links
              </h4>
              <ul className="space-y-2.5 xl:space-y-3 text-sm xl:text-base list-none p-0 m-0">
                {[
                  { to: '/lands', label: 'Browse Lands' },
                  { to: '/about', label: 'About Us' },
                  { to: '/faq', label: 'FAQ' },
                  { to: '/contact', label: 'Contact' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-green-400 transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center">
              <h4 className="font-semibold text-white mb-4 text-xs xl:text-sm uppercase tracking-widest">
                Contact Info
              </h4>
              <ul className="space-y-2.5 xl:space-y-3 text-sm xl:text-base text-gray-400 list-none p-0 m-0 text-center">
                <li className="flex items-center justify-center gap-2.5">
                  <span className="text-base flex-shrink-0">📧</span>
                  <span>support@rentfarming.in</span>
                </li>
                <li className="flex items-center justify-center gap-2.5">
                  <span className="text-base flex-shrink-0">📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center justify-center gap-2.5">
                  <span className="text-base flex-shrink-0">📍</span>
                  <span>Pune, Maharashtra, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 xl:pt-8 text-center text-xs sm:text-sm xl:text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Rent Farming. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
