import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { session } from './data/session';
import { identify, initAnalytics } from './util/analytics';
import { initInstall } from './util/install';
import { initMonitoring, reactErrorHandler, setMonitoringUser } from './util/monitoring';

// Both stay off without their env keys (see .env.example).
initMonitoring();
initAnalytics();
const onSession = (userId: string | null) => {
  setMonitoringUser(userId);
  identify(userId);
};
onSession(session.current.userId);
session.subscribe((s) => onSession(s.userId));

initInstall();

// Reports render errors to Sentry and still logs them, as React does by default.
const onError = reactErrorHandler((error) => console.error(error));

createRoot(document.getElementById('root')!, { onUncaughtError: onError, onCaughtError: onError }).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
