import { APP_PATH, CONTACT_EMAIL } from '../config';
import { PageHead } from '../Layout';

export function About() {
  return (
    <>
      <PageHead kicker="About" title="Dating, without the guesswork">
        Relun is a dating app built around one simple idea: you should know what someone is looking for before
        you start talking.
      </PageHead>

      <section className="lp-section lp-section-tight">
        <div className="lp-wrap lp-narrow lp-prose">
          <h2>Why we built Relun</h2>
          <p>
            Too much time on dating apps goes to conversations that were never going anywhere, because one person wanted a
            relationship and the other just wanted fun. On Relun you choose what you’re here for when you join, and you
            only meet people who chose the same.
          </p>

          <h2>What makes it different</h2>
          <ul>
            <li>
              <b>Two separate spaces.</b> Relationship and Fun each have their own people, so intentions are clear from
              the first like.
            </li>
            <li>
              <b>Free chat with matches.</b> If it’s mutual, you can talk. No paywall in front of your conversations.
            </li>
            <li>
              <b>You decide who reaches you.</b> People you haven’t matched can only send a request, and you can switch
              those off.
            </li>
            <li>
              <b>Date plans.</b> Post a real plan, like dinner on Friday, and choose from the people who ask to join.
            </li>
            <li>
              <b>Fairly priced.</b> Relun Plus starts at the price of a snack, not a monthly bill.
            </li>
          </ul>

          <h2>Where we are</h2>
          <p>
            Relun works today in any phone browser, and you can add it to your home screen. Our Android and iPhone apps are
            on the way.
          </p>

          <h2>Get in touch</h2>
          <p>
            Questions, feedback or press: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <div className="lp-cta-row">
            <a href={APP_PATH} className="lp-btn lp-btn-dark press">
              Try Relun free
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
