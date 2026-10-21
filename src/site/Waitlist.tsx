import { useState, type FormEvent } from 'react';
import { apiUrl } from './config';
import { SiteIcon } from './SiteIcon';

type Platform = 'android' | 'ios';
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done' } | { kind: 'error'; message: string };

/** "Email me when the app launches": posts to relun-backend /api/waitlist. */
export function Waitlist({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.kind === 'sending') return;
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(apiUrl('api/waitlist'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), platform: platform ?? undefined, source }),
      });
      if (res.ok) {
        setStatus({ kind: 'done' });
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus({ kind: 'error', message: body?.error ?? 'Something went wrong. Try again.' });
    } catch {
      setStatus({ kind: 'error', message: "Couldn't reach Relun. Check your connection and try again." });
    }
  };

  if (status.kind === 'done') {
    return (
      <div className="lp-waitlist lp-waitlist-done" role="status">
        <SiteIcon name="check_circle" size={24} />
        <span>
          <b>You're on the list.</b> We'll email you once when the app is ready.
        </span>
      </div>
    );
  }

  return (
    <form className="lp-waitlist" onSubmit={submit}>
      <label htmlFor="waitlist-email" className="lp-waitlist-label">
        Get an email when the Android and iPhone apps launch
      </label>
      <div className="lp-waitlist-row">
        <input
          id="waitlist-email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="lp-btn lp-btn-rose press" disabled={status.kind === 'sending'}>
          <SiteIcon name="mail" size={20} />
          {status.kind === 'sending' ? 'Adding…' : 'Notify me'}
        </button>
      </div>
      <fieldset className="lp-waitlist-platforms">
        <legend>My phone is (optional)</legend>
        {(
          [
            ['android', 'Android', 'android'],
            ['ios', 'iPhone', 'phone_iphone'],
          ] as const
        ).map(([value, label, icon]) => (
          <button
            key={value}
            type="button"
            className="lp-toggle press"
            aria-pressed={platform === value}
            onClick={() => setPlatform(platform === value ? null : value)}
          >
            <SiteIcon name={icon} size={18} />
            {label}
          </button>
        ))}
      </fieldset>
      {status.kind === 'error' && (
        <p className="lp-waitlist-error" role="alert">
          {status.message}
        </p>
      )}
      <p className="lp-waitlist-fine">
        One email at launch, nothing else. See our <a href="/privacy/">Privacy Policy</a>.
      </p>
    </form>
  );
}
