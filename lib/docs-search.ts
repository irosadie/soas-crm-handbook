export type DocsSearchEntry = { id: string; title: string; section: string; text: string; searchText?: string; glossaryTerm?: string };

export const glossaryTargetId = (term: string) => `glossary-${term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

export function normalizeDocsSearch(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function searchDocs(entries: DocsSearchEntry[], query: string) {
  const normalized = normalizeDocsSearch(query);
  if (!normalized) return [];
  const words = normalized.split(/\s+/);
  return entries.map(entry => {
    const title = normalizeDocsSearch(entry.title);
    const text = normalizeDocsSearch(entry.searchText ?? `${entry.title} ${entry.text}`);
    if (!words.every(word => text.includes(word))) return null;
    const score = (normalizeDocsSearch(entry.glossaryTerm ?? "") === normalized ? 200 : 0) + (title === normalized ? 100 : 0) + (title.includes(normalized) ? 30 : 0) + words.filter(word => title.includes(word)).length * 5 + (text.includes(normalized) ? 10 : 0);
    return { ...entry, score };
  }).filter(entry => entry !== null).sort((a, b) => b.score - a.score);
}

export function docsSearchExcerpt(text: string, query: string) {
  const word = query.trim().split(/\s+/).find(part => text.toLowerCase().includes(part.toLowerCase()));
  const position = word ? text.toLowerCase().indexOf(word.toLowerCase()) : 0;
  const start = Math.max(0, position - 55);
  return `${start > 0 ? "…" : ""}${text.slice(start, start + 180)}${text.length > start + 180 ? "…" : ""}`;
}
