"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { DocsLang } from "@/components/docs-flow";
import { glossaryEntries, referenceSources } from "@/data/docs-reference";
import { docsSearchExcerpt, glossaryTargetId, searchDocs, type DocsSearchEntry } from "@/lib/docs-search";

function buildIndex(lang: DocsLang): DocsSearchEntry[] {
  const article = document.querySelector(".docs-content");
  const selector = "h1, h2, h3, h4, p, li, tr, .dfn, .dfh-step, a, strong, span, small, code";
  const entries: DocsSearchEntry[] = [];
  article?.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
    if (element.closest("#glossary") || element.parentElement?.closest(selector)) return;
    const text = element.innerText.replace(/\s+/g, " ").trim();
    if (!text) return;
    const section = element.closest("section");
    const heading = section?.querySelector("h2, h3, h4")?.textContent || (lang === "id" ? "Panduan CRM" : "CRM Handbook");
    const title = element.querySelector(".dfn-title, h3, h4, strong")?.textContent || (/^H[1-4]$/.test(element.tagName) ? text : heading);
    if (!element.id) element.id = `docs-search-block-${index}`;
    entries.push({ id: element.id, title, section: heading, text, searchText: text });
  });
  // The glossary index stays complete even when its local filters hide rows.
  for (const entry of glossaryEntries) entries.push({
    id: glossaryTargetId(entry.term), title: `${entry.term} · ${entry.full}`,
    section: lang === "id" ? "Kamus istilah" : "Glossary", glossaryTerm: entry.term,
    text: `${entry.meaning[lang]} ${entry.agency} ${entry.rule[lang]} ${entry.sources.map(key => referenceSources[key].title).join(" ")}`,
  });
  return entries;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.trim().split(/\s+/).filter(Boolean).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return text;
  return text.split(new RegExp(`(${words.join("|")})`, "gi")).map((part, index) => index % 2 ? <mark key={index}>{part}</mark> : part);
}

export default function DocsGlobalSearch({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [entries, setEntries] = useState<DocsSearchEntry[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchDocs(entries, query), [entries, query]);
  const expand = useCallback(() => { setEntries(buildIndex(lang)); setOpen(true); setActive(0); }, [lang]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); expand(); input.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", shortcut);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", shortcut); document.removeEventListener("pointerdown", outside); };
  }, [expand]);

  const choose = (entry: DocsSearchEntry) => {
    setOpen(false);
    if (entry.glossaryTerm) window.dispatchEvent(new CustomEvent("docs:reveal-glossary", { detail: entry.glossaryTerm }));
    // Let React reveal a filtered glossary row before scrolling to it.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.getElementById(entry.id);
      if (!target) return;
      document.querySelectorAll("[data-docs-search-hit]").forEach(element => element.removeAttribute("data-docs-search-hit"));
      target.setAttribute("data-docs-search-hit", "true");
      target.setAttribute("tabindex", "-1");
      window.history.replaceState(null, "", `#${entry.id}`);
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start", behavior: "instant" });
    }));
  };

  return <div className="docs-global-search" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <div className="docs-global-search-field">
      <Search size={17} aria-hidden="true" />
      <input ref={input} type="text" role="combobox" aria-label={isId ? "Cari seluruh dokumentasi" : "Search all documentation"} placeholder={isId ? "Cari apa pun di panduan…" : "Search anything in the handbook…"} autoComplete="off" spellCheck={false} value={query} aria-autocomplete="list" aria-expanded={open} aria-controls="docs-global-results" aria-activedescendant={open && results[active] ? `docs-search-option-${active}` : undefined}
        onFocus={expand} onChange={event => { setQuery(event.target.value); setActive(0); setOpen(true); }} onKeyDown={event => {
          if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); setOpen(true);
            const next = results.length ? (active + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length : 0;
            setActive(next); document.getElementById(`docs-search-option-${next}`)?.scrollIntoView({ block: "nearest" });
          }
          if (event.key === "Enter" && open && results[active]) { event.preventDefault(); choose(results[active]); }
        }} />
      {query ? <button type="button" className="docs-search-clear" aria-label={isId ? "Hapus pencarian" : "Clear search"} onClick={() => { setQuery(""); input.current?.focus(); }}><X size={15} /></button> : <kbd>⌘/Ctrl K</kbd>}
    </div>
    {open && <div className="docs-global-search-panel">
      <p className="docs-global-search-status" role="status">{query.trim() ? `${results.length} ${isId ? "hasil di seluruh dokumentasi" : "results across all documentation"}` : (isId ? "Cari istilah, aturan, alur atau deadline. Contoh: FYE, 60 hari, Comm Hub." : "Find terms, rules, workflows or deadlines. Try FYE, 60 days, Comm Hub.")}</p>
      <div id="docs-global-results" role="listbox" aria-label={isId ? "Hasil pencarian" : "Search results"} className="docs-global-search-results">
        {results.map((entry, index) => <a key={entry.id} id={`docs-search-option-${index}`} role="option" aria-selected={index === active} href={`#${entry.id}`} tabIndex={-1} onMouseEnter={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={event => { event.preventDefault(); choose(entry); }}>
          <small>{entry.section}</small><strong><span><Highlight text={entry.title} query={query} /></span><ArrowUpRight size={15} aria-hidden="true" /></strong><span><Highlight text={docsSearchExcerpt(entry.text, query)} query={query} /></span>
        </a>)}
      </div>
      {query.trim() && !results.length && <p className="docs-global-search-empty">{isId ? "Tidak ada hasil. Coba kata yang lebih singkat atau istilah lain." : "No results. Try a shorter keyword or another term."}</p>}
      <p className="docs-global-search-help">{isId ? "↑ ↓ pilih · Enter buka · Esc tutup" : "↑ ↓ select · Enter open · Esc close"}</p>
    </div>}
  </div>;
}
