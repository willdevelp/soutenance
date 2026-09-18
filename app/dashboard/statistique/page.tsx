// app/statistiques/page.tsx
'use client';

import { useMemo, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  TYPES & DONNÉES DE DÉMO                                            */
/* ------------------------------------------------------------------ */

interface DailyPoint {
  date: string; // ISO
  total: number;
  match: number;
  alerte: number;
}

interface AgentStat {
  name: string;
  controls: number;
  matchRate: number;
  alerts: number;
}

interface AlertSlice {
  label: string;
  value: number;
  color: string;
}

/* Générateur pseudo-aléatoire déterministe */
let seed = 7;
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

const buildDaily = (days: number): DailyPoint[] => {
  const out: DailyPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const total = 18 + Math.floor(rand() * 38);
    const match = Math.floor(total * (0.4 + rand() * 0.25));
    const alerte = Math.floor(total * (0.05 + rand() * 0.12));
    out.push({ date: d.toISOString(), total, match, alerte });
  }
  return out;
};

const AGENTS: AgentStat[] = [
  { name: 'A. Diallo', controls: 214, matchRate: 68, alerts: 14 },
  { name: 'M. Traoré', controls: 189, matchRate: 61, alerts: 22 },
  { name: 'S. Koné', controls: 176, matchRate: 72, alerts: 9 },
  { name: 'K. Bamba', controls: 142, matchRate: 55, alerts: 18 },
  { name: 'F. Ouédraogo', controls: 118, matchRate: 63, alerts: 6 },
  { name: 'L. Mensah', controls: 94, matchRate: 58, alerts: 11 },
];

const ALERT_DISTRIBUTION: AlertSlice[] = [
  { label: 'Personne recherchée', value: 42, color: '#EF4444' },
  { label: 'Pièce expirée', value: 28, color: '#F59E0B' },
  { label: 'Comportement suspect', value: 17, color: '#1E90FF' },
  { label: 'Autre', value: 13, color: '#94A3B8' },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const fmtDateShort = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' });
const fmtDateFull = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const toISO = (d: Date) => d.toISOString().slice(0, 10);

const today = new Date();
const defaultFrom = new Date(today);
defaultFrom.setDate(defaultFrom.getDate() - 30);

/* ------------------------------------------------------------------ */
/*  ICÔNES                                                             */
/* ------------------------------------------------------------------ */

const IconCalendar = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4m8-4v4M3 11h18" strokeLinecap="round" />
  </svg>
);

const IconPdf = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M9 17v-5h1.5a1.5 1.5 0 0 1 0 3H9m5-3h1.5a2.5 2.5 0 0 1 0 5H14v-5Z" strokeLinecap="round" />
  </svg>
);

const IconScan = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
    <path d="M3 12h18" strokeLinecap="round" />
  </svg>
);

const IconCheck = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconAlert = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 9v4m0 4h.01M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconUsers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
  </svg>
);

const IconTrendUp = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="m3 17 6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconTrendDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="m3 7 6 6 4-4 8 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 17h6v-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  COMPOSANTS UI                                                      */
/* ------------------------------------------------------------------ */

function KpiCard({
  label,
  value,
  suffix,
  trend,
  trendDirection = 'up',
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  icon: React.ReactNode;
  accent: string;
}) {
  const isPositive = trendDirection === 'up';
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
      <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tabular-nums text-[#1A1A2E]">{value}</span>
            {suffix && <span className="text-sm font-semibold text-[#64748B]">{suffix}</span>}
          </div>

          {trend && (
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isPositive
                    ? 'bg-[#E7F8F1] text-[#0B7A5B]'
                    : 'bg-[#FDECEC] text-[#B91C1C]'
                }`}
              >
                {isPositive ? <IconTrendUp className="h-3 w-3" /> : <IconTrendDown className="h-3 w-3" />}
                {trend}
              </span>
              <span className="text-[11px] text-[#64748B]">vs période précédente</span>
            </div>
          )}
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F4F7FB] text-[#1E90FF]">
          {icon}
        </span>
      </div>
    </div>
  );
}

/* --------------------- CHART : LIGNE (SVG) ------------------------ */

function LineChart({
  data,
  showMatch = true,
  showAlertes = true,
}: {
  data: DailyPoint[];
  showMatch?: boolean;
  showAlertes?: boolean;
}) {
  const W = 840;
  const H = 280;
  const PAD_L = 44;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 36;

  const max = Math.max(...data.map((d) => d.total)) * 1.15;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const xAt = (i: number) => PAD_L + i * stepX;
  const yAt = (v: number) => PAD_T + innerH - (v / max) * innerH;

  const pathFor = (getter: (d: DailyPoint) => number) =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(getter(d)).toFixed(1)}`).join(' ');

  const areaPath = (getter: (d: DailyPoint) => number) =>
    `${pathFor(getter)} L ${xAt(data.length - 1).toFixed(1)} ${(PAD_T + innerH).toFixed(1)} L ${PAD_L} ${(PAD_T + innerH).toFixed(1)} Z`;

  // graduations Y
  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((max / yTicks) * i));

  // graduations X : ~6 labels
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Évolution des contrôles">
      <defs>
        <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1E90FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grille horizontale + labels Y */}
      {tickValues.map((v) => (
        <g key={v}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={yAt(v)}
            y2={yAt(v)}
            stroke="#E2E8F0"
            strokeDasharray="4 4"
          />
          <text
            x={PAD_L - 10}
            y={yAt(v) + 4}
            textAnchor="end"
            className="fill-[#64748B] text-[10px] font-medium"
          >
            {v}
          </text>
        </g>
      ))}

      {/* Aire + ligne Total */}
      <path d={areaPath((d) => d.total)} fill="url(#gradTotal)" />
      <path
        d={pathFor((d) => d.total)}
        fill="none"
        stroke="#1E90FF"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Ligne Match */}
      {showMatch && (
        <path
          d={pathFor((d) => d.match)}
          fill="none"
          stroke="#10B981"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Ligne Alertes */}
      {showAlertes && (
        <path
          d={pathFor((d) => d.alerte)}
          fill="none"
          stroke="#EF4444"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Points sur la courbe Total */}
      {data.map((d, i) => (
        <circle key={i} cx={xAt(i)} cy={yAt(d.total)} r={3} fill="#FFFFFF" stroke="#1E90FF" strokeWidth={2} />
      ))}

      {/* Labels X */}
      {data.map((d, i) =>
        i % labelEvery === 0 ? (
          <text
            key={i}
            x={xAt(i)}
            y={H - PAD_B + 20}
            textAnchor="middle"
            className="fill-[#64748B] text-[10px] font-medium"
          >
            {fmtDateShort.format(new Date(d.date))}
          </text>
        ) : null,
      )}

      {/* Axe X */}
      <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="#E2E8F0" />
    </svg>
  );
}

/* --------------------- CHART : DONUT (SVG) ------------------------ */

function Donut({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  centerLabel: string;
  centerValue: string;
}) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 62;
  const stroke = 22;
  const circumference = 2 * Math.PI * r;

  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F4F7FB" strokeWidth={stroke} />
          {segments.map((seg, index) => {
            const frac = total > 0 ? seg.value / total : 0;
            const dash = circumference * frac;
            const gap = circumference - dash;
            const offset = segments
              .slice(0, index)
              .reduce((sum, previous) => sum + circumference * (total > 0 ? previous.value / total : 0), 0);
            const el = (
              <circle
                key={seg.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            return el;
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            {centerLabel}
          </span>
          <span className="text-2xl font-bold text-[#1A1A2E]">{centerValue}</span>
        </div>
      </div>

      <ul className="w-full space-y-2.5">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <li key={seg.label} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="truncate text-sm text-[#1A1A2E]">{seg.label}</span>
              </div>
              <div className="flex shrink-0 items-baseline gap-1.5">
                <span className="text-sm font-bold tabular-nums text-[#1A1A2E]">{seg.value}</span>
                <span className="text-xs tabular-nums text-[#64748B]">({pct}%)</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* --------------------- CHART : BARRES AGENTS ---------------------- */

function TopAgentsChart({ agents }: { agents: AgentStat[] }) {
  const max = Math.max(...agents.map((a) => a.controls));
  return (
    <ul className="space-y-4">
      {agents.map((a, i) => {
        const pct = Math.round((a.controls / max) * 100);
        return (
          <li key={a.name} className="flex items-center gap-4">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                i === 0
                  ? 'bg-[#FEF6E7] text-[#B45309]'
                  : i === 1
                    ? 'bg-[#F1F5F9] text-[#475569]'
                    : i === 2
                      ? 'bg-[#FEE9D8] text-[#B45309]'
                      : 'bg-[#F4F7FB] text-[#64748B]'
              }`}
            >
              {i + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-[#1A1A2E]">{a.name}</span>
                <span className="shrink-0 text-sm font-bold tabular-nums text-[#1A1A2E]">
                  {a.controls}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-[#1E90FF] to-[#0A2540]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#64748B]">
                <span>
                  Taux match : <span className="font-semibold text-[#0B7A5B]">{a.matchRate}%</span>
                </span>
                <span className="text-[#CBD5E1]">•</span>
                <span>
                  Alertes : <span className="font-semibold text-[#B91C1C]">{a.alerts}</span>
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* --------------------- LÉGENDE GRAPHIQUE -------------------------- */

function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

type Granularity = 'day' | 'week';

export default function StatistiquesPage() {
  const [from, setFrom] = useState(toISO(defaultFrom));
  const [to, setTo] = useState(toISO(today));
  const [preset, setPreset] = useState<'7' | '30' | '90' | 'custom'>('30');
  const [granularity, setGranularity] = useState<Granularity>('day');

  /* ---- données filtrées ---- */
  const daily = useMemo(() => {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);

    const all = buildDaily(90);
    return all.filter((p) => {
      const d = new Date(p.date);
      return d >= start && d <= end;
    });
  }, [from, to]);

  /* ---- agrégation par semaine ---- */
  const chartData = useMemo(() => {
    if (granularity === 'day') return daily;

    const buckets: Record<string, DailyPoint> = {};
    daily.forEach((p) => {
      const d = new Date(p.date);
      const monday = new Date(d);
      const dow = (d.getDay() + 6) % 7;
      monday.setDate(d.getDate() - dow);
      monday.setHours(0, 0, 0, 0);
      const key = monday.toISOString();
      if (!buckets[key]) buckets[key] = { date: key, total: 0, match: 0, alerte: 0 };
      buckets[key].total += p.total;
      buckets[key].match += p.match;
      buckets[key].alerte += p.alerte;
    });
    return Object.values(buckets);
  }, [daily, granularity]);

  /* ---- KPIs ---- */
  const kpis = useMemo(() => {
    const total = daily.reduce((s, d) => s + d.total, 0);
    const match = daily.reduce((s, d) => s + d.match, 0);
    const alerte = daily.reduce((s, d) => s + d.alerte, 0);
    const matchRate = total > 0 ? (match / total) * 100 : 0;
    const activeAgents = AGENTS.filter((a) => a.controls > 0).length;

    return { total, match, alerte, matchRate, activeAgents };
  }, [daily]);

  /* ---- presets ---- */
  const applyPreset = (p: '7' | '30' | '90') => {
    setPreset(p);
    const t = new Date();
    const f = new Date();
    f.setDate(f.getDate() - parseInt(p, 10));
    setFrom(toISO(f));
    setTo(toISO(t));
  };

  const handleFromChange = (v: string) => {
    setFrom(v);
    setPreset('custom');
  };
  const handleToChange = (v: string) => {
    setTo(v);
    setPreset('custom');
  };

  /* ---- export PDF ---- */
  const generateReport = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Rapport statistiques ${from} → ${to}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1A1A2E; }
            h1 { color: #0A2540; margin-bottom: 4px; }
            .meta { color: #64748B; font-size: 13px; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
            .kpi { border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; }
            .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748B; letter-spacing: 0.05em; }
            .kpi-value { font-size: 26px; font-weight: 700; margin-top: 6px; }
            h2 { color: #0A2540; font-size: 15px; margin: 28px 0 12px; }
            ul { list-style: none; padding: 0; }
            li { padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 13px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <h1>Rapport statistiques & contrôles</h1>
          <p class="meta">Période : ${from} → ${to}</p>
          <div class="grid">
            <div class="kpi"><div class="kpi-label">Contrôles</div><div class="kpi-value">${kpis.total}</div></div>
            <div class="kpi"><div class="kpi-label">Taux de match</div><div class="kpi-value">${kpis.matchRate.toFixed(1)}%</div></div>
            <div class="kpi"><div class="kpi-label">Alertes</div><div class="kpi-value">${kpis.alerte}</div></div>
            <div class="kpi"><div class="kpi-label">Agents actifs</div><div class="kpi-value">${kpis.activeAgents}</div></div>
          </div>
          <h2>Top agents</h2>
          <ul>${AGENTS.map((a) => `<li><span>${a.name}</span><span>${a.controls} contrôles — ${a.matchRate}% match</span></li>`).join('')}</ul>
          <script>setTimeout(() => window.print(), 300);</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  /* ---- segments donut match ---- */
  const matchSegments = [
    { label: 'Match', value: kpis.match, color: '#10B981' },
    { label: 'No Match', value: kpis.total - kpis.match - kpis.alerte, color: '#94A3B8' },
    { label: 'Alerte', value: kpis.alerte, color: '#EF4444' },
  ].filter((s) => s.value > 0);

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ EN-TÊTE ============ */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>Rapports</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#1E90FF]">Statistiques</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
              Statistiques & Rapports
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Vue globale des contrôles, performances des agents et répartition des alertes.
            </p>
          </div>

          <button
            onClick={generateReport}
            className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-[#0A2540] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123355] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40 lg:self-auto"
          >
            <IconPdf className="h-4 w-4" />
            Générer un rapport PDF
          </button>
        </header>

        {/* ============ FILTRES DE PÉRIODE ============ */}
        <section className="mt-6 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="mb-4 flex items-center gap-2">
            <IconCalendar className="h-4 w-4 text-[#1E90FF]" />
            <h2 className="text-sm font-semibold text-[#1A1A2E]">Filtres de période</h2>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Date — du
                </label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Date — au
                </label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => handleToChange(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
                />
              </div>
            </div>

            {/* Presets + granularité */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1">
                {[
                  { k: '7' as const, l: '7 jours' },
                  { k: '30' as const, l: '30 jours' },
                  { k: '90' as const, l: '90 jours' },
                ].map((opt) => (
                  <button
                    key={opt.k}
                    onClick={() => applyPreset(opt.k)}
                    className={`h-8 rounded-md px-3 text-xs font-semibold transition ${
                      preset === opt.k
                        ? 'bg-white text-[#1E90FF] shadow-sm ring-1 ring-[#E2E8F0]'
                        : 'text-[#64748B] hover:text-[#1A1A2E]'
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1">
                {[
                  { k: 'day' as const, l: 'Jour' },
                  { k: 'week' as const, l: 'Semaine' },
                ].map((opt) => (
                  <button
                    key={opt.k}
                    onClick={() => setGranularity(opt.k)}
                    className={`h-8 rounded-md px-3 text-xs font-semibold transition ${
                      granularity === opt.k
                        ? 'bg-white text-[#1E90FF] shadow-sm ring-1 ring-[#E2E8F0]'
                        : 'text-[#64748B] hover:text-[#1A1A2E]'
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ KPI CARDS ============ */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total contrôles"
            value={kpis.total.toLocaleString('fr-FR')}
            trend="+12,4 %"
            trendDirection="up"
            icon={<IconScan className="h-5 w-5" />}
            accent="bg-[#1E90FF]"
          />
          <KpiCard
            label="Taux de match"
            value={kpis.matchRate.toFixed(1)}
            suffix="%"
            trend="+2,1 pts"
            trendDirection="up"
            icon={<IconCheck className="h-5 w-5" />}
            accent="bg-[#10B981]"
          />
          <KpiCard
            label="Alertes déclenchées"
            value={kpis.alerte.toLocaleString('fr-FR')}
            trend="-8,7 %"
            trendDirection="down"
            icon={<IconAlert className="h-5 w-5" />}
            accent="bg-[#EF4444]"
          />
          <KpiCard
            label="Agents actifs"
            value={kpis.activeAgents}
            trend="+1"
            trendDirection="up"
            icon={<IconUsers className="h-5 w-5" />}
            accent="bg-[#0A2540]"
          />
        </section>

        {/* ============ GRAPHIQUE PRINCIPAL ============ */}
        <section className="mt-6 rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A2E]">
                Nombre de contrôles par {granularity === 'day' ? 'jour' : 'semaine'}
              </h2>
              <p className="mt-0.5 text-xs text-[#64748B]">
                {fmtDateFull.format(new Date(from))} → {fmtDateFull.format(new Date(to))}
              </p>
            </div>
            <ChartLegend
              items={[
                { label: 'Total', color: '#1E90FF' },
                { label: 'Match', color: '#10B981' },
                { label: 'Alertes', color: '#EF4444' },
              ]}
            />
          </div>

          <div className="p-4 sm:p-5">
            {chartData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-[#64748B]">
                Aucune donnée sur cette période.
              </div>
            ) : (
              <LineChart data={chartData} />
            )}
          </div>
        </section>

        {/* ============ 3 CARTES : MATCH / AGENTS / ALERTES ============ */}
        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Taux de match */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
            <div className="border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-sm font-semibold text-[#1A1A2E]">Taux de match</h2>
              <p className="mt-0.5 text-xs text-[#64748B]">Répartition des résultats de scan</p>
            </div>
            <div className="p-5">
              <Donut
                segments={matchSegments}
                centerLabel="Taux match"
                centerValue={`${kpis.matchRate.toFixed(0)}%`}
              />
            </div>
          </div>

          {/* Répartition des alertes */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
            <div className="border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-sm font-semibold text-[#1A1A2E]">Répartition des alertes</h2>
              <p className="mt-0.5 text-xs text-[#64748B]">Par type de motif déclenché</p>
            </div>
            <div className="p-5">
              <Donut
                segments={ALERT_DISTRIBUTION}
                centerLabel="Total alertes"
                centerValue={String(ALERT_DISTRIBUTION.reduce((s, a) => s + a.value, 0))}
              />
            </div>
          </div>

          {/* Top agents */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#1A1A2E]">Top agents</h2>
                <p className="mt-0.5 text-xs text-[#64748B]">Classement par nombre de contrôles</p>
              </div>
              <span className="rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold text-[#64748B]">
                {AGENTS.length}
              </span>
            </div>
            <div className="p-5">
              <TopAgentsChart agents={AGENTS} />
            </div>
          </div>
        </section>

        {/* ============ TABLEAU RÉCAPITULATIF ============ */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="text-sm font-semibold text-[#1A1A2E]">Synthèse par agent</h2>
            <span className="text-xs text-[#64748B]">Période analysée : {daily.length} jours</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0A2540] text-white">
                  {['Agent', 'Contrôles', 'Taux de match', 'Alertes', 'Performance'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${
                        i > 0 ? 'text-right' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((a) => (
                  <tr
                    key={a.name}
                    className="border-b border-[#E2E8F0] transition-colors last:border-0 even:bg-[#F8FAFD] hover:bg-[#EAF3FF]"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A2540] text-[11px] font-bold text-white">
                          {a.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-[#1A1A2E]">{a.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm font-semibold tabular-nums text-[#1A1A2E]">
                      {a.controls}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <span className="text-sm font-bold tabular-nums text-[#0B7A5B]">{a.matchRate}%</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <span className="inline-flex items-center rounded-full bg-[#FDECEC] px-2.5 py-1 text-xs font-semibold text-[#B91C1C] ring-1 ring-[#EF4444]/30">
                        {a.alerts}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="ml-auto flex w-[120px] items-center gap-2">
                        <span className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                          <span
                            className={`block h-full rounded-full ${
                              a.matchRate >= 70 ? 'bg-[#10B981]' : a.matchRate >= 60 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                            }`}
                            style={{ width: `${a.matchRate}%` }}
                          />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}