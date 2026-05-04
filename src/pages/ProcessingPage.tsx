import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Loader } from '../components/Loader';
import { ProgressBar } from '../components/ProgressBar';
import { usePageTitle } from '../hooks/usePageTitle';

export function ProcessingPage() {
  usePageTitle('Processing');

  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextValue = Math.min(100, (elapsed / 3000) * 100);
      setProgress(nextValue);
    }, 80);

    const timer = window.setTimeout(() => {
      navigate('/result');
    }, 3000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <Card className="space-y-6 p-8">
        <Loader label="Analyzing your profile..." caption="" />
        <ProgressBar value={progress} />
      </Card>
    </div>
  );
}
