import Link from 'next/link';
import LangSwitcher from '../components/LangSwitcher';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-6">
      <div className="card w-full max-w-2xl text-center space-y-4">
        <div className="flex justify-end"><LangSwitcher /></div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-gray-600">{t('tagline')}</p>
        <div className="flex space-x-3 justify-center">
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">{t('login')}</Link>
          <Link href="/register" className="bg-gray-200 px-4 py-2 rounded">{t('register')}</Link>
        </div>
      </div>
    </div>
  );
}
