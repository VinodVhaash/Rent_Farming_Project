import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa';
import { LANGUAGES } from '../i18n/i18n';

/**
 * Responsive language-switcher dropdown.
 * Persists the user's choice to localStorage so it survives page refreshes.
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('rf_lang', code);
    setOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative inline-block text-left z-50">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                   bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm
                   text-gray-700 text-xs sm:text-sm font-medium
                   hover:shadow-md hover:border-green-300 transition-all duration-200
                   cursor-pointer select-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FaGlobe className="text-green-600" />
        <span className="hidden xs:inline">{current.flag}</span>
        <span>{current.nativeLabel}</span>
        <FaChevronDown
          className={`text-[10px] text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menu */}
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-xl
                     py-1.5 animate-[fadeIn_0.15s_ease-out]"
        >
          {LANGUAGES.map((lang) => {
            const active = lang.code === i18n.language;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => switchLanguage(lang.code)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer border-none
                    transition-colors duration-150
                    ${
                      active
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="flex-1 text-left">
                    {lang.nativeLabel}
                    <span className="text-gray-400 text-xs ml-1">({lang.label})</span>
                  </span>
                  {active && <FaCheck className="text-green-500 text-xs" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
