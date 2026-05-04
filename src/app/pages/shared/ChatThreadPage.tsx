import { Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { type ChatMessage, type OfferMessage, useChats } from '../../context/ChatContext';
import { inr } from '../../utils/money';

export function ChatThreadPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useAuth();
  const { getChat, sendTextMessage, acceptOffer, markDealCompleted } = useChats();
  const [draft, setDraft] = useState('');
  const chat = getChat(id);

  if (!chat) return null;

  const backTarget = role === 'influencer' ? '/influencer/chat' : '/brand/chat';

  return (
    <div className="fin-page">
      <TopBar left={<BackButton onClick={() => navigate(backTarget)} />} title={chat.name} subtitle={chat.subtitle} />

      <div className="space-y-3">
        {chat.messages.map((message) => (
          <MessageBubble key={message.id} message={message} onAccept={() => acceptOffer(chat.id, message.id)} />
        ))}
      </div>

      {chat.dealStatus === 'active' ? (
        <Button variant="secondary" fullWidth onClick={() => markDealCompleted(chat.id)}>
          Mark as complete
        </Button>
      ) : null}

      <div className="mt-auto flex items-center gap-2 rounded-full border border-white/10 bg-gray-800 px-3 py-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && draft.trim()) {
              sendTextMessage(chat.id, draft.trim());
              setDraft('');
            }
          }}
          placeholder="Type a message"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
        />
        <button
          type="button"
          onClick={() => {
            if (!draft.trim()) return;
            sendTextMessage(chat.id, draft.trim());
            setDraft('');
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onAccept,
}: {
  message: ChatMessage;
  onAccept: () => void;
}) {
  if (message.type === 'offer') {
    return <OfferBubble message={message} onAccept={onAccept} />;
  }

  if (message.from === 'system') {
    return (
      <div className="flex justify-center">
        <span className="fin-chip">{message.text}</span>
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

function OfferBubble({
  message,
  onAccept,
}: {
  message: OfferMessage;
  onAccept: () => void;
}) {
  return (
    <div className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
      <div className="w-full max-w-[82%] rounded-[24px] border border-white/10 bg-gray-800 p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="fin-eyebrow">Offer</div>
            <div className="mt-2 text-lg font-semibold">{inr(message.amount)}</div>
          </div>
          <span className="fin-chip">{message.status}</span>
        </div>
        <div className="mt-3 text-sm text-zinc-300">{message.deliverables}</div>
        {message.from === 'them' && message.status === 'pending' ? (
          <div className="mt-4">
            <Button fullWidth onClick={onAccept}>
              Accept
            </Button>
          </div>
        ) : null}
        <div className="fin-time">{message.time}</div>
      </div>
    </div>
  );
}
