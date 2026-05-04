import { createContext, useContext, useState, ReactNode } from 'react';
import { DeliverableKey } from '../utils/pricing';
import {
  buildCustomCampaignBudget,
  buildPresetCampaignBudget,
  type CampaignBudgetPresetId,
} from '../utils/campaignBudget';

interface Campaign {
  name: string;
  deliverables: DeliverableKey[];
  deadline: string;
  brief: string;
}

interface CampaignState {
  selected: string[];
  toggle: (id: string) => void;
  setSelected: (ids: string[]) => void;
  clear: () => void;
  campaign: Campaign;
  setCampaign: (c: Campaign) => void;
  budget: number;
  budgetLabel: string;
  budgetMin: number;
  budgetMax: number | null;
  budgetPresetId: CampaignBudgetPresetId | null;
  setBudget: (n: number) => void;
  setBudgetPreset: (id: CampaignBudgetPresetId) => void;
  walletBalance: number;
  setWalletBalance: (n: number) => void;
}

const Ctx = createContext<CampaignState | null>(null);

const initialCampaign: Campaign = {
  name: '',
  deliverables: [],
  deadline: '',
  brief: '',
};

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign);
  const [budgetState, setBudgetState] = useState(() =>
    buildPresetCampaignBudget('15k-25k'),
  );
  const [walletBalance, setWalletBalance] = useState<number>(20000);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const clear = () => {
    setSelected([]);
    setCampaign(initialCampaign);
  };

  const setBudget = (amount: number) => {
    setBudgetState(buildCustomCampaignBudget(amount));
  };

  const setBudgetPreset = (id: CampaignBudgetPresetId) => {
    setBudgetState(buildPresetCampaignBudget(id));
  };

  return (
    <Ctx.Provider
      value={{
        selected,
        toggle,
        setSelected,
        clear,
        campaign,
        setCampaign,
        budget: budgetState.budget,
        budgetLabel: budgetState.budgetLabel,
        budgetMin: budgetState.budgetMin,
        budgetMax: budgetState.budgetMax,
        budgetPresetId: budgetState.budgetPresetId,
        setBudget,
        setBudgetPreset,
        walletBalance,
        setWalletBalance,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCampaign() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCampaign must be used inside CampaignProvider');
  return ctx;
}
