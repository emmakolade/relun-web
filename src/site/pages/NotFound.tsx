import { APP_PATH } from '../config';
import { PageHead } from '../Layout';

export function NotFound() {
  return (
    <>
      <PageHead title="Page not found">That page doesn’t exist or has moved.</PageHead>
      <section className="lp-section lp-section-tight">
        <div className="lp-wrap lp-narrow">
          <div className="lp-cta-row">
            <a href="/" className="lp-btn lp-btn-dark press">
              Go to the home page
            </a>
            <a href={APP_PATH} className="lp-btn lp-btn-outline press">
              Open Relun
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
