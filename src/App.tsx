import { RouterProvider } from 'react-router';
import { CampaignFlowProvider } from './context/CampaignFlowContext';
import { InfluencerWorkProvider } from './context/InfluencerWorkContext';
import { router } from './routes';

export default function App() {
  return (
    <CampaignFlowProvider>
      <InfluencerWorkProvider>
        <RouterProvider router={router} />
      </InfluencerWorkProvider>
    </CampaignFlowProvider>
  );
}
