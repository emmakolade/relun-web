import type { CSSProperties } from 'react';

/**
 * Every Material Symbol the public pages use. The font is requested with only
 * these glyphs (icon_names), which makes it a few KB instead of several MB.
 * Add a name here before using it, or it renders blank.
 */
export const SITE_ICONS = [
  'add_box',
  'arrow_forward',
  'auto_awesome',
  'chat_bubble',
  'check',
  'check_circle',
  'close',
  'delete',
  'event',
  'expand_more',
  'favorite',
  'flag',
  'groups',
  'install_mobile',
  'location_on',
  'lock',
  'mail',
  'more_vert',
  'near_me',
  'person',
  'phone_iphone',
  'android',
  'ios_share',
  'rocket_launch',
  'shield',
  'smartphone',
  'star',
  'verified_user',
  'visibility',
  'workspace_premium',
] as const;

export type SiteIconName = (typeof SITE_ICONS)[number];

/** Google Fonts wants icon_names sorted. */
export const iconFontUrl = () =>
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400..600,0..1,0' +
  `&icon_names=${[...SITE_ICONS].sort().join(',')}&display=block`;

/**
 * A Material Symbol drawn from a data attribute (see site.css) rather than as
 * text, so ligature names like "favorite" never show up in the page's text for
 * search engines or screen readers.
 */
export function SiteIcon({
  name,
  size = 24,
  color,
  outline = false,
  style,
}: {
  name: SiteIconName;
  size?: number;
  color?: string;
  outline?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className={outline ? 'ms ms-outline' : 'ms'}
      data-icon={name}
      aria-hidden
      style={{ fontSize: size, width: size, height: size, color, ...style }}
    />
  );
}
