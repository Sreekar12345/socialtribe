import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Loader } from '../components/Loader';
import { usePageTitle } from '../hooks/usePageTitle';

export function VerificationPage() {
  usePageTitle('Verification');

  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/processing');
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <Card className="p-8">
        <Loader label="Verifying your profile..." caption="" />
      </Card>
    </div>
  );
}
