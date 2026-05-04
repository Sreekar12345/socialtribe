import { createBrowserRouter, Navigate } from 'react-router';
import { BrandFlowGate, BrandShell, InfluencerFlowGate, InfluencerShell, RootRedirect } from './components/ProductShells';
import { RoleSelect } from './pages/auth/RoleSelect';
import { AuthMethod } from './pages/auth/AuthMethod';
import { EmailAuth } from './pages/auth/EmailAuth';
import { PhoneAuth } from './pages/auth/PhoneAuth';
import { OtpVerify } from './pages/auth/OtpVerify';
import { BrandSetupPage } from './pages/brand/BrandSetupPage';
import { BrandBudgetPage } from './pages/brand/BrandBudgetPage';
import { BrandCampaignBuilderPage } from './pages/brand/BrandCampaignBuilderPage';
import { BrandMatchPage } from './pages/brand/BrandMatchPage';
import { BrandManualSelectionPage } from './pages/brand/BrandManualSelectionPage';
import { BrandReviewPage } from './pages/brand/BrandReviewPage';
import { BrandCheckoutPage } from './pages/brand/BrandCheckoutPage';
import { BrandWaitPage } from './pages/brand/BrandWaitPage';
import { BrandHomePage } from './pages/brand/BrandHomePage';
import { BrandCampaignsPage } from './pages/brand/BrandCampaignsPage';
import { BrandCampaignDetailPage } from './pages/brand/BrandCampaignDetailPage';
import { BrandProfilePage } from './pages/brand/BrandProfilePage';
import { InfluencerSetupPage } from './pages/influencer/InfluencerSetupPage';
import { InfluencerVerificationPage } from './pages/influencer/InfluencerVerificationPage';
import { InfluencerProcessingPage } from './pages/influencer/InfluencerProcessingPage';
import { InfluencerHomePage } from './pages/influencer/InfluencerHomePage';
import { InfluencerOffersPage } from './pages/influencer/InfluencerOffersPage';
import { InfluencerCampaignDetailPage } from './pages/influencer/InfluencerCampaignDetailPage';
import { InfluencerExecutionPage } from './pages/influencer/InfluencerExecutionPage';
import { InfluencerPaymentStatusPage } from './pages/influencer/InfluencerPaymentStatusPage';
import { InfluencerProfilePage } from './pages/influencer/InfluencerProfilePage';
import { ChatListPage } from './pages/shared/ChatListPage';
import { ChatThreadPage } from './pages/shared/ChatThreadPage';

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },

  { path: '/auth/role', element: <RoleSelect /> },
  { path: '/auth', element: <AuthMethod /> },
  { path: '/auth/email', element: <EmailAuth /> },
  { path: '/auth/phone', element: <PhoneAuth /> },
  { path: '/auth/otp', element: <OtpVerify /> },

  { path: '/brand/setup', element: <BrandFlowGate><BrandSetupPage /></BrandFlowGate> },
  { path: '/brand/budget', element: <BrandFlowGate><BrandBudgetPage /></BrandFlowGate> },
  { path: '/brand/campaign', element: <BrandFlowGate><BrandCampaignBuilderPage /></BrandFlowGate> },
  { path: '/brand/match', element: <BrandFlowGate><BrandMatchPage /></BrandFlowGate> },
  { path: '/brand/select', element: <BrandFlowGate><BrandManualSelectionPage /></BrandFlowGate> },
  { path: '/brand/review', element: <BrandFlowGate><BrandReviewPage /></BrandFlowGate> },
  { path: '/brand/checkout', element: <BrandFlowGate><BrandCheckoutPage /></BrandFlowGate> },
  { path: '/brand/wait/:id', element: <BrandFlowGate><BrandWaitPage /></BrandFlowGate> },

  {
    path: '/brand',
    element: <BrandShell />,
    children: [
      { index: true, element: <Navigate to="/brand/home" replace /> },
      { path: 'home', element: <BrandHomePage /> },
      { path: 'campaigns', element: <BrandCampaignsPage /> },
      { path: 'campaigns/:id', element: <BrandCampaignDetailPage /> },
      { path: 'chat', element: <ChatListPage /> },
      { path: 'chat/:id', element: <ChatThreadPage /> },
      { path: 'profile', element: <BrandProfilePage /> },
    ],
  },

  { path: '/influencer/setup', element: <InfluencerFlowGate><InfluencerSetupPage /></InfluencerFlowGate> },
  { path: '/influencer/verify', element: <InfluencerFlowGate><InfluencerVerificationPage /></InfluencerFlowGate> },
  { path: '/influencer/processing', element: <InfluencerFlowGate><InfluencerProcessingPage /></InfluencerFlowGate> },
  { path: '/influencer/execute/:id', element: <InfluencerFlowGate><InfluencerExecutionPage /></InfluencerFlowGate> },
  { path: '/influencer/payment/:id', element: <InfluencerFlowGate><InfluencerPaymentStatusPage /></InfluencerFlowGate> },

  {
    path: '/influencer',
    element: <InfluencerShell />,
    children: [
      { index: true, element: <Navigate to="/influencer/home" replace /> },
      { path: 'home', element: <InfluencerHomePage /> },
      { path: 'offers', element: <InfluencerOffersPage /> },
      { path: 'campaign/:id', element: <InfluencerCampaignDetailPage /> },
      { path: 'chat', element: <ChatListPage /> },
      { path: 'chat/:id', element: <ChatThreadPage /> },
      { path: 'profile', element: <InfluencerProfilePage /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
