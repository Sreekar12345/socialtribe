import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';

export function PhoneAuth() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!role) return <Navigate to="/auth/role" replace />;

  const send = () => {
    if (phone.replace(/\D/g, '').length < 6) return;
    setLoading(true);
    window.setTimeout(() => navigate('/auth/otp', { state: { phone } }), 700);
  };

  return (
    <div className="fin-page">
      <TopBar
        left={<BackButton onClick={() => navigate('/auth')} />}
        title="OTP login"
        subtitle="Enter your number to receive a verification code."
      />

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <label className="fin-eyebrow">Phone number</label>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3">
          <span className="text-sm text-zinc-400">+91</span>
          <div className="h-5 w-px bg-white/10" />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="98765 43210"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
          />
        </div>
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={send} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            'Send OTP'
          )}
        </Button>
      </div>
    </div>
  );
}
