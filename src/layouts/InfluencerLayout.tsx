import { Outlet, useLocation, useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export function InfluencerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== '/influencer/dashboard';

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4">
        {showBackButton ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
          >
            {'\u2190 Back'}
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <Outlet />
      </div>

      <BottomNav role="influencer" />
    </div>
  );
}
