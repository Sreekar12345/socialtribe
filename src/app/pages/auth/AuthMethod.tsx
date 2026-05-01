import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AuthMethod() {
  const nav = useNavigate();
  const { role } = useAuth();
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const afterAuth = () => {
    if (role === 'influencer') nav('/onboard/influencer');
    else nav('/onboard/brand');
  };

  const google = () => {
    setLoadingGoogle(true);
    setTimeout(afterAuth, 1100);
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mt-16">
        <h1 className="text-white text-3xl tracking-tight">Continue with SocialTribe</h1>
        <p className="mt-2 text-white/50">
          {role === 'influencer' ? 'Start earning from your content.' : 'Hire creators in minutes.'}
        </p>
      </div>

      <div className="mt-10 space-y-3">
        <button
          onClick={google}
          disabled={loadingGoogle}
          className="w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-3 hover:bg-white/90 transition-all disabled:opacity-70"
        >
          {loadingGoogle ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
          ) : (
            <><GoogleG /> Continue with Google</>
          )}
        </button>

        <button
          onClick={() => nav('/auth/email')}
          className="w-full py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white flex items-center justify-center gap-3 hover:bg-white/[0.06] transition-all"
        >
          <Mail className="w-4 h-4" /> Login with Email
        </button>

        <button
          onClick={() => nav('/auth/phone')}
          className="w-full py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white flex items-center justify-center gap-3 hover:bg-white/[0.06] transition-all"
        >
          <Phone className="w-4 h-4" /> Login with OTP
        </button>
      </div>

      <div className="flex-1" />
      <p className="mt-8 text-center text-[11px] text-white/30">By continuing you agree to our Terms & Privacy.</p>
    </div>
  );
}

function GoogleG() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
