import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeOffer } from '../lib/api';

// Form for carriers to submit offers
export default function OfferForm({ shipmentId, onSubmitted }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ price: '', message_en: '', message_mn: '', message_zh: '', message_ru: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await makeOffer(shipmentId, { ...form, price: Number(form.price) });
      onSubmitted && onSubmitted(res.data);
      setForm({ price: '', message_en: '', message_mn: '', message_zh: '', message_ru: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting offer');
    }
  };

  return (
    <form className="card space-y-3" onSubmit={submit}>
      <h3 className="text-lg font-semibold">{t('makeOffer')}</h3>
      <div>
        <label className="text-sm font-medium">{t('price')}</label>
        <input name="price" value={form.price} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
      </div>
      {['en', 'mn', 'zh', 'ru'].map((lang) => (
        <div key={lang}>
          <label className="text-sm font-medium">{t('message')} ({lang})</label>
          <textarea name={`message_${lang}`} value={form[`message_${lang}`]} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
      ))}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{t('submit')}</button>
    </form>
  );
}
