import { useState } from 'react';
import { useNavigate } from 'react-router';
import { OfferCard } from '../../components/OfferCard';
import { TopBar } from '../../components/TopBar';
import { mockInfluencerOffers } from '../../data/mockData';

export function InfluencerOffersPage() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState(mockInfluencerOffers);

  return (
    <div className="space-y-4">
      <TopBar title="Offers" subtitle="Review collaboration details and next actions." />

      <div className="space-y-3">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            brandName={offer.brandName}
            deliverables={offer.deliverables}
            deadline={offer.deadline}
            onAccept={() => navigate(`/influencer/campaign/${offer.id}`)}
            onReject={() =>
              setOffers((current) => current.filter((item) => item.id !== offer.id))
            }
          />
        ))}
      </div>
    </div>
  );
}
