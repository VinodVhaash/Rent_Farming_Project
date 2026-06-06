import { FaSeedling, FaUsers, FaGlobeAsia, FaHandshake } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-700 pt-28 sm:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">About Rent Farming</h1>
          <p className="text-green-100/80 max-w-2xl mx-auto text-lg">
            Empowering Indian agriculture by bridging the gap between landowners and farmers
            through technology.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">Our Mission</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Making Agricultural Land Accessible
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                India's agricultural sector faces a unique challenge: many landowners have idle land,
                while numerous aspiring farmers lack access to farmland. Rent Farming bridges this
                gap by creating a transparent, secure, and easy-to-use marketplace.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our platform enables landowners to list their agricultural plots for rent, while
                buyers and tenant farmers can browse, filter, and connect with landowners directly –
                without middlemen or hidden fees.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every listing is verified by our admin team, ensuring authenticity and trust. We
                support 7/12 document uploads for transparent land ownership verification.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <FaSeedling className="text-3xl" />, label: 'Farmer First', desc: 'Designed for rural India', color: 'bg-green-50 text-green-600' },
                { icon: <FaUsers className="text-3xl" />, label: 'Community', desc: '10K+ active users', color: 'bg-blue-50 text-blue-600' },
                { icon: <FaGlobeAsia className="text-3xl" />, label: 'Pan-India', desc: '15+ states covered', color: 'bg-amber-50 text-amber-600' },
                { icon: <FaHandshake className="text-3xl" />, label: 'Trust', desc: 'Verified listings', color: 'bg-purple-50 text-purple-600' },
              ].map((item, i) => (
                <div key={i} className={`${item.color} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <h3 className="font-bold">{item.label}</h3>
                  <p className="text-sm opacity-75 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Transparency',
                desc: 'All listings are verified. Land documents are securely handled. No hidden charges.',
                emoji: '🔍',
              },
              {
                title: 'Accessibility',
                desc: 'Mobile-first design with simple UI, large buttons, and clear typography for all users.',
                emoji: '📱',
              },
              {
                title: 'Security',
                desc: 'OTP verification, JWT authentication, encrypted passwords, and secure data handling.',
                emoji: '🔒',
              },
            ].map((val, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <span className="text-4xl mb-4 block">{val.emoji}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
