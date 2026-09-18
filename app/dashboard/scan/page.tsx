"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Camera,
  Upload,
  Smartphone,
  ScanFace,
  MapPin,
  StickyNote,
  CircleCheck,
  CircleAlert,
  CircleX,
  Square,
  RefreshCw,
  Sparkles,
  History,
  Loader2,
  ShieldCheck,
  Trash2,
  User,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  TYPES & STYLES                                                     */
/* ------------------------------------------------------------------ */

type Quality = "bonne" | "moyenne" | "mauvaise" | null;

type Capture = {
  id: string;
  thumbnail: string;
  heure: string;
  qualite: Quality;
  score?: number;
};

const qualityStyles: Record<
  Exclude<Quality, null>,
  { text: string; bg: string; ring: string; dot: string; icon: typeof CircleCheck; label: string }
> = {
  bonne: {
    text: "text-[#0B7A5B]",
    bg: "bg-[#E7F8F1]",
    ring: "ring-[#10B981]/30",
    dot: "bg-[#10B981]",
    icon: CircleCheck,
    label: "Bonne qualité",
  },
  moyenne: {
    text: "text-[#B45309]",
    bg: "bg-[#FEF6E7]",
    ring: "ring-[#F59E0B]/30",
    dot: "bg-[#F59E0B]",
    icon: CircleAlert,
    label: "Qualité moyenne",
  },
  mauvaise: {
    text: "text-[#B91C1C]",
    bg: "bg-[#FDECEC]",
    ring: "ring-[#EF4444]/30",
    dot: "bg-[#EF4444]",
    icon: CircleX,
    label: "Qualité insuffisante",
  },
};

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function ScanCapturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [streaming, setStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState<Quality>(null);
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<Capture[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);

  /* Arrêter le flux caméra quand on quitte */
  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const stopWebcam = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreaming(false);
  }, []);

  const startWebcam = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      setCameraError(
        "Impossible d’accéder à la caméra. Vérifiez les autorisations du navigateur."
      );
    }
  }, []);

  const estimateQuality = (): Quality => {
    const options: Quality[] = ["bonne", "bonne", "moyenne", "mauvaise"];
    return options[Math.floor(Math.random() * options.length)];
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    setQuality(estimateQuality());
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
      setQuality(estimateQuality());
    };
    reader.readAsDataURL(file);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setQuality(null);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    try {
      // TODO: remplacer par l'appel réel à votre API de reconnaissance faciale
      // const res = await fetch("/api/analyze", { method: "POST", body: JSON.stringify({ image: capturedImage, note, location }) });
      await new Promise((r) => setTimeout(r, 1400));

      setHistory((prev) =>
        [
          {
            id: crypto.randomUUID(),
            thumbnail: capturedImage,
            heure: new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            qualite: quality,
            score: Math.floor(40 + Math.random() * 60),
          },
          ...prev,
        ].slice(0, 4)
      );

      // Reset après analyse
      setCapturedImage(null);
      setQuality(null);
      setNote("");
    } finally {
      setAnalyzing(false);
    }
  };

  const QualityIcon = quality ? qualityStyles[quality].icon : null;

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ EN-TÊTE ============ */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>Contrôles</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#1E90FF]">Nouveau scan</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
              Nouveau contrôle
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Capturez une image et lancez l’analyse de reconnaissance faciale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${
                streaming
                  ? "border-[#10B981]/30 bg-[#E7F8F1] text-[#0B7A5B]"
                  : "border-[#E2E8F0] bg-white text-[#64748B]"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {streaming && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    streaming ? "bg-[#10B981]" : "bg-[#94A3B8]"
                  }`}
                />
              </span>
              {streaming ? "Caméra active" : "Caméra inactive"}
            </span>
          </div>
        </header>

        {/* ============ GRILLE PRINCIPALE ============ */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* --------- COLONNE GAUCHE : CAPTURE --------- */}
          <div className="flex flex-col gap-6">
            {/* Zone vidéo / image */}
            <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-[#1E90FF]" />
                  <h2 className="text-sm font-semibold text-[#1A1A2E]">
                    Zone de capture
                  </h2>
                </div>
                {capturedImage ? (
                  <button
                    onClick={resetCapture}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#64748B] transition hover:border-[#1E90FF] hover:text-[#1E90FF]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reprendre
                  </button>
                ) : null}
              </div>

              <div className="p-5">
                {/* Zone vidéo */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#0A0F1A] to-[#0A2540]">
                  {/* Overlay de détection (visuel) */}
                  {(streaming || capturedImage) && (
                    <div className="pointer-events-none absolute inset-0 z-10">
                      <div className="absolute left-1/2 top-1/2 h-3/4 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#1E90FF]/60">
                        <span className="absolute -top-0.5 left-4 h-0.5 w-8 bg-[#1E90FF]" />
                        <span className="absolute -left-0.5 top-6 h-8 w-0.5 bg-[#1E90FF]" />
                        <span className="absolute -right-0.5 top-6 h-8 w-0.5 bg-[#1E90FF]" />
                        <span className="absolute -bottom-0.5 right-4 h-0.5 w-8 bg-[#1E90FF]" />
                        <span className="absolute -top-7 left-0 rounded-md bg-[#1E90FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Cadre visage
                        </span>
                      </div>
                    </div>
                  )}

                  {capturedImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={capturedImage}
                      alt="Capture"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`h-full w-full object-cover ${streaming ? "" : "hidden"}`}
                    />
                  )}

                  {!streaming && !capturedImage && (
                    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-[#64748B] backdrop-blur-sm">
                        <ScanFace className="h-8 w-8" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Aucun flux actif
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          Activez la caméra ou importez une image pour commencer.
                        </p>
                      </div>
                      <button
                        onClick={startWebcam}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#1E90FF] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1878d6]"
                      >
                        <Camera className="h-4 w-4" />
                        Activer la caméra
                      </button>
                    </div>
                  )}

                  {/* Badge LIVE */}
                  {streaming && !capturedImage && (
                    <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#EF4444] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      Live
                    </div>
                  )}

                  {/* Badge qualité sur l'image capturée */}
                  {capturedImage && quality && (
                    <div
                      className={`absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-lg ring-1 backdrop-blur-sm ${qualityStyles[quality].bg} ${qualityStyles[quality].text} ${qualityStyles[quality].ring}`}
                    >
                      {QualityIcon && <QualityIcon className="h-3.5 w-3.5" />}
                      {qualityStyles[quality].label}
                    </div>
                  )}

                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Message d'erreur caméra */}
                {cameraError && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#EF4444]/30 bg-[#FDECEC] px-4 py-3 text-sm text-[#B91C1C]">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    {cameraError}
                  </div>
                )}

                {/* Boutons de source */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <button
                    onClick={streaming ? handleCapture : startWebcam}
                    disabled={!streaming && capturedImage !== null}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123355] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Camera className="h-4 w-4" />
                    {streaming ? "Capturer" : "Activer"}
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#1A1A2E] transition hover:border-[#1E90FF] hover:text-[#1E90FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20"
                  >
                    <Upload className="h-4 w-4" />
                    Importer
                  </button>

                  <button
                    onClick={() => mobileInputRef.current?.click()}
                    className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#1A1A2E] transition hover:border-[#1E90FF] hover:text-[#1E90FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 sm:col-span-1"
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </button>

                  {streaming && (
                    <button
                      onClick={stopWebcam}
                      className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#EF4444] transition hover:border-[#EF4444] hover:bg-[#FDECEC] sm:col-span-3"
                    >
                      <Square className="h-4 w-4" />
                      Arrêter la caméra
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelected}
                />
                <input
                  ref={mobileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileSelected}
                />
              </div>
            </section>

            {/* Bouton Analyser */}
            <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
              <div className="p-5">
                <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-[#EAF3FF] to-[#F8FAFC] px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#1E90FF] shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E]">
                      Prêt pour l’analyse
                    </p>
                    <p className="mt-0.5 text-xs text-[#64748B]">
                      {capturedImage
                        ? "L’image est prête. Lancez l’analyse de reconnaissance faciale."
                        : "Capturez ou importez une image pour continuer."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!capturedImage || analyzing}
                  className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#1E90FF] text-base font-bold text-white shadow-md transition hover:bg-[#1878d6] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/40 disabled:cursor-not-allowed disabled:bg-[#94A3B8] disabled:shadow-none"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyse en cours…
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Analyser l’image
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* --------- COLONNE DROITE : MÉTADONNÉES + HISTORIQUE --------- */}
          <div className="flex flex-col gap-6">
            {/* Métadonnées */}
            <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-5 py-4">
                <StickyNote className="h-4 w-4 text-[#1E90FF]" />
                <h2 className="text-sm font-semibold text-[#1A1A2E]">
                  Informations du contrôle
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Localisation
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex. Poste Central, Yaoundé"
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm text-[#1A1A2E] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ajouter une note sur ce contrôle…"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-[#E2E8F0] bg-white p-3 text-sm text-[#1A1A2E] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20"
                  />
                  <p className="text-[11px] text-[#64748B]">
                    Ces informations seront attachées à l’enregistrement du contrôle.
                  </p>
                </div>
              </div>
            </section>

            {/* Historique de session */}
            <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)]">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-[#1E90FF]" />
                  <h2 className="text-sm font-semibold text-[#1A1A2E]">
                    Session en cours
                  </h2>
                </div>
                <span className="rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold text-[#64748B]">
                  {history.length} capture{history.length > 1 ? "s" : ""}
                </span>
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7FB] text-[#94A3B8]">
                    <Camera className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-[#1A1A2E]">
                    Aucune capture analysée
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Les scans analysés dans cette session apparaîtront ici.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[#E2E8F0]">
                  {history.map((c) => {
                    const Icon = c.qualite ? qualityStyles[c.qualite].icon : null;
                    return (
                      <li
                        key={c.id}
                        className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-[#F8FAFD]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.thumbnail}
                          alt="Capture précédente"
                          className="h-14 w-14 shrink-0 rounded-lg border border-[#E2E8F0] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-[#1A1A2E]">
                              {c.heure}
                            </p>
                            {typeof c.score === "number" && (
                              <span className="text-xs font-bold tabular-nums text-[#1E90FF]">
                                {c.score}%
                              </span>
                            )}
                          </div>
                          {Icon && c.qualite && (
                            <span
                              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${qualityStyles[c.qualite].bg} ${qualityStyles[c.qualite].text}`}
                            >
                              <Icon className="h-3 w-3" />
                              {qualityStyles[c.qualite].label}
                            </span>
                          )}
                        </div>
                        <button
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-[#FDECEC] hover:text-[#EF4444]"
                          aria-label="Retirer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Astuce sécurité */}
            <section className="rounded-xl border border-[#EAF3FF] bg-[#EAF3FF]/60 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1E90FF] shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#1A1A2E]">
                    Bonnes pratiques
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748B]">
                    Assurez un bon éclairage, un visage centré et dégagé. Évitez les
                    reflets et les lunettes de soleil pour maximiser le taux de
                    correspondance.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}