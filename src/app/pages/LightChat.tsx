import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Send, ShieldAlert } from 'lucide-react';
import { influencers } from '../data/influencers';

interface Msg {
  from: 'me' | 'them';
  text: string;
  time: string;
}

const seed: Msg[] = [
  { from: 'them', text: 'Hey! Got the brief. Quick q — landscape or portrait?', time: '10:24' },
  { from: 'me', text: 'Portrait please. 9:16 for the reel.', time: '10:25' },
  { from: 'them', text: 'Perfect. Shooting tomorrow morning.', time: '10:26' },
];

export function LightChat() {
  const nav = useNavigate();
  const { id } = useParams();
  const inf = influencers.find((i) => i.id === id) ?? influencers[0];
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text: draft.trim(), time: 'now' }]);
    setDraft('');
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="px-5 pt-12 pb-3 flex items-center gap-3">
          <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <img src={inf.image} className="w-9 h-9 rounded-full object-cover" />
          <div className="flex-1">
            <div className="text-white text-sm">{inf.name}</div>
            <div className="text-[11px] text-white/40">Active deal · clarifications only</div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 space-y-2">
        <div className="mx-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300/90 text-[11px] border border-amber-500/20">
          <ShieldAlert className="w-3 h-3" /> Pricing is fixed. No negotiation here.
        </div>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm ${
              m.from === 'me'
                ? 'bg-white text-black rounded-br-sm'
                : 'bg-white/[0.06] text-white border border-white/10 rounded-bl-sm'
            }`}>
              {m.text}
              <div className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-black/40' : 'text-white/40'}`}>{m.time}</div>
            </div>
          </div>
        ))}
        <div className="h-20" />
      </div>

      <div className="sticky bottom-0 backdrop-blur-xl bg-black/70 border-t border-white/10 px-3 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 focus-within:border-white/30">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask a clarification…"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-sm"
          />
          <button onClick={send} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
