import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { budgetOptions, type BudgetRange } from '../constants/budgetOptions';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCampaignFlow } from '../context/CampaignFlowContext';
import {
  createEmptyDeliverableCounts,
  getTotalDeliverables,
  sanitizeDeliverableCounts,
} from '../utils/campaignSchedule';

type ContentType = 'Story' | 'Post' | 'Reel';

const contentTypeOptions: ContentType[] = ['Story', 'Post', 'Reel'];
const deliverableLabels: Record<ContentType, string> = {
  Reel: 'Reels',
  Post: 'Posts',
  Story: 'Stories',
};

function getNextDateValue(value: string) {
  const nextDate = new Date(`${value}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate.toISOString().slice(0, 10);
}

export function BrandCampaignBudgetPage() {
  usePageTitle('Budget & Duration');

  const navigate = useNavigate();
  const { draft, updateBudget } = useCampaignFlow();
  const [budgetRange, setBudgetRange] = useState<BudgetRange | ''>(
    draft.budgetRange,
  );
  const [customBudget, setCustomBudget] = useState(draft.customBudget);
  const [startDate, setStartDate] = useState(draft.startDate);
  const [endDate, setEndDate] = useState(draft.endDate);
  const [deliverableCounts, setDeliverableCounts] = useState(() => {
    const counts = sanitizeDeliverableCounts(draft.deliverableCounts);

    if (getTotalDeliverables(counts) > 0) {
      return counts;
    }

    const fallback = createEmptyDeliverableCounts();

    draft.contentTypes.forEach((type) => {
      fallback[type] = 1;
    });

    return fallback;
  });
  const contentTypes = contentTypeOptions.filter(
    (option) => deliverableCounts[option] > 0,
  );

  const hasCustomBudget = (Number.parseInt(customBudget.trim(), 10) || 0) > 0;
  const hasBudgetSelection = Boolean(budgetRange) || hasCustomBudget;
  const totalDeliverables = getTotalDeliverables(deliverableCounts);
  const hasStartDate = startDate.trim().length > 0;
  const hasEndDate = endDate.trim().length > 0;
  const hasInvalidDateRange = hasStartDate && hasEndDate && endDate <= startDate;
  const isSubmitDisabled =
    !hasBudgetSelection ||
    totalDeliverables === 0 ||
    !hasStartDate ||
    !hasEndDate ||
    hasInvalidDateRange;

  function toggleContentType(option: ContentType) {
    setDeliverableCounts((current) => ({
      ...current,
      [option]: current[option] > 0 ? 0 : 1,
    }));
  }

  function updateDeliverableCount(option: ContentType, value: string) {
    const parsedValue = Number.parseInt(value.replace(/\D/g, ''), 10);

    setDeliverableCounts((current) => ({
      ...current,
      [option]: Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0,
    }));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Budget &amp; Duration
      </h1>

      <Card className="p-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (isSubmitDisabled) return;
            updateBudget({
              budgetRange,
              customBudget: customBudget.trim(),
              startDate,
              endDate,
              contentTypes,
              deliverableCounts,
            });
            navigate('/brand/recommendations');
          }}
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Select Budget Range
              </p>
            </div>
            <div className="grid gap-3">
              {budgetOptions.map((option, index) => {
                const active = budgetRange === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      setBudgetRange(option.label);
                      setCustomBudget('');
                    }}
                    className={`rounded-[24px] border px-4 py-4 text-left text-sm font-medium transition ${
                      active
                        ? 'border-transparent bg-neutral-950 text-white'
                        : index % 2 === 0
                          ? 'border-black/10 bg-[#f4ecd6] text-neutral-950'
                          : 'border-black/10 bg-[#ede7fb] text-neutral-950'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <InputField
            label="Or enter custom budget"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter amount (\u20B9)"
            value={customBudget}
            onChange={(event) => {
              setCustomBudget(event.target.value.replace(/\D/g, ''));
              setBudgetRange('');
            }}
            min="1"
          />

          <div className="space-y-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Campaign Duration
            </p>
            <InputField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
            <InputField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              min={startDate ? getNextDateValue(startDate) : undefined}
              required
              error={
                hasInvalidDateRange
                  ? 'End date must be after start date'
                  : undefined
              }
            />
            <p className="text-xs text-neutral-500">
              Campaign will run between selected dates
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Select Content Type
            </p>
            <div className="flex flex-wrap gap-2">
              {contentTypeOptions.map((option) => {
                const active = contentTypes.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleContentType(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'border-transparent bg-neutral-950 text-white'
                        : 'border-black/10 bg-white text-neutral-700'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {contentTypeOptions.map((option) => (
                <InputField
                  key={option}
                  label={deliverableLabels[option]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={
                    deliverableCounts[option] > 0
                      ? String(deliverableCounts[option])
                      : ''
                  }
                  onChange={(event) =>
                    updateDeliverableCount(option, event.target.value)
                  }
                  helper="Set quantity"
                />
              ))}
            </div>
            <p className="text-xs text-neutral-500">
              We&apos;ll use these counts to build a day-by-day creator schedule.
            </p>
          </div>

          {isSubmitDisabled ? (
            <p className="text-sm text-neutral-600">
              Select a budget option or enter a custom amount, choose at least
              one deliverable, and set a valid campaign duration to continue.
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={isSubmitDisabled}>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
