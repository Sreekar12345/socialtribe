import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from '../layouts/AppLayout';
import { BrandLayout } from '../layouts/BrandLayout';
import { InfluencerLayout } from '../layouts/InfluencerLayout';
import { AuthPage } from '../pages/AuthPage';
import { BrandCampaignBriefPage } from '../pages/BrandCampaignBriefPage';
import { BrandCampaignBudgetPage } from '../pages/BrandCampaignBudgetPage';
import { BrandCampaignReviewFlowPage } from '../pages/BrandCampaignReviewFlowPage';
import { BrandSignupPage } from '../pages/BrandSignupPage';
import { BrandWorkspaceDashboardPage } from '../pages/BrandWorkspaceDashboardPage';
import { BrandCampaignsPage } from '../pages/BrandCampaignsPage';
import { BrandChatPage } from '../pages/BrandChatPage';
import { BrandCreateCampaignEntryPage } from '../pages/BrandCreateCampaignEntryPage';
import { BrandInfluencerProfilePage } from '../pages/BrandInfluencerProfilePage';
import { BrandManualPickPage } from '../pages/BrandManualPickPage';
import { BrandPaymentPage } from '../pages/BrandPaymentPage';
import { BrandRecommendationsPage } from '../pages/BrandRecommendationsPage';
import { BrandSelectedInfluencersPage } from '../pages/BrandSelectedInfluencersPage';
import { BrandWaitingForApprovalPage } from '../pages/BrandWaitingForApprovalPage';
import { InfluencerSignupPage } from '../pages/InfluencerSignupPage';
import { InfluencerCampaignDetailFlowPage } from '../pages/InfluencerCampaignDetailFlowPage';
import { InfluencerCampaignListPage } from '../pages/InfluencerCampaignListPage';
import { InfluencerDashboardPage } from '../pages/InfluencerDashboardPage';
import { InfluencerChatPage } from '../pages/InfluencerChatPage';
import { InfluencerPayoutsPage } from '../pages/InfluencerPayoutsPage';
import { InfluencerSubmitPage } from '../pages/InfluencerSubmitPage';
import { InfluencerWorkDetailPage } from '../pages/InfluencerWorkDetailPage';
import { ProcessingPage } from '../pages/ProcessingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ResultPage } from '../pages/ResultPage';
import { RoleSelectionPage } from '../pages/RoleSelectionPage';
import { VerificationPage } from '../pages/VerificationPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: 'role', element: <RoleSelectionPage /> },
      { path: 'signup/brand', element: <BrandSignupPage /> },
      { path: 'signup/influencer', element: <InfluencerSignupPage /> },
      { path: 'verify', element: <VerificationPage /> },
      { path: 'processing', element: <ProcessingPage /> },
      { path: 'result', element: <ResultPage /> },
      { path: 'dashboard', element: <Navigate to="/brand/dashboard" replace /> },
      {
        path: 'brand',
        element: <BrandLayout />,
        children: [
          { path: 'dashboard', element: <BrandWorkspaceDashboardPage /> },
          { path: 'create', element: <BrandCreateCampaignEntryPage /> },
          { path: 'create/brief', element: <BrandCampaignBriefPage /> },
          { path: 'create/budget', element: <BrandCampaignBudgetPage /> },
          { path: 'recommendations', element: <BrandRecommendationsPage /> },
          { path: 'manual-pick', element: <BrandManualPickPage /> },
          {
            path: 'influencer/:id',
            element: <BrandInfluencerProfilePage />,
          },
          { path: 'selected', element: <BrandSelectedInfluencersPage /> },
          { path: 'review', element: <BrandCampaignReviewFlowPage /> },
          { path: 'waiting', element: <BrandWaitingForApprovalPage /> },
          { path: 'payment', element: <BrandPaymentPage /> },
          { path: 'campaigns', element: <BrandCampaignsPage /> },
          { path: 'chat', element: <BrandChatPage /> },
          { path: 'profile', element: <ProfilePage role="brand" /> },
        ],
      },
      {
        path: 'influencer',
        element: <InfluencerLayout />,
        children: [
          { path: 'dashboard', element: <InfluencerDashboardPage /> },
          { path: 'campaigns', element: <InfluencerCampaignListPage /> },
          { path: 'work/:id', element: <InfluencerWorkDetailPage /> },
          { path: 'submit/:campaignId', element: <InfluencerSubmitPage /> },
          {
            path: 'campaign/:id',
            element: <InfluencerCampaignDetailFlowPage />,
          },
          { path: 'chat', element: <InfluencerChatPage /> },
          { path: 'payouts', element: <InfluencerPayoutsPage /> },
          {
            path: 'profile',
            element: <ProfilePage role="influencer" />,
          },
        ],
      },
    ],
  },
]);
