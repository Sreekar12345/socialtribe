import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Inbox, Send } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ChatMessage, OfferMessage, useChats } from '../context/ChatContext';

const dealTone: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  negotiating: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  active: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  completed: 'bg-white/8 text-white/60 border-white/10',
};

const offerTone: Record<OfferMessage['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  completed: 'bg-white/8 text-white/60 border-white/10',
};

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const formatINR = (amount: number) => `\u20B9${amount.toLocaleString('en-IN')}`;

export function LightChat() {
  const nav = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { getChat, sendTextMessage, sendCounterMessage, acceptOffer, markDealCompleted } = useChats();
  const chat = getChat(id);
  const [draft, setDraft] = useState('');
  const [counteringOfferId, setCounteringOfferId] = useState<string | null>(null);

  if (!chat) return null;

  const backTarget = typeof location.state?.from === 'string' ? location.state.from : '/inbox';

  const send = () => {
    const value = draft.trim();
    if (!value) return;

    if (counteringOfferId) {
      sendCounterMessage(chat.id, value);
      setCounteringOfferId(null);
    } else {
      sendTextMessage(chat.id, value);
    }

    setDraft('');
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="px-5 pt-12 pb-3 flex items-center gap-3">
          <button onClick={() => nav(backTarget)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
            <ArrowLeft className="w-4 h-4" />
          </button>

          {chat.avatar ? (
            <img src={chat.avatar} alt={chat.name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-sm">
              {chat.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="text-white text-sm truncate">{chat.name}</div>
            <div className="text-[11px] text-white/40 truncate">{chat.subtitle}</div>
          </div>

          <button onClick={() => nav('/inbox')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
            <Inbox className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-5 py-3 border-b border-white/5">
        <div className="flex items-center justify-between gap-3 rounded-2xl p-3 bg-white/[0.03] border border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/40">Deal status</div>
            <div className="mt-1 text-white text-sm">
              {chat.dealStatus === 'active' ? 'Deal Active' : titleCase(chat.dealStatus)}
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full border text-[10px] uppercase tracking-wider ${dealTone[chat.dealStatus]}`}>
            {chat.dealStatus === 'active' ? 'Active' : titleCase(chat.dealStatus)}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 space-y-3">
        {chat.messages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            onAccept={() => acceptOffer(chat.id, message.id)}
            onNegotiate={() => setCounteringOfferId(message.id)}
          />
        ))}
        <div className="h-16" />
      </div>

      {chat.dealStatus === 'active' ? (
        <div className="px-5 pb-3">
          <button
            onClick={() => markDealCompleted(chat.id)}
            className="w-full py-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-sm"
          >
            Mark as Completed
          </button>
        </div>
      ) : null}

      <div className="sticky bottom-0 backdrop-blur-xl bg-black/70 border-t border-white/10 px-3 py-3">
        {counteringOfferId ? (
          <div className="px-2 pb-2 flex items-center justify-between gap-2 text-[11px] text-sky-300">
            <span>Negotiation mode: send your counter terms.</span>
            <button onClick={() => setCounteringOfferId(null)} className="text-white/50">
              Cancel
            </button>
          </div>
        ) : null}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 focus-within:border-white/30">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={counteringOfferId ? 'Send counter offer details...' : 'Type a message...'}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-sm"
          />
          <button
            onClick={send}
            disabled={!draft.trim()}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageRow({
  message,
  onAccept,
  onNegotiate,
}: {
  message: ChatMessage;
  onAccept: () => void;
  onNegotiate: () => void;
}) {
  if (message.type === 'offer') {
    return (
      <div className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
        <div className="w-full max-w-[82%] rounded-2xl p-4 bg-white/[0.05] border border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-white/40">Offer</div>
              <div className="mt-1 text-white text-2xl tabular-nums">{formatINR(message.amount)}</div>
            </div>
            <span className={`px-2 py-1 rounded-full border text-[10px] uppercase tracking-wider ${offerTone[message.status]}`}>
              {titleCase(message.status)}
            </span>
          </div>

          <div className="mt-4 rounded-xl p-3 bg-black/20 border border-white/5">
            <div className="text-[11px] uppercase tracking-widest text-white/40">Deliverables</div>
            <div className="mt-1 text-sm text-white/85">{message.deliverables}</div>
          </div>

          {message.from === 'them' && message.status === 'pending' ? (
            <div className="mt-4 flex gap-2">
              <button onClick={onAccept} className="flex-1 py-2 rounded-xl bg-white text-black text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Accept
              </button>
              <button onClick={onNegotiate} className="flex-1 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/80 text-sm">
                Negotiate
              </button>
            </div>
          ) : null}

          <div className="mt-3 text-[10px] text-white/35">{message.time}</div>
        </div>
      </div>
    );
  }

  if (message.from === 'system') {
    return (
      <div className="flex justify-center">
        <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-white/55">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm ${
          message.from === 'me'
            ? 'bg-white text-black rounded-br-sm'
            : 'bg-white/[0.06] text-white border border-white/10 rounded-bl-sm'
        }`}
      >
        {message.text}
        <div className={`text-[10px] mt-1 ${message.from === 'me' ? 'text-black/40' : 'text-white/40'}`}>{message.time}</div>
      </div>
    </div>
  );
}
