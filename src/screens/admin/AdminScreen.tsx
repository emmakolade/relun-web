import { useEffect, useState, type ReactNode } from 'react';
import { BackButton, OutlineButton } from '../../components/Buttons';
import { ToggleRow } from '../../components/Controls';
import { EmptyState, Shimmer } from '../../components/Visuals';
import type { AdminSettings, AdminStats, AdminTrendDay } from '../../data/dtos';
import { api, ApiException } from '../../data/network';
import { useApp } from '../../data/store';
import { RelunColors, T, segmentColors } from '../../theme';

const REFRESH_MS = 30_000;

/**
 * Live numbers for the team at /app/admin. The backend only answers for user
 * ids in ADMIN_USER_IDS; everyone else gets a 404 and sees "not available".
 */
export function AdminScreen({ onBack }: { onBack: () => void }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<'forbidden' | 'failed' | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () => {
      if (document.hidden) return;
      api
        .adminStats()
        .then((s) => {
          if (!alive) return;
          setStats(s);
          setError(null);
        })
        .catch((e) => {
          if (!alive) return;
          setError(e instanceof ApiException && e.status === 404 ? 'forbidden' : 'failed');
        });
    };
    load();
    const timer = window.setInterval(load, REFRESH_MS);
    document.addEventListener('visibilitychange', load);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', load);
    };
  }, [attempt]);

  return (
    <div
      className="status-pad nav-pad"
      style={{ position: 'absolute', inset: 0, background: RelunColors.Background, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 16px', flexShrink: 0 }}>
        <BackButton onClick={onBack} />
        <div style={{ paddingLeft: 12, display: 'flex', flexDirection: 'column' }}>
          <span style={{ ...T.headlineSmall, color: RelunColors.Ink }}>Admin</span>
          {stats && (
            <span style={{ ...T.bodySmall, color: RelunColors.Muted }}>
              Updated {new Date(stats.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              {' · '}days on Lagos time
            </span>
          )}
        </div>
      </div>

      <div className="scroll" style={{ flex: 1 }}>
        {error === 'forbidden' ? (
          <EmptyState icon="lock" outline title="Not available" body="This page is only for the Relun team." />
        ) : error && !stats ? (
          <EmptyState
            icon="error"
            outline
            title="Couldn’t load stats"
            error
            action={
              <OutlineButton
                text="Try again"
                onClick={() => setAttempt((a) => a + 1)}
                style={{ maxWidth: 180 }}
                leadingIcon="refresh"
                height={48}
              />
            }
          />
        ) : !stats ? (
          <div style={{ ...tileGrid, padding: 16 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Shimmer key={i} radius={16} style={{ height: 84 }} />
            ))}
          </div>
        ) : (
          <Dashboard stats={stats} stale={error === 'failed'} />
        )}
      </div>
    </div>
  );
}

function Dashboard({ stats, stale }: { stats: AdminStats; stale: boolean }) {
  const { live, users, today, money, safety, server, trend } = stats;
  return (
    <div style={{ padding: '4px 16px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {stale && (
        <div style={{ ...T.bodySmall, color: RelunColors.WarningText, background: RelunColors.WarningFill, padding: '8px 12px', borderRadius: 12 }}>
          Couldn’t refresh. Showing the last numbers loaded.
        </div>
      )}

      <Section title="Discovery" grid={false}>
        <DiscoverySettings />
      </Section>

      <Section title="Live">
        <Tile label="Online now" value={live.online} dot />
        <Tile label="In a chat" value={live.inChats} />
      </Section>

      <Section title="Users">
        <Tile label="Active today" value={users.activeToday} />
        <Tile label="Sign-ups today" value={users.signupsToday} />
        <Tile label="Active 7 days" value={users.active7d} />
        <Tile label="Active 30 days" value={users.active30d} />
        <Tile label="Total accounts" value={users.total} />
        <Tile label="Completed profiles" value={users.completedProfiles} />
      </Section>

      <Section title="Today">
        <Tile label="Likes" value={today.likes} />
        <Tile label="Matches" value={today.matches} />
        <Tile label="Messages" value={today.messages} />
        <Tile label="Date posts" value={today.datePosts} />
        <Tile label="Date requests" value={today.dateRequests} />
        <Tile label="Reports" value={today.reports} />
      </Section>

      <Section title="Last 14 days" grid={false}>
        <TrendCharts trend={trend} />
      </Section>

      <Section title="Money">
        <Tile
          label="Plus subscribers"
          value={money.plusActive}
          sub={Object.entries(money.plusBySource).map(([source, n]) => `${sourceLabel(source)} ${n}`).join(' · ') || undefined}
        />
        <Tile label="Plus revenue today" value={formatRevenue(money.plusToday.byCurrency)} sub={payments(money.plusToday.payments)} />
        <Tile label="Plus revenue this month" value={formatRevenue(money.plusMonth.byCurrency)} sub={payments(money.plusMonth.payments)} />
        <Tile label="Coin purchases today" value={money.coinsToday.purchases} sub={`${formatCount(money.coinsToday.coins)} coins`} />
        <Tile label="Coin purchases this month" value={money.coinsMonth.purchases} sub={`${formatCount(money.coinsMonth.coins)} coins`} />
      </Section>

      <Section title="Safety">
        <Tile label="Open reports" value={safety.openReports} warn={safety.openReports > 0} />
      </Section>

      <Section title="Server">
        <Tile label="Up for" value={formatUptime(server.uptimeSeconds)} />
        <Tile label="Memory" value={`${server.memoryMb} MB`} sub={`heap ${server.heapMb} MB`} />
        <Tile label="Load (1/5/15 min)" value={server.load.join(' / ')} sub={`${server.cpus} CPU · Node ${server.node}`} />
      </Section>
    </div>
  );
}

/** App-wide discovery switch. Saves as soon as it's flipped and rolls back if the save fails. */
function DiscoverySettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.adminSettings().then(setSettings).catch(() => setError('Couldn’t load settings.'));
  }, []);

  const toggle = () => {
    if (!settings || saving) return;
    const previous = settings;
    const next = { discoverEveryone: !settings.discoverEveryone };
    setSettings(next);
    setSaving(true);
    setError(null);
    api
      .updateAdminSettings(next)
      .then(setSettings)
      .catch(() => {
        setSettings(previous);
        setError('Couldn’t save. Try again.');
      })
      .finally(() => setSaving(false));
  };

  return (
    <div style={{ background: RelunColors.Surface, border: `1px solid ${RelunColors.BorderSoft}`, borderRadius: 16, overflow: 'hidden' }}>
      {settings ? (
        <ToggleRow
          title="Show everyone, anywhere"
          subtitle="Ignore everyone’s max distance. Discovery shows people from anywhere, nearest first. Age, gender and other filters still apply."
          checked={settings.discoverEveryone}
          onToggle={toggle}
          divider={false}
        />
      ) : (
        !error && <Shimmer radius={0} style={{ height: 72 }} />
      )}
      {error && <div style={{ ...T.bodySmall, color: RelunColors.WarningText, padding: '8px 16px' }}>{error}</div>}
    </div>
  );
}

const tileGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 } as const;

function Section({ title, children, grid = true }: { title: string; children: ReactNode; grid?: boolean }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ ...T.sectionLabel, color: RelunColors.Muted, textTransform: 'uppercase' }}>{title}</span>
      {grid ? <div style={tileGrid}>{children}</div> : children}
    </section>
  );
}

function Tile({ label, value, sub, dot, warn }: { label: string; value: number | string; sub?: string; dot?: boolean; warn?: boolean }) {
  return (
    <div
      style={{
        background: warn ? RelunColors.WarningFill : RelunColors.Surface,
        border: `1px solid ${RelunColors.BorderSoft}`,
        borderRadius: 16,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minWidth: 0,
      }}
    >
      <span style={{ ...T.bodySmall, color: warn ? RelunColors.WarningText : RelunColors.Muted, display: 'flex', alignItems: 'center', gap: 6 }}>
        {dot && <span style={{ width: 8, height: 8, borderRadius: 4, background: RelunColors.OnlineDot }} />}
        {label}
      </span>
      <span style={{ ...T.titleLarge, color: RelunColors.Ink, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>
        {typeof value === 'number' ? formatCount(value) : value}
      </span>
      {sub && <span style={{ ...T.bodySmall, color: RelunColors.Muted }}>{sub}</span>}
    </div>
  );
}

const TREND_SERIES: { key: keyof Omit<AdminTrendDay, 'day'>; label: string }[] = [
  { key: 'activeUsers', label: 'Active users' },
  { key: 'signups', label: 'Sign-ups' },
  { key: 'matches', label: 'Matches' },
  { key: 'messages', label: 'Messages' },
];

/** One small bar chart per measure (they differ in scale too much to share an axis), plus a table view. */
function TrendCharts({ trend }: { trend: AdminTrendDay[] }) {
  const [table, setTable] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {table ? (
        <TrendTable trend={trend} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {TREND_SERIES.map((s) => (
            <MiniBars key={s.key} label={s.label} days={trend.map((d) => d.day)} values={trend.map((d) => d[s.key])} />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setTable((t) => !t)}
        style={{ ...T.labelMedium, alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, color: RelunColors.Body, cursor: 'pointer', textDecoration: 'underline' }}
      >
        {table ? 'Show charts' : 'Show as table'}
      </button>
    </div>
  );
}

const CHART_W = 280;
const CHART_H = 72;
const BAR_GAP = 2;

function MiniBars({ label, days, values }: { label: string; days: string[]; values: number[] }) {
  const accent = segmentColors(useApp((s) => s.segment)).fill;
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...values);
  const slot = CHART_W / values.length;
  const barW = slot - BAR_GAP;
  const shown = hover ?? values.length - 1;

  return (
    <div style={{ background: RelunColors.Surface, border: `1px solid ${RelunColors.BorderSoft}`, borderRadius: 16, padding: '12px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <span style={{ ...T.labelMedium, color: RelunColors.Ink }}>{label}</span>
        <span style={{ ...T.bodySmall, color: RelunColors.Muted, fontVariantNumeric: 'tabular-nums' }}>
          {formatDay(days[shown])}: <strong style={{ color: RelunColors.Ink }}>{formatCount(values[shown])}</strong>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        width="100%"
        height={CHART_H}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${label}, last ${values.length} days, peak ${formatCount(max)}`}
        onMouseLeave={() => setHover(null)}
        style={{ display: 'block', marginTop: 8 }}
      >
        <line x1={0} x2={CHART_W} y1={CHART_H - 0.5} y2={CHART_H - 0.5} stroke={RelunColors.Border} strokeWidth={1} />
        {values.map((v, i) => {
          const h = v === 0 ? 0 : Math.max(3, (v / max) * (CHART_H - 4));
          const x = i * slot + BAR_GAP / 2;
          const y = CHART_H - h;
          const r = Math.min(4, barW / 2, h);
          return (
            <g key={days[i]}>
              {h > 0 && (
                <path
                  d={`M${x},${CHART_H} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${CHART_H} Z`}
                  fill={accent}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
              )}
              {/* Full-height hit target, wider than the bar. */}
              <rect
                x={i * slot}
                y={0}
                width={slot}
                height={CHART_H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onTouchStart={() => setHover(i)}
              >
                <title>{`${formatDay(days[i])}: ${formatCount(v)}`}</title>
              </rect>
            </g>
          );
        })}
      </svg>
      <div style={{ ...T.bodySmall, color: RelunColors.Faint, display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span>{formatDay(days[0])}</span>
        <span>{formatDay(days[days.length - 1])}</span>
      </div>
    </div>
  );
}

function TrendTable({ trend }: { trend: AdminTrendDay[] }) {
  const cell = { ...T.bodySmall, padding: '6px 8px', textAlign: 'right' as const, fontVariantNumeric: 'tabular-nums' };
  return (
    <div style={{ background: RelunColors.Surface, border: `1px solid ${RelunColors.BorderSoft}`, borderRadius: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: RelunColors.Ink }}>
        <thead>
          <tr style={{ color: RelunColors.Muted }}>
            <th style={{ ...cell, textAlign: 'left', fontWeight: 600 }}>Day</th>
            {TREND_SERIES.map((s) => (
              <th key={s.key} style={{ ...cell, fontWeight: 600 }}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...trend].reverse().map((d) => (
            <tr key={d.day} style={{ borderTop: `1px solid ${RelunColors.Divider}` }}>
              <td style={{ ...cell, textAlign: 'left' }}>{formatDay(d.day)}</td>
              {TREND_SERIES.map((s) => (
                <td key={s.key} style={cell}>{formatCount(d[s.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const formatCount = (n: number) => n.toLocaleString();

/** "Oct 21" from "2026-10-21", without the viewer's timezone shifting the day. */
const formatDay = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString([], { month: 'short', day: 'numeric', timeZone: 'UTC' });

/** Amounts arrive in minor units (kobo, cents) per currency. */
const formatRevenue = (byCurrency: Record<string, number>) => {
  const entries = Object.entries(byCurrency);
  if (entries.length === 0) return '—';
  return entries
    .map(([currency, minor]) => {
      try {
        return new Intl.NumberFormat([], { style: 'currency', currency, maximumFractionDigits: 0 }).format(minor / 100);
      } catch {
        return `${(minor / 100).toLocaleString()} ${currency}`;
      }
    })
    .join(' + ');
};

const payments = (n: number) => (n === 1 ? '1 payment' : `${formatCount(n)} payments`);

const sourceLabel = (source: string) =>
  ({ paystack: 'Paystack', paystack_pass: 'Pass', play: 'Google Play' })[source] ?? source;

const formatUptime = (seconds: number) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
};
