// app/parametres/page.tsx
'use client';

import { useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type TabKey = 'general' | 'reconnaissance' | 'camera' | 'notifications' | 'securite';

interface SettingsState {
  /* Général */
  appName: string;
  appShortName: string;
  language: string;
  timezone: string;
  logo: string | null;

  /* Reconnaissance */
  similarityThreshold: number;
  minImageQuality: number;
  maxFacesPerScan: number;
  autoDeleteDays: number;
  detectionModel: string;

  /* Caméra */
  resolution: string;
  defaultSource: string;
  fps: number;
  autoCapture: boolean;
  mirrorPreview: boolean;
  showBoundingBox: boolean;

  /* Notifications */
  emailAlerts: boolean;
  emailRecipients: string;
  pushAlerts: boolean;
  alertOnMatch: boolean;
  alertOnAlerte: boolean;
  dailyReport: boolean;

  /* Sécurité */
  sessionTimeout: number;
  require2FA: boolean;
  passwordMinLength: number;
  passwordComplexity: boolean;
  maxLoginAttempts: number;
  logRetentionDays: number;
}

const DEFAULT_SETTINGS: SettingsState = {
  appName: 'Système de Reconnaissance Faciale',
  appShortName: 'SRF',
  language: 'fr',
  timezone: 'Africa/Abidjan',
  logo: null,

  similarityThreshold: 80,
  minImageQuality: 65,
  maxFacesPerScan: 5,
  autoDeleteDays: 90,
  detectionModel: 'arcface-v2',

  resolution: '1920x1080',
  defaultSource: 'webcam',
  fps: 30,
  autoCapture: true,
  mirrorPreview: false,
  showBoundingBox: true,

  emailAlerts: true,
  emailRecipients: 'superviseurs@example.com',
  pushAlerts: false,
  alertOnMatch: true,
  alertOnAlerte: true,
  dailyReport: true,

  sessionTimeout: 30,
  require2FA: false,
  passwordMinLength: 8,
  passwordComplexity: true,
  maxLoginAttempts: 5,
  logRetentionDays: 365,
};

/* ------------------------------------------------------------------ */
/*  ICÔNES                                                             */
/* ------------------------------------------------------------------ */

const IconSettings = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconGlobe = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconScan = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
    <path d="M3 12h18" strokeLinecap="round" />
  </svg>
);

const IconCamera = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconBell = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconShield = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconUpload = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconTrash = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCheck = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconReset = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconMail = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconLock = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  COMPOSANTS UI                                                      */
/* ------------------------------------------------------------------ */

function Section({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
      <div className="flex items-start gap-3 border-b border-[#E2E8F0] px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FF] text-[#1E90FF]">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-semibold text-[#1A1A2E]">{title}</h2>
          <p className="mt-0.5 text-xs text-[#64748B]">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#64748B]">{hint}</p>}
    </div>
  );
}

const inputClass =
  'h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1A1A2E] ' +
  'placeholder:text-[#94A3B8] outline-none transition ' +
  'focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20';

const selectClass =
  'h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3 pr-9 text-sm text-[#1A1A2E] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20';

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ---- Toggle ---- */
function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-[#E2E8F0] bg-white p-4 transition hover:border-[#1E90FF]/40">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1A1A2E]">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[#64748B]">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 ${
          checked ? 'bg-[#1E90FF]' : 'bg-[#CBD5E1]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

/* ---- Slider ---- */
function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '%',
  colorThresholds,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  colorThresholds?: { low: number; high: number };
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const barColor = colorThresholds
    ? value < colorThresholds.low
      ? '#EF4444'
      : value < colorThresholds.high
        ? '#F59E0B'
        : '#10B981'
    : '#1E90FF';

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent
              [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:bg-[#0A2540] [&::-webkit-slider-thumb]:shadow-md
              [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#0A2540]"
          />
        </div>
        <span
          className="min-w-[64px] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-center text-sm font-bold tabular-nums"
          style={{ color: barColor }}
        >
          {value}
          {suffix}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function ParametresPage() {
  const [tab, setTab] = useState<TabKey>('general');
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [toast, setToast] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify(settings) !== JSON.stringify(saved);

  const set = <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => {
    setSettings((p) => ({ ...p, [k]: v }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('logo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    setSaved(settings);
    showToast('Paramètres enregistrés avec succès.');
  };

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
    showToast('Paramètres réinitialisés aux valeurs par défaut.');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'general', label: 'Général', icon: <IconGlobe className="h-4 w-4" /> },
    { key: 'reconnaissance', label: 'Reconnaissance', icon: <IconScan className="h-4 w-4" /> },
    { key: 'camera', label: 'Caméra', icon: <IconCamera className="h-4 w-4" /> },
    { key: 'notifications', label: 'Notifications', icon: <IconBell className="h-4 w-4" /> },
    { key: 'securite', label: 'Sécurité', icon: <IconShield className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ EN-TÊTE ============ */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>Administration</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#1E90FF]">Paramètres</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
              Paramètres du système
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Configurez le comportement de la plateforme, du moteur de reconnaissance et de la sécurité.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {dirty && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF6E7] px-3 py-1.5 text-xs font-semibold text-[#B45309] ring-1 ring-[#F59E0B]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                Modifications non enregistrées
              </span>
            )}
            <button
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#64748B] shadow-sm transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
            >
              <IconReset className="h-4 w-4" />
              Réinitialiser
            </button>
            <button
              onClick={save}
              disabled={!dirty}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0A2540] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123355] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconCheck className="h-4 w-4" />
              Enregistrer les modifications
            </button>
          </div>
        </header>

        {/* ============ TABS ============ */}
        <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-[#E2E8F0]">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === t.key
                  ? 'border-[#1E90FF] text-[#1E90FF]'
                  : 'border-transparent text-[#64748B] hover:text-[#1A1A2E]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        {/* ============ CONTENU ============ */}
        <div className="mt-6 space-y-6">
          {/* ---------- ONGLET GÉNÉRAL ---------- */}
          {tab === 'general' && (
            <>
              <Section
                title="Identité de l’application"
                description="Nom affiché, logo et informations générales"
                icon={<IconGlobe className="h-4 w-4" />}
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Logo */}
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-5 lg:col-span-1">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#1E90FF] text-3xl font-bold text-white shadow-md">
                      {settings.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={settings.logo} alt="Logo" className="h-full w-full object-cover" />
                      ) : (
                        settings.appShortName || 'SRF'
                      )}
                    </div>
                    <p className="text-xs text-[#64748B]">PNG, JPG ou SVG — 512×512 recommandé</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#1A1A2E] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
                      >
                        <IconUpload className="h-3.5 w-3.5" />
                        Téléverser
                      </button>
                      {settings.logo && (
                        <button
                          type="button"
                          onClick={() => set('logo', null)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#EF4444] transition hover:border-[#EF4444] hover:bg-[#FDECEC]"
                          aria-label="Supprimer"
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>

                  {/* Champs */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
                    <Field label="Nom de l’application">
                      <input
                        value={settings.appName}
                        onChange={(e) => set('appName', e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Sigle / nom court" hint="Utilisé dans la sidebar">
                      <input
                        value={settings.appShortName}
                        onChange={(e) => set('appShortName', e.target.value)}
                        maxLength={6}
                        className={`${inputClass} font-mono uppercase`}
                      />
                    </Field>
                    <Field label="Langue par défaut">
                      <SelectField
                        value={settings.language}
                        onChange={(v) => set('language', v)}
                        options={[
                          { value: 'fr', label: 'Français' },
                          { value: 'en', label: 'English' },
                          { value: 'ar', label: 'العربية' },
                        ]}
                      />
                    </Field>
                    <Field label="Fuseau horaire">
                      <SelectField
                        value={settings.timezone}
                        onChange={(v) => set('timezone', v)}
                        options={[
                          { value: 'Africa/Abidjan', label: 'Africa/Abidjan (GMT)' },
                          { value: 'Africa/Dakar', label: 'Africa/Dakar (GMT)' },
                          { value: 'Africa/Casablanca', label: 'Africa/Casablanca (GMT+1)' },
                          { value: 'Europe/Paris', label: 'Europe/Paris (GMT+1)' },
                        ]}
                      />
                    </Field>
                  </div>
                </div>
              </Section>

              {/* Prévisualisation */}
              <Section
                title="Aperçu de l’identité"
                description="Rendu de l’en-tête avec le logo et le nom configurés"
                icon={<IconSettings className="h-4 w-4" />}
              >
                <div className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#0A2540] to-[#1E90FF] text-lg font-bold text-white shadow-sm">
                    {settings.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={settings.logo} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      settings.appShortName || 'SRF'
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1A1A2E]">{settings.appName}</p>
                    <p className="text-xs text-[#64748B]">
                      Langue : {settings.language.toUpperCase()} • {settings.timezone}
                    </p>
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ---------- ONGLET RECONNAISSANCE ---------- */}
          {tab === 'reconnaissance' && (
            <>
              <Section
                title="Seuils de détection"
                description="Ajustez la sensibilité du moteur de reconnaissance faciale"
                icon={<IconScan className="h-4 w-4" />}
              >
                <div className="space-y-6">
                  <Field
                    label="Seuil de similarité"
                    hint="Pourcentage minimum pour valider une correspondance"
                  >
                    <Slider
                      value={settings.similarityThreshold}
                      onChange={(v) => set('similarityThreshold', v)}
                      min={50}
                      max={99}
                      colorThresholds={{ low: 70, high: 85 }}
                    />
                  </Field>

                  <Field
                    label="Qualité minimale d’image"
                    hint="Score minimum requis pour traiter une capture"
                  >
                    <Slider
                      value={settings.minImageQuality}
                      onChange={(v) => set('minImageQuality', v)}
                      min={30}
                      max={95}
                      colorThresholds={{ low: 50, high: 70 }}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Modèle de détection">
                      <SelectField
                        value={settings.detectionModel}
                        onChange={(v) => set('detectionModel', v)}
                        options={[
                          { value: 'arcface-v2', label: 'ArcFace v2 (recommandé)' },
                          { value: 'facenet-512', label: 'FaceNet 512' },
                          { value: 'retinaface', label: 'RetinaFace' },
                        ]}
                      />
                    </Field>
                    <Field label="Nombre max de visages par scan">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={settings.maxFacesPerScan}
                        onChange={(e) => set('maxFacesPerScan', Number(e.target.value))}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
              </Section>

              <Section
                title="Rétention des données"
                description="Conservation et purge automatique des captures"
                icon={<IconSettings className="h-4 w-4" />}
              >
                <Field
                  label="Suppression automatique après"
                  hint="Les captures non signalées seront purgées après ce délai"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={7}
                      max={3650}
                      value={settings.autoDeleteDays}
                      onChange={(e) => set('autoDeleteDays', Number(e.target.value))}
                      className={`${inputClass} max-w-[180px]`}
                    />
                    <span className="text-sm text-[#64748B]">jours</span>
                  </div>
                </Field>
              </Section>
            </>
          )}

          {/* ---------- ONGLET CAMÉRA ---------- */}
          {tab === 'camera' && (
            <>
              <Section
                title="Configuration vidéo"
                description="Résolution, source et paramètres de capture"
                icon={<IconCamera className="h-4 w-4" />}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Résolution">
                    <SelectField
                      value={settings.resolution}
                      onChange={(v) => set('resolution', v)}
                      options={[
                        { value: '640x480', label: '640 × 480 (SD)' },
                        { value: '1280x720', label: '1280 × 720 (HD)' },
                        { value: '1920x1080', label: '1920 × 1080 (Full HD)' },
                        { value: '2560x1440', label: '2560 × 1440 (QHD)' },
                        { value: '3840x2160', label: '3840 × 2160 (4K)' },
                      ]}
                    />
                  </Field>

                  <Field label="Source par défaut">
                    <SelectField
                      value={settings.defaultSource}
                      onChange={(v) => set('defaultSource', v)}
                      options={[
                        { value: 'webcam', label: 'Webcam intégrée' },
                        { value: 'rtsp', label: 'Flux RTSP / IP' },
                        { value: 'usb', label: 'Caméra USB externe' },
                        { value: 'file', label: 'Fichier local' },
                      ]}
                    />
                  </Field>

                  <Field label="Images par seconde (FPS)">
                    <SelectField
                      value={String(settings.fps)}
                      onChange={(v) => set('fps', Number(v))}
                      options={[
                        { value: '15', label: '15 fps' },
                        { value: '24', label: '24 fps' },
                        { value: '30', label: '30 fps' },
                        { value: '60', label: '60 fps' },
                      ]}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="Options d’affichage"
                description="Comportement du flux vidéo et des superpositions"
                icon={<IconSettings className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <Toggle
                    checked={settings.autoCapture}
                    onChange={(v) => set('autoCapture', v)}
                    label="Capture automatique"
                    description="Déclenche un scan dès qu’un visage est détecté dans le cadre."
                  />
                  <Toggle
                    checked={settings.mirrorPreview}
                    onChange={(v) => set('mirrorPreview', v)}
                    label="Miroir de la prévisualisation"
                    description="Inverse horizontalement l’aperçu caméra."
                  />
                  <Toggle
                    checked={settings.showBoundingBox}
                    onChange={(v) => set('showBoundingBox', v)}
                    label="Afficher les cadres de détection"
                    description="Superpose les boîtes englobantes autour des visages détectés."
                  />
                </div>
              </Section>
            </>
          )}

          {/* ---------- ONGLET NOTIFICATIONS ---------- */}
          {tab === 'notifications' && (
            <>
              <Section
                title="Canaux d’alerte"
                description="Choisissez comment et à qui les alertes sont envoyées"
                icon={<IconBell className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <Toggle
                    checked={settings.emailAlerts}
                    onChange={(v) => set('emailAlerts', v)}
                    label="Alertes par e-mail"
                    description="Envoie un e-mail aux destinataires configurés."
                  />

                  {settings.emailAlerts && (
                    <div className="ml-4 rounded-lg border border-[#EAF3FF] bg-[#F8FAFC] p-4">
                      <Field
                        label="Destinataires"
                        hint="Séparez plusieurs adresses par une virgule"
                      >
                        <div className="relative">
                          <IconMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                          <input
                            value={settings.emailRecipients}
                            onChange={(e) => set('emailRecipients', e.target.value)}
                            placeholder="ex. superviseurs@example.com, admin@example.com"
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </Field>
                    </div>
                  )}

                  <Toggle
                    checked={settings.pushAlerts}
                    onChange={(v) => set('pushAlerts', v)}
                    label="Notifications push"
                    description="Notifications en temps réel sur les appareils mobiles."
                  />
                </div>
              </Section>

              <Section
                title="Événements déclencheurs"
                description="Sélectionnez les événements qui génèrent une alerte"
                icon={<IconSettings className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <Toggle
                    checked={settings.alertOnMatch}
                    onChange={(v) => set('alertOnMatch', v)}
                    label="Correspondance positive (Match)"
                    description="Alerte lorsqu’un visage correspond à une identité connue."
                  />
                  <Toggle
                    checked={settings.alertOnAlerte}
                    onChange={(v) => set('alertOnAlerte', v)}
                    label="Personne recherchée détectée"
                    description="Alerte critique lorsqu’une personne signalée est détectée."
                  />
                  <Toggle
                    checked={settings.dailyReport}
                    onChange={(v) => set('dailyReport', v)}
                    label="Rapport quotidien récapitulatif"
                    description="Résumé journalier envoyé aux superviseurs à 20h00."
                  />
                </div>
              </Section>
            </>
          )}

          {/* ---------- ONGLET SÉCURITÉ ---------- */}
          {tab === 'securite' && (
            <>
              <Section
                title="Sessions utilisateurs"
                description="Gestion des connexions et de l’expiration de session"
                icon={<IconLock className="h-4 w-4" />}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Durée de session (minutes)" hint="Déconnexion automatique après inactivité">
                    <input
                      type="number"
                      min={5}
                      max={480}
                      value={settings.sessionTimeout}
                      onChange={(e) => set('sessionTimeout', Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Tentatives de connexion max" hint="Verrouillage après ce nombre d’échecs">
                    <input
                      type="number"
                      min={3}
                      max={10}
                      value={settings.maxLoginAttempts}
                      onChange={(e) => set('maxLoginAttempts', Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="Authentification"
                description="Renforcez la sécurité des comptes utilisateurs"
                icon={<IconShield className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <Toggle
                    checked={settings.require2FA}
                    onChange={(v) => set('require2FA', v)}
                    label="Exiger la double authentification (2FA)"
                    description="Tous les utilisateurs devront configurer un second facteur (TOTP, SMS)."
                  />

                  {settings.require2FA && (
                    <div className="ml-4 flex items-start gap-3 rounded-lg border border-[#FEF6E7] bg-[#FEF6E7]/40 p-4">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-white">
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3}>
                          <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                        </svg>
                      </span>
                      <div className="text-xs text-[#B45309]">
                        <p className="font-semibold">Activation recommandée</p>
                        <p className="mt-0.5 leading-relaxed">
                          Les utilisateurs existants devront configurer la 2FA à leur prochaine connexion.
                          Assurez-vous que vos serveurs SMTP sont opérationnels pour l’envoi des codes.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              <Section
                title="Politique de mots de passe"
                description="Exigences minimales pour les comptes"
                icon={<IconLock className="h-4 w-4" />}
              >
                <div className="space-y-4">
                  <Field label="Longueur minimale">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={6}
                        max={32}
                        value={settings.passwordMinLength}
                        onChange={(e) => set('passwordMinLength', Number(e.target.value))}
                        className={`${inputClass} max-w-[120px]`}
                      />
                      <span className="text-sm text-[#64748B]">caractères</span>
                    </div>
                  </Field>

                  <Toggle
                    checked={settings.passwordComplexity}
                    onChange={(v) => set('passwordComplexity', v)}
                    label="Complexité renforcée"
                    description="Exige au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
                  />
                </div>
              </Section>

              <Section
                title="Journalisation"
                description="Conservation des journaux d’audit et d’activité"
                icon={<IconSettings className="h-4 w-4" />}
              >
                <Field label="Durée de rétention des logs" hint="Les logs seront supprimés après cette période">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={30}
                      max={3650}
                      value={settings.logRetentionDays}
                      onChange={(e) => set('logRetentionDays', Number(e.target.value))}
                      className={`${inputClass} max-w-[180px]`}
                    />
                    <span className="text-sm text-[#64748B]">jours</span>
                  </div>
                </Field>
              </Section>
            </>
          )}
        </div>

        {/* ============ BARRE DE SAUVEGARDE FIXE ============ */}
        {dirty && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E2E8F0] bg-white/95 px-4 py-3 shadow-[0_-4px_12px_rgba(10,37,64,0.06)] backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEF6E7] text-[#F59E0B]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">Modifications non enregistrées</p>
                  <p className="text-xs text-[#64748B]">
                    Pensez à enregistrer avant de quitter la page.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSettings(saved)}
                  className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
                >
                  Annuler
                </button>
                <button
                  onClick={save}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1E90FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1878d6] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40"
                >
                  <IconCheck className="h-4 w-4" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============ TOAST ============ */}
      {toast && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[60] -translate-x-1/2">
          <div className="flex items-center gap-2.5 rounded-xl bg-[#0A2540] px-4 py-3 text-sm font-semibold text-white shadow-2xl">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981]">
              <IconCheck className="h-3 w-3 text-white" />
            </span>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}