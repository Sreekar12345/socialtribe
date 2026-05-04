import { useState } from 'react';
import { CheckCircle2, Inbox, Send } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { BackButton } from '../components/FintechPrimitives';
import { type ChatMessage, type OfferMessage, useChats } from '../context/ChatContext';
import { inr } from '../utils/money';

const dealTone: Record<string, string> = {
  pending: 'fin-badge-warning',
  negotiating: 'fin-badge-info',
  active: 'fin-badge-success',
  completed: 'fin-badge-neutral',
};

const offerTone: Record<OfferMessage['status'], string> = {
  pending: 'fin-badge-warning',
  accepted: 'fin-badge-success',
  completed: 'fin-badge-neutral',
};

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function LightChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { getChat, sendTextMessage, sendCounterMessage, acceptOffer, markDealCompleted } = useChats();
  const [draft, setDraft] = useState('');
  const [counteringOfferId, setCounteringOfferId] = useState<string | null>(null);
  const chat = getChat(id);

  if (!chat) return null;

  const backTarget = typeof location.state?.from === 'string' ? location.state.from : '/inbox';

  const submit = () => {
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
    <div className="fin-page">
      <div className="fin-topbar">
        <BackButton onClick={() => navigate(backTarget)} />
        {chat.avatar ? (
          <img src={chat.avatar} alt={chat.name} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-white">
            {chat.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-white">{chat.name}</div>
          <div className="mt-1 truncate text-xs text-zinc-400">{chat.subtitle}</div>
        </div>
        <button type="button" onClick={() => navigate('/inbox')} className="fin-topbar-action">
          <Inbox className="h-4 w-4" />
        </button>
      </div>

      <div className="fin-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="fin-eyebrow">Deal status</div>
            <div className="mt-2 text-sm text-white">{titleCase(chat.dealStatus)}</div>
          </div>
          <span className={`fin-badge ${dealTone[chat.dealStatus]}`}>{titleCase(chat.dealStatus)}</span>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {chat.messages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            onAccept={() => acceptOffer(chat.id, message.id)}
            onNegotiate={() => setCounteringOfferId(message.id)}
          />
        ))}
      </div>

      {chat.dealStatus === 'active' ? (
        <button type="button" onClick={() => markDealCompleted(chat.id)} className="fin-button-secondary w-full">
          Mark collaboration complete
        </button>
      ) : null}

      <div className="fin-sticky-actions -mx-4 mt-4">
        {counteringOfferId ? (
          <div className="mb-3 text-xs text-zinc-400">Negotiation mode is on. Send your counter terms.</div>
        ) : null}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-3 py-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit();
            }}
            placeholder={counteringOfferId ? 'Send counter offer details' : 'Type your message'}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
          />
          <button type="button" onClick={submit} disabled={!draft.trim()} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] disabled:opacity-40">
            <Send className="h-4 w-4" />
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
        <div className="w-full max-w-[82%] rounded-2xl border border-white/10 bg-gray-800 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="fin-eyebrow">Offer</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{inr(message.amount)}</div>
            </div>
            <span className={`fin-badge ${offerTone[message.status]}`}>{titleCase(message.status)}</span>
          </div>

          <div className="mt-4 rounded-xl bg-zinc-900 p-3">
            <div className="fin-eyebrow">Deliverables</div>
            <div className="mt-2 text-sm text-zinc-300">{message.deliverables}</div>
          </div>

          {message.from === 'them' && message.status === 'pending' ? (
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={onAccept} className="fin-button-primary flex-1">
                <CheckCircle2 className="h-4 w-4" /> Accept
              </button>
              <button type="button" onClick={onNegotiate} className="fin-button-secondary flex-1">
                Counter
              </button>
            </div>
          ) : null}

          <div className="fin-time">{message.time}</div>
        </div>
      </div>
    );
  }

  if (message.from === 'system') {
    return (
      <div className="flex justify-center">
        <div className="fin-chip">{message.text}</div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
      <div className={message.from === 'me' ? 'fin-message-me' : 'fin-message-them'}>
        {message.text}
        <div className="fin-time">{message.time}</div>
      </div>
    </div>
  );
}
