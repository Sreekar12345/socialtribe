import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';

export function OtpVerify() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { state } = useLocation() as { state?: { phone?: string } };
  const phone = state?.phone ?? '';
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  if (!role) return <Navigate to="/auth/role" replace />;

  const code = digits.join('');
  const complete = code.length === 6;

  const verify = () => {
    if (!complete) return;
    setLoading(true);
    window.setTimeout(() => {
      navigate(role === 'influencer' ? '/influencer/setup' : '/brand/setup');
    }, 700);
  };

  const updateDigit = (index: number, value: string) => {
    const next = value.replace(/\D/g, '').slice(-1);
    const copy = [...digits];
    copy[index] = next;
    setDigits(copy);
    if (next && index < copy.length - 1) refs.current[index + 1]?.focus();
  };

  return (
    <div className="fin-page">
      <TopBar
        left={<BackButton onClick={() => navigate('/auth/phone')} />}
        title="Verify OTP"
        subtitle={`Code sent to ${phone || 'your number'}.`}
      />

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                refs.current[index] = element;
              }}
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              maxLength={1}
              className="h-14 w-12 rounded-2xl border border-white/10 bg-neutral-950 text-center text-lg text-white outline-none focus:border-lime-200/60"
            />
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <Button fullWidth onClick={verify} disabled={!complete || loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying
            </>
          ) : (
            'Verify and continue'
          )}
        </Button>
        <Button variant="ghost" fullWidth onClick={() => setDigits(['', '', '', '', '', ''])}>
          Resend OTP
        </Button>
      </div>
    </div>
  );
}
