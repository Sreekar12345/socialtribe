import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { influencerActiveWork, profileData } from '../data/dashboardMockData';

type WorkStatus = 'Pending' | 'Submitted' | 'Approved' | 'Rejected';

export interface InfluencerWorkItem {
  id: string;
  title: string;
  brandName: string;
  contentType: string;
  status: WorkStatus;
  description: string;
  deliverables: string[];
  deadline: string;
  guidelines: string[];
}

export interface InfluencerSubmission {
  campaignId: string;
  influencerId: string;
  mediaUrl?: string;
  uploadedFile?: File;
  caption: string;
  submittedAt: string;
}

interface InfluencerWorkContextValue {
  campaigns: InfluencerWorkItem[];
  submissions: InfluencerSubmission[];
  findCampaignById: (campaignId: string) => InfluencerWorkItem | undefined;
  submitCampaignContent: (payload: {
    campaignId: string;
    mediaUrl?: string;
    uploadedFile?: File;
    caption: string;
  }) => void;
}

const InfluencerWorkContext =
  createContext<InfluencerWorkContextValue | null>(null);

export function InfluencerWorkProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] =
    useState<InfluencerWorkItem[]>(influencerActiveWork);
  const [submissions, setSubmissions] = useState<InfluencerSubmission[]>([]);

  const value = useMemo<InfluencerWorkContextValue>(
    () => ({
      campaigns,
      submissions,
      findCampaignById(campaignId) {
        return campaigns.find((campaign) => campaign.id === campaignId);
      },
      submitCampaignContent(payload) {
        const submission: InfluencerSubmission = {
          campaignId: payload.campaignId,
          influencerId: profileData.influencer.email,
          mediaUrl: payload.mediaUrl,
          uploadedFile: payload.uploadedFile,
          caption: payload.caption,
          submittedAt: new Date().toISOString(),
        };

        setSubmissions((current) => {
          const remaining = current.filter(
            (item) => item.campaignId !== payload.campaignId,
          );

          return [...remaining, submission];
        });

        setCampaigns((current) =>
          current.map((campaign) =>
            campaign.id === payload.campaignId
              ? { ...campaign, status: 'Submitted' }
              : campaign,
          ),
        );
      },
    }),
    [campaigns, submissions],
  );

  return (
    <InfluencerWorkContext.Provider value={value}>
      {children}
    </InfluencerWorkContext.Provider>
  );
}

export function useInfluencerWork() {
  const context = useContext(InfluencerWorkContext);

  if (!context) {
    throw new Error(
      'useInfluencerWork must be used within InfluencerWorkProvider',
    );
  }

  return context;
}
