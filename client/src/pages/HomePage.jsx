import { Link } from 'react-router-dom';
import {
  FaSeedling, FaShieldAlt, FaSearch,
  FaUserPlus, FaCheckCircle, FaArrowRight,
  FaMapMarkedAlt, FaUsers, FaLeaf
} from 'react-icons/fa';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Note: farmimg.png is in /public — accessed via URL, not imported

const HomePage = () => {

  const { t } = useTranslation();
  const [farmerCount, setFarmerCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/farmer-count").then((res) => {
      setFarmerCount(res.data.count);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  return (
    <div className="overflow-hidden">
      {/* ═══════ HERO SECTION ═══════ */}
      <section
        className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[80vh] xl:min-h-[85vh] 3xl:min-h-screen flex items-center overflow-hidden bg-cover bg-[center_top] lg:bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/farmimg2.png')" }}
      >
        {/* Very light left-to-right gradient so left text area has slight contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.60)_100%)]" />

        <div className="relative w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">

          {/* ── LEFT: Text Content ── */}
          <div className="flex flex-col items-center text-center lg:ml-32 pt-12">
            <div className="flex justify-end mb-4">
              <LanguageSwitcher />
            </div>
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 lg:px-8 lg:py-3.5 3xl:px-10 3xl:py-4 bg-green-900/85 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-semibold mb-6 shadow-lg">
              <FaShieldAlt className="text-green-300 flex-shrink-0" />
              {t('home.badge', 'India\'s Agricultural Land Marketplace')}
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl 3xl:text-7xl font-bold leading-[1.1] mb-5">
              <span className="text-gray-900 drop-shadow-sm">{t('home.headingLine1', 'Rent Agricultural')}</span>
              <span className="block text-green-700 drop-shadow-lg">
                {t('home.headingLine2', 'Land Easily')} <span className="text-3xl">🌿</span>
              </span>
            </h1>

            {/* Description with left green border */}
            <div className="border-l-4 border-green-600 pl-4 mb-8">
              <p className="text-gray-800 text-sm sm:text-base lg:text-sm xl:text-base 3xl:text-lg leading-relaxed font-medium">
                {t('home.description', 'Connecting Indian landowners with farmers who need land. Find the perfect plot for farming or list your land for rent – all in one trusted platform.')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 lg:px-6 lg:py-3 3xl:px-7 3xl:py-3.5 rounded-full bg-green-700 text-white font-bold text-sm lg:text-sm 3xl:text-base shadow-lg hover:bg-green-800 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 no-underline"
              >
                <FaSeedling /> {t('home.getStarted', 'Get Started →')}
              </Link>
              <Link
                to="/lands"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 lg:px-6 lg:py-3 3xl:px-7 3xl:py-3.5 bg-white/90 backdrop-blur-sm text-gray-800 font-semibold text-sm lg:text-sm 3xl:text-base rounded-full border border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 no-underline"
              >
                <FaSearch /> {t('home.browseLands', 'Browse Lands')}
              </Link>
            </div>

            {/* Stat Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { value: farmerCount, label: t('home.statFarmers', 'Farmers'), icon: <FaUsers className="text-green-400" /> },
                { value: '5K+', label: t('home.statListings', 'Listings'), icon: <FaMapMarkedAlt className="text-green-400" /> },
                { value: '15+', label: t('home.statStates', 'States'), icon: <FaSeedling className="text-green-400" /> },
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
                <p className="text-2xl font-bold text-white text-center">{t('register.brandName', 'Rent Farming')}</p>
                <p className="text-sm text-green-200/90 text-center font-medium">{t('home.growTogether', 'Grow Together, Prosper Together')}</p>
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


      {/* ═══════ FEATURES / WHY CHOOSE US SECTION ═══════ */}
      <section
        className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
        style={{
          backgroundImage: "url('/farm3.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Soft overlay for readability */}
        <div className="" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* ── Section Header ── */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-widest mb-3">
              <span className="text-lg">🌿</span> {t('home.whyChooseUs', 'Why Choose Us')} <span className="text-lg">🌿</span>
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] font-extrabold text-gray-900 leading-tight mb-2">
              {t('home.featuresHeading', 'Everything You Need for')}{' '}
              <span className="text-green-700">{t('home.featuresHighlight', 'Land Rental')}</span>
            </h2>
            {/* Green underline accent */}
            <div className="w-24 h-1 bg-green-600 rounded-full mx-auto mt-2 mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {t('home.featuresSubtext', 'Our platform makes renting agricultural land simple, secure, and accessible for every Indian farmer.')}
            </p>
          </div>

          {/* ── Cards Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                img: '/icon_easy_search.png',
                titleKey: 'home.card1Title',
                titleDefault: 'Easy Land Search',
                descKey: 'home.card1Desc',
                descDefault: 'Search land by location, soil type, crop suitability, area, and budget with ease.',
                bg: 'bg-gradient-to-br from-blue-300/80 to-sky-200/80 backdrop-blur-sm',
                ring: 'ring-blue-400',
                //arrow: 'bg-orange-500',
              },
              {
                img: '/icon_verified.png',
                titleKey: 'home.card2Title',
                titleDefault: 'Verified Listings',
                descKey: 'home.card2Desc',
                descDefault: 'All land listings are verified by our admin team for authenticity and trust.',
                bg: 'bg-gradient-to-br from-indigo-200 via-blue-100 to-slate-100',
                ring: 'ring-indigo-300',
                //arrow: 'bg-blue-500',
              },
              {
                img: '/icon_direct_contact.png',
                titleKey: 'home.card3Title',
                titleDefault: 'Direct Contact',
                descKey: 'home.card3Desc',
                descDefault: 'Connect directly with landowners. No middlemen, no hidden fees – complete transparency.',
                bg: 'bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-50',
                ring: 'ring-amber-300',
                // arrow: 'bg-orange-500',
              },
              {
                img: '/icon_mobile.png',
                titleKey: 'home.card4Title',
                titleDefault: 'Mobile Friendly',
                descKey: 'home.card4Desc',
                descDefault: 'Fully responsive platform accessible anytime, anywhere on any device.',
                bg: 'bg-gradient-to-br from-violet-200 via-purple-100 to-fuchsia-50',
                ring: 'ring-violet-300',
                //arrow: 'bg-orange-500',
              },
              {
                img: '/icon_india_coverage.png',
                titleKey: 'home.card5Title',
                titleDefault: 'Pan-India Coverage',
                descKey: 'home.card5Desc',
                descDefault: 'Browse agricultural land listings across multiple Indian states and districts.',
                bg: 'bg-gradient-to-br from-emerald-200 via-teal-100 to-cyan-100',
                ring: 'ring-emerald-300',
                //arrow: 'bg-orange-500',
              },
              {
                img: '/icon_support.png',
                titleKey: 'home.card6Title',
                titleDefault: '24/7 Support',
                descKey: 'home.card6Desc',
                descDefault: 'Upload documents securely and get support from our dedicated team anytime.',
                bg: 'bg-gradient-to-br from-rose-200 via-orange-100 to-amber-50',
                ring: 'ring-rose-300',
                //arrow: 'bg-orange-500',
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`group relative flex items-start gap-4 p-5 sm:p-6 rounded-2xl ${card.bg} ring-1 ${card.ring} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                {/* Icon image */}
                <div className="flex-shrink-0 w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem]">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-1">
                    {t(card.titleKey, card.titleDefault)}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {t(card.descKey, card.descDefault)}
                  </p>
                </div>

                {/* Arrow button */}
                {/* <div
                  className={`absolute bottom-4 right-4 w-8 h-8 ${card.arrow} rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                >
                  <FaArrowRight className="text-white text-xs" />
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-2 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-blue-500/20 backdrop-blur-xl">
          <div className="text-center mb-16 ">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">{t('home.simpleProcess', 'Simple Process')}</p>
            <h2 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 3xl:text-4xl font-bold text-gray-900 mb-4">{t('home.howItWorks', 'How It Works')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-20">
            {/* Farmer Flow */}
            <div className="ml-4 md:ml-8 lg:ml-12">
              <h3 className="text-xl font-bold text-green-700 mb-8 flex items-center gap-2">
                <FaSeedling /> {t('home.forFarmers', 'For Landowners / Farmers')}
              </h3>
              <div className="space-y-6">
                {[
                  { step: '1', title: t('home.farmerStep1Title', 'Register & Verify'), desc: t('home.farmerStep1Desc', 'Sign up with your details and verify via OTP.') },
                  { step: '2', title: t('home.farmerStep2Title', 'Add Land Details'), desc: t('home.farmerStep2Desc', 'Fill in land area, crops, soil, location, rent & upload photos.') },
                  { step: '3', title: t('home.farmerStep3Title', 'Admin Approval'), desc: t('home.farmerStep3Desc', 'Our team reviews your listing for authenticity.') },
                  { step: '4', title: t('home.farmerStep4Title', 'Get Connected'), desc: t('home.farmerStep4Desc', 'Interested buyers contact you directly.') },
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
                <FaUsers /> {t('home.forBuyers', 'For Buyers / Tenants')}
              </h3>
              <div className="space-y-6">
                {[
                  { step: '1', title: t('home.buyerStep1Title', 'Browse Listings'), desc: t('home.buyerStep1Desc', 'Explore approved lands across India.') },
                  { step: '2', title: t('home.buyerStep2Title', 'Filter & Search'), desc: t('home.buyerStep2Desc', 'Narrow down by state, district, soil, crop, and budget.') },
                  { step: '3', title: t('home.buyerStep3Title', 'Register / Login'), desc: t('home.buyerStep3Desc', 'Sign up to see complete contact details.') },
                  { step: '4', title: t('home.buyerStep4Title', 'Contact Farmer'), desc: t('home.buyerStep4Desc', 'Call or message the landowner directly.') },
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
                {t('home.ctaHeading', 'Ready to Start Your Farming Journey?')}
              </h2>
              <p className="text-green-100/80 mb-8 max-w-xl mx-auto text-center ">
                {t('home.ctaSubtext', 'Join thousands of Indian farmers and landowners who trust Rent Farming for connecting land with opportunity.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-all shadow-lg no-underline"
                >
                  <FaUserPlus /> {t('home.registerFarmer', 'Register as Farmer')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all no-underline"
                >
                  <FaCheckCircle /> {t('home.registerBuyer', 'Register as Buyer')}
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
