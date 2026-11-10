import { Suspense } from "react";
import type { Metadata } from "next";
import DocsView from "@/components/docs-view";

export const metadata: Metadata = {
  title: "CRM Handbook · v1.1",
  description: "Panduan CRM, kamus istilah, dan aturan ACRA/IRAS dengan sumber resmi",
};

export default function DocsPage() {
  return (
    <main className="docs-standalone" aria-label="Dokumentasi alur bisnis">
      <Suspense fallback={<p>Loading handbook…</p>}><DocsView version="1.1" /></Suspense>
    </main>
  );
}
