import type { ReactNode } from "react";

/**
 * Primitif flowchart murni CSS/HTML (tanpa dependency tambahan).
 * Gaya ada di `docs.css`.
 *
 * - <Flow>      : kolom vertikal, anak-anaknya dipusatkan
 * - <FlowNode>  : kotak langkah (start / process / decision / store / external / end / note)
 * - <FlowArrow> : panah ke bawah (opsional label, `plain` = hanya garis tanpa kepala)
 * - <Branches>/<Branch> : percabangan paralel dengan konektor
 * - <HFlow>/<HStep>     : alur horizontal (timeline)
 */

export type NodeKind = "start" | "process" | "decision" | "store" | "external" | "end" | "note";

export type DocsLang = "id" | "en";

export const kindLabel: Record<DocsLang, Record<NodeKind, string>> = {
  id: {
    start: "Mulai",
    process: "Proses",
    decision: "Keputusan",
    store: "Data",
    external: "Pihak eksternal",
    end: "Selesai",
    note: "Catatan",
  },
  en: {
    start: "Start",
    process: "Process",
    decision: "Decision",
    store: "Data Store",
    external: "External Entity",
    end: "End",
    note: "Note",
  },
};

export function Flow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="df" role="group" aria-label={label}>
      {children}
    </div>
  );
}

export function FlowNode({
  id,
  kind = "process",
  title,
  children,
  lang = "id",
}: {
  id?: string;
  kind?: NodeKind;
  title: string;
  children?: ReactNode;
  lang?: DocsLang;
}) {
  const label = kindLabel[lang]?.[kind] || kindLabel.id[kind];
  return (
    <div id={id} className={`dfn dfn-${kind}`} data-kind={kind}>
      <span className="sr-only">{label}: </span>
      <strong className="dfn-title">{title}</strong>
      {children ? <div className="dfn-body">{children}</div> : null}
    </div>
  );
}

export function FlowArrow({ label, plain = false }: { label?: string; plain?: boolean }) {
  return (
    <div className={`dfa${plain ? " dfa-plain" : ""}`} aria-hidden="true">
      <span className="dfa-line" />
      {label ? <span className="dfa-label">{label}</span> : null}
      {plain ? null : <span className="dfa-head" />}
    </div>
  );
}

export function Branches({ children }: { children: ReactNode }) {
  return <div className="dfb">{children}</div>;
}

export function Branch({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="dfb-col">
      {label ? <span className="dfb-label">{label}</span> : null}
      {children}
    </div>
  );
}

export function HFlow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <ol className="dfh" aria-label={label}>
      {children}
    </ol>
  );
}

export function HStep({
  time,
  title,
  children,
  tone = "default",
}: {
  time: string;
  title: string;
  children?: ReactNode;
  tone?: "default" | "deadline";
}) {
  return (
    <li className={`dfh-step${tone === "deadline" ? " is-deadline" : ""}`}>
      <span className="dfh-time">{time}</span>
      <strong className="dfh-title">{title}</strong>
      {children ? <div className="dfh-body">{children}</div> : null}
    </li>
  );
}

export function FlowLegend({ lang = "id" }: { lang?: DocsLang }) {
  const kinds: NodeKind[] = ["start", "process", "decision", "store", "external", "end", "note"];
  const labels = kindLabel[lang] || kindLabel.id;
  return (
    <ul className="df-legend" aria-label={lang === "id" ? "Legenda flowchart" : "Flowchart legend"}>
      {kinds.map((kind) => (
        <li key={kind}>
          <span className={`df-legend-swatch dfn-${kind}`} aria-hidden="true" />
          {labels[kind]}
        </li>
      ))}
    </ul>
  );
}
