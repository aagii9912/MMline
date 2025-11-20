import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createShipment } from '../lib/api';

// Form for creating shipments with multilingual fields
export default function ShipmentForm({ onCreated }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title_en: '',
    title_mn: '',
    title_zh: '',
    title_ru: '',
    description_en: '',
    description_mn: '',
    description_zh: '',
    description_ru: '',
    origin: '',
    destination: '',
    weight: '',
    price_min: '',
    price_max: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, weight: Number(form.weight), price_min: Number(form.price_min), price_max: Number(form.price_max) };
      const res = await createShipment(payload);
      onCreated && onCreated(res.data);
      setForm({
        title_en: '',
        title_mn: '',
        title_zh: '',
        title_ru: '',
        description_en: '',
        description_mn: '',
        description_zh: '',
        description_ru: '',
        origin: '',
        destination: '',
        weight: '',
        price_min: '',
        price_max: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating shipment');
    }
  };

  return (
    <form className="card space-y-3" onSubmit={submit}>
      <h3 className="text-lg font-semibold">{t('createShipment')}</h3>
      {['en', 'mn', 'zh', 'ru'].map((lang) => (
        <div key={lang} className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">{t('title')} ({lang})</label>
            <input name={`title_${lang}`} value={form[`title_${lang}`]} onChange={handleChange} className="w-full border rounded px-2 py-1" required={lang === 'en'} />
          </div>
          <div>
            <label className="text-sm font-medium">{t('description')} ({lang})</label>
            <textarea name={`description_${lang}`} value={form[`description_${lang}`]} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
        </div>
      ))}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">{t('origin')}</label>
          <input name="origin" value={form.origin} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
        <div>
          <label className="text-sm font-medium">{t('destination')}</label>
          <input name="destination" value={form.destination} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label className="text-sm font-medium">{t('weight')} (kg)</label>
          <input name="weight" value={form.weight} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
        <div>
          <label className="text-sm font-medium">{t('priceMin')}</label>
          <input name="price_min" value={form.price_min} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
        <div>
          <label className="text-sm font-medium">{t('priceMax')}</label>
          <input name="price_max" value={form.price_max} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {t('submit')}
      </button>
    </form>
  );
}
