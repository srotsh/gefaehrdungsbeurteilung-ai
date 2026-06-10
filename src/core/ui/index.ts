/**
 * @flow/ui — Shared UI Shell.
 *
 * **Aktueller Stand R5:** Bewusst minimal. ProtokollFlow's bestehende Components
 * (audio-uploader, protokoll-editor, sidebar, etc.) bleiben in der App, weil
 * sie product-spezifisch sind. shadcn-Primitives (Button, Card, Input, ...)
 * leben aktuell auch in der App und sind beim ersten Cross-Product-Bedarf
 * (P-3 oder JahresabrechnungAI) zu migrieren.
 *
 * **Migration-Strategie wenn nötig:**
 *  1. shadcn-Primitives + DashboardShell + Sidebar nach `@flow/ui/src/components/`
 *  2. ProtokollFlow's Imports auf `@flow/ui` umstellen
 *  3. Apps bringen ihre product-spezifischen Components weiter selbst mit
 *
 * Bis dahin: Hier nur die Stelle reservieren, sodass spätere Migration
 * keine größere Refactor-Welle auslöst.
 */

export {};

// Beim ersten echten Bedarf hier ergänzen:
// export { Button } from "./components/button";
// export { Card, CardHeader, CardContent } from "./components/card";
// export { DashboardShell } from "./components/dashboard-shell";
// export { Sidebar, SidebarItem } from "./components/sidebar";
// export { ErrorBoundary } from "./components/error-boundary";
