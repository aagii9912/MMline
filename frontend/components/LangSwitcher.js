import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Language switcher component storing selection locally
export default function LangSwitcher() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (stored) {
      i18n.changeLanguage(stored);
      setLang(stored);
    }
  }, [i18n]);

  const change = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined') localStorage.setItem('lang', lng);
  };

  return (
    <select className="border rounded px-2 py-1" value={lang} onChange={(e) => change(e.target.value)}>
      <option value="en">English</option>
      <option value="mn">Монгол</option>
      <option value="zh">中文</option>
      <option value="ru">Русский</option>
    </select>
  );
}
