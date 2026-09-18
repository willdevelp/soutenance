// app/identites/page.tsx
'use client';

import { useMemo, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  TYPES & DONNÉES DE DÉMO                                            */
/* ------------------------------------------------------------------ */

type IdentityStatus = 'Libre' | 'Recherché' | 'Surveillance' | 'Interdit';

interface Identity {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  birthDate: string;
  nationality: string;
  gender: 'M' | 'F';
  address: string;
  phone: string;
  status: IdentityStatus;
  riskLevel: 'Faible' | 'Moyen' | 'Élevé';
  photoInitials: string;
  photosCount: number;
  lastSeen: string | null;
  createdAt: string;
  notes?: string;
}

const IDENTITIES: Identity[] = [
  {
    id: 'ID-001',
    firstName: 'Ibrahim',
    lastName: 'Sow',
    idNumber: 'SN-874512036',
    birthDate: '1987-04-12',
    nationality: 'Sénégalaise',
    gender: 'M',
    address: '18 Rue des Almadies, Abidjan',
    phone: '+225 07 88 45 12 36',
    status: 'Recherché',
    riskLevel: 'Élevé',
    photoInitials: 'IS',
    photosCount: 4,
    lastSeen: '2026-09-15T08:42:00Z',
    createdAt: '2024-03-10T10:20:00Z',
    notes: 'Signalé dans l’enquête ENQ-2024-118.',
  },
  {
    id: 'ID-002',
    firstName: 'Aïcha',
    lastName: 'Belkacem',
    idNumber: 'DZ-441209871',
    birthDate: '1992-11-08',
    nationality: 'Algérienne',
    gender: 'F',
    address: 'Zone 4, Marcory, Abidjan',
    phone: '+225 05 44 78 91 02',
    status: 'Surveillance',
    riskLevel: 'Moyen',
    photoInitials: 'AB',
    photosCount: 2,
    lastSeen: '2026-09-12T14:03:00Z',
    createdAt: '2024-06-22T09:15:00Z',
  },
  {
    id: 'ID-003',
    firstName: 'Karim',
    lastName: 'Haddad',
    idNumber: 'MA-330298451',
    birthDate: '1979-06-25',
    nationality: 'Marocaine',
    gender: 'M',
    address: 'Rue du Commerce, Treichville',
    phone: '+225 01 23 45 67 89',
    status: 'Libre',
    riskLevel: 'Faible',
    photoInitials: 'KH',
    photosCount: 3,
    lastSeen: '2026-08-28T19:31:00Z',
    createdAt: '2024-02-14T11:45:00Z',
  },
  {
    id: 'ID-004',
    firstName: 'Fatou',
    lastName: 'Ndiaye',
    idNumber: 'SN-556781234',
    birthDate: '1995-02-18',
    nationality: 'Sénégalaise',
    gender: 'F',
    address: 'Cité Sicogi, Yopougon',
    phone: '+225 07 11 22 33 44',
    status: 'Libre',
    riskLevel: 'Faible',
    photoInitials: 'FN',
    photosCount: 1,
    lastSeen: '2026-09-08T07:12:00Z',
    createdAt: '2025-01-05T15:00:00Z',
  },
  {
    id: 'ID-005',
    firstName: 'Youssef',
    lastName: 'Amrani',
    idNumber: 'MA-119876543',
    birthDate: '1983-09-30',
    nationality: 'Marocaine',
    gender: 'M',
    address: 'Boulevard Latrille, Cocody',
    phone: '+225 05 66 77 88 99',
    status: 'Interdit',
    riskLevel: 'Élevé',
    photoInitials: 'YA',
    photosCount: 5,
    lastSeen: '2026-07-19T10:55:00Z',
    createdAt: '2023-11-18T08:30:00Z',
    notes: 'Interdiction de territoire émise le 12/07/2026.',
  },
  {
    id: 'ID-006',
    firstName: 'Nadia',
    lastName: 'Bakayoko',
    idNumber: 'CI-998877665',
    birthDate: '1990-12-03',
    nationality: 'Ivoirienne',
    gender: 'F',
    address: 'Angré 8ème Tranche, Cocody',
    phone: '+225 07 55 44 33 22',
    status: 'Surveillance',
    riskLevel: 'Moyen',
    photoInitials: 'NB',
    photosCount: 2,
    lastSeen: '2026-09-14T16:10:00Z',
    createdAt: '2024-08-30T13:20:00Z',
  },
  {
    id: 'ID-007',
    firstName: 'David',
    lastName: 'Mensah',
    idNumber: 'GH-221144556',
    birthDate: '1988-05-14',
    nationality: 'Ghanéenne',
    gender: 'M',
    address: 'Rue Pierre et Marie Curie, Plateau',
    phone: '+225 01 99 88 77 66',
    status: 'Libre',
    riskLevel: 'Faible',
    photoInitials: 'DM',
    photosCount: 1,
    lastSeen: null,
    createdAt: '2025-04-02T10:00:00Z',
  },
  {
    id: 'ID-008',
    firstName: 'Salimata',
    lastName: 'Cissé',
    idNumber: 'ML-556633221',
    birthDate: '1993-07-22',
    nationality: 'Malienne',
    gender: 'F',
    address: 'Koumassi Remblais, Abidjan',
    phone: '+225 05 12 34 56 78',
    status: 'Recherché',
    riskLevel: 'Élevé',
    photoInitials: 'SC',
    photosCount: 3,
    lastSeen: '2026-09-16T11:20:00Z',
    createdAt: '2025-02-20T14:30:00Z',
    notes: 'Mandat d’arrêt international en cours.',
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<
  IdentityStatus,
  { label: string; badge: string; dot: string; gradient: string; accent: string }
> = {
  Libre: {
    label: 'Libre',
    badge: 'bg-[#E7F8F1] text-[#0B7A5B] ring-1 ring-[#10B981]/30',
    dot: 'bg-[#10B981]',
    gradient: 'from-[#10B981] to-[#0B7A5B]',
    accent: 'bg-[#10B981]',
  },
  Recherché: {
    label: 'Recherché',
    badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30',
    dot: 'bg-[#EF4444]',
    gradient: 'from-[#EF4444] to-[#B91C1C]',
    accent: 'bg-[#EF4444]',
  },
  Surveillance: {
    label: 'Surveillance',
    badge: 'bg-[#FEF6E7] text-[#B45309] ring-1 ring-[#F59E0B]/30',
    dot: 'bg-[#F59E0B]',
    gradient: 'from-[#F59E0B] to-[#B45309]',
    accent: 'bg-[#F59E0B]',
  },
  Interdit: {
    label: 'Interdit',
    badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30',
    dot: 'bg-[#EF4444]',
    gradient: 'from-[#0A2540] to-[#EF4444]',
    accent: 'bg-[#EF4444]',
  },
};

const RISK_CONFIG: Record<string, { badge: string }> = {
  Faible: { badge: 'bg-[#E7F8F1] text-[#0B7A5B] ring-1 ring-[#10B981]/30' },
  Moyen: { badge: 'bg-[#FEF6E7] text-[#B45309] ring-1 ring-[#F59E0B]/30' },
  Élevé: { badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30' },
};

const fmtDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtDateTime = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const ageFromBirth = (iso: string) => {
  const b = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
};

/* ------------------------------------------------------------------ */
/*  ICÔNES                                                             */
/* ------------------------------------------------------------------ */

const IconSearch = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
  </svg>
);

const IconPlus = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const IconGrid = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconList = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
  </svg>
);

const IconEye = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const IconEdit = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 20h9" strokeLinecap="round" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconClose = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

const IconChevron = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCamera = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconUser = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconNote = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconShield = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
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

/* ------------------------------------------------------------------ */
/*  COMPOSANTS UI                                                      */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: IdentityStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${RISK_CONFIG[level].badge}`}>
      Risque {level.toLowerCase()}
    </span>
  );
}

function PhotoAvatar({
  initials,
  status,
  size = 'md',
}: {
  initials: string;
  status: IdentityStatus;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'h-10 w-10 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-14 w-14 text-base',
  };
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-white shadow-sm ${STATUS_CONFIG[status].gradient} ${sizes[size]}`}
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  FORMULAIRE (MODAL)                                                 */
/* ------------------------------------------------------------------ */

interface FormState {
  firstName: string;
  lastName: string;
  idNumber: string;
  birthDate: string;
  nationality: string;
  gender: 'M' | 'F';
  address: string;
  phone: string;
  status: IdentityStatus;
  riskLevel: 'Faible' | 'Moyen' | 'Élevé';
  notes: string;
}

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  idNumber: '',
  birthDate: '',
  nationality: '',
  gender: 'M',
  address: '',
  phone: '',
  status: 'Libre',
  riskLevel: 'Faible',
  notes: '',
};

function IdentityModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: FormState, photos: string[]) => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photos, setPhotos] = useState<{ id: string; name: string; preview: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).map((f) => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      preview: URL.createObjectURL(f),
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 6));
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const submit = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Le nom et le prénom sont obligatoires.');
      return;
    }
    if (!form.idNumber.trim()) {
      setError('Le numéro d’identité est obligatoire.');
      return;
    }
    if (!form.birthDate) {
      setError('La date de naissance est obligatoire.');
      return;
    }
    if (photos.length === 0) {
      setError('Ajoutez au moins une photo.');
      return;
    }
    onSave(form, photos.map((p) => p.preview));
  };

  const inputClass =
    'h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1A1A2E] ' +
    'placeholder:text-[#94A3B8] outline-none transition ' +
    'focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0A2540]/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between bg-[#0A2540] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
              <IconUser className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Ajouter une identité</h3>
              <p className="text-[11px] text-white/60">Enregistrer une nouvelle personne au fichier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        {/* Corps */}
        <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-5 py-5">
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-[#EF4444]/30 bg-[#FDECEC] px-4 py-3 text-sm text-[#B91C1C]">
              <span className="mt-0.5 h-4 w-4 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                </svg>
              </span>
              {error}
            </div>
          )}

          {/* Section 1 — Photos */}
          <div className="mb-3 flex items-center gap-2">
            <IconCamera className="h-4 w-4 text-[#1E90FF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
              Photos ({photos.length}/6)
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {photos.map((p) => (
              <div
                key={p.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F4F7FB]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt={p.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(p.id)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-[#EF4444] text-white opacity-0 shadow-sm transition group-hover:opacity-100"
                  aria-label="Supprimer la photo"
                >
                  <IconTrash className="h-3 w-3" />
                </button>
              </div>
            ))}

            {photos.length < 6 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] transition hover:border-[#1E90FF] hover:bg-[#EAF3FF] hover:text-[#1E90FF]"
              >
                <IconCamera className="h-5 w-5" />
                <span className="text-[10px] font-semibold">Ajouter</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Séparateur */}
          <div className="my-6 h-px bg-[#E2E8F0]" />

          {/* Section 2 — Identité */}
          <div className="mb-3 flex items-center gap-2">
            <IconUser className="h-4 w-4 text-[#1E90FF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
              Informations personnelles
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Prénom *
              </label>
              <input
                value={form.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                placeholder="Ex. Ibrahim"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Nom *
              </label>
              <input
                value={form.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                placeholder="Ex. Sow"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Numéro d’identité *
              </label>
              <input
                value={form.idNumber}
                onChange={(e) => setField('idNumber', e.target.value)}
                placeholder="Ex. SN-874512036"
                className={`${inputClass} font-mono uppercase`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Date de naissance *
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setField('birthDate', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Nationalité
              </label>
              <input
                value={form.nationality}
                onChange={(e) => setField('nationality', e.target.value)}
                placeholder="Ex. Sénégalaise"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Sexe
              </label>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-1">
                {(['M', 'F'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setField('gender', g)}
                    className={`h-full flex-1 rounded-md text-xs font-semibold transition ${
                      form.gender === g
                        ? 'bg-[#EAF3FF] text-[#1E90FF] ring-1 ring-[#1E90FF]/30'
                        : 'text-[#64748B] hover:text-[#1A1A2E]'
                    }`}
                  >
                    {g === 'M' ? 'Masculin' : 'Féminin'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Téléphone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="+225 XX XX XX XX XX"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Adresse
              </label>
              <input
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder="Ex. 18 Rue des Almadies, Abidjan"
                className={inputClass}
              />
            </div>
          </div>

          {/* Séparateur */}
          <div className="my-6 h-px bg-[#E2E8F0]" />

          {/* Section 3 — Statut */}
          <div className="mb-3 flex items-center gap-2">
            <IconShield className="h-4 w-4 text-[#1E90FF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
              Statut de la personne
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(['Libre', 'Surveillance', 'Recherché', 'Interdit'] as IdentityStatus[]).map((s) => {
              const active = form.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setField('status', s)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-bold transition ${
                    active
                      ? 'border-[#1E90FF] bg-[#EAF3FF] text-[#1E90FF] ring-2 ring-[#1E90FF]/20'
                      : 'border-[#E2E8F0] bg-white text-[#1A1A2E] hover:border-[#1E90FF]/50'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                  {STATUS_CONFIG[s].label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Niveau de risque
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Faible', 'Moyen', 'Élevé'] as const).map((r) => {
                const active = form.riskLevel === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setField('riskLevel', r)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      active
                        ? 'border-[#1E90FF] bg-[#EAF3FF] text-[#1E90FF] ring-2 ring-[#1E90FF]/20'
                        : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#1E90FF]/50'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Séparateur */}
          <div className="my-6 h-px bg-[#E2E8F0]" />

          {/* Section 4 — Notes */}
          <div className="mb-3 flex items-center gap-2">
            <IconNote className="h-4 w-4 text-[#1E90FF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
              Notes complémentaires
            </h4>
          </div>

          <textarea
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={4}
            placeholder="Observations, antécédents, contexte de signalement…"
            className="w-full resize-none rounded-lg border border-[#E2E8F0] bg-white p-3 text-sm text-[#1A1A2E] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
          />
        </div>

        {/* Pied */}
        <div className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
          <p className="hidden text-[11px] text-[#64748B] sm:block">
            Les champs marqués <span className="font-bold text-[#EF4444]">*</span> sont obligatoires.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
            >
              Annuler
            </button>
            <button
              onClick={submit}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1E90FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1878d6] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40"
            >
              <IconPlus className="h-4 w-4" />
              Enregistrer l’identité
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

type ViewMode = 'grid' | 'list';
const ALL = 'Tous';

export default function IdentitesPage() {
  const [identities, setIdentities] = useState<Identity[]>(IDENTITIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [riskFilter, setRiskFilter] = useState<string>(ALL);
  const [view, setView] = useState<ViewMode>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* ---- filtrage + recherche ---- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return identities.filter((p) => {
      if (statusFilter !== ALL && p.status !== statusFilter) return false;
      if (riskFilter !== ALL && p.riskLevel !== riskFilter) return false;
      if (q) {
        const hay = `${p.firstName} ${p.lastName} ${p.idNumber} ${p.nationality} ${p.address} ${p.phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [identities, search, statusFilter, riskFilter]);

  /* ---- stats ---- */
  const stats = useMemo(
    () => ({
      total: identities.length,
      recherche: identities.filter((p) => p.status === 'Recherché').length,
      surveillance: identities.filter((p) => p.status === 'Surveillance').length,
      libre: identities.filter((p) => p.status === 'Libre').length,
    }),
    [identities],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter(ALL);
    setRiskFilter(ALL);
  };

  /* ---- création ---- */
  const handleSave = (data: FormState, photos: string[]) => {
    const initials =
      (data.firstName[0] + data.lastName[0]).toUpperCase();
    const newIdentity: Identity = {
      id: `ID-${String(identities.length + 1).padStart(3, '0')}`,
      firstName: data.firstName,
      lastName: data.lastName,
      idNumber: data.idNumber,
      birthDate: data.birthDate,
      nationality: data.nationality || '—',
      gender: data.gender,
      address: data.address || '—',
      phone: data.phone || '—',
      status: data.status,
      riskLevel: data.riskLevel,
      photoInitials: initials,
      photosCount: photos.length,
      lastSeen: null,
      createdAt: new Date().toISOString(),
      notes: data.notes,
    };
    setIdentities((prev) => [newIdentity, ...prev]);
    setModalOpen(false);
    showToast(`Identité ${data.firstName} ${data.lastName} ajoutée au fichier.`);
  };

  const inputBase =
    'h-10 w-full rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#1A1A2E] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20';

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ EN-TÊTE ============ */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>Fichier</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#1E90FF]">Identités</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
              Base de données d’identités
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Consultez et gérez le fichier complet des personnes enregistrées.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-[#1E90FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1878d6] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40 lg:self-auto"
          >
            <IconPlus className="h-4 w-4" />
            Ajouter une identité
          </button>
        </header>

        {/* ============ STATS ============ */}
        <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[
            { label: 'Total fiches', value: stats.total, accent: 'bg-[#1E90FF]', color: 'text-[#1A1A2E]' },
            { label: 'Personnes recherchées', value: stats.recherche, accent: 'bg-[#EF4444]', color: 'text-[#B91C1C]' },
            { label: 'Sous surveillance', value: stats.surveillance, accent: 'bg-[#F59E0B]', color: 'text-[#B45309]' },
            { label: 'Libres', value: stats.libre, accent: 'bg-[#10B981]', color: 'text-[#0B7A5B]' },
          ].map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${s.accent}`} />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{s.label}</p>
              <p className={`mt-2 text-3xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </section>

        {/* ============ BARRE DE RECHERCHE + FILTRES ============ */}
        <section className="mt-6 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          {/* Recherche principale */}
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, numéro d’identité, nationalité, adresse ou téléphone…"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-12 pr-4 text-sm font-medium text-[#1A1A2E] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1E90FF] focus:bg-white focus:ring-2 focus:ring-[#1E90FF]/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#64748B] transition hover:bg-[#F4F7FB] hover:text-[#1A1A2E]"
                aria-label="Effacer"
              >
                <IconClose className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filtres secondaires */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Statut
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`${inputBase} cursor-pointer appearance-none pr-9`}
                >
                  <option>{ALL}</option>
                  <option>Libre</option>
                  <option>Surveillance</option>
                  <option>Recherché</option>
                  <option>Interdit</option>
                </select>
                <IconChevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Niveau de risque
              </label>
              <div className="relative">
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className={`${inputBase} cursor-pointer appearance-none pr-9`}
                >
                  <option>{ALL}</option>
                  <option>Faible</option>
                  <option>Moyen</option>
                  <option>Élevé</option>
                </select>
                <IconChevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              </div>
            </div>

            {/* Bascule vue */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Affichage
              </label>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1">
                  <button
                    onClick={() => setView('grid')}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition ${
                      view === 'grid'
                        ? 'bg-white text-[#1E90FF] shadow-sm ring-1 ring-[#E2E8F0]'
                        : 'text-[#64748B] hover:text-[#1A1A2E]'
                    }`}
                  >
                    <IconGrid className="h-3.5 w-3.5" />
                    Grille
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition ${
                      view === 'list'
                        ? 'bg-white text-[#1E90FF] shadow-sm ring-1 ring-[#E2E8F0]'
                        : 'text-[#64748B] hover:text-[#1A1A2E]'
                    }`}
                  >
                    <IconList className="h-3.5 w-3.5" />
                    Tableau
                  </button>
                </div>

                <button
                  onClick={resetFilters}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
                >
                  <IconReset className="h-3.5 w-3.5" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#E2E8F0] pt-4">
            <span className="text-xs text-[#64748B]">
              <span className="font-semibold text-[#1A1A2E]">{filtered.length}</span> résultat{filtered.length > 1 ? 's' : ''}
            </span>
            {statusFilter !== ALL && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3FF] px-2.5 py-1 text-[11px] font-semibold text-[#1E90FF]">
                Statut : {statusFilter}
              </span>
            )}
            {riskFilter !== ALL && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F7FB] px-2.5 py-1 text-[11px] font-semibold text-[#64748B]">
                Risque : {riskFilter}
              </span>
            )}
          </div>
        </section>

        {/* ============ RÉSULTATS ============ */}
        {filtered.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-5 py-20 shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F7FB] text-[#64748B]">
              <IconSearch className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-semibold text-[#1A1A2E]">Aucune identité trouvée</p>
            <p className="mt-1 text-xs text-[#64748B]">
              Essayez d’ajuster votre recherche ou vos filtres.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-xs font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
            >
              <IconReset className="h-3.5 w-3.5" />
              Réinitialiser les filtres
            </button>
          </div>
        ) : view === 'grid' ? (
          /* --------- VUE GRILLE --------- */
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)] transition hover:border-[#1E90FF] hover:shadow-md"
              >
                {/* Bandeau supérieur */}
                <div className={`h-16 bg-gradient-to-r ${STATUS_CONFIG[p.status].gradient}`} />

                {/* Photo */}
                <div className="-mt-10 flex justify-center">
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br text-xl font-bold text-white shadow-md ${STATUS_CONFIG[p.status].gradient}`}
                  >
                    {p.photoInitials}
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3 text-center">
                  <h3 className="text-sm font-bold text-[#1A1A2E]">
                    {p.firstName} {p.lastName}
                  </h3>
                  <p className="mt-0.5 font-mono text-[11px] font-semibold text-[#64748B]">
                    {p.idNumber}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    <StatusBadge status={p.status} />
                    <RiskBadge level={p.riskLevel} />
                  </div>

                  <dl className="mt-4 space-y-1.5 border-t border-[#E2E8F0] pt-3 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[11px] text-[#64748B]">Âge</dt>
                      <dd className="text-[11px] font-semibold text-[#1A1A2E]">
                        {ageFromBirth(p.birthDate)} ans
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[11px] text-[#64748B]">Nationalité</dt>
                      <dd className="text-[11px] font-semibold text-[#1A1A2E]">{p.nationality}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[11px] text-[#64748B]">Dernier contrôle</dt>
                      <dd className="text-[11px] font-semibold text-[#1A1A2E]">
                        {p.lastSeen ? fmtDate.format(new Date(p.lastSeen)) : '—'}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-center gap-2">
                    <button className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#1A1A2E] transition hover:border-[#1E90FF] hover:text-[#1E90FF]">
                      <IconEye className="h-3.5 w-3.5" />
                      Voir la fiche
                    </button>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
                      aria-label="Modifier"
                    >
                      <IconEdit className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Badge photos */}
                {p.photosCount > 1 && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    <IconCamera className="h-3 w-3" />
                    {p.photosCount}
                  </span>
                )}
              </article>
            ))}
          </section>
        ) : (
          /* --------- VUE TABLEAU --------- */
          <section className="mt-6 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#0A2540] text-white">
                    {['Personne', 'N° d’identité', 'Naissance', 'Nationalité', 'Statut', 'Risque', 'Dernier contrôle', 'Actions'].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${
                            i === 7 ? 'text-right' : ''
                          }`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-[#E2E8F0] transition-colors last:border-0 even:bg-[#F8FAFD] hover:bg-[#EAF3FF]"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <PhotoAvatar initials={p.photoInitials} status={p.status} size="sm" />
                          <div>
                            <div className="text-sm font-semibold text-[#1A1A2E]">
                              {p.firstName} {p.lastName}
                            </div>
                            <div className="text-xs text-[#64748B]">{p.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="rounded-md bg-[#F4F7FB] px-2.5 py-1 font-mono text-xs font-semibold text-[#1A1A2E]">
                          {p.idNumber}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="text-sm text-[#1A1A2E]">{fmtDate.format(new Date(p.birthDate))}</div>
                        <div className="text-xs text-[#64748B]">{ageFromBirth(p.birthDate)} ans</div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#1A1A2E]">
                        {p.nationality}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <RiskBadge level={p.riskLevel} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm text-[#64748B]">
                        {p.lastSeen ? fmtDateTime.format(new Date(p.lastSeen)) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E90FF] transition hover:border-[#1E90FF] hover:bg-[#EAF3FF]">
                            <IconEye className="h-3.5 w-3.5" />
                            Voir
                          </button>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
                            aria-label="Modifier"
                          >
                            <IconEdit className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* ============ MODALE AJOUT ============ */}
      {modalOpen && <IdentityModal onClose={() => setModalOpen(false)} onSave={handleSave} />}

      {/* ============ TOAST ============ */}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
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