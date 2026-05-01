import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function PhoneAuth() {
  const nav = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (phone.replace(/\D/g, '').length < 6) return;
    setLoading(true);
    setTimeout(() => nav('/auth/otp', { state: { phone } }), 700);
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mt-14">
        <h1 className="text-white text-3xl tracking-tight">Enter your number</h1>
        <p className="mt-2 text-white/50">We'll text you a 6-digit code.</p>
      </div>

      <div className="mt-8">
        <label className="text-xs uppercase tracking-widest text-white/40">Phone</label>
        <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-white/30">
          <span className="text-white/50 text-sm">+1</span>
          <div className="w-px h-5 bg-white/10" />
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-sm"
          />
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={send}
        disabled={loading}
        className="mt-8 w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send OTP'}
      </button>
    </div>
  );
}
