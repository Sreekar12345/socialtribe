import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function EmailAuth() {
  const nav = useNavigate();
  const { role } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email || !pw) return;
    setLoading(true);
    setTimeout(() => {
      if (role === 'influencer') nav('/onboard/influencer');
      else nav('/onboard/brand');
    }, 900);
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mt-14">
        <h1 className="text-white text-3xl tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="mt-2 text-white/50">Use your work email.</p>
      </div>

      <div className="mt-8 inline-flex rounded-full p-1 bg-white/5 border border-white/10 self-start">
        {(['login', 'signup'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 text-xs rounded-full transition-all ${
              mode === m ? 'bg-white text-black' : 'text-white/60'
            }`}
          >
            {m === 'login' ? 'Login' : 'Sign up'}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
        <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="••••••••" />
      </div>

      <div className="flex-1" />

      <button
        onClick={submit}
        disabled={!email || !pw || loading}
        className="mt-8 w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> {mode === 'login' ? 'Signing in…' : 'Creating…'}</>
        ) : (
          mode === 'login' ? 'Login' : 'Create Account'
        )}
      </button>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-white/40">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-white/30 text-sm"
      />
    </div>
  );
}
