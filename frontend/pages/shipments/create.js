import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LangSwitcher from '../../components/LangSwitcher';
import ShipmentForm from '../../components/ShipmentForm';
import { getAuth } from '../../lib/auth';
import { useTranslation } from 'react-i18next';

export default function CreateShipment() {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = typeof window !== 'undefined' ? getAuth() : null;

  useEffect(() => {
    if (!auth) router.push('/login');
  }, []);

  const onCreated = (shipment) => router.push(`/shipments/${shipment.id}`);

  return (
    <div className="min-h-screen p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('createShipment')}</h1>
        <LangSwitcher />
      </div>
      <ShipmentForm onCreated={onCreated} />
    </div>
  );
}
