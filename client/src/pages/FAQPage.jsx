import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();

  const faqs = [
    {
      q: t('faq.q1', 'What is Rent Farming?'),
      a: t('faq.a1', 'Rent Farming is an online marketplace that connects Indian landowners who want to rent out their agricultural land with buyers/tenants who are interested in farming on rented land.'),
    },
    {
      q: t('faq.q2', 'How do I register as a farmer/landowner?'),
      a: t('faq.a2', 'Click on "Register", select the "Farmer" role, fill in your details including your 7/12 Survey Number, verify your phone number via OTP, and you\'re ready to list your land.'),
    },
    {
      q: t('faq.q3', 'How do I list my land for rent?'),
      a: t('faq.a3', 'After logging in as a farmer, go to your dashboard and click "Add Land". Fill in the land details – area, soil type, crops, location, expected rent – and upload photos and your 7/12 document. Your listing will be reviewed by an admin before it becomes visible.'),
    },
    {
      q: t('faq.q4', 'How long does admin approval take?'),
      a: t('faq.a4', 'Our admin team reviews listings within 24-48 hours. Once approved, your land will be visible to all buyers on the platform.'),
    },
    {
      q: t('faq.q5', 'Why is the farmer\'s phone number masked?'),
      a: t('faq.a5', 'For security and privacy, farmer phone numbers are partially masked for visitors who are not logged in. Registered and logged-in buyers can see the full contact number.'),
    },
    {
      q: t('faq.q6', 'Can I list multiple land plots?'),
      a: t('faq.a6', 'Yes! One farmer account can add multiple land listings. Each listing goes through the admin approval process independently.'),
    },
    {
      q: t('faq.q7', 'What documents are required?'),
      a: t('faq.a7', 'For farmers, a 7/12 document (land record extract) is recommended to verify ownership. You can upload images and PDF documents during the listing process.'),
    },
    {
      q: t('faq.q8', 'Is there any fee for using the platform?'),
      a: t('faq.a8', 'Currently, Rent Farming is free to use for both landowners and buyers. There are no listing fees or commission charges.'),
    },
    {
      q: t('faq.q9', 'How do I search for land?'),
      a: t('faq.a9', 'Use the "Browse Lands" page to explore approved listings. You can filter by state, district, village, soil type, crop type, area range, and rent budget.'),
    },
    {
      q: t('faq.q10', 'What if my listing gets rejected?'),
      a: t('faq.a10', 'If your listing is rejected, you will see the rejection reason on your dashboard. You can edit the listing to address the issues and resubmit for approval.'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-700 pt-28 sm:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <FaQuestionCircle className="text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 text-green-300" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">{t('faq.pageTitle', 'Frequently Asked Questions')}</h1>
          <p className="text-green-100/80 max-w-2xl mx-auto text-lg">
            {t('faq.pageSubtitle', 'Find answers to common questions about using Rent Farming.')}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left cursor-pointer bg-transparent border-none"
                >
                  <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">{faq.q}</span>
                  {openIndex === index ? (
                    <FaChevronUp className="text-green-600 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-50 pt-3 animate-[fadeIn_0.2s_ease-out]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
