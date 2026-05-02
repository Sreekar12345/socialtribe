import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';
import { inr } from '../utils/money';

const presets = [
  { label: '₹5k - ₹10k', value: 10000 },
  { label: '₹10k - ₹25k', value: 25000 },
  { label: '₹25k - ₹50k', value: 50000 },
];

export function BudgetSetup() {
  const nav = useNavigate();
  const { budget, setBudget } = useCampaign();
  const [custom, setCustom] = useState('');
  const [picked, setPicked] = useState<number | 'custom' | null>(null);

  const canProceed = picked === 'custom' ? Number(custom) > 0 : picked !== null;

  const go = () => {
    if (picked === 'custom') setBudget(Number(custom));
    else if (typeof picked === 'number') setBudget(picked);
    nav('/ai-plan');
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mt-10">
        <div className="text-xs uppercase tracking-widest text-white/40">Step 1 of 3</div>
        <h1 className="mt-2 text-white text-3xl tracking-tight">What's your campaign budget?</h1>
        <p className="mt-2 text-white/50">We'll build a creator plan that fits.</p>
      </div>

      <div className="mt-8 space-y-2">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => setPicked(p.value)}
            className={`w-full text-left px-4 py-4 rounded-2xl border transition-all flex items-center justify-between ${picked === p.value ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/10 text-white'
              }`}
          >
            <span>{p.label}</span>
            <span className={`text-xs ${picked === p.value ? 'text-black/50' : 'text-white/40'}`}>up to {inr(p.value)}</span>
          </button>
        ))}
        <div
          className={`px-4 py-3 rounded-2xl border transition-all ${picked === 'custom' ? 'bg-white/[0.06] border-white/30' : 'bg-white/[0.03] border-white/10'
            }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">₹</span>
            <input
              inputMode="numeric"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value.replace(/\D/g, ''));
                setPicked('custom');
              }}
              onFocus={() => setPicked('custom')}
              placeholder="Custom amount"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={go}
        disabled={!canProceed}
        className="mt-10 w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
      >
        <Sparkles className="w-4 h-4" /> Get AI Recommendations <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
