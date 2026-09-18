// app/personnes/[id]/page.tsx
'use client';

import { useMemo, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  TYPES & DONNÉES DE DÉMO                                            */
/* ------------------------------------------------------------------ */

type PersonStatus = 'Surveillance' | 'Recherchée' | 'Autorisée' | 'Interdite';
type UserRole = 'admin' | 'superviseur' | 'agent';

interface ControlRecord {
  id: string;
  datetime: string;
  agent: string;
  location: string;
  score: number;
  result: 'Match' | 'No Match' | 'Alerte';
}

interface DocFile {
  id: string;
  name: string;
  type: 'PDF' | 'JPG' | 'PNG';
  size: string;
  date: string;
}

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  gender: 'M' | 'F';
  idNumber: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  profession: string;
  status: PersonStatus;
  riskLevel: 'Faible' | 'Moyen' | 'Élevé';
  mainPhoto: string; // initiales fallback
  gallery: string[]; // initiales fallback
  background: string;
  notes: Note[];
  controls: ControlRecord[];
  documents: DocFile[];
}

interface Note {
  id: string;
  author: string;
  date: string;
  text: string;
  important: boolean;
}

/* ------------------------------------------------------------------ */
/*  DONNÉES DE DÉMONSTRATION                                           */
/* ------------------------------------------------------------------ */

const PERSON: Person = {
  id: 'PRS-2048',
  firstName: 'Ibrahim',
  lastName: 'Sow',
  birthDate: '1987-04-12',
  birthPlace: 'Dakar, Sénégal',
  nationality: 'Sénégalaise',
  gender: 'M',
  idNumber: 'SN-874512036',
  address: '18 Rue des Almadies, Quartier Plateau',
  city: 'Abidjan, Côte d’Ivoire',
  phone: '+225 07 88 45 12 36',
  email: 'i.sow@example.com',
  profession: 'Consultant logistique',
  status: 'Recherchée',
  riskLevel: 'Élevé',
  mainPhoto: 'IS',
  gallery: ['IS', 'IS', 'IS', 'IS'],
  background:
    'Personne signalée dans le cadre de l’enquête réf. ENQ-2024-118. Faisait l’objet d’un contrôle renforcé aux points d’entrée depuis mars 2024. Aucune condamnation pénale enregistrée à ce jour.',
  notes: [
    {
      id: 'N-1',
      author: 'Commandant M. Traoré',
      date: '2026-09-14T09:24:00Z',
      text: 'Individu très coopératif lors du dernier contrôle. Aucune objection à signaler.',
      important: false,
    },
    {
      id: 'N-2',
      author: 'Superviseur S. Koné',
      date: '2026-09-02T16:10:00Z',
      text: 'Refus de fournir une pièce d’identité complémentaire. Comportement évasif. À surveiller.',
      important: true,
    },
    {
      id: 'N-3',
      author: 'Agent A. Diallo',
      date: '2026-08-19T11:45:00Z',
      text: 'Carte professionnelle expirée présentée. Rappel effectué.',
      important: false,
    },
  ],
  controls: [
    { id: 'SCN-1064', datetime: '2026-09-15T08:42:00Z', agent: 'A. Diallo', location: 'Entrée principale', score: 94, result: 'Match' },
    { id: 'SCN-1051', datetime: '2026-09-08T14:03:00Z', agent: 'S. Koné', location: 'Portail Nord', score: 88, result: 'Match' },
    { id: 'SCN-1038', datetime: '2026-08-27T19:31:00Z', agent: 'M. Traoré', location: 'Zone logistique', score: 41, result: 'No Match' },
    { id: 'SCN-1022', datetime: '2026-08-11T07:12:00Z', agent: 'K. Bamba', location: 'Hall B', score: 76, result: 'Alerte' },
    { id: 'SCN-1009', datetime: '2026-07-29T10:55:00Z', agent: 'F. Ouédraogo', location: 'Parking visiteurs', score: 91, result: 'Match' },
  ],
  documents: [
    { id: 'D-1', name: 'Fiche_renseignement_2026.pdf', type: 'PDF', size: '412 Ko', date: '2026-08-01' },
    { id: 'D-2', name: 'Photo_identite_recto.jpg', type: 'JPG', size: '184 Ko', date: '2026-07-12' },
    { id: 'D-3', name: 'Rapport_controle_aout.pdf', type: 'PDF', size: '1,2 Mo', date: '2026-08-22' },
  ],
};

const CURRENT_USER: { name: string; role: UserRole } = {
  name: 'M. Traoré',
  role: 'superviseur',
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<
  PersonStatus,
  { label: string; badge: string; dot: string; gradient: string }
> = {
  Recherchée: {
    label: 'Recherchée',
    badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30',
    dot: 'bg-[#EF4444]',
    gradient: 'from-[#EF4444] to-[#B91C1C]',
  },
  Surveillance: {
    label: 'Sous surveillance',
    badge: 'bg-[#FEF6E7] text-[#B45309] ring-1 ring-[#F59E0B]/30',
    dot: 'bg-[#F59E0B]',
    gradient: 'from-[#F59E0B] to-[#B45309]',
  },
  Autorisée: {
    label: 'Autorisée',
    badge: 'bg-[#E7F8F1] text-[#0B7A5B] ring-1 ring-[#10B981]/30',
    dot: 'bg-[#10B981]',
    gradient: 'from-[#10B981] to-[#0B7A5B]',
  },
  Interdite: {
    label: 'Interdite',
    badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30',
    dot: 'bg-[#EF4444]',
    gradient: 'from-[#EF4444] to-[#B91C1C]',
  },
};

const RISK_CONFIG: Record<string, { badge: string; bar: string }> = {
  Faible: { badge: 'bg-[#E7F8F1] text-[#0B7A5B] ring-1 ring-[#10B981]/30', bar: 'bg-[#10B981]' },
  Moyen: { badge: 'bg-[#FEF6E7] text-[#B45309] ring-1 ring-[#F59E0B]/30', bar: 'bg-[#F59E0B]' },
  Élevé: { badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30', bar: 'bg-[#EF4444]' },
};

const CONTROL_RESULT: Record<
  'Match' | 'No Match' | 'Alerte',
  { badge: string; dot: string; label: string }
> = {
  Match: {
    badge: 'bg-[#E7F8F1] text-[#0B7A5B] ring-1 ring-[#10B981]/30',
    dot: 'bg-[#10B981]',
    label: 'Match',
  },
  'No Match': {
    badge: 'bg-[#F1F5F9] text-[#475569] ring-1 ring-[#E2E8F0]',
    dot: 'bg-[#94A3B8]',
    label: 'No Match',
  },
  Alerte: {
    badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30',
    dot: 'bg-[#EF4444]',
    label: 'Alerte',
  },
};

const fmtDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtDateTime = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const formatDate = (iso: string) => fmtDate.format(new Date(iso));
const formatDateTime = (iso: string) => fmtDateTime.format(new Date(iso));

const ageFromBirth = (iso: string) => {
  const b = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
};

const scoreColor = (score: number) =>
  score >= 85 ? 'text-[#10B981]' : score >= 65 ? 'text-[#F59E0B]' : 'text-[#EF4444]';

const scoreBar = (score: number) =>
  score >= 85 ? 'bg-[#10B981]' : score >= 65 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]';

/* ------------------------------------------------------------------ */
/*  ICÔNES                                                             */
/* ------------------------------------------------------------------ */

const IconBack = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconEdit = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 20h9" strokeLinecap="round" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconNote = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const IconDownload = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 21h14" strokeLinecap="round" />
  </svg>
);

const IconDoc = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
  </svg>
);

const IconWarning = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 9v4m0 4h.01M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconInfo = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4m0-4h.01" strokeLinecap="round" />
  </svg>
);

const IconHistory = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3v5h5M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPhone = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconMail = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconMap = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 22s8-6.5 8-12a8 8 0 1 0-16 0c0 5.5 8 12 8 12Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconCalendar = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4m8-4v4M3 11h18" strokeLinecap="round" />
  </svg>
);

const IconClose = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  COMPOSANTS UI                                                      */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: PersonStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  const cfg = RISK_CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badge}`}>
      Risque {level.toLowerCase()}
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F7FB] text-[#1E90FF]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-[#1A1A2E]">{value}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

type TabKey = 'infos' | 'historique' | 'documents';

export default function FichePersonnePage() {
  const [tab, setTab] = useState<TabKey>('infos');
  const [noteModal, setNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [notes, setNotes] = useState<Note[]>(PERSON.notes);

  const person = PERSON;
  const canEdit = CURRENT_USER.role === 'admin' || CURRENT_USER.role === 'superviseur';

  const stats = useMemo(() => {
    const match = person.controls.filter((c) => c.result === 'Match').length;
    const alertes = person.controls.filter((c) => c.result === 'Alerte').length;
    return { total: person.controls.length, match, alertes };
  }, [person.controls]);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      {
        id: `N-${Date.now()}`,
        author: CURRENT_USER.name,
        date: new Date().toISOString(),
        text: newNote.trim(),
        important: false,
      },
      ...prev,
    ]);
    setNewNote('');
    setNoteModal(false);
  };

  const tabs: { key: TabKey; label: string; count?: number; icon: React.ReactNode }[] = [
    { key: 'infos', label: 'Informations', icon: <IconInfo className="h-4 w-4" /> },
    { key: 'historique', label: 'Historique des contrôles', count: person.controls.length, icon: <IconHistory className="h-4 w-4" /> },
    { key: 'documents', label: 'Documents', count: person.documents.length, icon: <IconDoc className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ BREADCRUMB ============ */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
          <button className="inline-flex items-center gap-1 rounded-md text-[#64748B] transition hover:text-[#1E90FF]">
            <IconBack className="h-3.5 w-3.5" />
            Personnes
          </button>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#1A1A2E]">{person.lastName} {person.firstName}</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#1E90FF]">Fiche</span>
        </div>

        {/* ============ HEADER ============ */}
        <header className="mt-4 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="h-24 bg-gradient-to-r from-[#0A2540] via-[#123355] to-[#1E90FF]/70" />

          <div className="px-5 pb-5 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              {/* Photo + identité */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="-mt-14 shrink-0">
                  <div className="relative">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-[#0A2540] to-[#1E90FF] text-3xl font-bold text-white shadow-lg">
                      {person.mainPhoto}
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#10B981]">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
                      {person.firstName} {person.lastName}
                    </h1>
                    <StatusBadge status={person.status} />
                    <RiskBadge level={person.riskLevel} />
                  </div>
                  <p className="mt-1.5 text-sm text-[#64748B]">
                    Réf. <span className="font-semibold text-[#1A1A2E]">{person.id}</span>
                    <span className="mx-2 text-[#CBD5E1]">•</span>
                    {ageFromBirth(person.birthDate)} ans
                    <span className="mx-2 text-[#CBD5E1]">•</span>
                    {person.nationality}
                    <span className="mx-2 text-[#CBD5E1]">•</span>
                    {person.profession}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setNoteModal(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#1A1A2E] shadow-sm transition hover:border-[#1E90FF] hover:text-[#1E90FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20"
                >
                  <IconNote className="h-4 w-4" />
                  Ajouter une note
                </button>

                {canEdit && (
                  <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1E90FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1878d6] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40">
                    <IconEdit className="h-4 w-4" />
                    Modifier
                  </button>
                )}
              </div>
            </div>
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
              {typeof t.count === 'number' && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    tab === t.key ? 'bg-[#EAF3FF] text-[#1E90FF]' : 'bg-[#F4F7FB] text-[#64748B]'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ============ CONTENU DES ONGLETS ============ */}
        <div className="mt-6">
          {/* ---------- ONGLET INFOS ---------- */}
          {tab === 'infos' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Colonne gauche */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                {/* Infos personnelles */}
                <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-5 py-4">
                    <IconInfo className="h-4 w-4 text-[#1E90FF]" />
                    <h2 className="text-sm font-semibold text-[#1A1A2E]">Informations personnelles</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-x-8 divide-y divide-[#E2E8F0] px-5 sm:grid-cols-2 sm:divide-y-0 sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(n+3)]:border-[#E2E8F0]">
                    <InfoRow icon={<IconCalendar className="h-4 w-4" />} label="Date de naissance" value={`${formatDate(person.birthDate)} (${ageFromBirth(person.birthDate)} ans)`} />
                    <InfoRow icon={<IconMap className="h-4 w-4" />} label="Lieu de naissance" value={person.birthPlace} />
                    <InfoRow icon={<IconInfo className="h-4 w-4" />} label="Nationalité" value={person.nationality} />
                    <InfoRow icon={<IconInfo className="h-4 w-4" />} label="N° pièce d'identité" value={person.idNumber} />
                    <InfoRow icon={<IconMap className="h-4 w-4" />} label="Adresse" value={person.address} />
                    <InfoRow icon={<IconMap className="h-4 w-4" />} label="Ville" value={person.city} />
                    <InfoRow icon={<IconPhone className="h-4 w-4" />} label="Téléphone" value={person.phone} />
                    <InfoRow icon={<IconMail className="h-4 w-4" />} label="E-mail" value={person.email} />
                  </div>
                </section>

                {/* Antécédents */}
                <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-5 py-4">
                    <IconWarning className="h-4 w-4 text-[#F59E0B]" />
                    <h2 className="text-sm font-semibold text-[#1A1A2E]">Antécédents / Contexte</h2>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm leading-relaxed text-[#1A1A2E]">{person.background}</p>
                  </div>
                </section>

                {/* Notes */}
                <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
                    <div className="flex items-center gap-2">
                      <IconNote className="h-4 w-4 text-[#1E90FF]" />
                      <h2 className="text-sm font-semibold text-[#1A1A2E]">Notes importantes</h2>
                    </div>
                    <span className="rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold text-[#64748B]">
                      {notes.length}
                    </span>
                  </div>

                  <ul className="divide-y divide-[#E2E8F0]">
                    {notes.map((n) => (
                      <li key={n.id} className="flex gap-4 px-5 py-4">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-[11px] font-bold text-white">
                          {n.author.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-[#1A1A2E]">{n.author}</p>
                            {n.important && (
                              <span className="rounded-full bg-[#FDECEC] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#B91C1C] ring-1 ring-[#EF4444]/30">
                                Important
                              </span>
                            )}
                            <span className="text-xs text-[#64748B]">• {formatDateTime(n.date)}</span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-[#1A1A2E]">{n.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Colonne droite */}
              <div className="flex flex-col gap-6">
                {/* Statut actuel */}
                <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
                  <h2 className="text-sm font-semibold text-[#1A1A2E]">Statut actuel</h2>
                  <div className="mt-4 flex flex-col gap-3">
                    <StatusBadge status={person.status} />
                    <RiskBadge level={person.riskLevel} />
                  </div>

                  <div className="mt-5 border-t border-[#E2E8F0] pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-[#64748B]">Contrôles enregistrés</span>
                      <span className="font-bold text-[#1A1A2E]">{stats.total}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFD] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Match</p>
                        <p className="mt-1 text-xl font-bold tabular-nums text-[#0B7A5B]">{stats.match}</p>
                      </div>
                      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFD] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Alertes</p>
                        <p className="mt-1 text-xl font-bold tabular-nums text-[#B91C1C]">{stats.alertes}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Galerie */}
                <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#1A1A2E]">Galerie</h2>
                    <span className="text-xs text-[#64748B]">
                      {galleryIndex + 1} / {person.gallery.length}
                    </span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-[#E2E8F0]">
                    <div className="flex h-52 items-center justify-center bg-gradient-to-br from-[#0A2540] to-[#1E90FF] text-4xl font-bold text-white">
                      {person.gallery[galleryIndex]}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {person.gallery.map((g, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        className={`flex h-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#0A2540] to-[#1E90FF] text-xs font-bold text-white transition ${
                          i === galleryIndex
                            ? 'ring-2 ring-[#1E90FF] ring-offset-2 ring-offset-white'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ---------- ONGLET HISTORIQUE ---------- */}
          {tab === 'historique' && (
            <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
                <div className="flex items-center gap-2">
                  <IconHistory className="h-4 w-4 text-[#1E90FF]" />
                  <h2 className="text-sm font-semibold text-[#1A1A2E]">Historique des contrôles</h2>
                </div>
                <span className="rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold text-[#64748B]">
                  {person.controls.length} enregistrement{person.controls.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#0A2540] text-white">
                      {['Réf.', 'Date & Heure', 'Agent', 'Localisation', 'Score', 'Résultat'].map((h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${i === 5 ? 'text-right' : ''}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {person.controls.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-[#E2E8F0] transition-colors last:border-0 even:bg-[#F8FAFD] hover:bg-[#EAF3FF]"
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm font-semibold text-[#1E90FF]">
                          {c.id}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#1A1A2E]">
                          {formatDateTime(c.datetime)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A2540] text-[11px] font-bold text-white">
                              {c.agent.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-[#1A1A2E]">{c.agent}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#64748B]">{c.location}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex w-[110px] flex-col gap-1.5">
                            <span className={`text-sm font-bold tabular-nums ${scoreColor(c.score)}`}>
                              {c.score}%
                            </span>
                            <span className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                              <span className={`block h-full rounded-full ${scoreBar(c.score)}`} style={{ width: `${c.score}%` }} />
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${CONTROL_RESULT[c.result].badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${CONTROL_RESULT[c.result].dot}`} />
                            {CONTROL_RESULT[c.result].label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ---------- ONGLET DOCUMENTS ---------- */}
          {tab === 'documents' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {person.documents.map((d) => (
                <div
                  key={d.id}
                  className="group flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)] transition hover:border-[#1E90FF] hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF3FF] text-[#1E90FF]">
                      <IconDoc className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-[#F4F7FB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      {d.type}
                    </span>
                  </div>

                  <p className="mt-4 truncate text-sm font-semibold text-[#1A1A2E]" title={d.name}>
                    {d.name}
                  </p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {d.size} • Ajouté le {formatDate(d.date)}
                  </p>

                  <button className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#1A1A2E] transition group-hover:border-[#1E90FF] group-hover:text-[#1E90FF]">
                    <IconDownload className="h-3.5 w-3.5" />
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ============ MODALE AJOUT NOTE ============ */}
      {noteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/50 p-4 backdrop-blur-sm"
          onClick={() => setNoteModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-[#0A2540] px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Ajouter une note</h3>
              <button
                onClick={() => setNoteModal(false)}
                className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Fermer"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-xs text-[#64748B]">
                Concernant{' '}
                <span className="font-semibold text-[#1A1A2E]">
                  {person.firstName} {person.lastName}
                </span>
              </p>

              <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Contenu de la note
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={5}
                placeholder="Saisissez vos observations…"
                className="mt-1.5 w-full resize-none rounded-lg border border-[#E2E8F0] bg-white p-3 text-sm text-[#1A1A2E] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setNoteModal(false)}
                  className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
                >
                  Annuler
                </button>
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="h-10 rounded-lg bg-[#1E90FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1878d6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Enregistrer la note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}