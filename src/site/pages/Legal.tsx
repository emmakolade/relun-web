import type { ReactNode } from 'react';
import { LEGAL_UPDATED } from '../config';
import { PageHead } from '../Layout';

/**
 * Shows a "draft" notice on the Terms and Privacy Policy when true.
 */
export const LEGAL_DRAFT = false;

export function LegalPage({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <>
      <PageHead kicker="Legal" title={title} />
      <section className="lp-section lp-section-tight">
        <div className="lp-wrap lp-narrow lp-prose lp-legal">
          <p className="lp-updated">Last updated: {LEGAL_UPDATED}</p>
          {LEGAL_DRAFT && (
            <p className="lp-draft" role="note">
              This document is a draft and is being reviewed. It may change before Relun’s full launch.
            </p>
          )}
          <p>{intro}</p>
          {children}
        </div>
      </section>
    </>
  );
}
