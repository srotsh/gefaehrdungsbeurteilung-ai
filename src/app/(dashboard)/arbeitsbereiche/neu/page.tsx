import { ArbeitsbereichForm } from "@/components/arbeitsbereich-form";

export default function NeuerArbeitsbereichPage() {
  return (
    <main className="p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Neuer Arbeitsbereich</h1>
        <p className="text-sm text-muted-foreground">
          Die Branche lädt den passenden Gefährdungskatalog als Vorlage für
          Rundgang und Checkliste.
        </p>
      </div>
      <ArbeitsbereichForm />
    </main>
  );
}
