import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CampaignProvider } from './context/CampaignContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { MobileFrame } from './components/MobileFrame';

export default function App() {
  return (
    <div className="size-full dark">
      <AuthProvider>
        <CampaignProvider>
          <ChatProvider>
            <MobileFrame>
              <RouterProvider router={router} />
            </MobileFrame>
          </ChatProvider>
        </CampaignProvider>
      </AuthProvider>
    </div>
  );
}
