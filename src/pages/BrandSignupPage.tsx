import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { usePageTitle } from '../hooks/usePageTitle';

export function BrandSignupPage() {
  usePageTitle('Brand signup');

  const navigate = useNavigate();
  const [form, setForm] = useState({
    brandName: '',
    industry: '',
    websiteUrl: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function updateField<Key extends keyof typeof form>(key: Key, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="flex min-h-full flex-col justify-center">
      <Card className="p-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            navigate('/dashboard');
          }}
        >
          <h1 className="text-center text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
            Brand Signup
          </h1>

          <InputField
            label="Brand name"
            placeholder="Enter brand name"
            value={form.brandName}
            onChange={(event) => updateField('brandName', event.target.value)}
          />
          <InputField
            label="Industry"
            placeholder="Enter industry"
            value={form.industry}
            onChange={(event) => updateField('industry', event.target.value)}
          />
          <InputField
            label="Website URL"
            placeholder="Enter website URL"
            value={form.websiteUrl}
            onChange={(event) => updateField('websiteUrl', event.target.value)}
            helper="Optional"
          />
          <InputField
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
          />
          <InputField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField('confirmPassword', event.target.value)
            }
          />

          <Button type="submit" fullWidth>
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
