import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { influencers } from '../data/influencers';
import { useAuth } from './AuthContext';

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
const creatorDeliverables = [
  '1 Reel + 3 Story frames',
  '1 Feed post + 2 Story frames',
  '2 Story frames + link mention',
  '1 Reel with product tag',
];

const brandThreads = [
  {
    id: '1',
    name: 'Acme Co.',
    subtitle: 'Summer Drop',
    dealStatus: 'pending' as const,
    messages: [
      { id: 'b1-m1', type: 'text' as const, from: 'them' as const, text: 'We loved your last reel and want to book a campaign for next week.', time: '09:10' },
      { id: 'b1-o1', type: 'offer' as const, from: 'them' as const, amount: 3200, deliverables: '1 Reel + 2 Story frames', status: 'pending' as const, time: '09:14' },
    ],
  },
  {
    id: '2',
    name: 'Lumen Beauty',
    subtitle: 'Glow Kit Launch',
    dealStatus: 'active' as const,
    messages: [
      { id: 'b2-m1', type: 'text' as const, from: 'them' as const, text: 'Can you lock in a launch day post for the new kit?', time: 'Yesterday' },
      { id: 'b2-o1', type: 'offer' as const, from: 'them' as const, amount: 5400, deliverables: '1 Feed post + 1 Story set', status: 'accepted' as const, time: 'Yesterday' },
      { id: 'b2-s1', type: 'text' as const, from: 'system' as const, text: 'Deal active. Content production is underway.', time: 'Yesterday' },
    ],
  },
  {
    id: '3',
    name: 'Northwind',
    subtitle: 'Travel Story Series',
    dealStatus: 'completed' as const,
    messages: [
      { id: 'b3-o1', type: 'offer' as const, from: 'them' as const, amount: 2100, deliverables: '2 Story frames + hotel tag', status: 'completed' as const, time: 'Apr 24' },
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
        amount: influencer.price,
        deliverables,
        status: offerStatus,
        time: '10:27',
      },
    ];

    if (dealStatus === 'negotiating') {
      messages.push({
        id: `c${influencer.id}-m3`,
        type: 'text',
        from: 'them',
        text: 'Can we add one extra story frame if we keep the same budget?',
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
  const mode: RoleMode = role === 'influencer' ? 'influencer' : 'brand';
  const [chats, setChats] = useState<ChatThread[]>(() => createSeed(mode));

  useEffect(() => {
    setChats(createSeed(mode));
  }, [mode]);

  const getChat = (id?: string) => {
    if (!id) return chats[0];
    return chats.find((chat) => chat.id === id) ?? chats[0];
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
    <Ctx.Provider value={{ chats, getChat, sendTextMessage, sendCounterMessage, acceptOffer, markDealCompleted }}>
      {children}
    </Ctx.Provider>
  );
}

export function useChats() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useChats must be used inside ChatProvider');
  return ctx;
}
