"use client";

import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, AlertCircle, ScanFace } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const identifiant = formData.get("identifiant") as string;
    const password = formData.get("password") as string;

    if (!identifiant || !password) {
      setError("Veuillez renseigner votre identifiant et votre mot de passe.");
      setLoading(false);
      return;
    }

    try {
      // TODO: remplacer par l'appel réel à votre API d'authentification
      // const res = await fetch("/api/auth/login", { method: "POST", body: formData });
      // if (!res.ok) throw new Error();
      await new Promise((r) => setTimeout(r, 800));
    } catch {
      setError("Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0A2540] via-[#12345f] to-[#dce9fa]">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        {/* Logo + titre */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-13 h-13 w-[52px] h-[52px] rounded-xl bg-[#0A2540] flex items-center justify-center mb-2.5">
            <ScanFace className="w-6 h-6 text-[#1E90FF]" />
          </div>
          <p className="text-xs tracking-wider uppercase text-[#64748B]">VigiFace</p>
          <h1 className="text-xl font-medium text-[#1A1A2E] mt-1">Connexion agent</h1>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-[#EF4444] rounded-lg px-3 py-2 mb-4">
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email ou matricule */}
          <div>
            <label htmlFor="identifiant" className="block text-sm text-[#64748B] mb-1">
              Email ou matricule
            </label>
            <input
              id="identifiant"
              name="identifiant"
              type="text"
              placeholder="agent.dupont ou email@vigiface.cm"
              className="w-full h-10 border border-[#E2E8F0] rounded-lg px-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm text-[#64748B] mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-10 border border-[#E2E8F0] rounded-lg px-3 pr-10 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1A1A2E]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Se souvenir / mot de passe oublié */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#64748B]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#1E90FF]"
              />
              Se souvenir de moi
            </label>
            <a href="/mot-de-passe-oublie" className="text-[#1E90FF] hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Bouton principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[#1E90FF] text-white text-sm font-medium hover:bg-[#1a7fe0] transition-colors disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Bandeau 2FA */}
        <div className="flex items-center gap-2 mt-4 px-3 py-2.5 bg-[#F4F7FB] rounded-lg">
          <ShieldCheck className="w-4 h-4 text-[#0A2540] shrink-0" />
          <span className="text-xs text-[#64748B]">
            Authentification à deux facteurs activée après la première connexion
          </span>
        </div>
      </div>
    </main>
  );
}