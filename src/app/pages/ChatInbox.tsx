import { ChevronRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BackButton, ScreenHeader } from '../components/FintechPrimitives';
import { type ChatMessage, useChats } from '../context/ChatContext';

const dealTone: Record<string, string> = {
  pending: 'fin-badge-warning',
  negotiating: 'fin-badge-info',
  active: 'fin-badge-success',
  completed: 'fin-badge-neutral',
};

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const previewFor = (message: ChatMessage | undefined) => {
  if (!message) return 'No messages yet';
  if (message.type === 'offer') return `Offer update - ${titleCase(message.status)}`;
  return message.text;
};

export function ChatInbox() {
  const navigate = useNavigate();
  const { chats } = useChats();

  return (
    <div className="fin-page">
      <BackButton onClick={() => navigate(-1)} />
      <ScreenHeader
        eyebrow="Inbox"
        title="Creator conversations"
        subtitle="Reply fast, negotiate rates, and keep delivery moving."
        actions={
          <div className="fin-topbar-action">
            <MessageSquare className="h-4 w-4" />
          </div>
        }
      />

      <div className="space-y-3">
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => navigate(`/chat/${chat.id}`, { state: { from: '/inbox' } })}
              className="app-list-button"
            >
              <div className="flex items-center gap-3">
                {chat.avatar ? (
                  <img src={chat.avatar} alt={chat.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white">
                    {chat.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-white">{chat.name}</div>
                      <div className="mt-1 truncate text-xs text-zinc-400">{chat.subtitle}</div>
                    </div>
                    <span className={`fin-badge ${dealTone[chat.dealStatus]}`}>{titleCase(chat.dealStatus)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-400">
                    <span className="truncate">{previewFor(lastMessage)}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />
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
