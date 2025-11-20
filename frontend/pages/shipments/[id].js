import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../../components/LangSwitcher';
import OfferForm from '../../components/OfferForm';
import { getAuth } from '../../lib/auth';
import { getShipment, acceptOffer, getOffers } from '../../lib/api';

export default function ShipmentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { t, i18n } = useTranslation();
  const [shipment, setShipment] = useState(null);
  const [offers, setOffers] = useState([]);
  const auth = typeof window !== 'undefined' ? getAuth() : null;

  useEffect(() => {
    if (!id) return;
    loadShipment();
    if (auth?.user?.role === 'shipper') loadOffers();
  }, [id]);

  const loadShipment = async () => {
    try {
      const res = await getShipment(id);
      setShipment(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOffers = async () => {
    try {
      const res = await getOffers(id);
      setOffers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onAccept = async (offerId) => {
    await acceptOffer(offerId, 'accepted');
    await loadOffers();
    await loadShipment();
  };

  const renderLocalized = (item, prefix) => {
    const lang = auth?.user?.preferred_language || i18n.language || 'en';
    return item[`${prefix}_${lang}`] || item[`${prefix}_en`];
  };

  if (!shipment) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{renderLocalized(shipment, 'title')}</h1>
          <p className="text-gray-600">{renderLocalized(shipment, 'description')}</p>
          <p className="text-sm text-gray-500">{shipment.origin} → {shipment.destination}</p>
        </div>
        <div className="flex items-center space-x-2">
          <LangSwitcher />
          <Link href="/dashboard" className="text-blue-600 text-sm">{t('dashboard')}</Link>
        </div>
      </div>

      {auth?.user?.role === 'carrier' && (
        <OfferForm shipmentId={id} onSubmitted={loadShipment} />
      )}

      <div className="card space-y-2">
        <h3 className="text-lg font-semibold">{t('offers')}</h3>
        {(offers.length === 0 && auth?.user?.role === 'shipper') && <p className="text-sm text-gray-500">No offers yet</p>}
        {(auth?.user?.role === 'shipper' ? offers : shipment.Offers || []).map((offer) => (
          <div key={offer.id} className="border rounded p-3 space-y-1">
            <div className="flex justify-between items-center">
              <p className="font-medium">${offer.price}</p>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{offer.status}</span>
            </div>
            <p className="text-sm">{renderLocalized(offer, 'message')}</p>
            {auth?.user?.role === 'shipper' && offer.status === 'pending' && (
              <button onClick={() => onAccept(offer.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Accept</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
