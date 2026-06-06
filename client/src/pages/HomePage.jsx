import { Link } from 'react-router-dom';
import {
  FaSeedling, FaHandshake, FaShieldAlt, FaSearch,
  FaUserPlus, FaCheckCircle, FaArrowRight, FaMobileAlt,
  FaMapMarkedAlt, FaClipboardCheck, FaUsers, FaLeaf, FaEnvira
} from 'react-icons/fa';
// Note: farmimg.png is in /public — accessed via URL, not imported

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      {/* ═══════ HERO SECTION ═══════ */}
      <section
        className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[80vh] xl:min-h-[85vh] 3xl:min-h-screen flex items-center overflow-hidden bg-cover bg-[center_top] lg:bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/farmimg2.png')" }}
      >
        {/* Very light left-to-right gradient so left text area has slight contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.75)_100%)]" />

        <div className="relative w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">

          {/* ── LEFT: Text Content ── */}
          <div className="flex flex-col items-center text-center lg:ml-32 pt-12">

            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 lg:px-8 lg:py-3.5 3xl:px-10 3xl:py-4 bg-green-900/85 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-semibold mb-6 shadow-lg">
              <FaShieldAlt className="text-green-300 flex-shrink-0" />
              India's Agricultural Land Marketplace
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl 3xl:text-7xl font-bold leading-[1.1] mb-5">
              <span className="text-gray-900 drop-shadow-sm">Rent Agricultural</span>
              <span className="block text-green-700 drop-shadow-lg">
                Land Easily <span className="text-3xl">🌿</span>
              </span>
            </h1>

            {/* Description with left green border */}
            <div className="border-l-4 border-green-600 pl-4 mb-8">
              <p className="text-gray-800 text-sm sm:text-base lg:text-sm xl:text-base 3xl:text-lg leading-relaxed font-medium">
                Connecting Indian landowners with farmers who need land.<br className="hidden sm:block" />
                Find the perfect plot for farming or list your land for rent –<br className="hidden sm:block" />
                all in one trusted platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 lg:px-6 lg:py-3 3xl:px-7 3xl:py-3.5 rounded-full bg-green-700 text-white font-bold text-sm lg:text-sm 3xl:text-base shadow-lg hover:bg-green-800 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 no-underline"
              >
                <FaSeedling /> Get Started →
              </Link>
              <Link
                to="/lands"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 lg:px-6 lg:py-3 3xl:px-7 3xl:py-3.5 bg-white/90 backdrop-blur-sm text-gray-800 font-semibold text-sm lg:text-sm 3xl:text-base rounded-full border border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 no-underline"
              >
                <FaSearch /> Browse Lands
              </Link>
            </div>

            {/* Stat Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { value: '20K+', label: 'Farmers', icon: <FaUsers className="text-green-400" /> },
                { value: '5K+', label: 'Listings', icon: <FaMapMarkedAlt className="text-green-400" /> },
                { value: '15+', label: 'States', icon: <FaSeedling className="text-green-400" /> },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-black/45 backdrop-blur-sm rounded-2xl text-white shadow-md"
                >
                  <span className="text-lg">{stat.icon}</span>
                  <div>
                    <p className="text-base font-bold leading-none">{stat.value}</p>
                    <p className="text-xs text-gray-300 leading-none mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Glass Card ── */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Main card */}
              <div className="w-80 xl:w-96 xl:h-70 rounded-3xl bg-green-900/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(255,255,255,0.90)] p-8 flex flex-col justify-center items-center gap-3 rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* App icon */}
                <div className="w-14 h-14  flex items-center justify-center shadow-lg mb-1">
                  <FaLeaf className="text-3xl text-green-600" />
                </div>
                <p className="text-2xl font-bold text-white text-center">Rent Farming</p>
                <p className="text-sm text-green-200/90 text-center font-medium">Grow Together, Prosper Together</p>
                {/* Animated emoji row */}
                <div className="flex gap-2 mt-4">
                  {['🌾', '🌿', '🌱', '🌻', '🚜'].map((e, i) => (
                    <span
                      key={i}
                      className="text-4xl animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    >{e}</span>
                  ))}
                </div>
              </div>
              {/* Floating tractor badge */}
              <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-amber-400/30 rounded-2xl backdrop-blur-sm border border-amber-300/30 flex items-center justify-center animate-pulse shadow-lg">
                <span className="text-4xl">🚜</span>
              </div>
              {/* Floating water badge */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400/30 rounded-2xl backdrop-blur-sm border border-blue-300/30 flex items-center justify-center animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}>
                <span className="text-2xl">💧</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ═══════ FEATURES SECTION ═══════ */}
      <section className="my-4">
        <div className="w-full mx-auto">
          <div className="text-center bg-blue-500/20 backdrop-blur-xl">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">Why Choose Us</p>
            <h2 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 3xl:text-4xl font-bold text-gray-900 mb-4">Everything You Need for Land Rental</h2>
            <p className="text-gray-500 w-full mx-auto text-center">Our platform simplifies the process of renting agricultural land, making it accessible and secure for all Indian farmers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 bg-blue-500/20 backdrop-blur-xl">
            {[
              {
                icon: <FaSearch className="text-2xl" />,
                title: 'Easy Land Search',
                desc: 'Filter by location, soil type, crop suitability, area, and budget to find the perfect plot.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: <FaShieldAlt className="text-2xl" />,
                title: 'Verified Listings',
                desc: 'Every land listing is reviewed and approved by our admin team for authenticity.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: <FaHandshake className="text-2xl" />,
                title: 'Direct Contact',
                desc: 'Connect directly with landowners. No middlemen, no extra charges.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: <FaMobileAlt className="text-2xl" />,
                title: 'Mobile Friendly',
                desc: 'Designed for smartphones. Access the platform even on low-bandwidth connections.',
                color: 'bg-purple-50 text-purple-600',
              },
              {
                icon: <FaMapMarkedAlt className="text-2xl" />,
                title: 'Pan-India Coverage',
                desc: 'Browse land listings across multiple Indian states and districts.',
                color: 'bg-red-50 text-red-600',
              },
              {
                icon: <FaClipboardCheck className="text-2xl" />,
                title: '7/12 Document Support',
                desc: 'Upload and verify land ownership documents securely on the platform.',
                color: 'bg-indigo-50 text-indigo-600',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg bg-blue-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-2 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-blue-500/20 backdrop-blur-xl">
          <div className="text-center mb-16 ">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">Simple Process</p>
            <h2 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 3xl:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-20">
            {/* Farmer Flow */}
            <div className="ml-4 md:ml-8 lg:ml-12">
              <h3 className="text-xl font-bold text-green-700 mb-8 flex items-center gap-2">
                <FaSeedling /> For Landowners / Farmers
              </h3>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Register & Verify', desc: 'Sign up with your details and verify via OTP.' },
                  { step: '2', title: 'Add Land Details', desc: 'Fill in land area, crops, soil, location, rent & upload photos.' },
                  { step: '3', title: 'Admin Approval', desc: 'Our team reviews your listing for authenticity.' },
                  { step: '4', title: 'Get Connected', desc: 'Interested buyers contact you directly.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer Flow */}
            <div className="">
              <h3 className="text-xl font-bold text-blue-500 mb-8 flex items-center gap-2">
                <FaUsers /> For Buyers / Tenants
              </h3>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Browse Listings', desc: 'Explore approved lands across India.' },
                  { step: '2', title: 'Filter & Search', desc: 'Narrow down by state, district, soil, crop, and budget.' },
                  { step: '3', title: 'Register / Login', desc: 'Sign up to see complete contact details.' },
                  { step: '4', title: 'Contact Farmer', desc: 'Call or message the landowner directly.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section className="py-2">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-6 sm:p-10 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 3xl:text-4xl font-bold text-white mb-4">
                Ready to Start Your Farming Journey?
              </h2>
              <p className="text-green-100/80 mb-8 max-w-xl mx-auto text-center ">
                Join thousands of Indian farmers and landowners who trust Rent Farming for
                connecting land with opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-all shadow-lg no-underline"
                >
                  <FaUserPlus /> Register as Farmer
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all no-underline"
                >
                  <FaCheckCircle /> Register as Buyer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
