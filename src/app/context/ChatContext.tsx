import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { influencers } from '../data/influencers';
import { calculatePrice, DeliverableKey, formatDeliverablesSummary } from '../utils/pricing';
import { useAuth } from './AuthContext';
import { useCampaign } from './CampaignContext';

type RoleMode = 'brand' | 'influencer';
type DealStatus = 'pending' | 'negotiating' | 'active' | 'completed';
type MessageSender = 'me' | 'them' | 'system';

interface BaseMessage {
  id: string;
  type: 'text' | 'offer';
  time: string;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  from: MessageSender;
  text: string;
}

export interface OfferMessage extends BaseMessage {
  type: 'offer';
  from: 'me' | 'them';
  amount: number;
  deliverables: string;
  status: 'pending' | 'accepted' | 'completed';
}

export type ChatMessage = TextMessage | OfferMessage;

export interface ChatThread {
  id: string;
  name: string;
  subtitle: string;
  avatar?: string;
  dealStatus: DealStatus;
  messages: ChatMessage[];
}

interface ChatState {
  chats: ChatThread[];
  getChat: (id?: string) => ChatThread | undefined;
  sendTextMessage: (chatId: string, text: string) => void;
  sendCounterMessage: (chatId: string, text: string) => void;
  acceptOffer: (chatId: string, messageId: string) => void;
  markDealCompleted: (chatId: string) => void;
}

const Ctx = createContext<ChatState | null>(null);

const dealOrder: DealStatus[] = ['negotiating', 'pending', 'active', 'completed'];
const creatorDeliverables: DeliverableKey[][] = [
  ['reel', 'story', 'story', 'story'],
  ['post', 'story', 'story'],
  ['story', 'story'],
  ['reel'],
];

const brandThreads = [
  {
    id: '1',
    name: 'Acme Co.',
    subtitle: 'Summer Drop',
    dealStatus: 'pending' as const,
    messages: [
      { id: 'b1-m1', type: 'text' as const, from: 'them' as const, text: 'We loved your last reel and want to book a campaign for next week.', time: '09:10' },
      {
        id: 'b1-o1',
        type: 'offer' as const,
        from: 'them' as const,
        amount: calculatePrice(influencers[0]?.price ?? 0, ['reel', 'story', 'story']),
        deliverables: formatDeliverablesSummary(['reel', 'story', 'story']),
        status: 'pending' as const,
        time: '09:14',
      },
    ],
  },
  {
    id: '2',
    name: 'Lumen Beauty',
    subtitle: 'Glow Kit Launch',
    dealStatus: 'active' as const,
    messages: [
      { id: 'b2-m1', type: 'text' as const, from: 'them' as const, text: 'Can you lock in a launch day post for the new kit?', time: 'Yesterday' },
      {
        id: 'b2-o1',
        type: 'offer' as const,
        from: 'them' as const,
        amount: calculatePrice(influencers[1]?.price ?? 0, ['post', 'story', 'story']),
        deliverables: formatDeliverablesSummary(['post', 'story', 'story']),
        status: 'accepted' as const,
        time: 'Yesterday',
      },
      { id: 'b2-s1', type: 'text' as const, from: 'system' as const, text: 'Deal active. Content production is underway.', time: 'Yesterday' },
    ],
  },
  {
    id: '3',
    name: 'Northwind',
    subtitle: 'Travel Story Series',
    dealStatus: 'completed' as const,
    messages: [
      {
        id: 'b3-o1',
        type: 'offer' as const,
        from: 'them' as const,
        amount: calculatePrice(influencers[2]?.price ?? 0, ['story', 'story']),
        deliverables: formatDeliverablesSummary(['story', 'story']),
        status: 'completed' as const,
        time: 'Apr 24',
      },
      { id: 'b3-s1', type: 'text' as const, from: 'system' as const, text: 'Deal completed. Waiting for payout release.', time: 'Apr 27' },
    ],
  },
];

const formatTime = () =>
  new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const getSeedDeliverables = (chatId: string) => {
  const index = influencers.findIndex((influencer) => influencer.id === chatId);
  return creatorDeliverables[index >= 0 ? index % creatorDeliverables.length : 0];
};

const buildBrandSeed = (): ChatThread[] =>
  influencers.map((influencer, index) => {
    const dealStatus = dealOrder[index % dealOrder.length];
    const deliverables = creatorDeliverables[index % creatorDeliverables.length];
    const offerStatus =
      dealStatus === 'completed' ? 'completed' : dealStatus === 'active' ? 'accepted' : 'pending';

    const messages: ChatMessage[] = [
      {
        id: `c${influencer.id}-m1`,
        type: 'text',
        from: 'them',
        text: `Brief looks good. I can feature the ${influencer.niche.toLowerCase()} angle naturally.`,
        time: '10:24',
      },
      {
        id: `c${influencer.id}-m2`,
        type: 'text',
        from: 'me',
        text: 'Perfect. Sending the offer now.',
        time: '10:26',
      },
      {
        id: `c${influencer.id}-o1`,
        type: 'offer',
        from: 'me',
        amount: calculatePrice(influencer.price, deliverables),
        deliverables: formatDeliverablesSummary(deliverables),
        status: offerStatus,
        time: '10:27',
      },
    ];

    if (dealStatus === 'negotiating') {
      messages.push({
        id: `c${influencer.id}-m3`,
        type: 'text',
        from: 'them',
        text: 'Can we add one extra story frame to this package?',
        time: '10:31',
      });
    }

    if (dealStatus === 'active') {
      messages.push({
        id: `c${influencer.id}-s1`,
        type: 'text',
        from: 'system',
        text: 'Deal active. Waiting for content submission.',
        time: '11:02',
      });
    }

    if (dealStatus === 'completed') {
      messages.push({
        id: `c${influencer.id}-s1`,
        type: 'text',
        from: 'system',
        text: 'Deal completed. Awaiting approval confirmation.',
        time: 'Apr 28',
      });
    }

    return {
      id: influencer.id,
      name: influencer.name,
      subtitle: influencer.handle,
      avatar: influencer.image,
      dealStatus,
      messages,
    };
  });

const buildInfluencerSeed = (): ChatThread[] =>
  brandThreads.map((thread) => ({
    ...thread,
    messages: thread.messages.map((message) => ({ ...message })),
  }));

const createSeed = (role: RoleMode): ChatThread[] => (role === 'influencer' ? buildInfluencerSeed() : buildBrandSeed());

export function ChatProvider({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const { selected, campaign } = useCampaign();
  const mode: RoleMode = role === 'influencer' ? 'influencer' : 'brand';
  const [chats, setChats] = useState<ChatThread[]>(() => createSeed(mode));

  useEffect(() => {
    setChats(createSeed(mode));
  }, [mode]);

  const selectedSet = new Set(selected);
  const visibleChats =
    mode === 'brand'
      ? chats.map((chat) => {
          const influencer = influencers.find((item) => item.id === chat.id);
          if (!influencer) return chat;

          const activeDeliverables =
            campaign.deliverables.length > 0 && selectedSet.has(chat.id)
              ? campaign.deliverables
              : getSeedDeliverables(chat.id);

          return {
            ...chat,
            messages: chat.messages.map((message) =>
              message.type === 'offer'
                ? {
                    ...message,
                    amount: calculatePrice(influencer.price, activeDeliverables),
                    deliverables: formatDeliverablesSummary(activeDeliverables),
                  }
                : message,
            ),
          };
        })
      : chats;

  const getChat = (id?: string) => {
    if (!id) return visibleChats[0];
    return visibleChats.find((chat) => chat.id === id) ?? visibleChats[0];
  };

  const sendTextMessage = (chatId: string, text: string) => {
    const value = text.trim();
    if (!value) return;

    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: createId('msg'),
                  type: 'text',
                  from: 'me',
                  text: value,
                  time: formatTime(),
                },
              ],
            }
          : chat,
      ),
    );
  };

  const sendCounterMessage = (chatId: string, text: string) => {
    const value = text.trim();
    if (!value) return;

    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              dealStatus: 'negotiating',
              messages: [
                ...chat.messages,
                {
                  id: createId('msg'),
                  type: 'text',
                  from: 'me',
                  text: value,
                  time: formatTime(),
                },
              ],
            }
          : chat,
      ),
    );
  };

  const acceptOffer = (chatId: string, messageId: string) => {
    setChats((current) =>
      current.map((chat) => {
        if (chat.id !== chatId) return chat;

        const messages = chat.messages.map((message) => {
          if (message.type !== 'offer' || message.id !== messageId) return message;
          return { ...message, status: 'accepted' as const };
        });

        return {
          ...chat,
          dealStatus: 'active',
          messages: [
            ...messages,
            {
              id: createId('system'),
              type: 'text',
              from: 'system',
              text: 'Deal active. Deliverables are confirmed.',
              time: formatTime(),
            },
          ],
        };
      }),
    );
  };

  const markDealCompleted = (chatId: string) => {
    setChats((current) =>
      current.map((chat) => {
        if (chat.id !== chatId) return chat;

        let completedOne = false;
        const messages = chat.messages.map((message) => {
          if (message.type !== 'offer' || completedOne) return message;
          if (message.status !== 'accepted') return message;
          completedOne = true;
          return { ...message, status: 'completed' as const };
        });

        return {
          ...chat,
          dealStatus: 'completed',
          messages: [
            ...messages,
            {
              id: createId('system'),
              type: 'text',
              from: 'system',
              text: 'Deal marked as completed.',
              time: formatTime(),
            },
          ],
        };
      }),
    );
  };

  return (
    <Ctx.Provider value={{ chats: visibleChats, getChat, sendTextMessage, sendCounterMessage, acceptOffer, markDealCompleted }}>
      {children}
    </Ctx.Provider>
  );
}

export function useChats() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useChats must be used inside ChatProvider');
  return ctx;
}
