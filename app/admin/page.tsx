// app/agents/page.tsx
'use client';

import { useMemo, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  TYPES & DONNÉES DE DÉMO                                            */
/* ------------------------------------------------------------------ */

type Role = 'Agent' | 'Superviseur' | 'Admin';
type AgentStatus = 'Actif' | 'Inactif';

interface Permission {
  id: string;
  label: string;
  description: string;
}

interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  role: Role;
  status: AgentStatus;
  lastLogin: string | null; // ISO
  permissions: string[];
  createdAt: string;
}

const PERMISSIONS: Permission[] = [
  { id: 'scan.view', label: 'Consulter les scans', description: 'Accès à l’historique des contrôles' },
  { id: 'scan.export', label: 'Exporter les scans', description: 'Générer des exports Excel / PDF' },
  { id: 'person.view', label: 'Consulter les fiches', description: 'Accès aux fiches d’identité' },
  { id: 'person.edit', label: 'Modifier les fiches', description: 'Éditer les informations personnelles' },
  { id: 'person.note', label: 'Ajouter des notes', description: 'Créer des notes sur une personne' },
  { id: 'stats.view', label: 'Voir les statistiques', description: 'Accès au tableau de bord analytique' },
  { id: 'agent.manage', label: 'Gérer les agents', description: 'Créer, modifier, désactiver des comptes' },
  { id: 'system.settings', label: 'Paramètres système', description: 'Configuration avancée de la plateforme' },
];

const ROLE_PRESETS: Record<Role, string[]> = {
  Agent: ['scan.view', 'person.view', 'person.note'],
  Superviseur: ['scan.view', 'scan.export', 'person.view', 'person.edit', 'person.note', 'stats.view'],
  Admin: PERMISSIONS.map((p) => p.id),
};

const AGENTS: Agent[] = [
  {
    id: 'AG-001',
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'a.diallo@example.com',
    matricule: 'MAT-1024',
    role: 'Superviseur',
    status: 'Actif',
    lastLogin: '2026-09-18T07:42:00Z',
    permissions: ROLE_PRESETS.Superviseur,
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'AG-002',
    firstName: 'Mariam',
    lastName: 'Traoré',
    email: 'm.traore@example.com',
    matricule: 'MAT-1025',
    role: 'Admin',
    status: 'Actif',
    lastLogin: '2026-09-18T06:15:00Z',
    permissions: ROLE_PRESETS.Admin,
    createdAt: '2023-11-02T10:30:00Z',
  },
  {
    id: 'AG-003',
    firstName: 'Souleymane',
    lastName: 'Koné',
    email: 's.kone@example.com',
    matricule: 'MAT-1026',
    role: 'Agent',
    status: 'Actif',
    lastLogin: '2026-09-17T22:08:00Z',
    permissions: ROLE_PRESETS.Agent,
    createdAt: '2024-03-20T14:00:00Z',
  },
  {
    id: 'AG-004',
    firstName: 'Kadidja',
    lastName: 'Bamba',
    email: 'k.bamba@example.com',
    matricule: 'MAT-1027',
    role: 'Agent',
    status: 'Inactif',
    lastLogin: '2026-08-30T18:24:00Z',
    permissions: ROLE_PRESETS.Agent,
    createdAt: '2024-05-11T08:45:00Z',
  },
  {
    id: 'AG-005',
    firstName: 'Fatim',
    lastName: 'Ouédraogo',
    email: 'f.ouedraogo@example.com',
    matricule: 'MAT-1028',
    role: 'Superviseur',
    status: 'Actif',
    lastLogin: '2026-09-18T05:03:00Z',
    permissions: ROLE_PRESETS.Superviseur,
    createdAt: '2024-02-08T11:20:00Z',
  },
  {
    id: 'AG-006',
    firstName: 'Luc',
    lastName: 'Mensah',
    email: 'l.mensah@example.com',
    matricule: 'MAT-1029',
    role: 'Agent',
    status: 'Actif',
    lastLogin: '2026-09-16T13:50:00Z',
    permissions: ROLE_PRESETS.Agent,
    createdAt: '2024-06-01T09:10:00Z',
  },
  {
    id: 'AG-007',
    firstName: 'Nadia',
    lastName: 'Bakayoko',
    email: 'n.bakayoko@example.com',
    matricule: 'MAT-1030',
    role: 'Agent',
    status: 'Inactif',
    lastLogin: null,
    permissions: ROLE_PRESETS.Agent,
    createdAt: '2026-08-22T15:30:00Z',
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const fmtDateTime = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const fmtRelative = (iso: string | null) => {
  if (!iso) return 'Jamais connecté';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'À l’instant';
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `Il y a ${days} j`;
  return fmtDateTime.format(d);
};

const initials = (first: string, last: string) =>
  (first[0] + last[0]).toUpperCase();

const ROLE_CONFIG: Record<Role, { badge: string; dot: string; gradient: string }> = {
  Admin: {
    badge: 'bg-[#FDECEC] text-[#B91C1C] ring-1 ring-[#EF4444]/30',
    dot: 'bg-[#EF4444]',
    gradient: 'from-[#0A2540] to-[#EF4444]',
  },
  Superviseur: {
    badge: 'bg-[#EAF3FF] text-[#1E90FF] ring-1 ring-[#1E90FF]/30',
    dot: 'bg-[#1E90FF]',
    gradient: 'from-[#0A2540] to-[#1E90FF]',
  },
  Agent: {
    badge: 'bg-[#F1F5F9] text-[#475569] ring-1 ring-[#E2E8F0]',
    dot: 'bg-[#94A3B8]',
    gradient: 'from-[#64748B] to-[#94A3B8]',
  },
};

const STATUS_CONFIG: Record<AgentStatus, { badge: string; dot: string }> = {
  Actif: {
    badge: 'bg-[#E7F8F1] text-[#0B7A5B] ring-1 ring-[#10B981]/30',
    dot: 'bg-[#10B981]',
  },
  Inactif: {
    badge: 'bg-[#F1F5F9] text-[#475569] ring-1 ring-[#E2E8F0]',
    dot: 'bg-[#94A3B8]',
  },
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

const IconEdit = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 20h9" strokeLinecap="round" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBan = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m5.6 5.6 12.8 12.8" strokeLinecap="round" />
  </svg>
);

const IconCheck = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
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

const IconEye = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const IconEyeOff = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M17.9 17.9A10.1 10.1 0 0 1 12 20c-6.4 0-10-8-10-8a17.9 17.9 0 0 1 4.1-5.2M9.9 4.2A10 10 0 0 1 12 4c6.4 0 10 8 10 8a18 18 0 0 1-2.4 3.5M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconUsers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
  </svg>
);

const IconShield = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconKey = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx="8" cy="15" r="4" />
    <path d="m10.9 12.1 8.1-8.1M17 6l2 2M14 9l2 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  COMPOSANTS UI                                                      */
/* ------------------------------------------------------------------ */

function RoleBadge({ role }: { role: Role }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function AgentAvatar({ first, last, role }: { first: string; last: string; role: Role }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white shadow-sm ${ROLE_CONFIG[role].gradient}`}
    >
      {initials(first, last)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  FORMULAIRE (MODAL)                                                 */
/* ------------------------------------------------------------------ */

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  password: string;
  role: Role;
  permissions: string[];
}

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  matricule: '',
  password: '',
  role: 'Agent',
  permissions: ROLE_PRESETS.Agent,
};

function AgentModal({
  mode,
  agent,
  onClose,
  onSave,
}: {
  mode: 'create' | 'edit';
  agent: Agent | null;
  onClose: () => void;
  onSave: (data: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(
    agent
      ? {
          firstName: agent.firstName,
          lastName: agent.lastName,
          email: agent.email,
          matricule: agent.matricule,
          password: '',
          role: agent.role,
          permissions: agent.permissions,
        }
      : emptyForm,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCreate = mode === 'create';

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const handleRoleChange = (role: Role) => {
    setForm((p) => ({
      ...p,
      role,
      permissions: ROLE_PRESETS[role],
    }));
  };

  const togglePermission = (id: string) => {
    setForm((p) => ({
      ...p,
      permissions: p.permissions.includes(id)
        ? p.permissions.filter((x) => x !== id)
        : [...p.permissions, id],
    }));
  };

  const submit = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Le nom et le prénom sont obligatoires.');
      return;
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Adresse e-mail invalide.');
      return;
    }
    if (!form.matricule.trim()) {
      setError('Le matricule est obligatoire.');
      return;
    }
    if (isCreate && form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (form.permissions.length === 0) {
      setError('Sélectionnez au moins une permission.');
      return;
    }
    onSave(form);
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
              {isCreate ? <IconPlus className="h-4 w-4" /> : <IconEdit className="h-4 w-4" />}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {isCreate ? 'Ajouter un agent' : 'Modifier l’agent'}
              </h3>
              <p className="text-[11px] text-white/60">
                {isCreate ? 'Créer un nouveau compte utilisateur' : `Réf. ${agent?.id}`}
              </p>
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

          {/* Section 1 — Identité */}
          <div className="mb-2 flex items-center gap-2">
            <IconUsers className="h-4 w-4 text-[#1E90FF]" />
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
                placeholder="Ex. Amadou"
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
                placeholder="Ex. Diallo"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Adresse e-mail *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="prenom.nom@example.com"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Matricule *
              </label>
              <input
                value={form.matricule}
                onChange={(e) => setField('matricule', e.target.value)}
                placeholder="MAT-XXXX"
                className={`${inputClass} font-mono uppercase`}
              />
            </div>
          </div>

          {/* Séparateur */}
          <div className="my-6 h-px bg-[#E2E8F0]" />

          {/* Section 2 — Sécurité */}
          <div className="mb-2 flex items-center gap-2">
            <IconKey className="h-4 w-4 text-[#1E90FF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">Sécurité</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                {isCreate ? 'Mot de passe *' : 'Nouveau mot de passe (laisser vide pour conserver)'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#64748B] transition hover:bg-[#F4F7FB] hover:text-[#1A1A2E]"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="my-6 h-px bg-[#E2E8F0]" />

          {/* Section 3 — Rôle */}
          <div className="mb-2 flex items-center gap-2">
            <IconShield className="h-4 w-4 text-[#1E90FF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
              Rôle & permissions
            </h4>
          </div>

          {/* Sélection du rôle */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(['Agent', 'Superviseur', 'Admin'] as Role[]).map((r) => {
              const active = form.role === r;
              const descriptions: Record<Role, string> = {
                Agent: 'Accès aux scans et fiches',
                Superviseur: 'Accès complet + statistiques',
                Admin: 'Contrôle total du système',
              };
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? 'border-[#1E90FF] bg-[#EAF3FF] ring-2 ring-[#1E90FF]/20'
                      : 'border-[#E2E8F0] bg-white hover:border-[#1E90FF]/50'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className={`text-sm font-bold ${active ? 'text-[#1E90FF]' : 'text-[#1A1A2E]'}`}>
                      {r}
                    </span>
                    {active && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1E90FF] text-white">
                        <IconCheck className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#64748B]">{descriptions[r]}</span>
                </button>
              );
            })}
          </div>

          {/* Permissions */}
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Permissions ({form.permissions.length}/{PERMISSIONS.length})
            </p>
            <button
              type="button"
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  permissions:
                    p.permissions.length === PERMISSIONS.length ? [] : PERMISSIONS.map((x) => x.id),
                }))
              }
              className="text-[11px] font-semibold text-[#1E90FF] transition hover:text-[#0A2540]"
            >
              {form.permissions.length === PERMISSIONS.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>

          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PERMISSIONS.map((perm) => {
              const checked = form.permissions.includes(perm.id);
              return (
                <li key={perm.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition ${
                      checked
                        ? 'border-[#1E90FF]/40 bg-[#EAF3FF]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#1E90FF]/30'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition ${
                        checked ? 'border-[#1E90FF] bg-[#1E90FF]' : 'border-[#CBD5E1] bg-white'
                      }`}
                      style={{ width: 18, height: 18 }}
                    >
                      {checked && <IconCheck className="h-3 w-3 text-white" />}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePermission(perm.id)}
                      className="sr-only"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[#1A1A2E]">{perm.label}</span>
                      <span className="block text-[11px] text-[#64748B]">{perm.description}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
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
              {isCreate ? <IconPlus className="h-4 w-4" /> : <IconCheck className="h-4 w-4" />}
              {isCreate ? 'Créer l’agent' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MODALE DE CONFIRMATION                                             */
/* ------------------------------------------------------------------ */

function ConfirmModal({
  agent,
  onClose,
  onConfirm,
}: {
  agent: Agent;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isDisabling = agent.status === 'Actif';
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="p-6 text-center">
          <span
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              isDisabling ? 'bg-[#FDECEC] text-[#EF4444]' : 'bg-[#E7F8F1] text-[#10B981]'
            }`}
          >
            {isDisabling ? <IconBan className="h-6 w-6" /> : <IconCheck className="h-6 w-6" />}
          </span>
          <h3 className="mt-4 text-base font-bold text-[#1A1A2E]">
            {isDisabling ? 'Désactiver cet agent ?' : 'Réactiver cet agent ?'}
          </h3>
          <p className="mt-2 text-sm text-[#64748B]">
            {isDisabling ? (
              <>
                <span className="font-semibold text-[#1A1A2E]">
                  {agent.firstName} {agent.lastName}
                </span>{' '}
                ne pourra plus se connecter à la plateforme. Cette action peut être annulée.
              </>
            ) : (
              <>
                <span className="font-semibold text-[#1A1A2E]">
                  {agent.firstName} {agent.lastName}
                </span>{' '}
                pourra à nouveau accéder à la plateforme.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
          <button
            onClick={onClose}
            className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`h-10 rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition ${
              isDisabling
                ? 'bg-[#EF4444] hover:bg-[#dc2626]'
                : 'bg-[#10B981] hover:bg-[#0d9b6c]'
            }`}
          >
            {isDisabling ? 'Désactiver' : 'Réactiver'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const ALL = 'Tous';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>(ALL);
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; agent: Agent | null } | null>(null);
  const [confirmAgent, setConfirmAgent] = useState<Agent | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* ---- filtrage ---- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agents.filter((a) => {
      if (roleFilter !== ALL && a.role !== roleFilter) return false;
      if (statusFilter !== ALL && a.status !== statusFilter) return false;
      if (q) {
        const hay = `${a.firstName} ${a.lastName} ${a.email} ${a.matricule}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [agents, search, roleFilter, statusFilter]);

  /* ---- stats ---- */
  const stats = useMemo(
    () => ({
      total: agents.length,
      active: agents.filter((a) => a.status === 'Actif').length,
      admins: agents.filter((a) => a.role === 'Admin').length,
      supervisors: agents.filter((a) => a.role === 'Superviseur').length,
    }),
    [agents],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  /* ---- save (create / edit) ---- */
  const handleSave = (data: FormState) => {
    if (modal?.mode === 'create') {
      const newAgent: Agent = {
        id: `AG-${String(agents.length + 1).padStart(3, '0')}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        matricule: data.matricule,
        role: data.role,
        status: 'Actif',
        lastLogin: null,
        permissions: data.permissions,
        createdAt: new Date().toISOString(),
      };
      setAgents((prev) => [newAgent, ...prev]);
      showToast(`Agent ${newAgent.firstName} ${newAgent.lastName} créé avec succès.`);
    } else if (modal?.agent) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === modal.agent!.id
            ? {
                ...a,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                matricule: data.matricule,
                role: data.role,
                permissions: data.permissions,
              }
            : a,
        ),
      );
      showToast(`Agent ${data.firstName} ${data.lastName} mis à jour.`);
    }
    setModal(null);
  };

  /* ---- toggle status ---- */
  const handleToggleStatus = () => {
    if (!confirmAgent) return;
    const newStatus: AgentStatus = confirmAgent.status === 'Actif' ? 'Inactif' : 'Actif';
    setAgents((prev) =>
      prev.map((a) => (a.id === confirmAgent.id ? { ...a, status: newStatus } : a)),
    );
    showToast(
      `Agent ${confirmAgent.firstName} ${confirmAgent.lastName} ${
        newStatus === 'Actif' ? 'réactivé' : 'désactivé'
      }.`,
    );
    setConfirmAgent(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ EN-TÊTE ============ */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>Administration</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#1E90FF]">Agents</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
              Gestion des agents
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Créez, modifiez et gérez les comptes utilisateurs de la plateforme.
            </p>
          </div>

          <button
            onClick={() => setModal({ mode: 'create', agent: null })}
            className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-[#1E90FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1878d6] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40 lg:self-auto"
          >
            <IconPlus className="h-4 w-4" />
            Ajouter un agent
          </button>
        </header>

        {/* ============ STATS ============ */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total agents', value: stats.total, accent: 'bg-[#1E90FF]', color: 'text-[#1A1A2E]' },
            { label: 'Actifs', value: stats.active, accent: 'bg-[#10B981]', color: 'text-[#0B7A5B]' },
            { label: 'Superviseurs', value: stats.supervisors, accent: 'bg-[#1E90FF]', color: 'text-[#1E90FF]' },
            { label: 'Administrateurs', value: stats.admins, accent: 'bg-[#EF4444]', color: 'text-[#B91C1C]' },
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

        {/* ============ FILTRES ============ */}
        <section className="mt-6 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Recherche */}
            <div className="lg:col-span-6">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Recherche
              </label>
              <div className="relative mt-1.5">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nom, email ou matricule…"
                  className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm text-[#1A1A2E] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
                />
              </div>
            </div>

            {/* Rôle */}
            <div className="lg:col-span-3">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Rôle</label>
              <div className="relative mt-1.5">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3 pr-9 text-sm text-[#1A1A2E] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
                >
                  <option>{ALL}</option>
                  <option>Agent</option>
                  <option>Superviseur</option>
                  <option>Admin</option>
                </select>
                <IconChevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              </div>
            </div>

            {/* Statut */}
            <div className="lg:col-span-3">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Statut</label>
              <div className="relative mt-1.5">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3 pr-9 text-sm text-[#1A1A2E] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
                >
                  <option>{ALL}</option>
                  <option>Actif</option>
                  <option>Inactif</option>
                </select>
                <IconChevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              </div>
            </div>
          </div>
        </section>

        {/* ============ TABLEAU ============ */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="text-sm font-semibold text-[#1A1A2E]">Liste des agents</h2>
            <span className="rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold text-[#64748B]">
              {filtered.length} agent{filtered.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0A2540] text-white">
                  {['Agent', 'Matricule', 'Rôle', 'Statut', 'Dernière connexion', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${
                        i === 5 ? 'text-right' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7FB] text-[#64748B]">
                        <IconUsers className="h-5 w-5" />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">Aucun agent trouvé</p>
                      <p className="mt-1 text-xs text-[#64748B]">
                        Ajustez vos filtres ou ajoutez un nouvel agent.
                      </p>
                    </td>
                  </tr>
                )}

                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-[#E2E8F0] transition-colors last:border-0 even:bg-[#F8FAFD] hover:bg-[#EAF3FF]"
                  >
                    {/* Agent */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <AgentAvatar first={a.firstName} last={a.lastName} role={a.role} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1A1A2E]">
                              {a.firstName} {a.lastName}
                            </span>
                            {a.status === 'Inactif' && (
                              <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#64748B]">
                                Désactivé
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B]">{a.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Matricule */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className="rounded-md bg-[#F4F7FB] px-2.5 py-1 font-mono text-xs font-semibold text-[#1A1A2E]">
                        {a.matricule}
                      </span>
                    </td>

                    {/* Rôle */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <RoleBadge role={a.role} />
                    </td>

                    {/* Statut */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>

                    {/* Dernière connexion */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="text-sm text-[#1A1A2E]">{fmtRelative(a.lastLogin)}</div>
                      {a.lastLogin && (
                        <div className="text-xs text-[#64748B]">{fmtDateTime.format(new Date(a.lastLogin))}</div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setModal({ mode: 'edit', agent: a })}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E90FF] transition hover:border-[#1E90FF] hover:bg-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/25"
                        >
                          <IconEdit className="h-3.5 w-3.5" />
                          Modifier
                        </button>
                        <button
                          onClick={() => setConfirmAgent(a)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 ${
                            a.status === 'Actif'
                              ? 'border-[#E2E8F0] bg-white text-[#EF4444] hover:border-[#EF4444] hover:bg-[#FDECEC] focus:ring-[#EF4444]/25'
                              : 'border-[#E2E8F0] bg-white text-[#10B981] hover:border-[#10B981] hover:bg-[#E7F8F1] focus:ring-[#10B981]/25'
                          }`}
                        >
                          {a.status === 'Actif' ? (
                            <>
                              <IconBan className="h-3.5 w-3.5" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <IconCheck className="h-3.5 w-3.5" />
                              Réactiver
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ============ MODALES ============ */}
      {modal && (
        <AgentModal
          mode={modal.mode}
          agent={modal.agent}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {confirmAgent && (
        <ConfirmModal
          agent={confirmAgent}
          onClose={() => setConfirmAgent(null)}
          onConfirm={handleToggleStatus}
        />
      )}

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