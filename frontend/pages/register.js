import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';
import { registerUser } from '../lib/api';

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'shipper', preferred_language: 'en' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(form);
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('register')}</h1>
          <LangSwitcher />
        </div>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm font-medium">{t('name')}</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="text-sm font-medium">{t('email')}</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="text-sm font-medium">{t('password')}</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="text-sm font-medium">{t('role')}</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-2 py-1">
              <option value="shipper">{t('shipper')}</option>
              <option value="carrier">{t('carrier')}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">{t('preferredLanguage')}</label>
            <select name="preferred_language" value={form.preferred_language} onChange={handleChange} className="w-full border rounded px-2 py-1">
              <option value="en">English</option>
              <option value="mn">Монгол</option>
              <option value="zh">中文</option>
              <option value="ru">Русский</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">{t('register')}</button>
        </form>
        <p className="text-sm text-center">
          {t('login')}?
          <Link className="text-blue-600" href="/login"> {t('login')}</Link>
        </p>
      </div>
    </div>
  );
}
