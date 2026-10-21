import { useEffect, useState, type ReactNode } from 'react';
import { RingsMark } from '../../components/Brand';
import { Pacifico, RelunColors, SegmentColorSets } from '../../theme';
import { isIos, promptInstall, useInstallMode, type InstallMode } from '../../util/install';
import { APP_PATH, PRICES, naira } from '../config';
import { SiteIcon, type SiteIconName } from '../SiteIcon';
import { Waitlist } from '../Waitlist';
import { FAQS } from './Faq';

/**
 * relun.chat: what Relun is, that the native apps are coming, a one-tap
 * install of the web app and the launch waitlist. The app itself is at /app/.
 */
export function Home() {
  const mode = useInstallMode();
  const [sheet, setSheet] = useState(false);

  const install = () => {
    if (mode === 'prompt') void promptInstall();
    else if (mode !== 'installed') setSheet(true);
  };

  return (
    <>
      <section className="lp-hero">
        <div className="lp-wrap lp-hero-inner">
          <div className="lp-hero-copy">
            <span className="lp-chip">
              <SiteIcon name="smartphone" size={16} />
              Works in your phone's browser today
            </span>
            <h1>Find your match, your way.</h1>
            <p>
              Relun connects you with people nearby who want the same thing you do, whether that's something serious or
              just a bit of fun.
            </p>
            <div className="lp-actions">
              <InstallButton mode={mode} onClick={install} variant="light" />
              <a href={APP_PATH} className="lp-btn lp-btn-ghost press">
                Continue on web
              </a>
            </div>
            <p className="lp-fine">Free to join · Android and iPhone · No app store needed</p>
          </div>
          <PhoneMock />
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-wrap">
          <h2>Two ways to Relun</h2>
          <p className="lp-lead">Pick what you're here for. You'll only meet people who picked the same.</p>
          <div className="lp-grid lp-grid-2">
            {(['relationship', 'fun'] as const).map((seg) => {
              const c = SegmentColorSets[seg];
              return (
                <div key={seg} className="lp-card" style={{ background: c.tint, borderColor: c.wash }}>
                  <div className="lp-icon" style={{ background: c.fill }}>
                    <SiteIcon name={c.icon as SiteIconName} size={26} color={c.onFill} />
                  </div>
                  <h3>{c.label}</h3>
                  <p>{c.description}.</p>
                  <span className="lp-pill" style={{ color: c.text }}>
                    {c.pill}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp-section lp-soft">
        <div className="lp-wrap">
          <h2>How it works</h2>
          <ol className="lp-grid lp-grid-4 lp-steps">
            <Step n={1} icon="person" title="Make your profile">
              Add a few photos and the basics. It takes a couple of minutes.
            </Step>
            <Step n={2} icon="near_me" title="Discover people nearby">
              Browse people close to you. Set the distance and age range you want.
            </Step>
            <Step n={3} icon="favorite" title="Match when it's mutual">
              Like someone, and if they like you back, it's a match.
            </Step>
            <Step n={4} icon="chat_bubble" title="Chat and meet up">
              Chat with your matches for free, or post a date plan and let people ask to join.
            </Step>
          </ol>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-wrap">
          <h2>Made for real connections</h2>
          <div className="lp-grid lp-grid-2 lp-features">
            <Feature icon="lock" title="You choose who can message you">
              Matches chat for free. Anyone else has to send a message request, and you can turn those off any time.
            </Feature>
            <Feature icon="event" title="Date plans">
              Post a plan, say dinner on Friday, and pick from the people who ask to join.
            </Feature>
            <Feature icon="workspace_premium" title="Relun Plus">
              Unlimited likes, see who likes you, and free message requests. From {naira(PRICES.plusWeekly)} a week.{' '}
              <a href="/pricing/">See pricing</a>.
            </Feature>
            <Feature icon="shield" title="You're in control">
              Block or report anyone, any time, right from their profile. <a href="/safety/">Our safety tips</a>.
            </Feature>
          </div>
        </div>
      </section>

      <section className="lp-section lp-soft">
        <div className="lp-wrap">
          <h2>Questions people ask</h2>
          <div className="lp-faq">
            {FAQS.slice(0, 4).map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <SiteIcon name="expand_more" size={22} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="lp-more">
            <a href="/faq/">
              All questions <SiteIcon name="arrow_forward" size={18} />
            </a>
          </p>
        </div>
      </section>

      <section className="lp-section" id="app">
        <div className="lp-wrap">
          <div className="lp-soon">
            <div className="lp-soon-copy">
              <span className="lp-chip lp-chip-dark">
                <SiteIcon name="rocket_launch" size={16} />
                Coming soon
              </span>
              <h2>The Relun app is on its way</h2>
              <p>
                Native apps for Android and iPhone are in the works. You don't have to wait: add Relun to your home
                screen now and it opens full-screen, just like an app.
              </p>
              <div className="lp-actions">
                <InstallButton mode={mode} onClick={install} variant="dark" />
                <a href={APP_PATH} className="lp-btn lp-btn-outline press">
                  Continue on web
                </a>
              </div>
              <Waitlist source="/" />
            </div>
            <div className="lp-soon-art" aria-hidden>
              <div className="lp-homeicon">
                <RingsMark width={58} />
              </div>
              <span>Relun</span>
            </div>
          </div>
        </div>
      </section>

      {sheet && <InstallSheet mode={mode} onDismiss={() => setSheet(false)} />}
    </>
  );
}

function InstallButton({ mode, onClick, variant }: { mode: InstallMode; onClick: () => void; variant: 'light' | 'dark' }) {
  const done = mode === 'installed';
  return (
    <button type="button" className={`lp-btn lp-btn-${variant} press`} onClick={onClick} aria-disabled={done}>
      <SiteIcon name={done ? 'check_circle' : 'install_mobile'} size={20} />
      {done ? 'Installed on this device' : 'Install the web app'}
    </button>
  );
}

function Step({ n, icon, title, children }: { n: number; icon: SiteIconName; title: string; children: ReactNode }) {
  return (
    <li className="lp-step">
      <div className="lp-step-head">
        <span className="lp-step-n">{n}</span>
        <SiteIcon name={icon} size={22} outline />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </li>
  );
}

function Feature({ icon, title, children }: { icon: SiteIconName; title: string; children: ReactNode }) {
  return (
    <div className="lp-feature">
      <div className="lp-feature-icon">
        <SiteIcon name={icon} size={24} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

function CoinIcon({ size }: { size: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle, ${RelunColors.CoinLight} 0%, ${RelunColors.Coin} 55%, ${RelunColors.CoinDark} 100%)`,
        border: `1px solid ${RelunColors.CoinRim}`,
      }}
    >
      <SiteIcon name="star" size={size * 0.48} color={RelunColors.CoinText} />
    </span>
  );
}

/** A Discover card in a phone outline, drawn in CSS so it needs no screenshots. */
function PhoneMock() {
  const rose = SegmentColorSets.relationship;
  return (
    <div className="lp-phone" aria-hidden>
      <div className="lp-phone-screen">
        <div className="lp-phone-top">
          <span style={{ fontFamily: Pacifico }}>relun</span>
          <span className="lp-phone-coins">
            <CoinIcon size={16} />
            300
          </span>
        </div>
        <div className="lp-phone-card">
          <div className="lp-phone-photo">
            <SiteIcon name="person" size={120} color="rgba(255,255,255,0.55)" />
          </div>
          <div className="lp-phone-info">
            <span className="lp-phone-pill" style={{ background: rose.tint, color: rose.text }}>
              <SiteIcon name="favorite" size={13} />
              {rose.pill}
            </span>
            <strong>Tola, 27</strong>
            <span>
              <SiteIcon name="location_on" size={14} />
              3 km away
            </span>
          </div>
        </div>
        <div className="lp-phone-buttons">
          <span className="lp-round">
            <SiteIcon name="close" size={26} />
          </span>
          <span className="lp-round lp-round-like">
            <SiteIcon name="favorite" size={28} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** Steps for browsers that can't install from a button: iOS, or Android/desktop without the prompt. */
function InstallSheet({ mode, onDismiss }: { mode: InstallMode; onDismiss: () => void }) {
  const [closing, setClosing] = useState(false);
  const close = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(onDismiss, 200);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  // The server snapshot is 'manual', so check iOS directly once the sheet is open.
  const ios = mode === 'ios' || isIos();
  const mobile = ios || /Android|Mobi/i.test(navigator.userAgent);
  let title: string;
  let steps: { icon: SiteIconName; text: ReactNode }[];
  let note: string | null = null;

  if (ios) {
    title = 'Add Relun to your Home Screen';
    steps = [
      { icon: 'ios_share', text: <>Tap the <b>Share</b> button in your browser's toolbar.</> },
      { icon: 'add_box', text: <>Scroll down and tap <b>Add to Home Screen</b>.</> },
      { icon: 'check_circle', text: <>Tap <b>Add</b>. Relun appears on your Home Screen.</> },
    ];
    note = 'On older iPhones this only works in Safari.';
  } else if (mobile) {
    title = 'Install Relun';
    steps = [
      { icon: 'more_vert', text: <>Open your browser's menu (<b>⋮</b>).</> },
      { icon: 'install_mobile', text: <>Tap <b>Install app</b> or <b>Add to Home screen</b>.</> },
      { icon: 'check_circle', text: <>Confirm. Relun appears with your other apps.</> },
    ];
    note = 'Chrome, Edge and Samsung Internet all support this.';
  } else {
    title = 'Install Relun on your phone';
    steps = [
      { icon: 'smartphone', text: <>Open <b>{window.location.host}</b> in your phone's browser.</> },
      { icon: 'install_mobile', text: <>Tap <b>Install the web app</b> on this page.</> },
    ];
    note = "On a computer, look for the install icon in your browser's address bar.";
  }

  return (
    <div className="lp-sheet-root">
      <div className={`lp-scrim ${closing ? 'out' : ''}`} onClick={close} />
      <div role="dialog" aria-modal="true" aria-label={title} className={`lp-sheet ${closing ? 'out' : ''}`}>
        <div className="lp-sheet-grip" />
        <div className="lp-sheet-icon">
          <RingsMark width={44} />
        </div>
        <h3>{title}</h3>
        <ol className="lp-sheet-steps">
          {steps.map((s, i) => (
            <li key={i}>
              <span className="lp-sheet-step-icon">
                <SiteIcon name={s.icon} size={22} />
              </span>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
        {note && <p className="lp-sheet-note">{note}</p>}
        <button type="button" className="lp-btn lp-btn-dark press" onClick={close} style={{ width: '100%' }}>
          Got it
        </button>
      </div>
    </div>
  );
}
