"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Arbeitsbereich } from "@/types";
import { BRANCHEN_LABELS } from "@/lib/validations";
import { startGbuAction } from "@/app/(dashboard)/neu/actions";

export function NeueGbuForm({
  bereiche,
  checklisten,
  preselect,
}: {
  bereiche: Arbeitsbereich[];
  checklisten: Record<string, string>;
  preselect?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [bereichId, setBereichId] = useState(
    preselect && bereiche.some((b) => b.id === preselect) ? preselect : bereiche[0]?.id ?? ""
  );
  const [mode, setMode] = useState<"voice" | "checkliste">("voice");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [checkliste, setCheckliste] = useState("");

  const bereich = bereiche.find((b) => b.id === bereichId);

  return (
    <form
      className="space-y-5 rounded-md border bg-card p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        fd.set("arbeitsbereich_id", bereichId);
        fd.set("input_mode", mode);
        if (mode === "voice") {
          if (!audioFile) {
            setError("Bitte eine Audiodatei auswählen.");
            return;
          }
          fd.set("audio", audioFile);
        } else {
          fd.set("checkliste", checkliste);
        }
        startTransition(async () => {
          setProgress("Beurteilung wird angelegt…");
          const res = await startGbuAction(fd);
          if (res.error) {
            setError(res.error);
            setProgress(null);
            return;
          }
          setProgress(mode === "voice" ? "Audio wird transkribiert…" : "AI strukturiert…");
          router.push(`/gbu/${res.id}`);
        });
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Arbeitsbereich</label>
        <select
          value={bereichId}
          onChange={(e) => {
            setBereichId(e.target.value);
            setCheckliste("");
          }}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          {bereiche.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({BRANCHEN_LABELS[b.branche]})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("voice")}
          className={`flex-1 rounded-md border px-3 py-2 text-sm ${mode === "voice" ? "border-primary bg-primary/10 font-medium" : "text-muted-foreground"}`}
        >
          🎙 Sprach-Rundgang
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("checkliste");
            if (!checkliste && bereich) setCheckliste(checklisten[bereich.id] ?? "");
          }}
          className={`flex-1 rounded-md border px-3 py-2 text-sm ${mode === "checkliste" ? "border-primary bg-primary/10 font-medium" : "text-muted-foreground"}`}
        >
          ☑ Geführte Checkliste
        </button>
      </div>

      {mode === "voice" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Audio-Rundgang</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Gehen Sie durch den Bereich und beschreiben Sie, was Sie sehen — Maschinen,
            Arbeitsabläufe, Auffälligkeiten. mp3, m4a, wav oder webm, max. 500 MB.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Checkliste ({bereich ? BRANCHEN_LABELS[bereich.branche] : ""})
          </label>
          <textarea
            value={checkliste}
            onChange={(e) => setCheckliste(e.target.value)}
            rows={14}
            className="w-full rounded-md border px-3 py-2 font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Branchentypische Punkte sind vorbefüllt — ergänzen Sie Ihre Beobachtungen
            hinter „Beobachtung:&quot; und streichen Sie Unzutreffendes.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Fotos (optional)</label>
        <input type="file" name="fotos" accept="image/*" multiple className="w-full text-sm" />
        <p className="text-xs text-muted-foreground">
          Fotos werden der Beurteilung als Anhang beigefügt (max. 10 MB pro Bild).
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {progress && <p className="text-sm text-muted-foreground">{progress}</p>}

      <button
        type="submit"
        disabled={pending || !bereichId}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Wird verarbeitet…" : "Beurteilung starten"}
      </button>
    </form>
  );
}
