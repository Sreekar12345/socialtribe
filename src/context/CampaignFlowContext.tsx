import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { BudgetRange } from '../constants/budgetOptions';
import {
  createEmptyDeliverableCounts,
  type CampaignDeliverableCounts,
} from '../utils/campaignSchedule';

type ContentType = 'Story' | 'Post' | 'Reel';

interface CampaignDraft {
  title: string;
  description: string;
  budgetRange: BudgetRange | '';
  customBudget: string;
  startDate: string;
  endDate: string;
  contentTypes: ContentType[];
  deliverableCounts: CampaignDeliverableCounts;
  selectedInfluencerIds: string[];
}

interface CampaignFlowContextValue {
  draft: CampaignDraft;
  updateBrief: (payload: {
    title: string;
    description: string;
  }) => void;
  updateBudget: (payload: {
    budgetRange: BudgetRange | '';
    customBudget: string;
    startDate: string;
    endDate: string;
    contentTypes: ContentType[];
    deliverableCounts: CampaignDeliverableCounts;
  }) => void;
  setSelectedInfluencerIds: (ids: string[]) => void;
  selectInfluencer: (id: string) => void;
  resetCampaign: () => void;
}

const defaultDraft: CampaignDraft = {
  title: '',
  description: '',
  budgetRange: '',
  customBudget: '',
  startDate: '',
  endDate: '',
  contentTypes: [],
  deliverableCounts: createEmptyDeliverableCounts(),
  selectedInfluencerIds: [],
};

const CampaignFlowContext = createContext<CampaignFlowContextValue | null>(null);

export function CampaignFlowProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CampaignDraft>(defaultDraft);

  const value = useMemo<CampaignFlowContextValue>(
    () => ({
      draft,
      updateBrief(payload) {
        setDraft((current) => ({
          ...current,
          title: payload.title,
          description: payload.description,
        }));
      },
      updateBudget(payload) {
        setDraft((current) => ({
          ...current,
          budgetRange: payload.budgetRange,
          customBudget: payload.customBudget,
          startDate: payload.startDate,
          endDate: payload.endDate,
          contentTypes: payload.contentTypes,
          deliverableCounts: payload.deliverableCounts,
        }));
      },
      setSelectedInfluencerIds(ids) {
        setDraft((current) => ({
          ...current,
          selectedInfluencerIds: ids,
        }));
      },
      selectInfluencer(id) {
        setDraft((current) => {
          if (current.selectedInfluencerIds.includes(id)) {
            return current;
          }

          return {
            ...current,
            selectedInfluencerIds: [...current.selectedInfluencerIds, id],
          };
        });
      },
      resetCampaign() {
        setDraft(defaultDraft);
      },
    }),
    [draft],
  );

  return (
    <CampaignFlowContext.Provider value={value}>
      {children}
    </CampaignFlowContext.Provider>
  );
}

export function useCampaignFlow() {
  const context = useContext(CampaignFlowContext);

  if (!context) {
    throw new Error('useCampaignFlow must be used within CampaignFlowProvider');
  }

  return context;
}
