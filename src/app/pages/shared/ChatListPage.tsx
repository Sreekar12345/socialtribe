import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { type ChatMessage, useChats } from '../../context/ChatContext';

const preview = (message: ChatMessage | undefined) => {
  if (!message) return 'No messages yet';
  if (message.type === 'offer') return `Offer ${message.status}`;
  return message.text;
};

export function ChatListPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { chats } = useChats();
  const base = role === 'influencer' ? '/influencer/chat' : '/brand/chat';

  return (
    <div className="space-y-4">
      <TopBar title="Chat" subtitle="Open conversations and reply fast." />

      <div className="space-y-3">
        {chats.map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => navigate(`${base}/${chat.id}`)}
            className="w-full rounded-[24px] border border-white/10 bg-gray-800 p-4 text-left text-white"
          >
            <div className="flex items-center gap-3">
              {chat.avatar ? (
                <img src={chat.avatar} alt={chat.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white">
                  {chat.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{chat.name}</div>
                <div className="mt-1 truncate text-xs text-zinc-400">{preview(chat.messages[chat.messages.length - 1])}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
