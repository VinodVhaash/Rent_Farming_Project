import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSeedling, FaBars, FaTimes, FaUserCircle, FaChevronRight } from 'react-icons/fa';
import { logout } from '../store/slices/authSlice';
import { useState, useEffect, useCallback } from 'react';

const PublicLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

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

  // Is on homepage (hero has bg image, so navbar should be transparent initially)
  const isHomePage = location.pathname === '/';
  const navTransparent = isHomePage && !scrolled && !mobileMenuOpen;

  return (
    <div className="min-h-screen flex flex-col">

      {/* ═══════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50">

        {/* ── Top Accent Bar ── */}
        <div className=" w-full bg-white/10 backdrop-blur-md" />
        <nav
          className={`
            w-full transition-all duration-500 ease-out
            ${navTransparent
              ? 'bg-transparent shadow-none'
              : 'bg-white/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border-b border-white/60'
            }
          `}
        >
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px]">

              {/* ── Brand Logo ── */}
              <Link
                to="/"
                className="flex items-center gap-2.5 no-underline flex-shrink-0 group"
              >
                <div
                  className={`
                    h-10 w-10 sm:h-11 sm:w-11
                    rounded-xl
                    bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600
                    flex items-center justify-center
                    shadow-lg shadow-green-500/25
                    group-hover:shadow-green-500/40
                    group-hover:scale-105
                    transition-all duration-300
                  `}
                >
                  <FaSeedling className="text-white text-lg sm:text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className={`font-extrabold text-lg sm:text-xl tracking-tight leading-none transition-colors duration-300 ${navTransparent ? 'text-white' : 'text-gray-900'}`}>
                    Rent<span className="text-green-600">Farming</span>
                  </span>
                  <span className={`text-[10px] font-medium tracking-widest uppercase leading-none mt-0.5 transition-colors duration-300 ${navTransparent ? 'text-green-200' : 'text-green-600/70'}`}>
                    Agricultural Marketplace
                  </span>
                </div>
              </Link>

              {/* ── Desktop Nav Links (md and above) ── */}
              <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      relative px-3 lg:px-4 py-2 font-medium no-underline whitespace-nowrap
                      text-[13px] lg:text-sm
                      rounded-lg transition-all duration-300
                      group
                      ${isActive(link.to)
                        ? navTransparent
                          ? 'text-white font-semibold'
                          : 'text-white font-semibold'
                        : navTransparent
                          ? 'text-white hover:text-white hover:bg-white/10'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    {link.label}
                    {/* Animated underline — visible on active, hover-animated on others */}
                    <span
                      className={`
                        absolute left-1/2 -translate-x-1/2 -bottom-0.5
                        h-[2.5px] rounded-full
                        transition-all duration-300 ease-out
                        ${isActive(link.to)
                          ? navTransparent
                            ? 'w-5 bg-white'
                            : 'w-5 bg-green-600'
                          : navTransparent
                            ? 'w-0 group-hover:w-4 bg-white/70'
                            : 'w-0 group-hover:w-4 bg-green-500'
                        }
                      `}
                    />
                  </Link>
                ))}
              </div>

              {/* ── Desktop Auth Buttons (md and above) ── */}
              <div className="hidden md:flex items-center gap-2.5 lg:gap-3 flex-shrink-0">
                {isAuthenticated ? (
                  <>
                    {/* User greeting pill */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${navTransparent ? 'bg-white/15 text-white' : 'bg-green-50 text-green-800'}`}>
                      <FaUserCircle className="text-sm" />
                      <span>Hi, {user?.firstName || 'User'}</span>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className={`
                        inline-flex items-center justify-center gap-1.5
                        px-4 py-2 lg:px-5 lg:py-2.5
                        text-xs lg:text-sm font-semibold
                        rounded-xl no-underline whitespace-nowrap
                        transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-[1px]
                        ${navTransparent
                          ? 'text-white border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                          : 'text-green-700 border border-green-200 bg-white hover:bg-green-50 hover:border-green-400'
                        }
                      `}
                    >
                      Dashboard
                      <FaChevronRight className="text-[9px]" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`
                        inline-flex items-center justify-center
                        px-4 py-2 lg:px-5 lg:py-2.5
                        text-xs lg:text-sm font-semibold
                        rounded-xl cursor-pointer whitespace-nowrap
                        transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-[1px]
                        ${navTransparent
                          ? 'text-red-200 border border-red-300/30 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm'
                          : 'text-red-600 border border-red-200 bg-white hover:bg-red-50 hover:border-red-400'
                        }
                      `}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`
                        inline-flex items-center justify-center
                        px-5 py-2.5 lg:px-6 lg:py-2.5
                        text-sm font-semibold
                        rounded-xl no-underline whitespace-nowrap
                        transition-all duration-300 hover:-translate-y-[1px]
                        ${navTransparent
                          ? 'bg-sky-500/50  text-white hover:bg-sky-500 shadow-lg shadow-emerald-800/75'
                          : 'text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md'
                        }
                      `}
                    >
                      Login
                      <FaChevronRight className="text-[10px]" />
                    </Link>
                    <Link
                      to="/register"
                      className={`
                        inline-flex items-center justify-center
                        px-5 py-2.5 lg:px-6 lg:py-2.5
                        text-sm font-semibold
                        rounded-xl no-underline whitespace-nowrap
                        transition-all duration-300 hover:-translate-y-[1px]
                        ${navTransparent
                          ? 'bg-sky-500/50  text-white hover:bg-sky-500 shadow-lg shadow-emerald-800/75'
                          : 'text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md'
                        }
                      `}
                    >
                      Register
                      <FaChevronRight className="text-[10px]" />
                    </Link>
                  </>
                )}
              </div>

              {/* ── Mobile Hamburger (below md) ── */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`
                  md:hidden flex items-center justify-center
                  w-10 h-10 rounded-xl cursor-pointer
                  bg-transparent border-none
                  transition-all duration-300
                  ${navTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                  }
                `}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <FaBars className={`text-xl absolute transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
                  <FaTimes className={`text-xl absolute transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
                </div>
              </button>

            </div>
          </div>
        </nav>

        {/* ── Mobile Dropdown Menu ── */}
        <div
          className={`
            md:hidden
            transition-all duration-400 ease-out
            ${mobileMenuOpen
              ? 'max-h-[600px] opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
            }
          `}
        >
          <div className="bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-2xl px-4 pt-3 pb-5">
            {/* Nav Links */}
            <nav className="space-y-0.5">
              {navLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center justify-between
                    py-3.5 px-4 text-[15px] font-medium no-underline rounded-xl
                    transition-all duration-300
                    ${isActive(link.to)
                      ? 'text-green-700 bg-green-50 font-semibold'
                      : 'text-gray-700 hover:text-green-700 hover:bg-green-50/50'
                    }
                  `}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span>{link.label}</span>
                  {isActive(link.to) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-3 mx-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Auth Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {isAuthenticated ? (
                <>
                  {/* User greeting */}
                  <div className="col-span-2 flex items-center gap-2 px-4 py-2.5 bg-green-50 rounded-xl mb-1">
                    <FaUserCircle className="text-green-600 text-lg" />
                    <span className="text-sm font-medium text-green-800">Hi, {user?.firstName || 'User'}</span>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="text-center py-3 text-sm font-semibold text-green-700 border border-green-200 rounded-xl bg-white hover:bg-green-50 transition-all shadow-sm no-underline"
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
                    className="text-center py-3.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm no-underline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-3.5 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-md shadow-green-600/20 hover:shadow-lg transition-all no-underline"
                  >
                    Get Started
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
                  <span>Coming soon</span>
                </li>
                <li className="flex items-center justify-center gap-2.5">
                  <span className="text-base flex-shrink-0">📞</span>
                  <span>Coming soon</span>
                </li>
                <li className="flex items-center justify-center gap-2.5">
                  <span className="text-base flex-shrink-0">📍</span>
                  <span>Kembali, Tal.Kagal, Kolhapur, Maharashtra, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 xl:pt-8 text-center text-xs sm:text-sm xl:text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Rent Farming. All rights reserved.</p>
            <p>Developed by : Dheeraj and Vinod</p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
