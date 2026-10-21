import { COMPANY, CONTACT_EMAIL } from '../config';
import { LegalPage } from './Legal';

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={
        <>
          These terms are an agreement between you and {COMPANY} (“Relun”, “we”, “us”) for your use of the Relun website,
          web app and mobile apps (together, “Relun”). By creating an account or using Relun you agree to them. If you don’t
          agree, please don’t use Relun.
        </>
      }
    >
      <h2>1. Who can use Relun</h2>
      <p>To use Relun you must:</p>
      <ul>
        <li>be at least 18 years old;</li>
        <li>be legally able to enter into this agreement;</li>
        <li>not have been convicted of a sexual offence or any violent crime;</li>
        <li>not have been banned from Relun before; and</li>
        <li>have only one account.</li>
      </ul>

      <h2>2. Your account</h2>
      <ul>
        <li>Give accurate information about yourself, and use photos that are of you.</li>
        <li>
          Keep your sign-in codes private. You’re responsible for what happens on your account. Tell us at {mail} if you
          think someone else has accessed it.
        </li>
      </ul>

      <h2>3. Community rules</h2>
      <p>When you use Relun you must not:</p>
      <ul>
        <li>harass, threaten, bully, stalk or intimidate anyone;</li>
        <li>post hate speech, or content that is violent, sexually explicit, or involves minors in any way;</li>
        <li>pretend to be someone else, or create a fake or misleading profile;</li>
        <li>
          ask anyone for money, gifts, airtime or financial details, or run any scam, investment pitch or “business
          opportunity”;
        </li>
        <li>advertise or sell anything, or offer or request paid sexual services;</li>
        <li>share someone else’s private information or intimate images without their consent;</li>
        <li>send spam, or use bots, scrapers or automated tools to access Relun;</li>
        <li>break any law, or help anyone else break these rules.</li>
      </ul>
      <p>
        We may remove content, limit features or suspend or delete accounts that break these rules, and we may report
        illegal activity to the authorities.
      </p>

      <h2>4. Your content</h2>
      <p>
        You own the photos, text and messages you add to Relun. You give us a non-exclusive, royalty-free, worldwide licence
        to host, store, display and process that content only so we can run and improve Relun and keep it safe. The licence
        ends when your content is deleted, except where we need to keep it as described in our{' '}
        <a href="/privacy/">Privacy Policy</a>. You confirm you have the right to share everything you upload.
      </p>

      <h2>5. Meeting people safely</h2>
      <p>
        Relun helps you meet people, but we can’t control how other members behave, and we don’t run criminal background or
        identity checks on everyone. You are responsible for your interactions with other members, online and offline.
        Please read our <a href="/safety/">dating safety tips</a>, meet in public, and report anyone who makes you
        uncomfortable.
      </p>

      <h2>6. Relun Plus and coins</h2>
      <h3>Relun Plus</h3>
      <ul>
        <li>
          Relun Plus is sold by the week or by the month. Prices are shown before you pay and on our{' '}
          <a href="/pricing/">pricing page</a>.
        </li>
        <li>
          <b>Subscriptions renew automatically</b> at the end of each period and are charged to the same card until you
          cancel. On the web, payments are processed by Paystack; on Android, by Google Play under Google’s terms. A one-time
          pass paid by transfer or USSD doesn’t renew.
        </li>
        <li>
          You can cancel at any time: on the web, open Relun Plus in the app and tap Turn off auto-renew; on Android, cancel
          in Google Play. Cancelling stops the next renewal. You keep Plus until the end of the period you’ve paid for.
        </li>
        <li>
          Payments aren’t refunded for partly used periods, except where the law requires it or where Google Play’s refund
          rules apply to Play purchases.
        </li>
        <li>If we change the price, we’ll tell you before it applies to your next renewal.</li>
      </ul>
      <h3>Coins</h3>
      <ul>
        <li>
          Coins are a virtual item for use on Relun only, for example to send a message request. They have no cash value,
          can’t be exchanged for money and can’t be transferred to another account.
        </li>
        <li>
          Coins aren’t refundable once bought, except where the law requires it. Coins spent on a message request aren’t
          returned if the other person declines or doesn’t reply.
        </li>
        <li>Unused coins are lost when your account is deleted or closed for breaking these terms.</li>
      </ul>

      <h2>7. Ending your account</h2>
      <p>
        You can delete your account at any time (see <a href="/delete-account/">Delete your account</a>). We may suspend or
        end your account if you break these terms, if we’re required to by law, or to protect other members. If we end your
        account for breaking these terms, you won’t get a refund for Plus or coins.
      </p>

      <h2>8. Our service</h2>
      <p>
        We work hard to keep Relun running well, but we provide it “as is” and can’t promise it will always be available,
        error-free or that you’ll find a match. We may change, add or remove features. Nothing in these terms limits rights
        you have under Nigerian consumer protection law, including the Federal Competition and Consumer Protection Act 2018,
        that can’t be limited by contract.
      </p>

      <h2>9. Limit of liability</h2>
      <p>
        To the extent the law allows, Relun isn’t liable for indirect or consequential losses, or for the conduct of any
        member on or off Relun. Our total liability to you for any claim is limited to the amount you paid us in the 12
        months before the claim, or ₦10,000 if you paid nothing. We don’t exclude liability for death or personal injury
        caused by our negligence, for fraud, or for anything else the law doesn’t allow us to exclude.
      </p>

      <h2>10. Governing law and disputes</h2>
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria. If you have a problem, please email us first
        at {mail} and we’ll try to resolve it. If we can’t, disputes will be handled by the courts of Lagos State, Nigeria.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms. If a change is important, we’ll tell you in the app or by email before it applies. If you
        keep using Relun after a change takes effect, the new terms apply.
      </p>

      <h2>12. Contact</h2>
      <p>
        {COMPANY}, {mail}.
      </p>
    </LegalPage>
  );
}
