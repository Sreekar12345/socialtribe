import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  completeInstagramSignup,
  fetchInstagramSignupSession,
  getInstagramSignupStartUrl,
  saveConnectedInfluencerAccount,
  type InstagramSignupSession,
} from '../utils/influencerSignup';

function toTitleCase(value: string) {
  if (!value) {
    return '';
  }

  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function InfluencerSignupPage() {
  usePageTitle('Create your influencer account');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oauthSessionId = searchParams.get('oauthSessionId');
  const oauthStatus = searchParams.get('instagram');
  const oauthError = searchParams.get('error');

  const [session, setSession] = useState<InstagramSignupSession | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    oauthError ? decodeURIComponent(oauthError) : null,
  );
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!oauthSessionId) {
      setSession(null);
      return;
    }

    setIsLoadingSession(true);
    setErrorMessage(oauthError ? decodeURIComponent(oauthError) : null);

    fetchInstagramSignupSession(oauthSessionId)
      .then((nextSession) => {
        setSession(nextSession);

        if (nextSession.status === 'failed' && nextSession.error) {
          setErrorMessage(nextSession.error);
        }
      })
      .catch((error: Error) => {
        setErrorMessage(error.message);
        setSession(null);
      })
      .finally(() => {
        setIsLoadingSession(false);
      });
  }, [oauthError, oauthSessionId]);

  const connectedProfile = session?.profile ?? null;
  const canCompleteSignup =
    session?.status === 'connected' && connectedProfile !== null;
  const detectedCategory = useMemo(
    () => toTitleCase(connectedProfile?.category ?? ''),
    [connectedProfile?.category],
  );

  function updateField<Key extends keyof typeof form>(key: Key, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!oauthSessionId || !canCompleteSignup) {
      setErrorMessage('Connect Instagram before creating your account.');
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await completeInstagramSignup({
        sessionId: oauthSessionId,
        email: form.email,
        password: form.password,
      });

      saveConnectedInfluencerAccount(result);
      navigate('/influencer/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create account.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center">
      <Card className="p-6">
        {!canCompleteSignup ? (
          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
                Create your influencer account
              </h1>
              <p className="text-sm leading-6 text-neutral-600">
                Connect Instagram to fetch your verified creator data
                automatically. We&apos;ll pull your handle, audience size,
                media count, and available engagement metrics directly from
                Instagram.
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f7f7f5] px-5 py-4">
              <p className="text-sm leading-6 text-neutral-600">
                Manual Instagram entry is disabled. You&apos;ll only be able to
                continue after a successful Instagram connection.
              </p>
            </div>

            {errorMessage ? (
              <p className="text-sm text-[#b42318]">{errorMessage}</p>
            ) : null}

            <Button
              fullWidth
              disabled={isLoadingSession}
              onClick={() => {
                setErrorMessage(null);
                window.location.assign(getInstagramSignupStartUrl());
              }}
            >
              {isLoadingSession || oauthStatus === 'connected'
                ? 'Loading Instagram...'
                : 'Connect Instagram'}
            </Button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
                Finish your account
              </h1>
              <p className="text-sm leading-6 text-neutral-600">
                Your Instagram account is verified. Add your login details to
                complete signup.
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f7f7f5] px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Instagram Handle
                  </p>
                  <p className="mt-2 text-sm font-semibold text-neutral-950">
                    @{connectedProfile.username}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Auto-detected Category
                  </p>
                  <p className="mt-2 text-sm font-semibold text-neutral-950">
                    {detectedCategory || 'Pending classification'}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Followers
                  </p>
                  <p className="mt-2 text-sm font-semibold text-neutral-950">
                    {connectedProfile.followersCount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Engagement
                  </p>
                  <p className="mt-2 text-sm font-semibold text-neutral-950">
                    {connectedProfile.engagementRate > 0
                      ? `${connectedProfile.engagementRate.toFixed(1)}%`
                      : 'Unavailable'}
                  </p>
                </div>
              </div>
            </div>

            <InputField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
            <InputField
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              helper="Use at least 8 characters."
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
            />
            <InputField
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField('confirmPassword', event.target.value)
              }
            />

            {errorMessage ? (
              <p className="text-sm text-[#b42318]">{errorMessage}</p>
            ) : null}

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
