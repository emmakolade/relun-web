import { CONTACT_EMAIL } from '../config';
import { PageHead } from '../Layout';
import { SiteIcon, type SiteIconName } from '../SiteIcon';

const SECTIONS: { icon: SiteIconName; title: string; tips: string[] }[] = [
  {
    icon: 'flag',
    title: 'Spot a romance scam',
    tips: [
      'Never send money, airtime, gift cards or crypto to someone you haven’t met, whatever the story: a hospital bill, a stuck shipment, school fees, a “business opportunity”.',
      'Be careful if someone says “I love you” within days, wants to move to WhatsApp or Telegram straight away, or always has a reason they can’t video call.',
      'Never share your bank details, card PIN, ID numbers or any one-time code. Relun will never ask for your sign-in code.',
      'Reverse-search photos that look too polished. Scammers often use pictures of models or soldiers.',
    ],
  },
  {
    icon: 'groups',
    title: 'Before you meet',
    tips: [
      'Chat on Relun for a while first, and do a video call so you know they are who they say.',
      'Look them up. A real person usually has some online presence that matches what they told you.',
      'Keep your home address, workplace and daily routine to yourself until you trust them.',
    ],
  },
  {
    icon: 'location_on',
    title: 'On the date',
    tips: [
      'Meet somewhere public and busy, like a restaurant, café or mall, and stay there for the first few dates.',
      'Tell a friend or family member where you’re going, who you’re meeting and when you expect to be back. Share your live location.',
      'Get yourself there and back. Don’t accept a ride to a place you don’t know or go to a private home.',
      'Keep an eye on your drink and your phone, and keep your phone charged.',
      'Trust your gut. If anything feels off, leave. You don’t owe anyone an explanation.',
    ],
  },
  {
    icon: 'shield',
    title: 'Use Relun’s safety tools',
    tips: [
      'Block anyone, any time, from their profile or your chat. They won’t be able to see or contact you again.',
      'Report profiles that are fake, abusive, underage, selling something or asking for money. Our team reviews every report.',
      'Turn off message requests in Settings if you only want to hear from your matches.',
      'Hide your age or distance on your profile in Settings if you prefer.',
    ],
  },
];

export function Safety() {
  return (
    <>
      <PageHead kicker="Safety" title="Dating safety tips">
        Most people on Relun are here for the same reason you are. These habits help you stay safe while you meet them,
        online and in person.
      </PageHead>

      <section className="lp-section lp-section-tight">
        <div className="lp-wrap lp-narrow lp-prose">
          {SECTIONS.map((s) => (
            <section key={s.title} className="lp-tipblock">
              <h2>
                <span className="lp-tipicon">
                  <SiteIcon name={s.icon} size={22} />
                </span>
                {s.title}
              </h2>
              <ul>
                {s.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          ))}

          <aside className="lp-callout">
            <h2>If you’re in danger</h2>
            <p>
              Call your local emergency number straight away (<b>112</b> works from mobile phones in many countries). If
              something happened with someone you met on Relun, report them in the app and email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> so we can act on their account.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
