import { Suspense } from "react";
import type { Metadata } from "next";
import DocsView from "@/components/docs-view";

export const metadata: Metadata = { title: "CRM Handbook · v1.2" };

export default function VersionedDocsPage() {
  return <main className="docs-standalone" aria-label="CRM Handbook v1.2"><Suspense fallback={<p>Loading handbook…</p>}><DocsView version="1.2" /></Suspense></main>;
}
