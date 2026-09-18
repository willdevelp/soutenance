// app/historique/page.tsx
'use client';

import { useMemo, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  TYPES & DONNÉES                                                    */
/* ------------------------------------------------------------------ */

type Result = 'Match' | 'No Match' | 'Alerte';

interface ScanRecord {
  id: string;
  datetime: string; // ISO
  agent: string;
  name: string;
  score: number;
  status: Result;
  location: string;
}

const AGENTS = ['A. Diallo', 'M. Traoré', 'S. Koné', 'K. Bamba', 'F. Ouédraogo', 'L. Mensah'];

const LOCATIONS = [
  'Entrée principale',
  'Portail Nord',
  'Parking visiteurs',
  'Hall B',
  'Zone logistique',
];

const WATCHED = [
  'Ibrahim Sow',
  'Aïcha Belkacem',
  'Karim Haddad',
  'Fatou Ndiaye',
  'Youssef Amrani',
  'Nadia Bakayoko',
];

/* Générateur pseudo-aléatoire déterministe (données de démo stables) */
let seed = 42;
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

const RECORDS: ScanRecord[] = Array.from({ length: 34 }, (_, i) => {
  const r = rand();
  const status: Result = r < 0.45 ? 'Match' : r < 0.85 ? 'No Match' : 'Alerte';

  const score =
    status === 'Match'
      ? 85 + Math.floor(rand() * 15)
      : status === 'Alerte'
        ? 62 + Math.floor(rand() * 26)
        : 28 + Math.floor(rand() * 40);

  const name =
    status === 'No Match'
      ? rand() > 0.5
        ? '—'
        : 'Non identifié'
      : WATCHED[i % WATCHED.length];

  const date = new Date(Date.now() - i * 3_600_000 * (5 + rand() * 12));

  return {
    id: `SCN-${1024 + i}`,
    datetime: date.toISOString(),
    agent: AGENTS[Math.floor(rand() * AGENTS.length)],
    name,
    score,
    status,
    location: LOCATIONS[Math.floor(rand() * LOCATIONS.length)],
  };
});

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const fmtDate = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const fmtTime = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
});

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return { date: fmtDate.format(d), time: fmtTime.format(d) };
};

const initials = (fullName: string) =>
  fullName === '—' || fullName === 'Non identifié'
    ? '?'
    : fullName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

const STATUS_CONFIG: Record<
  Result,
  { label: string; badge: string; dot: string; avatar: string }
> = {
  Match: {
    label: 'Match',
    badge: 'bg-[#E7F8F1] text-[#0B7A5B] ring-1 ring-[#10B981]/30',
    dot: 'bg-[#10B981]',
    avatar: 'from-[#10B981] to-[#0B7A5B]',
  },
  'No Match': {
    label: 'No Match',
    badge: 'bg-[#F1F5F9] text-[#475569] ring-1 ring-[#E2E8F0]',
    dot: 'bg-[#94A3B8]',
    avatar: 'from-[#94A3B8] to-[#64748B]',
  },
  Alerte: {
    label: 'Alerte',
    badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30',
    dot: 'bg-[#EF4444]',
    avatar: 'from-[#EF4444] to-[#B91C1C]',
  },
};

const scoreColor = (score: number) =>
  score >= 85 ? 'text-[#10B981]' : score >= 65 ? 'text-[#F59E0B]' : 'text-[#EF4444]';

const scoreBar = (score: number) =>
  score >= 85 ? 'bg-[#10B981]' : score >= 65 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]';

/* ------------------------------------------------------------------ */
/*  ICÔNES (inline SVG)                                                */
/* ------------------------------------------------------------------ */

const IconSearch = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
  </svg>
);

const IconExcel = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="m9 12 4 5m0-5-4 5" strokeLinecap="round" />
  </svg>
);

const IconPdf = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M9 17v-5h1.5a1.5 1.5 0 0 1 0 3H9m5-3h1.5a2.5 2.5 0 0 1 0 5H14v-5Z" strokeLinecap="round" />
  </svg>
);

const IconEye = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const IconChevron = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconReset = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  COMPOSANTS UI                                                      */
/* ------------------------------------------------------------------ */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1A1A2E] ' +
  'placeholder:text-[#94A3B8] outline-none transition ' +
  'focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20';

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} cursor-pointer appearance-none pr-9`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <IconChevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
    </div>
  );
}

function StatusBadge({ status }: { status: Result }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Thumbnail({ name, status }: { name: string; status: Result }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[13px] font-bold text-white shadow-sm ${STATUS_CONFIG[status].avatar}`}
    >
      {initials(name)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 8;
const ALL = 'Tous';
const ALL_LOC = 'Toutes';

export default function HistoriqueControlesPage() {
  /* ---- état des filtres ---- */
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [agent, setAgent] = useState(ALL);
  const [result, setResult] = useState(ALL);
  const [location, setLocation] = useState(ALL_LOC);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ScanRecord | null>(null);

  /* ---- filtrage ---- */
  const filtered = useMemo(() => {
    return RECORDS.filter((r) => {
      const d = new Date(r.datetime);

      if (dateFrom) {
        const from = new Date(dateFrom + 'T00:00:00');
        if (d < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo + 'T23:59:59');
        if (d > to) return false;
      }
      if (agent !== ALL && r.agent !== agent) return false;
      if (result !== ALL && r.status !== result) return false;
      if (location !== ALL_LOC && r.location !== location) return false;

      return true;
    });
  }, [dateFrom, dateTo, agent, result, location]);

  /* ---- pagination ---- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setAgent(ALL);
    setResult(ALL);
    setLocation(ALL_LOC);
    setPage(1);
  };

  const updateFilter = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  /* ---- export ---- */
  const exportCSV = () => {
    const headers = ['Date', 'Heure', 'Agent', 'Nom détecté', 'Score', 'Statut', 'Localisation'];
    const rows = filtered.map((r) => {
      const { date, time } = formatDateTime(r.datetime);
      return [date, time, r.agent, r.name, `${r.score}%`, r.status, r.location];
    });
    const csv = [headers, ...rows]
      .map((line) => line.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique-controles-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => window.print();

  /* ---- stats rapides ---- */
  const stats = useMemo(() => {
    const match = filtered.filter((r) => r.status === 'Match').length;
    const alerte = filtered.filter((r) => r.status === 'Alerte').length;
    return { total: filtered.length, match, alerte };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ EN-TÊTE ============ */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>Contrôles</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#1E90FF]">Historique</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
              Historique des contrôles
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Consultez l’ensemble des scans effectués et leurs résultats de correspondance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportCSV}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#1A1A2E] shadow-sm transition hover:border-[#10B981] hover:text-[#0B7A5B] focus:outline-none focus:ring-2 focus:ring-[#10B981]/25"
            >
              <IconExcel className="h-4 w-4" />
              Exporter Excel
            </button>
            <button
              onClick={exportPDF}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0A2540] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123355] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40"
            >
              <IconPdf className="h-4 w-4" />
              Exporter PDF
            </button>
          </div>
        </header>

        {/* ============ CARTES STATS ============ */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Scans affichés', value: stats.total, accent: 'text-[#1A1A2E]', bar: 'bg-[#1E90FF]' },
            { label: 'Correspondances (Match)', value: stats.match, accent: 'text-[#0B7A5B]', bar: 'bg-[#10B981]' },
            { label: 'Alertes personne recherchée', value: stats.alerte, accent: 'text-[#B91C1C]', bar: 'bg-[#EF4444]' },
          ].map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${s.bar}`} />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                {s.label}
              </p>
              <p className={`mt-2 text-3xl font-bold tabular-nums ${s.accent}`}>{s.value}</p>
            </div>
          ))}
        </section>

        {/* ============ FILTRES ============ */}
        <section className="mt-6 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="mb-4 flex items-center gap-2">
            <IconSearch className="h-4 w-4 text-[#1E90FF]" />
            <h2 className="text-sm font-semibold text-[#1A1A2E]">Filtres de recherche</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <Field label="Date — du">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => updateFilter(setDateFrom)(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Date — au">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => updateFilter(setDateTo)(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Agent">
              <Select value={agent} onChange={updateFilter(setAgent)} options={[ALL, ...AGENTS]} />
            </Field>

            <Field label="Résultat">
              <Select
                value={result}
                onChange={updateFilter(setResult)}
                options={[ALL, 'Match', 'No Match', 'Alerte']}
              />
            </Field>

            <Field label="Localisation">
              <Select
                value={location}
                onChange={updateFilter(setLocation)}
                options={[ALL_LOC, ...LOCATIONS]}
              />
            </Field>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20"
              >
                <IconReset className="h-4 w-4" />
                Réinitialiser
              </button>
            </div>
          </div>
        </section>

        {/* ============ TABLEAU ============ */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="text-sm font-semibold text-[#1A1A2E]">Résultats des scans</h2>
            <span className="rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold text-[#64748B]">
              {filtered.length} enregistrement{filtered.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0A2540] text-white">
                  {['Date & Heure', 'Agent', 'Photo', 'Nom détecté', 'Score', 'Statut', 'Actions'].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${
                          i === 6 ? 'text-right' : ''
                        }`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <p className="text-sm font-semibold text-[#1A1A2E]">Aucun résultat</p>
                      <p className="mt-1 text-xs text-[#64748B]">
                        Aucun scan ne correspond aux filtres sélectionnés.
                      </p>
                    </td>
                  </tr>
                )}

                {paginated.map((r) => {
                  const { date, time } = formatDateTime(r.datetime);
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-[#E2E8F0] transition-colors last:border-0 even:bg-[#F8FAFD] hover:bg-[#EAF3FF]"
                    >
                      {/* Date & Heure */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="text-sm font-semibold text-[#1A1A2E]">{date}</div>
                        <div className="text-xs text-[#64748B]">{time}</div>
                      </td>

                      {/* Agent */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A2540] text-[11px] font-bold text-white">
                            {r.agent.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-[#1A1A2E]">{r.agent}</span>
                        </div>
                      </td>

                      {/* Photo miniature */}
                      <td className="px-5 py-3.5">
                        <Thumbnail name={r.name} status={r.status} />
                      </td>

                      {/* Nom détecté */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="text-sm font-semibold text-[#1A1A2E]">{r.name}</div>
                        <div className="text-xs text-[#64748B]">{r.location}</div>
                      </td>

                      {/* Score */}
                      <td className="px-5 py-3.5">
                        <div className="flex w-[110px] flex-col gap-1.5">
                          <span
                            className={`text-sm font-bold tabular-nums ${scoreColor(r.score)}`}
                          >
                            {r.score}%
                          </span>
                          <span className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                            <span
                              className={`block h-full rounded-full ${scoreBar(r.score)}`}
                              style={{ width: `${r.score}%` }}
                            />
                          </span>
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelected(r)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E90FF] transition hover:border-[#1E90FF] hover:bg-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/25"
                        >
                          <IconEye className="h-3.5 w-3.5" />
                          Voir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ============ PAGINATION ============ */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] px-5 py-4 sm:flex-row">
            <p className="text-xs text-[#64748B]">
              Affichage de{' '}
              <span className="font-semibold text-[#1A1A2E]">
                {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
              </span>{' '}
              à{' '}
              <span className="font-semibold text-[#1A1A2E]">
                {Math.min(currentPage * PAGE_SIZE, filtered.length)}
              </span>{' '}
              sur <span className="font-semibold text-[#1A1A2E]">{filtered.length}</span> résultats
            </p>

            <nav className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#1A1A2E] transition hover:border-[#1E90FF] hover:text-[#1E90FF] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E2E8F0] disabled:hover:text-[#1A1A2E]"
              >
                Précédent
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                    p === currentPage
                      ? 'bg-[#1E90FF] text-white shadow-sm'
                      : 'border border-[#E2E8F0] bg-white text-[#1A1A2E] hover:border-[#1E90FF] hover:text-[#1E90FF]'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#1A1A2E] transition hover:border-[#1E90FF] hover:text-[#1E90FF] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E2E8F0] disabled:hover:text-[#1A1A2E]"
              >
                Suivant
              </button>
            </nav>
          </div>
        </section>
      </main>

      {/* ============ MODALE DÉTAIL ============ */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/50 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-[#0A2540] px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Détail du scan</h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Fermer"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4">
                <Thumbnail name={selected.name} status={selected.status} />
                <div>
                  <p className="text-base font-bold text-[#1A1A2E]">{selected.name}</p>
                  <p className="text-xs text-[#64748B]">Réf. {selected.id}</p>
                </div>
              </div>

              <dl className="mt-5 divide-y divide-[#E2E8F0] rounded-lg border border-[#E2E8F0]">
                {[
                  ['Date & Heure', `${formatDateTime(selected.datetime).date} à ${formatDateTime(selected.datetime).time}`],
                  ['Agent', selected.agent],
                  ['Localisation', selected.location],
                  ['Score de correspondance', `${selected.score}%`],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-4 py-3">
                    <dt className="text-xs font-medium text-[#64748B]">{k}</dt>
                    <dd className="text-sm font-semibold text-[#1A1A2E]">{v}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-xs font-medium text-[#64748B]">Statut</dt>
                  <dd>
                    <StatusBadge status={selected.status} />
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
                >
                  Fermer
                </button>
                <button className="h-10 rounded-lg bg-[#1E90FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1878d6]">
                  Télécharger le rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}