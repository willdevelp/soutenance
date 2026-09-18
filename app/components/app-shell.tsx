'use client';

import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ScanFace,
  ScanLine,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navigation = [
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Nouveau contrôle', href: '/dashboard/scan', icon: ScanLine },
  { label: 'Historique', href: '/dashboard/historique', icon: ClipboardList },
  { label: 'Personnes', href: '/dashboard/personnes', icon: Users },
  { label: 'Statistiques', href: '/dashboard/statistique', icon: BarChart3 },
];

const adminNavigation = [
  { label: 'Gestion des agents', href: '/admin', icon: ShieldCheck },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
];

const pageNames: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/scan': 'Nouveau contrôle',
  '/dashboard/historique': 'Historique',
  '/dashboard/personnes': 'Personnes',
  '/dashboard/statistique': 'Statistiques',
  '/dashboard/resultat': 'Résultat du contrôle',
  '/dashboard/else': 'Fiche personne',
  '/admin': 'Gestion des agents',
  '/admin/settings': 'Paramètres',
};

function isActive(pathname: string, href: string) {
  if (href === '/dashboard' || href === '/admin') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationLinks({ pathname }: { pathname: string }) {
  return (
    <>
      <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8FA4BC]">
        Espace opérationnel
      </p>
      {navigation.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
              active
                ? 'bg-[#1E90FF] text-white shadow-[0_5px_14px_rgba(30,144,255,0.25)]'
                : 'text-[#B9C4D4] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className={`h-[17px] w-[17px] shrink-0 ${active ? 'text-white' : 'text-[#8FA4BC] group-hover:text-[#1E90FF]'}`} />
            {label}
          </Link>
        );
      })}
      <p className="px-3 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8FA4BC]">
        Administration
      </p>
      {adminNavigation.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
              active
                ? 'bg-[#1E90FF] text-white shadow-[0_5px_14px_rgba(30,144,255,0.25)]'
                : 'text-[#B9C4D4] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className={`h-[17px] w-[17px] shrink-0 ${active ? 'text-white' : 'text-[#8FA4BC] group-hover:text-[#1E90FF]'}`} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageName = pageNames[pathname] ?? 'VigiFace';

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <aside className="hidden w-[248px] shrink-0 flex-col bg-[#0A2540] px-4 py-5 lg:flex">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2.5 pb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E90FF] text-white shadow-[0_6px_16px_rgba(30,144,255,0.28)]">
            <ScanFace className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[15px] font-bold tracking-tight text-white">VigiFace</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-[#8FA4BC]">Contrôle sécurisé</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Navigation principale">
          <NavigationLinks pathname={pathname} />
        </nav>
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3FF] text-xs font-bold text-[#0A2540]">AM</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">Agent Mballa</p>
              <p className="text-[10px] text-[#8FA4BC]">Connecté maintenant</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/dashboard" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A2540] text-[#1E90FF] lg:hidden">
                <ScanFace className="h-5 w-5" />
              </Link>
              <div className="min-w-0">
                <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E90FF] sm:block">Espace sécurisé</p>
                <h1 className="truncate text-sm font-semibold text-[#1A1A2E] sm:text-base">{pageName}</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="hidden text-right sm:block">
                <span className="block text-xs font-semibold text-[#1A1A2E]">Agent Mballa</span>
                <span className="block text-[10px] text-[#64748B]">Opérateur</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FF] text-xs font-bold text-[#0A2540]">AM</span>
              <button type="button" aria-label="Se déconnecter" className="hidden h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition hover:border-[#EF4444] hover:text-[#EF4444] sm:flex">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-0.5 lg:hidden" aria-label="Navigation mobile">
            {[...navigation, ...adminNavigation].map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link key={href} href={href} className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${active ? 'bg-[#EAF3FF] text-[#1E90FF]' : 'text-[#64748B]'}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
