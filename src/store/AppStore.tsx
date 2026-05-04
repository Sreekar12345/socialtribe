import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { clearStorage, loadStorage, saveStorage } from '../utils/storage';
import type {
  AppState,
  BrandProfile,
  InfluencerMetrics,
  InfluencerProfile,
  Role,
} from './types';

const STORAGE_KEY = 'socialtribe.frontend.state.v1';

const defaultState: AppState = {
  user: {
    role: null,
    email: '',
    isAuthenticated: false,
  },
  brandProfile: null,
  influencerProfile: null,
  verification: {
    status: 'idle',
    error: null,
    result: null,
  },
};

type Action =
  | { type: 'AUTHENTICATE'; payload: { email: string } }
  | { type: 'SET_ROLE'; payload: { role: Role } }
  | { type: 'SAVE_BRAND_PROFILE'; payload: BrandProfile & { email: string } }
  | { type: 'SAVE_INFLUENCER_PROFILE'; payload: InfluencerProfile & { password: string } }
  | { type: 'START_VERIFICATION' }
  | { type: 'FAIL_VERIFICATION'; payload: { error: string } }
  | { type: 'MARK_VERIFICATION_PASSED' }
  | { type: 'START_PROCESSING' }
  | { type: 'COMPLETE_PROCESSING'; payload: { result: InfluencerMetrics } }
  | { type: 'RESET_VERIFICATION' }
  | { type: 'SIGN_OUT' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'AUTHENTICATE':
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload.email,
          isAuthenticated: true,
        },
      };

    case 'SET_ROLE':
      return {
        ...state,
        user: {
          ...state.user,
          role: action.payload.role,
        },
        brandProfile: action.payload.role === 'brand' ? state.brandProfile : null,
        influencerProfile:
          action.payload.role === 'influencer' ? state.influencerProfile : null,
        verification:
          action.payload.role === 'influencer'
            ? state.verification
            : defaultState.verification,
      };

    case 'SAVE_BRAND_PROFILE':
      return {
        ...state,
        user: {
          role: 'brand',
          email: action.payload.email,
          isAuthenticated: true,
        },
        brandProfile: {
          brandName: action.payload.brandName,
          industry: action.payload.industry,
          websiteUrl: action.payload.websiteUrl,
        },
        influencerProfile: null,
        verification: defaultState.verification,
      };

    case 'SAVE_INFLUENCER_PROFILE':
      return {
        ...state,
        user: {
          role: 'influencer',
          email: action.payload.email,
          isAuthenticated: true,
        },
        influencerProfile: {
          instagramHandle: action.payload.instagramHandle,
          category: action.payload.category,
          email: action.payload.email,
        },
        brandProfile: null,
        verification: defaultState.verification,
      };

    case 'START_VERIFICATION':
      return {
        ...state,
        verification: {
          ...state.verification,
          status: 'verifying',
          error: null,
          result: null,
        },
      };

    case 'FAIL_VERIFICATION':
      return {
        ...state,
        verification: {
          status: 'failed',
          error: action.payload.error,
          result: null,
        },
      };

    case 'MARK_VERIFICATION_PASSED':
      return {
        ...state,
        verification: {
          ...state.verification,
          status: 'verified',
          error: null,
        },
      };

    case 'START_PROCESSING':
      return {
        ...state,
        verification: {
          ...state.verification,
          status: 'processing',
          error: null,
        },
      };

    case 'COMPLETE_PROCESSING':
      return {
        ...state,
        verification: {
          status: 'completed',
          error: null,
          result: action.payload.result,
        },
      };

    case 'RESET_VERIFICATION':
      return {
        ...state,
        verification: defaultState.verification,
      };

    case 'SIGN_OUT':
      return defaultState;

    default:
      return state;
  }
}

interface AppStoreValue extends AppState {
  authenticate: (email: string) => void;
  setRole: (role: Role) => void;
  saveBrandProfile: (payload: BrandProfile & { email: string }) => void;
  saveInfluencerProfile: (
    payload: InfluencerProfile & { password: string },
  ) => void;
  startVerification: () => void;
  failVerification: (error: string) => void;
  markVerificationPassed: () => void;
  startProcessing: () => void;
  completeProcessing: (result: InfluencerMetrics) => void;
  resetVerification: () => void;
  signOut: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    loadStorage<AppState>(STORAGE_KEY) ?? defaultState,
  );

  useEffect(() => {
    saveStorage(STORAGE_KEY, state);
  }, [state]);

  const value = useMemo<AppStoreValue>(
    () => ({
      ...state,
      authenticate: (email) => dispatch({ type: 'AUTHENTICATE', payload: { email } }),
      setRole: (role) => dispatch({ type: 'SET_ROLE', payload: { role } }),
      saveBrandProfile: (payload) =>
        dispatch({ type: 'SAVE_BRAND_PROFILE', payload }),
      saveInfluencerProfile: (payload) =>
        dispatch({ type: 'SAVE_INFLUENCER_PROFILE', payload }),
      startVerification: () => dispatch({ type: 'START_VERIFICATION' }),
      failVerification: (error) =>
        dispatch({ type: 'FAIL_VERIFICATION', payload: { error } }),
      markVerificationPassed: () => dispatch({ type: 'MARK_VERIFICATION_PASSED' }),
      startProcessing: () => dispatch({ type: 'START_PROCESSING' }),
      completeProcessing: (result) =>
        dispatch({ type: 'COMPLETE_PROCESSING', payload: { result } }),
      resetVerification: () => dispatch({ type: 'RESET_VERIFICATION' }),
      signOut: () => {
        clearStorage(STORAGE_KEY);
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    [state],
  );

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }

  return context;
}
