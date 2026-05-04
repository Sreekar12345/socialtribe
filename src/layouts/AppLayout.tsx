import { AnimatePresence, motion } from 'motion/react';
import { Outlet, useLocation } from 'react-router';
import { cn } from '../utils/cn';

export function AppLayout() {
  const location = useLocation();
  const isSectionRoute =
    location.pathname.startsWith('/brand/') ||
    location.pathname.startsWith('/influencer/');

  return (
    <div className="min-h-screen bg-[#f6efdf] text-neutral-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#dceeb1]/60 blur-3xl" />
        <div className="absolute right-[-4rem] top-32 h-56 w-56 rounded-full bg-[#c5b0f4]/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-white/60 blur-3xl" />
      </div>

      <main
        className={cn(
          'relative mx-auto max-w-[420px]',
          isSectionRoute
            ? 'min-h-screen'
            : 'flex min-h-screen flex-col px-4 py-5',
        )}
      >
        {!isSectionRoute ? (
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-neutral-700 backdrop-blur">
              SocialTribe
            </span>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={cn(
              isSectionRoute
                ? 'min-h-screen'
                : 'flex min-h-[calc(100vh-4.5rem)] flex-col',
            )}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
