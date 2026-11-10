import type { Metadata } from "next";
import DocsView from "@/components/docs-view";

export const metadata: Metadata = {
  title: "Dokumentasi · CRM",
  description: "Panduan CRM, kamus istilah, dan aturan ACRA/IRAS dengan sumber resmi",
};

export default function DocsPage() {
  return (
    <main className="docs-standalone" aria-label="Dokumentasi alur bisnis">
      <DocsView />
    </main>
  );
}
