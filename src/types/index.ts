import type { Branche, GbuData } from "@/lib/validations";

export interface Arbeitsbereich {
  id: string;
  account_id: string;
  name: string;
  branche: Branche;
  standort: string | null;
  beschreibung: string | null;
  created_at: string;
}

export type GbuStatus = "draft" | "review" | "finalized";

export interface Gbu {
  id: string;
  account_id: string;
  arbeitsbereich_id: string;
  revision: number;
  status: GbuStatus;
  input_mode: "voice" | "checkliste";
  recording_path: string | null;
  foto_paths: string[];
  transcript_raw: string | null;
  gbu_data: GbuData | null;
  pruefen_markers: unknown[];
  next_review_at: string | null;
  finalized_at: string | null;
  created_at: string;
}

export type MassnahmeStatus = "offen" | "in_umsetzung" | "erledigt" | "wirksamkeit_geprueft";

export interface MassnahmeRow {
  id: string;
  account_id: string;
  gbu_id: string;
  arbeitsbereich_id: string;
  taetigkeit: string;
  gefaehrdung: string;
  faktor: string;
  risikostufe: number;
  beschreibung: string;
  stop_kategorie: string;
  verantwortlich: string | null;
  frist: string | null;
  status: MassnahmeStatus;
  wirksamkeit_geprueft_am: string | null;
  erinnert_am: string | null;
  created_at: string;
}
