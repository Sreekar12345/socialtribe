import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { Input } from '../../components/Input';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';

export function EmailAuth() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const nextRoute = role === 'influencer' ? '/influencer/setup' : '/brand/setup';

  if (!role) return <Navigate to="/auth/role" replace />;

  const submit = () => {
    if (!email || !password) return;
    setLoading(true);
    window.setTimeout(() => navigate(nextRoute), 700);
  };

  return (
    <div className="fin-page">
      <TopBar
        left={<BackButton onClick={() => navigate('/auth')} />}
        title={mode === 'login' ? 'Email login' : 'Create account'}
        subtitle="Use email and password to continue."
      />

      <div className="inline-flex rounded-full border border-white/10 bg-gray-800 p-1">
        {(['login', 'signup'] as const).map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setMode(entry)}
            className={`rounded-full px-4 py-2 text-sm ${mode === entry ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'text-zinc-400'}`}
          >
            {entry === 'login' ? 'Login' : 'Sign up'}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={submit} disabled={!email || !password || loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing
            </>
          ) : mode === 'login' ? (
            'Login'
          ) : (
            'Create account'
          )}
        </Button>
      </div>
    </div>
  );
}
