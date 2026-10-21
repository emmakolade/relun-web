import { COMPANY, CONTACT_EMAIL, DELETION_DAYS } from '../config';
import { LegalPage } from './Legal';

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <>
          This policy explains what personal data Relun collects, why, who we share it with and the rights you have. It
          applies to the Relun website at relun.chat, the Relun web app and our Android and iPhone apps. We process personal
          data in line with the Nigeria Data Protection Act 2023 (NDPA) and the rules of the Nigeria Data Protection
          Commission (NDPC).
        </>
      }
    >
      <h2>1. Who we are</h2>
      <p>
        {COMPANY} (“Relun”, “we”, “us”) is the data controller for your personal data. You can reach us,
        including our data protection contact, at {mail}.
      </p>

      <h2>2. What we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <b>Account details:</b> your email address or phone number, name, date of birth and gender.
        </li>
        <li>
          <b>Profile:</b> photos, bio, occupation, education, height, interests, and whether you’re on Relun for a
          relationship or for fun. Some optional fields, like religion, ethnicity, political views, drinking and smoking, can
          reveal sensitive information. Filling them in is up to you, and they appear on your profile when you do.
        </li>
        <li>
          <b>Preferences and settings:</b> the age range and distance you want to see, and your privacy and notification
          choices.
        </li>
        <li>
          <b>Messages and activity:</b> the messages and message requests you send and receive, likes, passes, matches,
          profile views, date plans and requests to join them, blocks and reports.
        </li>
        <li>
          <b>Waitlist:</b> if you ask to be told when our apps launch, your email address and the type of phone you chose.
        </li>
        <li>
          <b>Support:</b> anything you send us when you email us.
        </li>
      </ul>
      <h3>Information we collect automatically</h3>
      <ul>
        <li>
          <b>Location:</b> with your permission, your device’s location, which we use to show you people nearby and to show
          others how far away you are. You can enter a city instead. We never show your exact location to other members.
        </li>
        <li>
          <b>Device and technical data:</b> your IP address, browser or device type, app version, push notification tokens
          and server logs of requests to our service.
        </li>
        <li>
          <b>On your device:</b> the web app keeps your sign-in session and a few settings in your browser’s local storage.
          We don’t use advertising cookies or third-party trackers.
        </li>
      </ul>
      <h3>Payments</h3>
      <p>
        Payments on the web (card, bank transfer or USSD) are handled by Paystack, and in-app purchases on Android by Google
        Play. We never see or store your card details. We receive a record of each payment (amount, date, reference) and,
        for subscriptions, the Paystack or Google Play identifiers we need to renew or cancel them.
      </p>

      <h2>3. How we use it, and our legal basis</h2>
      <ul>
        <li>
          <b>To provide Relun (performance of our contract with you):</b> creating your account, showing your profile to
          people who match your settings, suggesting people nearby, delivering messages and notifications, and running
          Relun Plus and coins.
        </li>
        <li>
          <b>With your consent:</b> using your device location, sending push notifications, the optional profile fields
          listed above, and the launch waitlist email. You can withdraw consent at any time in your device or app settings,
          or by emailing us.
        </li>
        <li>
          <b>For safety and to protect our members (legitimate interests):</b> reviewing reports, detecting fake accounts,
          scams and abuse, and enforcing our Terms. Where we review messages, it is because they were reported or flagged as
          possible abuse.
        </li>
        <li>
          <b>To improve Relun (legitimate interests):</b> understanding how features are used and fixing problems.
        </li>
        <li>
          <b>To meet legal obligations:</b> keeping financial records and responding to lawful requests from authorities.
        </li>
      </ul>
      <p>We don’t sell your personal data and we don’t use it for third-party advertising.</p>

      <h2>4. Who can see your information</h2>
      <ul>
        <li>
          <b>Other members</b> who see your profile: your name, age (unless you hide it), photos, profile details, how far
          away you are (unless you hide it) and whether you’re on Relun for a relationship or for fun. Only the people you
          chat with see your messages.
        </li>
        <li>
          <b>Service providers</b> who run parts of Relun for us under contracts that require them to protect your data:
          cloud hosting and database providers (including Amazon Web Services and MongoDB), Cloudinary (photo storage),
          Paystack and Google Play (payments), Google Firebase (push notifications), Zoho ZeptoMail (email) and our SMS
          provider (sign-in codes).
        </li>
        <li>
          <b>Authorities</b>, when the law requires it, or when we believe in good faith that sharing is needed to prevent
          serious harm or investigate fraud or a crime.
        </li>
        <li>
          <b>A new owner</b>, if Relun is ever merged or sold, who would have to keep honouring this policy.
        </li>
      </ul>

      <h2>5. International transfers</h2>
      <p>
        Some of our service providers store or process data outside Nigeria. When that happens we rely on the transfer
        grounds the NDPA allows, such as adequate protection in the receiving country or contractual safeguards with the
        provider.
      </p>

      <h2>6. How long we keep it</h2>
      <ul>
        <li>
          <b>While your account is open,</b> we keep your information so we can provide Relun.
        </li>
        <li>
          <b>When you delete your account,</b> your profile disappears and your photos are deleted straight away. Within{' '}
          {DELETION_DAYS} days everything else is permanently erased, including your profile details, likes, matches, and
          your messages on both sides of every chat.
        </li>
        <li>
          <b>Payment records</b> are kept for as long as tax and accounting laws require, usually six years.
        </li>
        <li>
          <b>Reports</b> made about an account are kept so we can keep protecting members, even after that account is
          deleted.
        </li>
        <li>
          <b>Notifications</b> in your activity feed are deleted automatically after 60 days.
        </li>
        <li>
          <b>Waitlist emails</b> are kept until we’ve sent the launch email or you ask us to remove you.
        </li>
      </ul>

      <h2>7. Your rights</h2>
      <p>Under the NDPA you have the right to:</p>
      <ul>
        <li>be told how your data is used (this policy);</li>
        <li>get a copy of your personal data;</li>
        <li>correct data that is wrong or incomplete (most of it you can edit in the app);</li>
        <li>have your data deleted (see <a href="/delete-account/">Delete your account</a>);</li>
        <li>restrict or object to certain processing, including processing based on legitimate interests;</li>
        <li>receive your data in a portable format;</li>
        <li>withdraw your consent at any time, without affecting processing that happened before; and</li>
        <li>
          complain to the Nigeria Data Protection Commission (ndpc.gov.ng) if you think we’ve mishandled your data.
        </li>
      </ul>
      <p>
        To use any of these rights, email {mail}. We may need to confirm it’s you first, and we’ll reply within 30 days.
      </p>

      <h2>8. Security</h2>
      <p>
        We protect your data with encryption in transit (HTTPS), access controls and sign-in by one-time code. No system is
        perfectly secure, so keep your codes private, and tell us at {mail} if you think your account has been accessed by
        someone else.
      </p>

      <h2>9. Age limit</h2>
      <p>
        Relun is only for adults aged 18 and over. We don’t knowingly collect data from anyone younger, and we delete
        accounts we find belong to a minor. If you believe a minor is using Relun, please report the profile or email us.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        If we make important changes we’ll tell you in the app or by email before they apply. The date at the top shows
        when this policy last changed.
      </p>

      <h2>11. Contact</h2>
      <p>
        {COMPANY}, {mail}.
      </p>
    </LegalPage>
  );
}
