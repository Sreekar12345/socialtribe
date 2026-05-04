import { Globe, LockKeyhole, LogOut, Mail } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  brandCategoryOptions,
  brandContentTypeOptions,
  brandIndustryOptions,
  profileData,
} from '../data/dashboardMockData';

interface ProfilePageProps {
  role: 'brand' | 'influencer';
}

export function ProfilePage({ role }: ProfilePageProps) {
  usePageTitle('Profile');

  const navigate = useNavigate();
  const profile = profileData[role];
  const brandProfile = profileData.brand;
  const influencerProfile = profileData.influencer;
  const isBrand = role === 'brand';

  const [isEditing, setIsEditing] = useState(false);
  const [brandName, setBrandName] = useState(brandProfile.name);
  const [industry, setIndustry] = useState(brandProfile.industry);
  const [websiteUrl, setWebsiteUrl] = useState(brandProfile.websiteUrl);
  const [contentTypes, setContentTypes] = useState([
    ...brandProfile.contentTypes,
  ]);
  const [categories, setCategories] = useState([...brandProfile.categories]);

  function toggleSelection(
    value: string,
    setCurrent: Dispatch<SetStateAction<string[]>>,
  ) {
    if (!isEditing) return;

    setCurrent((items) =>
      items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value],
    );
  }

  const content = isBrand ? (
    <>
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#ede7fb] text-2xl font-semibold text-neutral-950">
            {brandName.charAt(0)}
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xl font-semibold text-neutral-950">{brandName}</p>
            <p className="text-sm font-medium text-neutral-700">{industry}</p>
            <p className="truncate text-sm leading-6 text-neutral-600">
              {brandProfile.tagline}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Campaigns Run
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {brandProfile.campaignsRun}
          </p>
        </Card>
        <Card className="border-[#c5b0f4] bg-[#f4f0fd] p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Active Campaigns
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {brandProfile.activeCampaigns}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Influencers Worked
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {brandProfile.influencersWorked}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-neutral-950">
              Editable Info
            </h2>
            <Button
              variant="secondary"
              onClick={() => setIsEditing((current) => !current)}
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Button>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Brand Name
            </span>
            <input
              className="h-12 rounded-full border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition disabled:bg-[#f7f7f5] disabled:text-neutral-500"
              value={brandName}
              disabled={!isEditing}
              onChange={(event) => setBrandName(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Industry
            </span>
            <select
              className="h-12 rounded-full border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition disabled:bg-[#f7f7f5] disabled:text-neutral-500"
              value={industry}
              disabled={!isEditing}
              onChange={(event) => setIndustry(event.target.value)}
            >
              {brandIndustryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Website URL
            </span>
            <input
              className="h-12 rounded-full border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition disabled:bg-[#f7f7f5] disabled:text-neutral-500"
              value={websiteUrl}
              disabled={!isEditing}
              onChange={(event) => setWebsiteUrl(event.target.value)}
            />
          </label>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-950">
            Preferences
          </h2>

          <div className="space-y-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Content Types
            </p>
            <div className="flex flex-wrap gap-2">
              {brandContentTypeOptions.map((option) => {
                const active = contentTypes.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleSelection(option, setContentTypes)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'border-transparent bg-neutral-950 text-white'
                        : 'border-black/10 bg-white text-neutral-700'
                    } ${!isEditing ? 'cursor-default' : ''}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {brandCategoryOptions.map((option) => {
                const active = categories.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleSelection(option, setCategories)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'border-transparent bg-[#ede7fb] text-neutral-950'
                        : 'border-black/10 bg-white text-neutral-700'
                    } ${!isEditing ? 'cursor-default' : ''}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-950">Account</h2>

          <div className="rounded-[22px] bg-[#f7f7f5] px-4 py-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-neutral-500" />
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Email
                </p>
                <p className="mt-1 text-sm text-neutral-950">
                  {brandProfile.email}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-[22px] border border-black/10 bg-white px-4 py-3 text-left text-sm font-medium text-neutral-950"
          >
            <LockKeyhole className="h-4 w-4 text-neutral-500" />
            Change Password
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex w-full items-center gap-3 rounded-[22px] border border-black/10 bg-white px-4 py-3 text-left text-sm font-medium text-neutral-950"
          >
            <LogOut className="h-4 w-4 text-neutral-500" />
            Logout
          </button>

          <Button variant="ghost" fullWidth>
            <Globe className="h-4 w-4" /> View Public Profile
          </Button>
        </div>
      </Card>
    </>
  ) : (
    <>
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ede7fb] text-2xl font-semibold text-neutral-950">
            {profile.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <p className="text-xl font-semibold text-neutral-950">
              {profile.name}
            </p>
            <p className="text-sm text-neutral-600">{profile.email}</p>
            <p className="text-sm font-medium text-neutral-700">
              {profile.role}
            </p>
          </div>
        </div>
      </Card>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-neutral-950">
          Performance
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-3 text-center">
            <p className="text-xs text-gray-500">Score</p>
            <p className="font-semibold text-neutral-950">
              {influencerProfile.score}
            </p>
          </div>

          <div className="rounded-xl bg-white p-3 text-center">
            <p className="text-xs text-gray-500">Engagement</p>
            <p className="font-semibold text-neutral-950">
              {influencerProfile.engagementRate}
            </p>
          </div>

          <div className="rounded-xl bg-white p-3 text-center">
            <p className="text-xs text-gray-500">Followers</p>
            <p className="font-semibold text-neutral-950">
              {influencerProfile.followers}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-neutral-950">
          Content Pricing
        </h2>

        <div className="space-y-3 rounded-xl bg-white p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Reel</span>
            <span className="text-neutral-950">
              {influencerProfile.pricing.reel}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-600">Post</span>
            <span className="text-neutral-950">
              {influencerProfile.pricing.post}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-600">Story</span>
            <span className="text-neutral-950">
              {influencerProfile.pricing.story}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-neutral-950">
          Account Actions
        </h2>

        <div className="space-y-3">
          <button
            type="button"
            className="w-full text-left text-sm font-medium text-neutral-950"
          >
            Edit Profile
          </button>

          <button
            type="button"
            className="w-full text-left text-sm font-medium text-neutral-950"
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-left text-sm font-medium text-red-500"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="mt-6">
        <button
          type="button"
          className="w-full rounded-xl border border-black/10 bg-white py-3 text-sm font-medium text-neutral-950"
        >
          View Public Profile
        </button>
      </section>
    </>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Profile
      </h1>
      {content}
    </div>
  );
}
