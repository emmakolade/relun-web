import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ToastHost } from './components/Controls';
import { RingsMark } from './components/Visuals';
import { auth } from './data/repositories';
import { useApp } from './data/store';
import { MainFlow } from './navigation/MainFlow';
import { Stack, useBack } from './navigation/Stack';
import { CodeSignInScreen } from './screens/auth/CodeSignInScreen';
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { OnboardingFlow } from './screens/onboarding/OnboardingFlow';
import { segmentColors } from './theme';
import { isStandalone } from './util/install';

// Team-only, so it stays out of the main bundle.
const AdminScreen = lazy(() => import('./screens/admin/AdminScreen').then((m) => ({ default: m.AdminScreen })));

/**
 * The whole app. Auth state picks one of three trees (signed out, onboarding,
 * signed in); the user's segment picks the accent colours for all of them.
 * Port of Android RelunRoot.
 *
 * The app lives under /app/; the public pages at / are src/site. Routes inside
 * stay as they were ("/chat/:userId" is served at /app/chat/:userId).
 */
export function App() {
  return (
    <BrowserRouter basename="/app">
      <Shell />
    </BrowserRouter>
  );
}

function Shell() {
  const authKind = useApp((s) => s.auth.kind);

  useEffect(() => {
    void auth.bootstrap();
  }, []);

  // Signing out in a browser tab goes back to the public home page, as it did
  // when that page lived inside the app. Only a real sign-out: the first load
  // also goes loading -> signedOut. The installed app stays on its Welcome screen.
  const lastKind = useRef(authKind);
  useEffect(() => {
    const was = lastKind.current;
    lastKind.current = authKind;
    if (authKind === 'signedOut' && (was === 'signedIn' || was === 'onboarding') && !isStandalone()) {
      window.location.assign('/');
    }
  }, [authKind]);

  return (
    <div className="app-frame">
      <Root />
      <div id="overlay-root" />
      <ToastHost />
    </div>
  );
}

function Root() {
  const state = useApp((s) => s.auth);
  const segment = useApp((s) => s.segment);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // CSS variables for the few styles that can't take inline colours (sliders).
  useEffect(() => {
    const c = segmentColors(segment);
    const root = document.documentElement.style;
    root.setProperty('--seg-fill', c.fill);
    root.setProperty('--seg-text', c.text);
    root.setProperty('--seg-tint', c.tint);
  }, [segment]);

  // Each tree starts at its own root. A cold start keeps the URL, so a reload stays put.
  const kind = state.kind === 'onboarding' ? `onboarding-${state.start}` : state.kind;
  const lastKind = useRef(kind);
  useEffect(() => {
    if (lastKind.current !== kind) {
      const fromLoading = lastKind.current === 'loading';
      lastKind.current = kind;
      // Signed out keeps it too: a phone may reload a backgrounded tab while
      // someone fetches their sign-in code, and that must land back on /code.
      if (!fromLoading || (kind !== 'signedIn' && kind !== 'signedOut')) navigate('/', { replace: true });
    }
  }, [kind, navigate]);

  switch (state.kind) {
    case 'loading':
      // Rings on white, like the Android splash and the app icon.
      return (
        <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RingsMark width={164} />
        </div>
      );
    case 'signedOut':
      return <SignedOutFlow />;
    case 'onboarding':
      return <OnboardingFlow key={state.start} start={state.start} />;
    case 'signedIn':
      // /app/admin sits outside the tabbed app; the backend decides who sees data.
      if (pathname === '/admin') {
        return (
          <Suspense fallback={null}>
            <AdminScreen onBack={() => navigate('/', { replace: true })} />
          </Suspense>
        );
      }
      return <MainFlow />;
  }
}

function CodeRoute() {
  const { method = 'phone' } = useParams();
  const back = useBack();
  return (
    <CodeSignInScreen
      initialMethod={method === 'email' ? 'email' : 'phone'}
      onBack={back}
    />
  );
}

function SignedOutFlow() {
  const navigate = useNavigate();
  return (
    <Stack
      base={
        <WelcomeScreen
          onPhone={() => navigate('/code/phone')}
          onEmail={() => navigate('/code/email')}
        />
      }
      routes={[{ path: '/code/:method', element: <CodeRoute /> }]}
    />
  );
}