"use client";

import {
  ScanLine,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  UserCheck,
  BellRing,
  Target,
  Camera,
  ChevronRight,
  Activity,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DONNÉES MOCKÉES                                                    */
/* ------------------------------------------------------------------ */

const kpis = [
  {
    label: "Contrôles aujourd’hui",
    value: "128",
    trend: "+12,4 %",
    trendDirection: "up" as const,
    icon: ScanLine,
    accent: "bg-[#1E90FF]",
    iconBg: "bg-[#EAF3FF]",
    iconColor: "text-[#1E90FF]",
  },
  {
    label: "Matches trouvés",
    value: "7",
    trend: "+2",
    trendDirection: "up" as const,
    icon: UserCheck,
    accent: "bg-[#10B981]",
    iconBg: "bg-[#E7F8F1]",
    iconColor: "text-[#10B981]",
  },
  {
    label: "Alertes actives",
    value: "3",
    trend: "-1",
    trendDirection: "down" as const,
    icon: BellRing,
    accent: "bg-[#EF4444]",
    iconBg: "bg-[#FDECEC]",
    iconColor: "text-[#EF4444]",
  },
  {
    label: "Taux de réussite",
    value: "94%",
    trend: "+1,8 pts",
    trendDirection: "up" as const,
    icon: Target,
    accent: "bg-[#0A2540]",
    iconBg: "bg-[#F4F7FB]",
    iconColor: "text-[#0A2540]",
  },
];

const controles = [
  { heure: "14:32", agent: "A. Mballa", resultat: "Aucun match", tone: "success", score: 34 },
  { heure: "14:15", agent: "A. Mballa", resultat: "Match trouvé", tone: "danger", score: 92 },
  { heure: "13:58", agent: "A. Mballa", resultat: "Aucun match", tone: "success", score: 41 },
  { heure: "13:40", agent: "A. Mballa", resultat: "Score moyen", tone: "warning", score: 72 },
  { heure: "13:22", agent: "K. Bamba", resultat: "Aucun match", tone: "success", score: 28 },
] as const;

const alertes = [
  {
    texte: "Personne recherchée détectée",
    lieu: "Poste Central",
    heure: "14:15",
    tone: "danger",
  },
  {
    texte: "Personne recherchée détectée",
    lieu: "Gare routière",
    heure: "13:04",
    tone: "danger",
  },
  {
    texte: "Score de correspondance moyen",
    lieu: "Poste Central",
    heure: "12:48",
    tone: "warning",
  },
] as const;

const chartPoints = [
  { x: 20, y: 100, jour: "Lun", value: 42 },
  { x: 100, y: 80, jour: "Mar", value: 58 },
  { x: 180, y: 90, jour: "Mer", value: 51 },
  { x: 260, y: 50, jour: "Jeu", value: 86 },
  { x: 340, y: 60, jour: "Ven", value: 78 },
  { x: 420, y: 30, jour: "Sam", value: 108 },
  { x: 500, y: 45, jour: "Dim", value: 92 },
];

const toneStyles: Record<
  string,
  { text: string; bg: string; border: string; icon: string; dot: string }
> = {
  success: {
    text: "text-[#0B7A5B]",
    bg: "bg-[#E7F8F1]",
    border: "border-[#10B981]/30",
    icon: "text-[#10B981]",
    dot: "bg-[#10B981]",
  },
  danger: {
    text: "text-[#B91C1C]",
    bg: "bg-[#FDECEC]",
    border: "border-[#EF4444]/30",
    icon: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
  warning: {
    text: "text-[#B45309]",
    bg: "bg-[#FEF6E7]",
    border: "border-[#F59E0B]/30",
    icon: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
  },
};

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ EN-TÊTE ============ */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>Tableau de bord</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#1E90FF]">Vue d’ensemble</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
              Bonjour, Agent Mballa
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Voici un résumé de l’activité du système pour aujourd’hui.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#64748B] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
              </span>
              Système opérationnel
            </span>
          </div>
        </header>

        {/* ============ KPI CARDS ============ */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const isUp = kpi.trendDirection === "up";
            return (
              <div
                key={kpi.label}
                className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)] transition hover:shadow-[0_4px_12px_rgba(10,37,64,0.08)]"
              >
                <span className={`absolute inset-y-0 left-0 w-1 ${kpi.accent}`} />

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      {kpi.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-[#1A1A2E]">
                      {kpi.value}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          isUp
                            ? "bg-[#E7F8F1] text-[#0B7A5B]"
                            : "bg-[#FDECEC] text-[#B91C1C]"
                        }`}
                      >
                        {isUp ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {kpi.trend}
                      </span>
                      <span className="text-[11px] text-[#64748B]">vs hier</span>
                    </div>
                  </div>

                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${kpi.iconBg} ${kpi.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* ============ CTA PRINCIPAL ============ */}
        <section className="mt-6">
          <button className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A2540] via-[#123355] to-[#1E90FF] px-6 py-5 text-left shadow-lg transition hover:shadow-xl">
            {/* Motif décoratif */}
            <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
            <span className="pointer-events-none absolute -bottom-12 right-16 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                <Camera className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-base font-bold text-white sm:text-lg">
                  Lancer un nouveau contrôle
                </p>
                <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
                  Capturez et analysez un visage en temps réel avec le moteur de reconnaissance.
                </p>
              </div>
            </div>

            <span className="relative hidden shrink-0 items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition group-hover:bg-white/25 sm:inline-flex">
              Démarrer
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </button>
        </section>

        {/* ============ GRILLE : CONTRÔLES + ALERTES ============ */}
        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
          {/* Derniers contrôles */}
          <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#1E90FF]" />
                <h2 className="text-sm font-semibold text-[#1A1A2E]">Derniers contrôles</h2>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E90FF] transition hover:text-[#0A2540]">
                Voir tout
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                      Heure
                    </th>
                    <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                      Agent
                    </th>
                    <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                      Score
                    </th>
                    <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                      Résultat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {controles.map((c, i) => {
                    const tone = toneStyles[c.tone];
                    return (
                      <tr
                        key={i}
                        className="border-t border-[#E2E8F0] transition-colors hover:bg-[#EAF3FF]"
                      >
                        <td className="whitespace-nowrap px-5 py-3">
                          <div className="text-sm font-semibold tabular-nums text-[#1A1A2E]">
                            {c.heure}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A2540] text-[10px] font-bold text-white">
                              {c.agent.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-[#1A1A2E]">
                              {c.agent}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-14 overflow-hidden rounded-full bg-[#E2E8F0]">
                              <span
                                className={`block h-full rounded-full ${tone.dot}`}
                                style={{ width: `${c.score}%` }}
                              />
                            </span>
                            <span className={`text-xs font-bold tabular-nums ${tone.text}`}>
                              {c.score}%
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.bg} ${tone.text}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                            {c.resultat}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alertes récentes */}
          <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#EF4444]" />
                <h2 className="text-sm font-semibold text-[#1A1A2E]">Alertes récentes</h2>
              </div>
              <span className="rounded-full bg-[#FDECEC] px-2.5 py-0.5 text-[11px] font-bold text-[#B91C1C]">
                {alertes.length}
              </span>
            </div>

            <ul className="divide-y divide-[#E2E8F0]">
              {alertes.map((a, i) => {
                const tone = toneStyles[a.tone];
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-[#F8FAFC]"
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.bg} ${tone.icon}`}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${tone.text}`}>{a.texte}</p>
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        {a.lieu} <span className="text-[#CBD5E1]">•</span> {a.heure}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <button className="flex w-full items-center justify-center gap-1.5 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3 text-xs font-semibold text-[#1E90FF] transition hover:bg-[#EAF3FF]">
              Voir toutes les alertes
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* ============ GRAPHIQUE ============ */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A2E]">
                Contrôles — 7 derniers jours
              </h2>
              <p className="mt-0.5 text-xs text-[#64748B]">
                Répartition quotidienne des scans effectués par tous les postes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1E90FF]" />
                Contrôles
              </span>
              <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs font-bold text-[#1A1A2E]">
                Total : 515
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <svg
              viewBox="0 0 600 160"
              className="h-[180px] w-full"
              role="img"
              aria-label="Graphique des contrôles sur 7 jours"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1E90FF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grille horizontale */}
              {[20, 50, 80, 110].map((y) => (
                <line
                  key={y}
                  x1="20"
                  x2="520"
                  y1={y}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Aire */}
              <path
                d={`M 20,100 ${chartPoints.map((p) => `L ${p.x},${p.y}`).join(" ")} L 500,120 L 20,120 Z`}
                fill="url(#areaGradient)"
              />

              {/* Ligne */}
              <polyline
                points={chartPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#1E90FF"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Points */}
              {chartPoints.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="6" fill="#1E90FF" opacity="0.15" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    fill="#FFFFFF"
                    stroke="#1E90FF"
                    strokeWidth="2"
                  />
                </g>
              ))}

              {/* Valeurs au-dessus des points */}
              {chartPoints.map((p, i) => (
                <text
                  key={`v-${i}`}
                  x={p.x}
                  y={p.y - 12}
                  fill="#1A1A2E"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {p.value}
                </text>
              ))}

              {/* Labels X */}
              {chartPoints.map((p, i) => (
                <text
                  key={`l-${i}`}
                  x={p.x}
                  y="145"
                  fill="#64748B"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {p.jour}
                </text>
              ))}
            </svg>
          </div>
        </section>

        {/* ============ PIED / INFO SYSTÈME ============ */}
        <footer className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(10,37,64,0.04)] sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FF] text-[#1E90FF]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#1A1A2E]">
                Système de reconnaissance faciale
              </p>
              <p className="text-[11px] text-[#64748B]">
                Dernière synchronisation : il y a 2 minutes
              </p>
            </div>
          </div>
          <span className="text-[11px] text-[#64748B]">
            Version 2.4.1 • © 2026
          </span>
        </footer>
      </main>
    </div>
  );
}