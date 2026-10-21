import { APP_PATH, PRICES, naira } from '../config';
import { PageHead } from '../Layout';
import { SiteIcon } from '../SiteIcon';

const FREE = [
  'Create your profile and add photos',
  `${PRICES.freeDailyLikes} likes every day`,
  'Unlimited chat with your matches',
  `${PRICES.freeWeeklyRequests} free message request a week`,
  `${PRICES.freeActiveDates} date plan live at a time`,
  'Block, report and privacy controls',
];

const PLUS = [
  'Unlimited likes',
  'See who liked you',
  'See who viewed your profile',
  `${PRICES.plusMonthlyRequests} free message requests a month`,
  `${PRICES.plusActiveDates} date plans live at a time`,
  'Everything in Free',
];

export function Pricing() {
  return (
    <>
      <PageHead kicker="Pricing" title="Free to date. Plus if you want more.">
        Matching and chatting on Relun are free. Relun Plus is a cheap upgrade for people who want to meet more people,
        faster.
      </PageHead>

      <section className="lp-section lp-section-tight">
        <div className="lp-wrap">
          <div className="lp-grid lp-grid-2 lp-plans">
            <div className="lp-plan">
              <h2>Free</h2>
              <p className="lp-plan-price">
                <strong>{naira(0)}</strong>
                <span>forever</span>
              </p>
              <ul>
                {FREE.map((f) => (
                  <li key={f}>
                    <SiteIcon name="check" size={20} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={APP_PATH} className="lp-btn lp-btn-outline press">
                Join free
              </a>
            </div>

            <div className="lp-plan lp-plan-plus">
              <span className="lp-plan-badge">
                <SiteIcon name="workspace_premium" size={16} />
                Relun Plus
              </span>
              <h2>Plus</h2>
              <p className="lp-plan-price">
                <strong>{naira(PRICES.plusWeekly)}</strong>
                <span>a week</span>
              </p>
              <p className="lp-plan-alt">
                or <b>{naira(PRICES.plusMonthly)} a month</b>, which works out about half the price
              </p>
              <ul>
                {PLUS.map((f) => (
                  <li key={f}>
                    <SiteIcon name="check" size={20} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={APP_PATH} className="lp-btn lp-btn-rose press">
                Get Plus in the app
              </a>
              <p className="lp-plan-fine">Renews automatically. Cancel any time in the app; you keep Plus until the period ends.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-soft">
        <div className="lp-wrap">
          <h2>Coins, for extras</h2>
          <p className="lp-lead">
            Don’t want a subscription? Coins pay for one-off extras. Every new account starts with {PRICES.signupCoins}{' '}
            free coins.
          </p>
          <div className="lp-grid lp-grid-4 lp-coins">
            {PRICES.coinPacks.map((p) => (
              <div key={p.coins} className="lp-coin">
                <strong>{p.coins.toLocaleString('en-NG')} coins</strong>
                <span>{naira(p.naira)}</span>
              </div>
            ))}
          </div>
          <table className="lp-table">
            <caption>What coins buy</caption>
            <tbody>
              <tr>
                <th scope="row">Message request to someone you haven’t matched</th>
                <td>{PRICES.messageRequestCoins} coins</td>
              </tr>
              <tr>
                <th scope="row">An extra date plan beyond your free one</th>
                <td>{PRICES.datePostCoins} coins</td>
              </tr>
              <tr>
                <th scope="row">Joining someone else’s date plan</th>
                <td>Free</td>
              </tr>
            </tbody>
          </table>
          <p className="lp-small">
            Payments on the web are processed securely by Paystack. Prices are in Naira.
            Coins and message requests can’t be refunded once used; see our <a href="/terms/">Terms</a>.
          </p>
        </div>
      </section>
    </>
  );
}
