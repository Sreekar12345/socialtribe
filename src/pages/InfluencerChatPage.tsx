import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { influencerConversations } from '../data/dashboardMockData';

export function InfluencerChatPage() {
  usePageTitle('Influencer chats');

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Chats
      </h1>

      <div className="space-y-3">
        {influencerConversations.map((conversation) => (
          <Card key={conversation.id} className="p-5">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-neutral-950">
                {conversation.name}
              </h2>
              <p className="text-sm leading-6 text-neutral-600">
                {conversation.preview}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
