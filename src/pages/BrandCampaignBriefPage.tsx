import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCampaignFlow } from '../context/CampaignFlowContext';

export function BrandCampaignBriefPage() {
  usePageTitle('Campaign Brief');

  const navigate = useNavigate();
  const { draft, updateBrief } = useCampaignFlow();
  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Campaign Brief
      </h1>

      <Card className="p-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            updateBrief({ title, description });
            navigate('/brand/create/budget');
          }}
        >
          <InputField
            label="Campaign Title"
            placeholder="Enter campaign title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label className="flex flex-col gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Description
            </span>
            <textarea
              className="min-h-32 rounded-[24px] border border-black/10 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-black/30"
              placeholder="Enter campaign description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <Button type="submit" fullWidth>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
