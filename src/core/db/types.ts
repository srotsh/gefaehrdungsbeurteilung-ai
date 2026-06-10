/**
 * Database types — Supabase-generierte Typen leben hier.
 *
 * Zwei Modi:
 *  1. Generated (vorzugsweise): `pnpm db:types` regeneriert dieses File aus
 *     dem aktuellen Supabase-Schema und schreibt nach `src/types.generated.ts`.
 *     `Database` ist dann das echte Schema-Type-Objekt.
 *  2. Stub (Default heute): bevor das erste `db:types` läuft, exportieren wir
 *     einen permissiven Stub — Code compiliert, aber Type-Safety ist limitiert.
 *
 * Der Stub-Mode kostet nichts an Laufzeit-Sicherheit (RLS bleibt aktiv);
 * er verschiebt nur strikteres Type-Checking auf später.
 *
 * REFACTOR-Hinweis (R2): Sobald die Migration 005 in Supabase ausgeführt ist,
 * lokales Supabase + `pnpm db:types` laufen lassen und das Result hier
 * einsetzen.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Stub-Schema. Muss `GenericSchema` aus @supabase/supabase-js erfüllen,
 * sonst kollabiert `Schema` im SupabaseClient zu `never` und alle
 * `.from(...)`-Queries geben `never[]` zurück. Konkret:
 *  - `Relationships` muss `GenericRelationship[]` sein (nicht `unknown[]`).
 *  - `Row/Insert/Update` müssen zuweisbar zu `Record<string, unknown>` sein.
 */
export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: any;
        Insert: any;
        Update: any;
        Relationships: any[];
      };
    };
    Views: {
      [key: string]: {
        Row: any;
        Relationships: any[];
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, any>;
        Returns: any;
      };
    };
    Enums: Record<string, string>;
    CompositeTypes: Record<string, any>;
  };
}
