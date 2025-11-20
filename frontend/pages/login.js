import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';
import { loginUser } from '../lib/api';
import { decodeToken } from '../lib/auth';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
      const user = decodeToken(res.data.token);
      if (user?.preferred_language) localStorage.setItem('lang', user.preferred_language);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('login')}</h1>
          <LangSwitcher />
        </div>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm font-medium">{t('email')}</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="text-sm font-medium">{t('password')}</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">{t('login')}</button>
        </form>
        <p className="text-sm text-center">
          {t('register')}?
          <Link className="text-blue-600" href="/register"> {t('register')}</Link>
        </p>
      </div>
    </div>
  );
}
