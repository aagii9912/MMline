import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';
import ShipmentForm from '../components/ShipmentForm';
import { getAuth } from '../lib/auth';
import { getShipments } from '../lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [shipments, setShipments] = useState([]);
  const auth = typeof window !== 'undefined' ? getAuth() : null;

  useEffect(() => {
    if (!auth) {
      router.push('/login');
      return;
    }
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const res = await getShipments();
      setShipments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderTitle = (shipment) => {
    const lang = auth?.user?.preferred_language || i18n.language || 'en';
    return shipment[`title_${lang}`] || shipment.title_en;
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
          <p className="text-sm text-gray-600">{auth?.user?.role}</p>
        </div>
        <div className="flex space-x-2 items-center">
          <LangSwitcher />
          <button onClick={logout} className="bg-gray-200 px-3 py-1 rounded">{t('logout')}</button>
        </div>
      </div>

      {auth?.user?.role === 'shipper' && (
        <ShipmentForm onCreated={loadShipments} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shipments.length === 0 && <p>{t('noShipments')}</p>}
        {shipments.map((s) => (
          <div key={s.id} className="card space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{renderTitle(s)}</h3>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{s.status}</span>
            </div>
            <p className="text-sm text-gray-600">{s.origin} → {s.destination}</p>
            <p className="text-sm">{t('weight')}: {s.weight} kg</p>
            <p className="text-sm">${s.price_min} - ${s.price_max}</p>
            <Link href={`/shipments/${s.id}`} className="text-blue-600 text-sm">{t('view')}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
