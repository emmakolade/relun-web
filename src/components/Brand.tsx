import { useId, type CSSProperties } from 'react';
import { SegmentColorSets } from '../theme';

/**
 * The Relun mark: a rose ring (Relationship) linked with an orange one (Fun).
 * Same drawing as the launcher icon and favicon; `width` is the width of both rings.
 * Kept free of app state so the prerendered public site can use it too.
 */
export function RingsMark({ width, style }: { width: number; style?: CSSProperties }) {
  // useId matches between the prerendered HTML and hydration; strip characters url(#…) can't take.
  const clip = `rings-top-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const rose = SegmentColorSets.relationship.fill;
  const orange = SegmentColorSets.fun.fill;
  return (
    <svg width={width} height={(width * 51) / 73} viewBox="17.5 28.5 73 51" aria-hidden style={{ display: 'block', flexShrink: 0, ...style }}>
      <defs>
        <clipPath id={clip}>
          <path d="M43 0H108V54H43Z" />
        </clipPath>
      </defs>
      <g fill="none" strokeWidth={9}>
        <circle cx={43} cy={54} r={21} stroke={rose} />
        <circle cx={65} cy={54} r={21} stroke={orange} />
        {/* Linked: rose passes over orange at the top crossing, under it at the bottom. */}
        <circle cx={43} cy={54} r={21} stroke={rose} clipPath={`url(#${clip})`} />
      </g>
    </svg>
  );
}
