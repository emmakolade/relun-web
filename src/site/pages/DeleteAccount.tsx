import { APP_PATH, CONTACT_EMAIL, DELETION_DAYS } from '../config';
import { PageHead } from '../Layout';

/** Google Play requires a public page that explains how to delete an account. */
export function DeleteAccount() {
  return (
    <>
      <PageHead kicker="Account" title="Delete your Relun account">
        You can delete your account yourself at any time, from the app or by email.
      </PageHead>

      <section className="lp-section lp-section-tight">
        <div className="lp-wrap lp-narrow lp-prose">
          <h2>In the app</h2>
          <ol>
            <li>
              Open <a href={APP_PATH}>Relun</a> and sign in.
            </li>
            <li>
              Go to the <b>Me</b> tab, or open <b>Settings</b>.
            </li>
            <li>
              Tap <b>Delete account</b> and confirm.
            </li>
          </ol>

          <h2>By email</h2>
          <p>
            Can’t sign in? Email <a href={`mailto:${CONTACT_EMAIL}?subject=Delete%20my%20account`}>{CONTACT_EMAIL}</a>{' '}
            from the email address on your account, or tell us the phone number you signed up with. We may ask you to
            confirm it’s you before we delete anything.
          </p>

          <h2>What happens</h2>
          <ul>
            <li>
              <b>Straight away:</b> your profile disappears from Relun, your photos are deleted, you are signed out on every
              device, any active date plans are cancelled, and your email or phone number is freed so it can be used again.
            </li>
            <li>
              <b>Within {DELETION_DAYS} days:</b> everything else is permanently erased, including your profile details, your
              likes and matches, and your messages, on both sides of every chat.
            </li>
            <li>
              <b>Kept:</b> records of payments (as tax and accounting laws require) and reports made about
              accounts, so we can keep acting on abuse. These are kept only as long as needed. See our{' '}
              <a href="/privacy/">Privacy Policy</a>.
            </li>
          </ul>
          <p>
            Deleting your account doesn’t cancel a Google Play subscription. Cancel it in Google Play first. Unused coins
            and any remaining Plus time can’t be refunded.
          </p>
        </div>
      </section>
    </>
  );
}
