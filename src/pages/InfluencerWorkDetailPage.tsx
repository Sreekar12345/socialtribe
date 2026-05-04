import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useInfluencerWork } from '../context/InfluencerWorkContext';
import { usePageTitle } from '../hooks/usePageTitle';

export function InfluencerWorkDetailPage() {
  usePageTitle('Campaign Details');

  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { findCampaignById } = useInfluencerWork();
  const campaign = findCampaignById(id);

  if (!campaign) {
    return (
      <div className="p-4">
        <Card className="p-6 text-center">
          <h1 className="text-xl font-semibold text-neutral-950">
            Campaign Details
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Campaign not found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold text-neutral-950">
        Campaign Details
      </h1>

      <Card className="p-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-neutral-600">{campaign.brandName}</p>
            <h2 className="mt-1 text-2xl font-semibold text-neutral-950">
              {campaign.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-[#f4ecd6] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Content Type
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {campaign.contentType}
              </p>
            </div>

            <div className="rounded-[22px] bg-[#eef5d8] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Status
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {campaign.status}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-neutral-950">
          What you need to do
        </h2>

        <p className="text-sm leading-relaxed text-gray-600">
          {campaign.description}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-neutral-950">
          Deliverables
        </h2>

        <ul className="space-y-1 text-sm text-gray-600">
          {campaign.deliverables.map((item) => (
            <li key={item}>{'\u2022'} {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-neutral-950">
          Deadline
        </h2>

        <p className="text-sm text-gray-600">
          Submit before {campaign.deadline}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-neutral-950">
          Guidelines
        </h2>

        <ul className="space-y-1 text-sm text-gray-600">
          {campaign.guidelines.map((item) => (
            <li key={item}>{'\u2022'} {item}</li>
          ))}
        </ul>
      </section>

      {campaign.status === 'Pending' ? (
        <Button
          fullWidth
          className="mt-6"
          onClick={() => navigate(`/influencer/submit/${campaign.id}`)}
        >
          Submit Content
        </Button>
      ) : null}

      {campaign.status === 'Submitted' ? (
        <div className="mt-6 text-sm text-gray-500">
          Waiting for brand approval
        </div>
      ) : null}

      {campaign.status === 'Approved' ? (
        <div className="mt-6 font-medium text-green-600">
          Campaign Completed {'\u2705'}
        </div>
      ) : null}

      {campaign.status === 'Rejected' ? (
        <div className="mt-6 font-medium text-red-500">
          Submission Rejected
        </div>
      ) : null}
    </div>
  );
}
