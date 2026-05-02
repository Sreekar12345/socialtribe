import { createBrowserRouter } from "react-router";
import { PilotLanding } from "./pages/PilotLanding";
import { PilotInfluencers } from "./pages/PilotInfluencers";
import { PilotCampaign } from "./pages/PilotCampaign";
import { PilotConfirm } from "./pages/PilotConfirm";
import { PilotSuccess } from "./pages/PilotSuccess";
import { RoleSelect } from "./pages/auth/RoleSelect";
import { AuthMethod } from "./pages/auth/AuthMethod";
import { EmailAuth } from "./pages/auth/EmailAuth";
import { PhoneAuth } from "./pages/auth/PhoneAuth";
import { OtpVerify } from "./pages/auth/OtpVerify";
import { ProfileSetup } from "./pages/auth/ProfileSetup";
import { InfluencerHome } from "./pages/InfluencerHome";
import { BudgetSetup } from "./pages/BudgetSetup";
import { AIRecommend } from "./pages/AIRecommend";
import { CampaignTracking } from "./pages/CampaignTracking";
import { ContentReview } from "./pages/ContentReview";
import { ActiveCampaign } from "./pages/ActiveCampaign";
import { ContentSubmission } from "./pages/ContentSubmission";
import { ChatInbox } from "./pages/ChatInbox";
import { LightChat } from "./pages/LightChat";

export const router = createBrowserRouter([
  { path: "/", element: <PilotLanding /> },
  { path: "/role", element: <RoleSelect /> },
  { path: "/auth", element: <AuthMethod /> },
  { path: "/auth/email", element: <EmailAuth /> },
  { path: "/auth/phone", element: <PhoneAuth /> },
  { path: "/auth/otp", element: <OtpVerify /> },
  { path: "/onboard/brand", element: <ProfileSetup /> },
  { path: "/onboard/influencer", element: <ProfileSetup /> },

  { path: "/budget", element: <BudgetSetup /> },
  { path: "/ai-plan", element: <AIRecommend /> },
  { path: "/influencers", element: <PilotInfluencers /> },
  { path: "/campaign", element: <PilotCampaign /> },
  { path: "/confirm", element: <PilotConfirm /> },
  { path: "/success", element: <PilotSuccess /> },
  { path: "/brand/track", element: <CampaignTracking /> },
  { path: "/brand/review/:id", element: <ContentReview /> },

  { path: "/influencer/home", element: <InfluencerHome /> },
  { path: "/influencer/campaign/:id", element: <ActiveCampaign /> },
  { path: "/influencer/submit/:id", element: <ContentSubmission /> },

  { path: "/inbox", element: <ChatInbox /> },
  { path: "/chat/:id", element: <LightChat /> },

  { path: "*", element: <PilotLanding /> },
]);
