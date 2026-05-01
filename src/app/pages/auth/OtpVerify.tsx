import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function OtpVerify() {
  const nav = useNavigate();
  const { role } = useAuth();
  const { state } = useLocation() as { state?: { phone?: string } };
  const phone = state?.phone ?? '';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const code = digits.join('');
  const complete = code.length === 6;

  const update = (i: number, v: string) => {
    const val = v.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = text.split('').concat(Array(6).fill('')).slice(0, 6);
    setDigits(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const verify = () => {
    if (!complete) return;
    setLoading(true);
    setTimeout(() => {
      if (role === 'influencer') nav('/onboard/influencer');
      else nav('/onboard/brand');
    }, 800);
  };

  useEffect(() => {
    if (complete) verify();
  }, [complete]);

  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mt-14">
        <h1 className="text-white text-3xl tracking-tight">Verify</h1>
        <p className="mt-2 text-white/50">
          Code sent to <span className="text-white/80">+1 {phone || '•••• •••'}</span>
        </p>
      </div>

      <div className="mt-10 flex gap-2 justify-between" onPaste={onPaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-14 text-center rounded-xl bg-white/[0.03] border border-white/10 text-white text-xl outline-none focus:border-white/40 tabular-nums"
          />
        ))}
      </div>

      <button
        onClick={() => setResent(true)}
        className="mt-6 self-start text-xs text-white/50 hover:text-white"
      >
        {resent ? 'Code resent ✓' : 'Resend OTP'}
      </button>

      <div className="flex-1" />

      <button
        onClick={verify}
        disabled={!complete || loading}
        className="mt-8 w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : 'Verify & Continue'}
      </button>
    </div>
  );
}
