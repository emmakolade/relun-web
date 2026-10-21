import { APP_PATH, DELETION_DAYS, PRICES, naira } from '../config';
import { PageHead } from '../Layout';
import { SiteIcon } from '../SiteIcon';

/** Plain-text answers: they also go into the page's FAQPage structured data. */
export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is Relun free?',
    a:
      `Yes. Joining, building your profile, ${PRICES.freeDailyLikes} likes a day and chatting with your matches are all free. ` +
      `Relun Plus (from ${naira(PRICES.plusWeekly)} a week) is optional and adds unlimited likes, who liked you and free message requests.`,
  },
  {
    q: 'Is there a Relun app for Android or iPhone?',
    a:
      'The Android and iPhone apps are coming soon. You can use Relun right now in your phone’s browser and add it to your ' +
      'home screen, where it opens full-screen like an app. Join the waitlist on our home page to get an email when the apps launch.',
  },
  {
    q: 'Where can I use Relun?',
    a: 'Anywhere. Relun shows you people near you, wherever you are, and you choose how far away they can be.',
  },
  {
    q: 'What is the difference between Relationship and Fun?',
    a:
      'When you join you pick what you’re here for: Relationship, for something serious and long-term, or Fun, for something casual ' +
      'and light. You only see and match with people who picked the same, so nobody’s intentions are a surprise.',
  },
  {
    q: 'How does matching work?',
    a: 'Like the people you’re interested in. If someone likes you back, it’s a match and you can chat for free straight away.',
  },
  {
    q: 'Can people message me without matching?',
    a:
      'Only by sending a message request, which you can accept or decline. You can turn message requests off completely in Settings. ' +
      'Matches can always message you.',
  },
  {
    q: 'What is Relun Plus?',
    a:
      `Relun Plus costs ${naira(PRICES.plusWeekly)} a week or ${naira(PRICES.plusMonthly)} a month. It gives you unlimited likes, ` +
      `shows who liked you and who viewed your profile, includes ${PRICES.plusMonthlyRequests} free message requests a month ` +
      `and lets you have ${PRICES.plusActiveDates} date plans live at once. You can cancel any time.`,
  },
  {
    q: 'What are coins for?',
    a:
      `Coins pay for extras outside Plus, like a message request (${PRICES.messageRequestCoins} coins) or an extra date plan ` +
      `(${PRICES.datePostCoins} coins). New accounts get ${PRICES.signupCoins} free coins. Packs start at ` +
      `${PRICES.coinPacks[0].coins} coins for ${naira(PRICES.coinPacks[0].naira)}.`,
  },
  {
    q: 'How old do I need to be?',
    a: 'You must be 18 or older to use Relun. We remove accounts that belong to anyone younger.',
  },
  {
    q: 'How do I block or report someone?',
    a:
      'Open their profile and tap the menu to block or report them. Blocking is instant and they can’t see or contact you again. ' +
      'Reports go to our team, who review every one.',
  },
  {
    q: 'How do I delete my account?',
    a:
      `In the app, go to Me or Settings and tap Delete account. Your profile disappears straight away, and everything else, ` +
      `including your messages, is permanently erased within ${DELETION_DAYS} days.`,
  },
  {
    q: 'Is Relun safe?',
    a:
      'Relun lets you control who can message you, and you can block or report anyone at any time. Still, always meet new people ' +
      'in public, tell a friend where you’re going and never send money to someone you haven’t met. Read our dating safety tips for more.',
  },
];

export function Faq() {
  return (
    <>
      <PageHead kicker="Help" title="Frequently asked questions">
        Everything you need to know about dating on Relun. Can’t find your answer? Email us.
      </PageHead>
      <section className="lp-section lp-section-tight">
        <div className="lp-wrap lp-narrow">
          <div className="lp-faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <SiteIcon name="expand_more" size={22} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="lp-cta-row">
            <a href={APP_PATH} className="lp-btn lp-btn-dark press">
              Open Relun
            </a>
            <a href="/safety/" className="lp-btn lp-btn-outline press">
              Dating safety tips
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
