"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Save,
  FileText,
  ScanLine,
  Flag,
} from "lucide-react";

type Status = "confirmee" | "recherchee" | "verification";

type Personne = {
  nom: string;
  dateNaissance: string;
  numeroIdentite: string;
  statut: string;
};

type ResultatScan = {
  status: Status;
  score: number;
  photoCapturee: string;
  photoBase: string | null;
  personne: Personne | null;
};

// --- Données mockées : à remplacer par la réponse de votre API d'analyse ---
const resultats: Record<Status, ResultatScan> = {
  confirmee: {
    status: "confirmee",
    score: 97,
    photoCapturee: "https://placehold.co/300x300/e2e8f0/64748b?text=Capture",
    photoBase: "https://placehold.co/300x300/e2e8f0/64748b?text=Base",
    personne: {
      nom: "Jean-Baptiste Etoundi",
      dateNaissance: "12/04/1988",
      numeroIdentite: "CM-0192837465",
      statut: "Libre",
    },
  },
  recherchee: {
    status: "recherchee",
    score: 94,
    photoCapturee: "https://placehold.co/300x300/e2e8f0/64748b?text=Capture",
    photoBase: "https://placehold.co/300x300/e2e8f0/64748b?text=Base",
    personne: {
      nom: "Paul Ndongo Abena",
      dateNaissance: "23/09/1979",
      numeroIdentite: "CM-0475839201",
      statut: "Recherché",
    },
  },
  verification: {
    status: "verification",
    score: 61,
    photoCapturee: "https://placehold.co/300x300/e2e8f0/64748b?text=Capture",
    photoBase: null,
    personne: null,
  },
};

const statusConfig: Record<
  Status,
  { label: string; bg: string; badgeBg: string; badgeText: string; icon: typeof ShieldCheck; scoreColor: string }
> = {
  confirmee: {
    label: "Identité confirmée",
    bg: "bg-emerald-50",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    icon: ShieldCheck,
    scoreColor: "text-emerald-600",
  },
  recherchee: {
    label: "Personne recherchée",
    bg: "bg-red-50",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    icon: ShieldAlert,
    scoreColor: "text-[#EF4444]",
  },
  verification: {
    label: "Score faible – vérification manuelle",
    bg: "bg-amber-50",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    icon: ShieldQuestion,
    scoreColor: "text-[#F59E0B]",
  },
};

export default function ResultatScanPage() {
  // Démo : permet de visualiser les 3 états. En production, remplacez par le statut réel reçu de l'API.
  const [statusDemo, setStatusDemo] = useState<Status>("recherchee");
  const resultat = resultats[statusDemo];
  const config = statusConfig[resultat.status];
  const StatusIcon = config.icon;

  return (
    <div className={`min-h-screen ${config.bg} p-6 transition-colors`}>
      {/* Sélecteur de démo — à retirer en production */}
      <div className="flex gap-2 mb-5">
        {(Object.keys(statusConfig) as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusDemo(s)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              s === statusDemo ? "border-[#0A2540] bg-white" : "border-[#E2E8F0] bg-white/60"
            } text-[#1A1A2E]`}
          >
            {statusConfig[s].label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        {/* Badge de statut */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className={`flex items-center gap-2 ${config.badgeBg} ${config.badgeText} rounded-full px-4 py-1.5 mb-3`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{config.label}</span>
          </div>
          <p className={`text-5xl font-medium ${config.scoreColor}`}>{resultat.score}%</p>
          <p className="text-sm text-[#64748B] mt-1">Score de similarité</p>
        </div>

        {/* Photos côte à côte */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-[#64748B] mb-1.5 text-center">Photo capturée</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultat.photoCapturee}
              alt="Photo capturée lors du contrôle"
              className="w-full aspect-square object-cover rounded-xl border border-[#E2E8F0]"
            />
          </div>
          <div>
            <p className="text-xs text-[#64748B] mb-1.5 text-center">Photo base de données</p>
            {resultat.photoBase ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resultat.photoBase}
                alt="Photo correspondante en base"
                className="w-full aspect-square object-cover rounded-xl border border-[#E2E8F0]"
              />
            ) : (
              <div className="w-full aspect-square rounded-xl border border-dashed border-[#E2E8F0] flex items-center justify-center text-sm text-[#64748B]">
                Aucun match en base
              </div>
            )}
          </div>
        </div>

        {/* Informations de la personne */}
        {resultat.personne ? (
          <div className="bg-[#F4F7FB] rounded-xl p-4 mb-6">
            <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div>
                <dt className="text-[#64748B]">Nom complet</dt>
                <dd className="text-[#1A1A2E] font-medium">{resultat.personne.nom}</dd>
              </div>
              <div>
                <dt className="text-[#64748B]">Date de naissance</dt>
                <dd className="text-[#1A1A2E] font-medium">{resultat.personne.dateNaissance}</dd>
              </div>
              <div>
                <dt className="text-[#64748B]">Numéro d&apos;identité</dt>
                <dd className="text-[#1A1A2E] font-medium">{resultat.personne.numeroIdentite}</dd>
              </div>
              <div>
                <dt className="text-[#64748B]">Statut</dt>
                <dd className={`font-medium ${config.scoreColor}`}>{resultat.personne.statut}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="bg-[#F4F7FB] rounded-xl p-4 mb-6 text-sm text-[#64748B] text-center">
            Aucune identité trouvée avec un score suffisant. Une vérification manuelle est requise.
          </div>
        )}

        {/* Boutons d'action */}
        <div className="grid grid-cols-2 gap-3">
          <button className="h-11 rounded-lg bg-[#1E90FF] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#1a7fe0] transition-colors">
            <Save className="w-4 h-4" />
            Enregistrer le contrôle
          </button>
          <button
            disabled={!resultat.personne}
            className="h-11 rounded-lg border border-[#E2E8F0] bg-white text-[#1A1A2E] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#F4F7FB] transition-colors disabled:opacity-40"
          >
            <FileText className="w-4 h-4" />
            Voir la fiche complète
          </button>
          <button className="h-11 rounded-lg border border-[#E2E8F0] bg-white text-[#1A1A2E] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#F4F7FB] transition-colors">
            <ScanLine className="w-4 h-4" />
            Nouveau scan
          </button>
          <button className="h-11 rounded-lg border border-[#E2E8F0] bg-white text-[#EF4444] text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
            <Flag className="w-4 h-4" />
            Signaler une erreur
          </button>
        </div>
      </div>
    </div>
  );
}