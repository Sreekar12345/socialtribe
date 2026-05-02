import { ArrowLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, OfferMessage, useChats } from '../context/ChatContext';

const dealTone: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  negotiating: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  active: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  completed: 'bg-white/8 text-white/60 border-white/10',
};

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const formatINR = (amount: number) => `\u20B9${amount.toLocaleString('en-IN')}`;

const getPreview = (message: ChatMessage) => {
  if (message.type === 'offer') {
    return `Offer ${formatINR(message.amount)} - ${titleCase(message.status)}`;
  }

  return message.text;
};

export function ChatInbox() {
  const nav = useNavigate();
  const { role } = useAuth();
  const { chats } = useChats();
  const backTarget = role === 'influencer' ? '/influencer/home' : role === 'brand' ? '/brand/track' : '/';

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav(backTarget)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-white/40">Inbox</div>
          <div className="text-white">Deal conversations</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/60">
          <MessageSquare className="w-4 h-4" />
        </div>
      </div>

      <div className="px-5 pb-8 space-y-2">
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1] as ChatMessage | undefined;

          return (
            <button
              key={chat.id}
              onClick={() => nav(`/chat/${chat.id}`, { state: { from: '/inbox' } })}
              className="w-full text-left rounded-2xl p-4 bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center gap-3">
                {chat.avatar ? (
                  <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-sm">
                    {chat.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white text-sm truncate">{chat.name}</div>
                      <div className="text-[11px] text-white/40 truncate">{chat.subtitle}</div>
                    </div>
                    <span className={`shrink-0 px-2 py-1 rounded-full border text-[10px] uppercase tracking-wider ${dealTone[chat.dealStatus]}`}>
                      {titleCase(chat.dealStatus)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="flex-1 text-sm text-white/65 truncate">{lastMessage ? getPreview(lastMessage) : 'No messages yet'}</p>
                    <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
