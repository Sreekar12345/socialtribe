import { createContext, useContext, useState, ReactNode } from 'react';
import { DeliverableKey } from '../utils/pricing';

interface Campaign {
  name: string;
  deliverables: DeliverableKey[];
  deadline: string;
}

interface CampaignState {
  selected: string[];
  toggle: (id: string) => void;
  setSelected: (ids: string[]) => void;
  clear: () => void;
  campaign: Campaign;
  setCampaign: (c: Campaign) => void;
  budget: number;
  setBudget: (n: number) => void;
}

const Ctx = createContext<CampaignState | null>(null);

const initialCampaign: Campaign = {
  name: '',
  deliverables: [],
  deadline: '',
};

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign);
  const [budget, setBudget] = useState<number>(15000);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const clear = () => {
    setSelected([]);
    setCampaign(initialCampaign);
  };

  return (
    <Ctx.Provider value={{ selected, toggle, setSelected, clear, campaign, setCampaign, budget, setBudget }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCampaign() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCampaign must be used inside CampaignProvider');
  return ctx;
}
