import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { usePageTitle } from '../hooks/usePageTitle';

export function AuthPage() {
  usePageTitle('Welcome to SocialTribe');

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-full flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Card className="p-6">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              navigate('/role');
            }}
          >
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
                Welcome to SocialTribe
              </h1>
            </div>

            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <div className="space-y-3 pt-1">
              <Button type="submit" fullWidth>
                Login
              </Button>
              <button
                type="button"
                onClick={() => navigate('/role')}
                className="w-full text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
              >
                Create account
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
