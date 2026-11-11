"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenCheck,
  Building2,
  CalendarClock,
  Database,
  FileSignature,
  HelpCircle,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Network,
  Rocket,
  Workflow,
} from "lucide-react";
import {
  Branch,
  Branches,
  DocsLang,
  Flow,
  FlowArrow,
  FlowLegend,
  FlowNode,
  HFlow,
  HStep,
} from "@/components/docs-flow";
import DocsMonthlyFlow from "@/components/docs-monthly-flow";
import DocsFyeAlerts from "@/components/docs-fye-alerts";
import DocsCommunicationFlow from "@/components/docs-communication-flow";
import DocsGlobalSearch from "@/components/docs-global-search";
import DocsReturnLoop from "@/components/docs-return-loop";
import DocsWipFlow from "@/components/docs-wip-flow";
import DocsManagementReport from "@/components/docs-management-report";
import DocsAcraUnsuccessful from "@/components/docs-acra-unsuccessful";
import { DocsGlossary, DocsRules, ReferenceLinks } from "@/components/docs-reference";
import "@/components/docs.css";

const navSections: Record<DocsLang, { id: string; label: string }[]> = {
  id: [
    { id: "overview", label: "Ringkasan" },
    { id: "glossary", label: "Kamus istilah" },
    { id: "official-rules", label: "Aturan ACRA & IRAS" },
    { id: "end-to-end-flow", label: "Alur besar" },
    { id: "incorporation", label: "Incorporation" },
    { id: "onboarding", label: "Onboarding" },
    { id: "client-database", label: "Client Database" },
    { id: "annual-compliance", label: "Kepatuhan tahunan" },
    { id: "fye-alerts", label: "Alert berdasarkan FYE" },
    { id: "communication", label: "Comm Hub & E-portal" },
    { id: "lead-reports", label: "Laporan lead" },
    { id: "monthly-reports", label: "Laporan bulanan A–F" },
    { id: "open-notes", label: "Catatan terbuka" },
  ],
  en: [
    { id: "overview", label: "Overview" },
    { id: "glossary", label: "Glossary" },
    { id: "official-rules", label: "ACRA & IRAS Rules" },
    { id: "end-to-end-flow", label: "End-to-End Flow" },
    { id: "incorporation", label: "Incorporation" },
    { id: "onboarding", label: "Onboarding" },
    { id: "client-database", label: "Client Database" },
    { id: "annual-compliance", label: "Annual Compliance" },
    { id: "fye-alerts", label: "FYE-Based Alerts" },
    { id: "communication", label: "Comm Hub & E-Portal" },
    { id: "lead-reports", label: "Lead Reports" },
    { id: "monthly-reports", label: "Monthly Reports A–F" },
    { id: "open-notes", label: "Open Notes" },
  ],
};

const legacySectionIds: Record<string, string> = {
  ringkasan: "overview",
  kamus: "glossary",
  "aturan-resmi": "official-rules",
  "alur-besar": "end-to-end-flow",
  "kepatuhan-tahunan": "annual-compliance",
  "alert-fye": "fye-alerts",
  komunikasi: "communication",
  "laporan-lead": "lead-reports",
  "laporan-bulanan": "monthly-reports",
  "catatan-terbuka": "open-notes",
  "h-kepatuhan": "h-annual-compliance",
  "h-laporan": "h-lead-reports",
  "h-catatan": "h-open-notes",
};

function SectionHead({ icon: Icon, title, id }: { icon: typeof Workflow; title: string; id: string }) {
  return (
    <div className="docs-section-head">
      <Icon aria-hidden="true" size={20} strokeWidth={2} />
      <h2 id={id}>{title}</h2>
    </div>
  );
}

const subscribeToHydration = () => () => {};

function readSavedLanguage(): DocsLang {
  try {
    const saved = window.localStorage.getItem("crm_docs_lang");
    if (saved === "id" || saved === "en") return saved;
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang === "id" || urlLang === "en") return urlLang;
  } catch {
    // Storage may be unavailable; retain the default language.
  }
  return "id";
}

type DocsTheme = "light" | "dark";

function readSavedSidebarCollapsed(): boolean {
  try {
    return window.localStorage.getItem("crm_docs_sidebar_collapsed") === "true";
  } catch {
    return false;
  }
}

function readSavedTheme(): DocsTheme {
  try {
    const saved = window.localStorage.getItem("crm_docs_theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export default function DocsView({ version = "1.1" }: { version?: "1.0" | "1.1" }) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [selectedLang, setLang] = useState<DocsLang | null>(null);
  const lang = selectedLang ?? (hydrated ? readSavedLanguage() : "id");
  const [selectedTheme, setTheme] = useState<DocsTheme | null>(null);
  const theme = selectedTheme ?? (hydrated ? readSavedTheme() : "light");
  const isDark = theme === "dark";
  const [selectedSidebarCollapsed, setSidebarCollapsed] = useState<boolean | null>(null);
  const sidebarCollapsed = selectedSidebarCollapsed ?? (hydrated ? readSavedSidebarCollapsed() : false);

  const handleToggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      window.localStorage.setItem("crm_docs_sidebar_collapsed", String(next));
    } catch {
      // Keep the sidebar choice for this visit when storage is unavailable.
    }
  };

  const handleToggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    try {
      window.localStorage.setItem("crm_docs_theme", next);
    } catch {
      // Keep the selected theme for this visit if storage is unavailable.
    }
  };

  const handleSetLang = (newLang: DocsLang) => {
    setLang(newLang);
    try {
      window.localStorage.setItem("crm_docs_lang", newLang);
    } catch {
      // ignore
    }
  };

  const isId = lang === "id";
  const sections = useMemo(() => {
    if (version === "1.1") return navSections[lang].flatMap(section => section.id === "onboarding" ? [section, { id: "work-in-progress", label: isId ? "WIP & follow-up" : "WIP & Follow-up" }, { id: "monthly-management-report", label: "Monthly Report" }] : [section]);
    return navSections[lang];
  }, [lang, isId, version]);

  const handleSetVersion = (next: string) => {
    if (next !== "1.0" && next !== "1.1") return;
    const hash = window.location.hash;
    const sharedAnchor = navSections.id.some(section => hash === `#${section.id}` || hash === `#h-${section.id}`) || hash.startsWith("#glossary-");
    router.push(`/docs/v${next}${window.location.search}${sharedAnchor ? hash : "#overview"}`);
  };
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const normalizeAnchor = () => {
      const current = window.location.hash.slice(1);
      const canonical = legacySectionIds[current] ?? (current.startsWith("h-") && legacySectionIds[current.slice(2)] ? `h-${legacySectionIds[current.slice(2)]}` : undefined);
      if (!canonical) return;
      window.history.replaceState(window.history.state, "", `#${canonical}`);
      document.getElementById(canonical)?.scrollIntoView({ block: "start" });
    };
    normalizeAnchor();
    window.addEventListener("hashchange", normalizeAnchor);
    return () => window.removeEventListener("hashchange", normalizeAnchor);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const current = entries.find(entry => entry.isIntersecting);
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: "-8% 0px -75% 0px" });
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="docs-shell" data-theme={theme}>
      <header className="docs-topbar" aria-label={isId ? "Header panduan" : "Handbook header"}>
        <div className="docs-topbar-inner">
          <div className="docs-header-identity">
            <a className="docs-header-brand" href="#overview"><BookOpenCheck size={24} aria-hidden="true" /><span>CRM Handbook<small>SOAS Pte. Ltd.</small></span></a>
            <label className="docs-version-control">
              <span className="sr-only">{isId ? "Versi panduan" : "Handbook version"}</span>
              <select aria-label={isId ? "Versi panduan" : "Handbook version"} value={version} onChange={event => handleSetVersion(event.target.value)}>
                <option value="1.1">v1.1 · {isId ? "Terbaru" : "Latest"}</option>
                <option value="1.0">v1.0 · {isId ? "Arsip" : "Archive"}</option>
              </select>
            </label>
          </div>
          <DocsGlobalSearch key={`${version}-${lang}`} lang={lang} />
          <div className="docs-header-actions">
            <button type="button" className="docs-theme-toggle" onClick={handleToggleTheme} aria-pressed={isDark} aria-label={isId ? (isDark ? "Gunakan mode terang" : "Gunakan mode gelap") : (isDark ? "Switch to light mode" : "Switch to dark mode")}>
              {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
              <span>{isId ? (isDark ? "Terang" : "Gelap") : (isDark ? "Light" : "Dark")}</span>
            </button>
          <div
            className="docs-lang-toggle"
            role="radiogroup"
            aria-label={isId ? "Pilih Bahasa" : "Select Language"}
          >
            <button
              type="button"
              role="radio"
              aria-checked={isId}
              className={`docs-lang-btn ${isId ? "is-active" : ""}`}
              onClick={() => handleSetLang("id")}
            >
              <span aria-hidden="true">🇮🇩</span> Bahasa Indonesia
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!isId}
              className={`docs-lang-btn ${!isId ? "is-active" : ""}`}
              onClick={() => handleSetLang("en")}
            >
              <span aria-hidden="true">🇬🇧</span> English
            </button>
          </div>
          </div>
        </div>
      </header>
      <div className={`docs-page${sidebarCollapsed ? " is-sidebar-collapsed" : ""}`}>
      <aside className="docs-sidebar">
        <div className="docs-sidebar-head">
          <p className="docs-toc-label">{isId ? "DAFTAR ISI" : "ON THIS PAGE"}</p>
          <button
            type="button"
            className="docs-sidebar-toggle"
            aria-expanded={!sidebarCollapsed}
            aria-controls="docs-toc-panel"
            aria-label={isId ? (sidebarCollapsed ? "Buka daftar isi" : "Kecilkan daftar isi") : (sidebarCollapsed ? "Expand table of contents" : "Collapse table of contents")}
            title={isId ? (sidebarCollapsed ? "Buka daftar isi" : "Kecilkan daftar isi") : (sidebarCollapsed ? "Expand table of contents" : "Collapse table of contents")}
            onClick={handleToggleSidebar}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={17} aria-hidden="true" /> : <PanelLeftClose size={17} aria-hidden="true" />}
          </button>
        </div>
        <div id="docs-toc-panel" hidden={sidebarCollapsed}>
        <nav className="docs-toc" aria-label={isId ? "Daftar isi" : "Table of contents"}>
          {sections.map((section, index) => <a key={section.id} href={`#${section.id}`} onClick={() => setActiveSection(section.id)} aria-current={activeSection === section.id ? "location" : undefined}><span className="docs-toc-number">{String(index + 1).padStart(2, "0")}</span>{section.label}</a>)}
        </nav>
        <div className="docs-sidebar-footer"><span>ACRA · IRAS · SOAS</span><small>{isId ? "Rujukan diperiksa 10 Nov 2026" : "Sources checked 10 Nov 2026"}</small></div>
        </div>
      </aside>
      <article className="docs-content">
      {version === "1.0" && <p className="docs-version-banner">{isId ? "Versi 1.0 — flow lama disimpan sebagai arsip." : "Version 1.0 — the previous workflow is preserved as an archive."} <a href="/docs/v1.1">{isId ? "Buka versi 1.1 →" : "Open version 1.1 →"}</a></p>}
      <header className="docs-hero">
        <div className="docs-hero-top">
          <p className="docs-eyebrow">
            {isId ? "Dokumentasi · SOAS Pte. Ltd." : "Documentation · SOAS Pte. Ltd."}
          </p>


        </div>

        <h1 className="docs-title">
          {isId
            ? "Panduan CRM & Kepatuhan"
            : "CRM & Compliance Handbook"}
        </h1>

        <p className="docs-lead">
          {isId ? (
            <>
              Panduan alur bisnis dari Excalidraw, kamus istilah, serta aturan resmi ACRA dan IRAS: bagaimana <em>lead</em> berubah menjadi klien (incorporation atau
              onboarding), bagaimana klien dikelola di Client Management Database, kepatuhan tahunan, laporan bulanan A–F, billing dan collection.
            </>
          ) : (
            <>
              Business workflows from Excalidraw, a practical glossary, and official ACRA and IRAS rules: how <em>leads</em> convert into active clients
              (incorporation or onboarding), client governance in the Client Management Database, annual compliance, monthly reports A–F, billing and collection.
            </>
          )}
        </p>
      </header>


      {/* ------------------------------------------------------------------ */}
      <section className="docs-section" id="overview" aria-labelledby="h-overview">
        <div className="docs-section-head">
          <BookOpenCheck aria-hidden="true" size={20} strokeWidth={2} />
          <h2 id="h-overview">{isId ? "Ringkasan" : "Executive Summary"}</h2>
        </div>
        <p>
          {isId ? (
            <>
              Papan terbaru mencakup leads, incorporation melalui corpora8e, onboarding dan Client Management Database. Alur di bawah menjelaskan rancangan proses bisnis SOAS.
            </>
          ) : (
            <>
              The current board covers leads, incorporation through corpora8e, onboarding and the Client Management Database. The flows below describe the SOAS business process design.
            </>
          )}
        </p>

        <div className="docs-cards">
          <div className="docs-card">
            <h4>1. Leads</h4>
            <p>
              {isId
                ? "Website dan referral langsung masuk ke Leads. Email dan WhatsApp masuk sebagai percakapan/kontak di Comm Hub, lalu dikonversi menjadi lead. Jenis layanan: incorporation / onboarding; progres: in progress, rejected, atau selesai."
                : "Website and referrals go directly to Leads. Email and WhatsApp first arrive as conversations/contacts in Comm Hub, then convert to leads. Service types: incorporation / onboarding; progress: in progress, rejected, or completed."}
            </p>
          </div>
          <div className="docs-card">
            <h4>2. Incorporation</h4>
            <p>
              {isId
                ? "Perusahaan baru: kumpulkan data, bayar di muka, KYC semua shareholder, ajukan ke ACRA, tanda tangan kontrak."
                : "New company formation: collect intake data, upfront payment, KYC all shareholders, file to ACRA, execute contract."}
            </p>
          </div>
          <div className="docs-card">
            <h4>3. Onboarding</h4>
            <p>
              {isId
                ? "Perusahaan existing dari CSP lain: Business Profile, KYC/KYB, approval, kontrak."
                : "Existing companies switching CSP: obtain Business Profile, KYC/KYB screening, approval, contract execution."}
            </p>
          </div>
          <div className="docs-card">
            <h4>4. Client Database</h4>
            <p>
              {isId
                ? "Daftar klien aktif, riwayat Business Profile & kontrak, status active / terminated / strike-off."
                : "Active client register, Business Profile & contract revision logs, lifecycle statuses (active / terminated / strike-off)."}
            </p>
          </div>
          <div className="docs-card">
            <h4>5. {isId ? "Kepatuhan tahunan" : "Annual Compliance"}</h4>
            <p>
              {isId
                ? "ECI ≤3 bulan (kecuali waiver), AGM ≤6 bulan dan AR ≤7 bulan setelah FYE untuk non-listed; tax return 30 November pada YA terkait."
                : "ECI within 3 months (unless waived), AGM within 6 months and AR within 7 months after FYE for non-listed companies; tax return by 30 November of the relevant YA."}
            </p>
          </div>
          <div className="docs-card">
            <h4>6. {isId ? "Laporan bulanan & collection" : "Monthly Reports & Collection"}</h4>
            <p>
              {isId
                ? "A–F: pengumpulan dokumen, progres kerja, AR, pajak final, billing deliverables, dan collection."
                : "A–F: document collection, work progress, AR, final tax, deliverable billing, and collection."}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <DocsGlossary lang={lang} />
      <DocsRules lang={lang} />

      <section className="docs-section" id="end-to-end-flow" aria-labelledby="h-end-to-end-flow">
        <SectionHead
          icon={Workflow}
          title={isId ? "Alur besar: dari lead sampai klien" : "End-to-End Flow: From Lead to Active Client"}
          id="h-end-to-end-flow"
        />
        <p>
          {isId
            ? "Gambaran end-to-end. Detail tiap jalur ada di bagian berikutnya."
            : "High-level end-to-end operational overview. Detailed workflows for each track are documented below."}
        </p>

        <FlowLegend lang={lang} />

        <div className="docs-canvas">
          <Flow label={isId ? "Alur besar lead ke klien" : "High-level lead to client workflow"}>
            <FlowNode
              kind="start"
              lang={lang}
              title={isId ? "Calon klien menghubungi SOAS" : "Prospect contacts SOAS"}
            />
            <FlowArrow plain />
            <Branches mergeToNext>
              <Branch mergeTail label={isId ? "Langsung menjadi lead" : "Direct to Lead"}>
                <FlowNode kind="external" lang={lang} title="Website (Landing Page)" />
              </Branch>
              <Branch mergeTail label={isId ? "Melalui Comm Hub" : "Via Comm Hub"}>
                <FlowNode kind="external" lang={lang} title="Email / WhatsApp" />
                <FlowArrow />
                <FlowNode id="lead-intake-comm-hub" kind="store" lang={lang} title="Comm Hub">
                  {isId ? "Email dan WhatsApp diterima sebagai percakapan/kontak sebelum menjadi lead." : "Email and WhatsApp arrive as conversations/contacts before becoming leads."}
                </FlowNode>
                <FlowArrow />
                <FlowNode id="lead-intake-conversion" lang={lang} title={isId ? "Konversi menjadi lead" : "Convert to Lead"}>
                  {isId ? "Buat lead dari percakapan Comm Hub dan tautkan riwayat komunikasinya." : "Create a lead from the Comm Hub conversation and link its communication history."}
                </FlowNode>
              </Branch>
              <Branch mergeTail label={isId ? "Langsung menjadi lead" : "Direct to Lead"}>
                <FlowNode kind="external" lang={lang} title="Referral" />
              </Branch>
            </Branches>
            <FlowArrow />
            <FlowNode kind="store" lang={lang} title={version === "1.1" ? "Leads (listing)" : "Leads"}>
              <p>{isId ? "Simpan detail lead & statusnya." : "Store lead details & pipeline status."}</p>
              {version === "1.1" && <p>{isId ? "Tinjau lead, tentukan tindakan yang diperlukan, lalu siapkan respons menggunakan template yang sesuai dengan jenis lead. Staf harus segera merespons, paling lambat 1 hari sejak lead diterima." : "Review the lead, determine the necessary actions, and prepare a response using the appropriate template for the lead type. Staff must respond promptly, within 1 day of receiving the lead."}</p>}
            </FlowNode>
            <FlowArrow />
            <FlowNode kind="decision" lang={lang} title={isId ? "Jenis layanan & progres lead" : "Service Type & Lead Progress"}>
              {version === "1.1" && <p>{isId ? "AI dapat mengekstrak informasi dan menentukan jenis layanan otomatis, atau staf memilihnya secara manual." : "AI can extract information and identify the service type automatically, or staff can select it manually."}</p>}
            </FlowNode>
            <FlowArrow plain />
            <Branches>
              <Branch label="Incorporation">
                <FlowNode
                  lang={lang}
                  title={isId ? "Mulai perusahaan baru" : "Start New Company"}
                >
                  <p>{isId ? "KYC → ACRA → kontrak" : "KYC → ACRA → Contract"}</p>
                </FlowNode>
            <FlowArrow label={isId ? "berhasil & kontrak ditandatangani" : "approved & contract signed"} />
            <FlowNode
              kind="process"
              lang={lang}
              title={isId ? "Menjadi klien SOAS" : "Onboarded as SOAS Client"}
            />
            <FlowArrow />
            <FlowNode kind="store" lang={lang} title="Client Management Database">
              <p>
                {isId
                  ? "Status klien, dokumen, kontrak, billing, kepatuhan."
                  : "Client status, documents, contracts, billing, compliance."}
              </p>
            </FlowNode>
              </Branch>
              <Branch label="Onboarding">
                <FlowNode
                  lang={lang}
                  title={isId ? "Perusahaan existing pindah CSP" : "Existing Company Switch"}
                >
                  <p>{isId ? "Business Profile → KYC/KYB → kontrak" : "Business Profile → KYC/KYB → Contract"}</p>
                </FlowNode>
            <FlowArrow label={isId ? "berhasil & kontrak ditandatangani" : "approved & contract signed"} />
            <FlowNode
              kind="process"
              lang={lang}
              title={isId ? "Menjadi klien SOAS" : "Onboarded as SOAS Client"}
            />
            <FlowArrow />
            <FlowNode kind="store" lang={lang} title="Client Management Database">
              <p>
                {isId
                  ? "Status klien, dokumen, kontrak, billing, kepatuhan."
                  : "Client status, documents, contracts, billing, compliance."}
              </p>
            </FlowNode>
              </Branch>
              <Branch label="In progress">
                <FlowNode
                  lang={lang}
                  title={isId ? "Proses masih berjalan" : "Work In Progress"}
                >
                  <p>
                    {isId
                      ? "Saldo dibawa ke bulan berikutnya."
                      : "Active balance carried over to next month."}
                  </p>
                  {version === "1.1" && <a href="#work-in-progress">{isId ? "Lihat flow WIP & follow-up →" : "See WIP & follow-up workflow →"}</a>}
                </FlowNode>
              </Branch>
              <Branch label="Rejected">
                <FlowNode
                  kind="end"
                  lang={lang}
                  title={isId ? "Lead ditolak" : "Lead Rejected"}
                />
              </Branch>
            </Branches>
            {version === "1.1" && <FlowNode id="lead-monthly-report-note" kind="note" lang={lang} title={isId ? "Catatan — Monthly Report" : "Note — Monthly Report"}>
              <p>{isId ? "Data leads dirangkum menjadi Monthly Report (digenerate secara otomatis), dengan highlight jumlah:" : "Lead data is compiled into the Monthly Report (automatically generated), highlighting the number of:"}</p>
              <ul>
                <li><strong>Success:</strong> {isId ? "berapa yang berhasil Onboarding dan berapa yang berhasil Incorporation, ditampilkan terpisah." : "successful Onboardings and successful Incorporations, shown separately."}</li>
                <li><strong>WIP:</strong> {isId ? "berapa yang masih diproses, termasuk WIP dari bulan sebelumnya." : "leads still in progress, including WIP carried forward from the previous month."}</li>
                <li><strong>Rejected:</strong> {isId ? "berapa lead yang ditolak." : "rejected leads."}</li>
              </ul>
              <a href="#monthly-management-report">{isId ? "Lihat Monthly Report →" : "View Monthly Report →"}</a>
            </FlowNode>}
          </Flow>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section className="docs-section" id="incorporation" aria-labelledby="h-incorporation">
        <SectionHead
          icon={Building2}
          title={isId ? "Incorporation (perusahaan baru)" : "Incorporation (New Company Formation)"}
          id="h-incorporation"
        />
        <p>
          {version === "1.1" ? (isId
            ? "Kumpulkan informasi jumlah director, shareholder individu dan shareholder korporasi untuk menentukan biaya. Informasi klien dikumpulkan melalui Communication Hub; data formulir lengkap disiapkan untuk pengajuan ACRA."
            : "Collect the number of directors, individual shareholders and corporate shareholders to determine the fee. Gather client information through Communication Hub and prepare the complete form data for ACRA filing.") : isId
            ? "Mengumpulkan semua data untuk formulir incorporation ke ACRA. Informasi dari klien dikumpulkan lewat Communication Hub; alur percakapan dan tindak lanjut ada pada bagian Comm Hub & E-portal."
            : "Collecting all intake data for the ACRA incorporation application. Client information is gathered via Communication Hub; conversation and follow-up steps are detailed in Comm Hub & E-Portal."}
        </p>
        <div className="docs-canvas">
          <Flow label={isId ? "Flow incorporation" : "Incorporation workflow"}>
            <FlowNode
              kind="start"
              lang={lang}
              title={isId ? "Mulai incorporation" : "Initiate Incorporation"}
            />
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={
                version === "1.1" ? (isId ? "Kumpulkan informasi untuk menentukan biaya" : "Collect Information to Determine Fees") : isId
                  ? "Kumpulkan data formulir incorporation ACRA"
                  : "Collect ACRA Incorporation Form Data"
              }
            >
              <ul>
                <li>
                  {version === "1.1" ? (isId
                    ? "Jumlah director dan shareholder individu."
                    : "Number of directors and individual shareholders.") : isId
                    ? "Jumlah shareholder & director (menentukan jumlah KYC)"
                    : "Shareholder & director headcounts (determines KYC volume)"}
                </li>
                {version === "1.1" && <li>{isId ? "Jumlah shareholder korporasi." : "Number of corporate shareholders."}</li>}
                {version === "1.1" && <li>{isId ? "Tanyakan pilihan constitution: Model Constitution ACRA atau Customised Constitution." : "Ask whether the client wants ACRA's Model Constitution or a Customised Constitution."}</li>}
              </ul>
            </FlowNode>
            {version === "1.1" && <>
              <FlowArrow />
              <FlowNode id="incorporation-constitution" lang={lang} title={isId ? "Konfirmasi pilihan constitution dengan klien" : "Confirm the Constitution Choice with the Client"}>
                <ul>
                  <li>{isId ? "Model Constitution: gunakan model yang disediakan ACRA jika sesuai dengan kebutuhan tata kelola dan tipe perusahaan." : "Model Constitution: adopt ACRA's model where it suits the company's governance needs and company type."}</li>
                  <li>{isId ? "Customised Constitution: minta dokumen yang sudah dimiliki klien atau konfirmasi aturan khusus yang perlu disusun dan direview. Sepakati cakupan drafting/review serta biayanya sebelum melanjutkan." : "Customised Constitution: request the client's existing document or confirm the specific provisions to be drafted and reviewed. Agree the drafting/review scope and fees before proceeding."}</li>
                </ul>
                <p>{isId ? "Pilihan mengikuti kebutuhan dan tipe perusahaan; tidak otomatis ditentukan oleh besar-kecilnya perusahaan. Catat pilihan dan persetujuan klien sejak intake." : "The choice depends on the company's needs and type; company size alone does not determine it. Record the client's choice and agreement during intake."}</p>
                <p>{isId ? "Sumber: " : "Source: "}<a href="https://www.acra.gov.sg/register/business/registering-different-business-structures/local-company/company-constitution/" target="_blank" rel="noreferrer">{isId ? "panduan constitution ACRA" : "ACRA constitution guide"}</a></p>
              </FlowNode>
              <FlowArrow />
              <FlowNode id="incorporation-resident-director" lang={lang} title={isId ? "Pastikan resident director & kebutuhan nominee" : "Confirm Resident Director & Nominee Requirements"}>
                <ul>
                  <li>{isId ? "Perusahaan wajib memiliki minimal satu direktur yang ordinarily resident di Singapura saat incorporation." : "The company must have at least one director ordinarily resident in Singapore at incorporation."}</li>
                  <li>{isId ? "Jika belum ada, klien dapat menunjuk nominee director yang memenuhi syarat domisili dan kelayakan direktur. Pastikan calon resident director sebelum filing ke ACRA." : "If none is available, the client may appoint a nominee director who meets the residency and director eligibility requirements. Confirm the proposed resident director before filing with ACRA."}</li>
                  <li>{isId ? "Untuk jasa nominee director secara bisnis, pengaturan harus melalui CSP terdaftar yang menilai calon tersebut fit and proper. Nominee tetap memiliki kewajiban hukum sebagai direktur." : "Nominee directorship provided by way of business must be arranged through a registered CSP that assesses the individual as fit and proper. A nominee retains the legal duties of a director."}</li>
                  <li>{isId ? "Lengkapi data dan KYC/CDD direktur. Jika menggunakan nominee, catat status nominee dan data nominator untuk incorporation." : "Complete director details and KYC/CDD. Where a nominee is used, record nominee status and nominator details for incorporation."}</li>
                </ul>
                <p>{isId ? "Sumber ACRA: " : "ACRA sources: "}
                  <a href="https://www.acra.gov.sg/news-events/news-announcements/balancing-director-accountability-with-sound-corporate-governance/" target="_blank" rel="noreferrer">resident director</a>{" · "}
                  <a href="https://www.acra.gov.sg/register/business/registering-different-business-structures/local-company/appointing-company-directors-other-key-officers/" target="_blank" rel="noreferrer">{isId ? "direktur & nominee" : "directors & nominees"}</a>{" · "}
                  <a href="https://www.acra.gov.sg/news-events/news-announcements/865/" target="_blank" rel="noreferrer">CSP & fit and proper</a>
                </p>
              </FlowNode>
            </>}
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={
                isId
                  ? "Hitung biaya & bayar di muka"
                  : "Calculate Fees & Upfront Payment"
              }
            >
              <ul>
                <li>
                  {version === "1.1" ? (isId
                    ? "Biaya jasa + biaya ACRA + biaya KYC/KYB"
                    : "Service fee + ACRA fee + KYC/KYB fee") : isId
                    ? "Biaya jasa + ACRA fee + GST"
                    : "Professional service fee + ACRA fee + GST"}
                </li>
                <li>
                  {version === "1.1" ? (isId
                    ? "Klien wajib melunasi pembayaran sebelum filing ke ACRA."
                    : "Client must settle payment before filing with ACRA.") : isId
                    ? "Klien wajib bayar sebelum incorporation dimulai"
                    : "Client must settle payment before filing begins"}
                </li>
              </ul>
            </FlowNode>
            <FlowArrow />
            <FlowNode
              id={version === "1.1" ? "incorporation-party-details" : undefined}
              kind={version === "1.1" ? "process" : "decision"}
              lang={lang}
              title={version === "1.1" ? (isId ? "Kumpulkan data director & shareholder" : "Collect Director & Shareholder Details") : (isId ? "Tipe shareholder?" : "Shareholder Type?")}
            >
              {version === "1.1" && <p>{isId ? "Kumpulkan identitas setiap director (termasuk nominee director) dan shareholder individu. Lengkapi jalur corporate shareholder jika ada. Jika orang yang sama merangkap peran, tautkan semua perannya ke satu identitas." : "Collect identity details for every director (including nominee directors) and individual shareholder. Complete the corporate shareholder branch where applicable. If one person holds multiple roles, link all their roles to a single identity."}</p>}
            </FlowNode>
            <FlowArrow plain />
            <Branches mergeToNext>
              <Branch mergeTail label={version === "1.1" ? (isId ? "Director & shareholder individu" : "Directors & Individual Shareholders") : "Individual"}>
                <Branches mergeToNext>
                  <Branch mergeTail label={isId ? "Singaporean / resident" : "Singaporean / Resident"}>
                    <FlowNode
                      lang={lang}
                      title={isId ? "Minta NRIC / FIN" : "Request NRIC / FIN"}
                    />
                  </Branch>
                  <Branch mergeTail label={isId ? "Foreigner" : "Foreigner"}>
                    <FlowNode
                      lang={lang}
                      title={isId ? "Minta Passport" : "Request Passport"}
                    >
                      <p>
                        {isId
                          ? "Alamat dari tagihan (mis. tagihan listrik)."
                          : "Proof of address (e.g. utility bill)."}
                      </p>
                    </FlowNode>
                  </Branch>
                </Branches>
              </Branch>
              <Branch mergeTail label={version === "1.1" ? (isId ? "Shareholder korporasi (jika ada)" : "Corporate Shareholders (if any)") : "Corporate"}>
                <Branches mergeToNext>
                  <Branch mergeTail label={isId ? "Perusahaan Singapura" : "Singapore Entity"}>
                    <FlowNode
                      lang={lang}
                      title={
                        isId
                          ? "Ambil dari Business Profile"
                          : "Extract from Business Profile"
                      }
                    />
                  </Branch>
                  <Branch mergeTail label={isId ? "Perusahaan asing" : "Foreign Entity"}>
                    <FlowNode
                      lang={lang}
                      title={
                        isId
                          ? "Business Profile + dokumen tersertifikasi"
                          : "Business Profile + Certified Documents"
                      }
                    >
                      <p>
                        {isId
                          ? "Oleh pihak berwenang / profesional."
                          : "Certified by authorized / professional bodies."}
                      </p>
                    </FlowNode>
                  </Branch>
                </Branches>
                {version === "1.1" && <>
                  <FlowArrow />
                  <FlowNode id="corporate-representative" kind="note" lang={lang} title={isId ? "Wakil perusahaan (individu)" : "Corporate Representative (Individual)"}>
                    <p>{isId ? "Wakil individu dari corporate shareholder mengikuti jalur data individu yang sama dengan director dan shareholder individu: data pribadi, NRIC/FIN atau passport, serta bukti alamat bila diperlukan. Wakil juga mengikuti KYC/CDD." : "An individual representing a corporate shareholder follows the same identity-data path as directors and individual shareholders: personal details, NRIC/FIN or passport, and proof of address where applicable. The representative also undergoes KYC/CDD."}</p>
                  </FlowNode>
                </>}
              </Branch>
            </Branches>
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={
                isId
                  ? "KYC / KYB & Client Due Diligence"
                  : "KYC / KYB & Client Due Diligence"
              }
            >
              <ul>
                <li>
                  {version === "1.1" ? (isId
                    ? "Mencakup director (termasuk nominee), shareholder individu, serta wakil dan individu terkait corporate shareholder."
                    : "Covers directors (including nominees), individual shareholders, and representatives and relevant individuals behind corporate shareholders.") : (isId
                    ? "Berlaku juga untuk individu di balik corporate shareholder"
                    : "Applies also to individuals behind corporate shareholders")}
                </li>
                <li>
                  {isId
                    ? "Proses dokumen: Passport, NRIC, FIN"
                    : "Process documents: Passport, NRIC, FIN"}
                </li>
                <li>
                  {isId
                    ? "IPPC (Internal Policies, Procedures and Controls Policy — kebijakan kepatuhan AML/CFT internal CSP/SOAS)"
                    : "IPPC (Internal Policies, Procedures and Controls Policy — internal AML/CFT compliance policy for CSP/SOAS)"}
                </li>
              </ul>
            </FlowNode>
            <FlowArrow />
            {version === "1.1" && <>
              <FlowNode id="incorporation-signature-bundle" lang={lang} title={isId ? "Bundel dokumen tanda tangan" : "Bundle Documents for Signature"}>
                <ul>
                  <li>{isId ? "Siapkan dokumen incorporation dan draf First Director Meeting pada tahap yang sesuai." : "Prepare incorporation documents and First Director Meeting drafts at the appropriate stage."}</li>
                  <li>{isId ? "Finalkan constitution yang dipilih dan minta persetujuan klien sebelum filing. Semua subscriber menandatangani salinan constitution saat incorporation; simpan salinan bertanda tangan di registered office." : "Finalise the selected constitution and obtain client approval before filing. All subscribers sign a copy of the constitution at incorporation; keep the signed copy at the registered office."}</li>
                  <li>{isId ? "Gabungkan dokumen yang siap ditandatangani agar tidak bolak-balik meminta tanda tangan." : "Bundle documents ready for signing to avoid repeated signature requests."}</li>
                  <li>{isId ? "SOAS juga review dan countersign kontrak layanan." : "SOAS also reviews and countersigns the service contract."}</li>
                </ul>
              </FlowNode>
              <FlowArrow />
            </>}
            <DocsReturnLoop
              fromId="acra-revision-consent"
              toId="incorporation-submit"
              label={version === "1.1" ? (isId ? "Kembali ke pengajuan hanya jika ACRA mengizinkan resubmission dan klien menyetujui perbaikan. Rejected mengakhiri proses." : "Return to submission only when ACRA allows resubmission and the client approves the corrections. Rejected ends the process.") : (isId ? "Setelah klien menyetujui perbaikan, kembali ke tahap pengajuan ACRA. Ulangi jika ditolak lagi; lanjutkan hanya setelah ACRA menyetujui." : "After the client approves the corrections, return to ACRA submission. Repeat if rejected again; proceed only after ACRA approval.")}
            >
            <FlowNode
              id="incorporation-submit"
              lang={lang}
              title={
                version === "1.1" ? (isId ? "Ajukan aplikasi ke ACRA" : "Submit Application to ACRA") : isId
                  ? "Ajukan aplikasi ke ACRA melalui corpora8e"
                  : "Submit Application to ACRA through corpora8e"
              }
            >
              {version === "1.1" ? (
                <>
                <p>{isId ? "Pilih Model Constitution yang disepakati atau upload Customised Constitution final pada pengajuan Bizfile." : "Select the agreed Model Constitution or upload the final Customised Constitution in the Bizfile application."} <a href="https://www.acra.gov.sg/register/business/registering-different-business-structures/local-company/registering-via-bizfile/" target="_blank" rel="noreferrer">{isId ? "Panduan ACRA" : "ACRA guide"}</a></p>
                <div className="docs-filing-note" role="note">
                  <strong>{isId ? "Catatan:" : "Note:"}</strong>
                  <p>{isId ? "Jika pengajuan online tidak tersedia, siapkan data dan serahkan ke SOAS untuk pengajuan manual. Tetap pantau hasil pengajuan." : "If online submission is unavailable, prepare the data and hand it to SOAS for manual filing. Continue tracking the filing outcome."}</p>
                </div>
                </>
              ) : (isId ? "Jika pengajuan online tidak tersedia, siapkan data dan serahkan ke SOAS untuk pengajuan manual. Tetap pantau hasil pengajuan." : "If online submission is unavailable, prepare the data and hand it to SOAS for manual filing. Continue tracking the filing outcome.")}
            </FlowNode>
            <FlowArrow />
            <FlowNode
              kind="decision"
              lang={lang}
              title={version === "1.1" ? (isId ? "Hasil pengajuan ACRA?" : "ACRA Application Outcome?") : (isId ? "Aplikasi disetujui ACRA?" : "Application Approved by ACRA?")}
            />
            <FlowArrow plain />
            <Branches>
              <Branch label={version === "1.1" ? (isId ? "Tidak berhasil (Not Successful)" : "Not Successful") : (isId ? "Ditolak" : "Rejected")}>
                {version === "1.1" ? <DocsAcraUnsuccessful lang={lang} /> : <>
                <FlowNode lang={lang} title={isId ? "Tinjau alasan penolakan & perbaiki aplikasi" : "Review Rejection Reasons & Correct Application"}>
                  {isId ? "Misalnya nama sudah dipakai perusahaan lain." : "For example, the proposed company name is already in use."}
                </FlowNode>
                <FlowArrow />
                <FlowNode id="acra-revision-consent" lang={lang} title={isId ? "Minta persetujuan klien atas perbaikan" : "Obtain Client Approval of the Corrections"}>
                  <p>{isId ? "Setelah klien menyetujui perbaikan, kembali ke tahap pengajuan aplikasi dan tunggu keputusan ACRA. Jika ditolak lagi, ulangi perbaikan, persetujuan klien, dan pengajuan hingga disetujui ACRA." : "Once the client approves the corrections, return to application submission and await ACRA’s decision. If rejected again, repeat the correction, client approval, and submission steps until ACRA approves the application."}</p>
                  <a href="#incorporation-submit">{isId ? "Kembali ke pengajuan ACRA ↑" : "Return to ACRA Submission ↑"}</a>
                </FlowNode>
                </>}
              </Branch>
              <Branch label={isId ? "Disetujui" : "Approved"}>
                <FlowArrow label={isId ? "Hanya jika disetujui" : "Only when approved"} />
            <FlowNode
              kind="store"
              lang={lang}
              title={
                isId
                  ? "Data hasil approval"
                  : "Approved Company Particulars"
              }
            >
              <ul>
                <li>Company Name, Date of Incorporation, UEN</li>
                <li>FYE (Financial Year End)</li>
                <li>Business Profile &amp; Constitution</li>
              </ul>
            </FlowNode>
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={
                isId
                  ? (version === "1.1" ? "Notifikasi ke shareholder / director" : "Notifikasi ke shareholder")
                  : (version === "1.1" ? "Shareholder / Director Notification" : "Shareholder Notification")
              }
            >
              <ul>
                {version !== "1.1" && <li>First Director meeting</li>}
                <li>
                  {version === "1.1" ? (isId
                    ? "Kirim Business Profile, Constitution & dokumen First Director Meeting"
                    : "Transmit Business Profile, Constitution & First Director Meeting Documents") : isId
                    ? "Kirim Business Profile & Constitution"
                    : "Transmit Business Profile & Constitution"}
                </li>
              </ul>
            </FlowNode>
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={
                version === "1.1" ? (isId ? "Kontrak Layanan" : "Service Contract") : isId
                  ? "Klien mengisi form layanan SOAS"
                  : "Client Selects SOAS Service Package"
              }
            >
              {version === "1.1" && <p>{isId ? "Klien memilih layanan yang dibutuhkan:" : "Let the client choose the required services:"}</p>}
              <ul>
                <li>
                  <strong>Corporate secretarial</strong>{" "}
                  {isId ? "(paket / item):" : "(package / item):"}{" "}
                  Company Secretary, Nominee Director, Nominee Shareholder, RORC, Registered address
                </li>
                <li>
                  <strong>ART</strong> (Account, Report, Tax):{" "}
                  {isId ? "paket / item" : "modular package / individual items"}
                </li>
                <li>
                  <strong>Ad hoc</strong>:{" "}
                  {version === "1.1" && (isId ? "Di luar layanan corporate secretarial / ART; " : "Outside corporate secretarial / ART services; ")}
                  {isId
                    ? "mis. beli Business Profile dari ACRA, ubah company particulars"
                    : "e.g. purchase ACRA Business Profile, update company particulars"}
                </li>
              </ul>
            </FlowNode>
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={
                isId
                  ? "Tanda tangan kontrak"
                  : "Sign Service Contract"
              }
            >
              <p>
                {isId
                  ? "Perubahan layanan = kontrak baru. Layanan di luar kontrak dianggap ad hoc & ditagih terpisah."
                  : "Scope amendments require a new contract. Out-of-scope services are treated as ad hoc & invoiced separately."}
              </p>
            </FlowNode>
            <FlowArrow />
            <FlowNode
              kind="end"
              lang={lang}
              title={isId ? "Menjadi klien SOAS" : "Officially Onboarded as SOAS Client"}
            />
            <FlowArrow plain />
            <FlowNode
              kind="note"
              lang={lang}
              title={isId ? "Catatan" : "Note"}
            >
              {isId
                ? "Pantau kontrak yang belum ditandatangani dan ingatkan klien untuk memperbarui."
                : "Track unsigned contracts and prompt clients for timely completion."}
            </FlowNode>
              </Branch>
            </Branches>
            </DocsReturnLoop>
          </Flow>
        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      <section className="docs-section" id="onboarding" aria-labelledby="h-onboarding">
        <SectionHead
          icon={Rocket}
          title={isId ? "Onboarding (perusahaan existing)" : "Onboarding (Existing Companies)"}
          id="h-onboarding"
        />
        <p>
          {isId
            ? "Perusahaan existing yang ingin berpindah dari CSP lain ke SOAS: ambil Business Profile, lakukan KYC/KYB, lalu tindak lanjuti hasil pemeriksaan. Pemilihan layanan dan kontrak dilanjutkan hanya setelah KYC/KYB disetujui SOAS."
            : "For an existing company transferring from another CSP to SOAS: retrieve its Business Profile, perform KYC/KYB, and act on the screening outcome. Proceed to service selection and the contract only after SOAS approves the KYC/KYB screening."}
        </p>
        <div className="docs-canvas">
          <Flow label={isId ? "Flow onboarding" : "Onboarding workflow"}>
            <FlowNode kind="start" lang={lang} title={isId ? "Perusahaan existing mengajukan onboarding" : "Existing Company Requests Onboarding"} />
            <FlowArrow />
            <FlowNode lang={lang} title={version === "1.1" ? (isId ? "Ambil atau minta Business Profile perusahaan" : "Retrieve or Request Company Business Profile") : (isId ? "Ambil Business Profile perusahaan" : "Retrieve Company Business Profile")}>
              {version === "1.1" && <p><strong>{isId ? "Usulan biaya screening: " : "Proposed screening fee: "}</strong>{isId ? "Biaya KYC/KYB dapat dihitung berdasarkan jumlah screening individu dan entitas yang diperlukan. Gunakan Business Profile untuk memperkirakan cakupannya, lalu sepakati tarif dan estimasi biaya dengan klien sebelum screening. Catat jumlah screening aktual untuk penagihan sesuai kesepakatan SOAS." : "KYC/KYB fees may be based on the number of individual and entity screenings required. Use the Business Profile to estimate the scope, then agree rates and estimated fees with the client before screening. Record the actual screening count for billing under the agreed SOAS terms."}</p>}
            </FlowNode>
            <FlowArrow />
            <DocsReturnLoop
              fromId="onboarding-corrected-documents"
              toId="onboarding-screening"
              label={isId ? "Setelah data atau dokumen diperbaiki, kembali ke pemeriksaan KYC/KYB untuk penilaian ulang oleh SOAS." : "After correcting the information or documents, return to KYC/KYB screening for SOAS reassessment."}
            >
              <FlowNode id="onboarding-screening" lang={lang} title={isId ? "Lakukan pemeriksaan KYC/KYB" : "Perform KYC/KYB Screening"} />
              <FlowArrow />
              <FlowNode kind="decision" lang={lang} title={isId ? "Hasil pemeriksaan KYC/KYB oleh SOAS?" : "SOAS KYC/KYB Screening Outcome?"} />
              <FlowArrow plain />
              <Branches>
                <Branch label={isId ? "Perlu perbaikan" : "Corrections Required"}>
                  <FlowNode lang={lang} title={isId ? "Tinjau temuan & minta kelengkapan dari klien" : "Review Findings & Request Missing Information"}>
                    {isId ? "Staf meninjau temuan dan meminta klien memperbaiki data atau melengkapi dokumen yang diperlukan." : "Staff review the findings and ask the client to correct the information or provide the required documents."}
                  </FlowNode>
                  <FlowArrow />
                  <FlowNode id="onboarding-corrected-documents" lang={lang} title={isId ? "Terima perbaikan & ajukan pemeriksaan ulang" : "Receive Corrections & Request Reassessment"}>
                    <p>{isId ? "Kembali ke pemeriksaan KYC/KYB setelah data atau dokumen diperbaiki. Hasil pemeriksaan ulang menentukan apakah perlu perbaikan lagi, ditolak, atau disetujui. Onboarding tetap tertunda sampai disetujui SOAS." : "Return to KYC/KYB screening after the information or documents have been corrected. Reassessment determines whether further corrections are needed, the request is rejected, or it is approved. Onboarding remains pending until SOAS approval."}</p>
                    <a href="#onboarding-screening">{isId ? "Kembali ke pemeriksaan KYC/KYB ↑" : "Return to KYC/KYB Screening ↑"}</a>
                  </FlowNode>
                </Branch>
                <Branch label={isId ? "Ditolak final" : "Final Rejection"}>
                  <FlowNode id="onboarding-rejected" kind="end" lang={lang} title={isId ? "Onboarding ditolak" : "Onboarding Rejected"}>
                    {isId ? "Catat alasan keputusan dan beri tahu klien. Proses berakhir tanpa kontrak layanan atau aktivasi sebagai klien SOAS." : "Record the decision reasons and inform the client. End the process without a service contract or activation as a SOAS client."}
                  </FlowNode>
                </Branch>
                <Branch label={isId ? "Disetujui" : "Approved"}>
                  {version === "1.1" && <>
                    <FlowNode id="onboarding-csp-handover" lang={lang} title={isId ? "Kumpulkan seluruh dokumen dari CSP sebelumnya" : "Get All Documents from Previous CSP"}>
                      {isId ? "Minta dan kumpulkan seluruh dokumen serta catatan perusahaan yang disimpan CSP sebelumnya, dalam bentuk digital maupun fisik." : "Request and collect all company documents and records held by the previous CSP, in digital or physical form."}
                    </FlowNode>
                    <FlowArrow />
                  </>}
                  <FlowNode lang={lang} title={version === "1.1" ? (isId ? "Kontrak Layanan" : "Service Contract") : (isId ? "Pilih layanan SOAS" : "Select SOAS Services")}>
                    {isId ? "Pilih paket atau item Corporate Secretarial / ART. Layanan di luar kontrak ditagih terpisah sebagai ad hoc." : "Select Corporate Secretarial / ART packages or individual items. Out-of-contract services are billed separately as ad hoc."}
                  </FlowNode>
                  <FlowArrow />
                  <FlowNode lang={lang} title={isId ? "Tanda tangan kontrak layanan" : "Sign Service Contract"}>
                    {isId ? "Siapkan kontrak sesuai layanan yang dipilih. Pantau kontrak yang belum ditandatangani dan kirim pengingat. Perubahan layanan membutuhkan kontrak baru." : "Prepare the contract for the selected services. Track unsigned contracts and send reminders. Service changes require a new contract."}
                  </FlowNode>
                  <FlowArrow label={isId ? "Kontrak sudah ditandatangani" : "Contract signed"} />
                  {version === "1.1" && <>
                    <FlowNode id="onboarding-csp-client-list" lang={lang} title={isId ? "Tambahkan perusahaan ke daftar klien CSP SOAS" : "Add Company to SOAS CSP Client List"}>
                      {isId ? "Untuk layanan filing, gunakan Maintain corporate service provider client list → Add client di Bizfile. Masukkan UEN perusahaan sebelum SOAS melakukan filing untuk klien." : "For filing services, use Maintain corporate service provider client list → Add client in Bizfile. Enter the company's UEN before SOAS files on the client's behalf."}
                    </FlowNode>
                    <FlowArrow />
                    <FlowNode id="onboarding-filing-endorsement" lang={lang} title={isId ? "Klien melakukan endorsement akses filing SOAS" : "Client Endorses SOAS Filing Access"}>
                      {isId ? "Minta klien melakukan endorsement permintaan di Bizfile. Pantau sampai akses filing SOAS aktif; jika masih tertunda, tindak lanjuti sebelum melakukan filing." : "Ask the client to endorse the request in Bizfile. Track it until SOAS filing access is active; follow up on pending endorsement before filing."}
                    </FlowNode>
                    <FlowArrow />
                    <FlowNode id="onboarding-acra-updates" lang={lang} title={isId ? "Perbarui appointment & data perusahaan di ACRA — jika berubah" : "Update Company Appointments & Particulars — If Applicable"}>
                      <p>{isId ? "Laporkan pengangkatan atau pemberhentian company secretary/pejabat perusahaan dan perubahan registered office jika ada. Untuk perusahaan lokal, laporkan dalam 14 hari sejak perubahan berlaku; simpan bukti filing dan data terbaru." : "File any appointment or cessation of the company secretary/officers and any registered office changes. For local companies, report these within 14 days of the effective change; retain filing confirmations and updated records."}</p>
                      <p>{isId ? "Jika tidak ada perubahan, lewati filing perubahan data. Penambahan ke daftar klien CSP tidak otomatis mengganti secretary atau alamat perusahaan." : "If nothing changes, skip the particulars-change filing. Adding a CSP client does not automatically change the company secretary or registered office."}</p>
                    </FlowNode>
                    <FlowArrow />
                  </>}
                  <FlowNode kind="end" lang={lang} title={isId ? "Resmi menjadi klien SOAS" : "Officially Onboarded as SOAS Client"} />
                </Branch>
              </Branches>
            </DocsReturnLoop>
          </Flow>
        </div>
        <p>{isId ? "Catatan: papan sumber belum merinci tindak lanjut hasil KYC/KYB yang gagal. Jalur koreksi dan penolakan final di atas merupakan usulan penanganan operasional; kriteria keputusan perlu ditetapkan oleh tim SOAS." : "Note: the source board does not detail failed KYC/KYB handling. The correction and final-rejection paths above are proposed operational handling; SOAS must define the decision criteria."}</p>
        {version === "1.1" && <p>
          {isId ? "Rujukan ACRA untuk tahap Bizfile setelah kontrak: " : "ACRA references for the post-contract Bizfile steps: "}
          <a href="https://www.acra.gov.sg/manage/corporate-service-providers/maintaining-client-lists-corporate-service-providers/" target="_blank" rel="noreferrer">{isId ? "daftar klien CSP & endorsement" : "CSP client list & endorsement"}</a>
          {" · "}
          <a href="https://www.acra.gov.sg/manage/companies/legal-requirements-common-offences/maintaining-local-companys-information-registers/updating-company-information-officers-shareholders/" target="_blank" rel="noreferrer">{isId ? "perubahan data & pejabat perusahaan" : "company particulars & officer changes"}</a>.
        </p>}
      </section>

      {version === "1.1" && <DocsWipFlow lang={lang} />}
      {version === "1.1" && <DocsManagementReport lang={lang} />}

      {/* ------------------------------------------------------------------ */}
      <section className="docs-section" id="client-database" aria-labelledby="h-client-database">
        <SectionHead
          icon={Database}
          title="Client Management Database"
          id="h-client-database"
        />
        <p>
          {isId
            ? "Sumber data utama setelah lead menjadi klien. Menyimpan jumlah klien aktif dan daftar klien beserta riwayat dokumennya."
            : "Central system of record post-onboarding. Maintains active client headcounts, comprehensive company directories, and document revision histories."}
        </p>

        <div className="docs-cards">
          <div className="docs-card">
            <h4>{isId ? "Daftar klien" : "Client Directory"}</h4>
            <ul>
              <li>{isId ? "Nama, UEN, Date of Incorporation" : "Company Name, UEN, Incorporation Date"}</li>
              <li>{isId ? "Alamat, FYE, Contact Person" : "Registered Address, FYE, Contact Persons"}</li>
              <li>{isId ? "Daftar lama (existing) & baru (incorporation + onboarding)" : "Legacy client roster & newly onboarded companies"}</li>
            </ul>
          </div>
          <div className="docs-card">
            <h4>Business Profile / Constitution</h4>
            <ul>
              <li>{isId ? "Bisa berubah; simpan tanggal perubahan" : "Subject to change; maintain revision dates"}</li>
              <li>{isId ? "Simpan semua dokumen (termasuk tanda tangan)" : "Retain all executed copies (including signatures)"}</li>
            </ul>
          </div>
          <div className="docs-card">
            <h4>Service Contract</h4>
            <ul>
              <li>{isId ? "Bisa berubah; simpan tanggal perubahan" : "Subject to scope adjustments; track revision dates"}</li>
              <li>{isId ? "Paket maupun item individual" : "Covers bundled packages or modular line items"}</li>
              <li>{isId ? "Simpan dokumen & tanda tangan" : "Archive executed agreements & signatures"}</li>
            </ul>
          </div>
        </div>

        <p>{isId ? "Biaya terminasi dan paket layanan di bawah mengikuti kontrak SOAS; bukan biaya wajib regulator. GST berlaku sesuai ketentuan IRAS." : "Termination charges and packages below follow SOAS contracts; they are not statutory regulator fees. GST applies under IRAS rules."}</p>
        <h3>
          {isId
            ? "Status klien & proses akhir layanan"
            : "Client Lifecycle Statuses & Offboarding Flows"}
        </h3>
        <div className="docs-canvas">
          <Flow label={isId ? "Status klien" : "Client lifecycle status"}>
            <FlowNode kind="store" lang={lang} title={version === "1.1" ? "Client Database" : (isId ? "Klien" : "Client Record")} />
            <FlowArrow />
            <FlowNode kind="decision" lang={lang} title={isId ? "Status?" : "Status?"} />
            <FlowArrow plain />
            <Branches>
              <Branch label="Active">
                <FlowNode
                  lang={lang}
                  title={isId ? "Layanan berjalan" : "Active Service"}
                >
                  <p>
                    {isId
                      ? "Corporate secretarial atau ART."
                      : "Corporate secretarial or ART engagements."}
                  </p>
                </FlowNode>
              </Branch>
              <Branch label={isId ? "Terminated oleh SOAS" : "Terminated by SOAS"}>
                <FlowNode
                  lang={lang}
                  title={isId ? "Terminasi oleh SOAS" : "Termination by SOAS"}
                >
                  <p>
                    {isId
                      ? "Template belum lengkap di papan."
                      : "Procedure template noted as incomplete on the board."}
                  </p>
                </FlowNode>
              </Branch>
              <Branch label={isId ? "Terminated oleh klien" : "Terminated by Client"}>
                <FlowNode
                  lang={lang}
                  title={isId ? "Klien membayar" : "Client Settlement"}
                >
                  <ul>
                    <li>{isId ? "Biaya terminasi SGD 100 + GST" : "SGD 100 termination fee + GST"}</li>
                    <li>{isId ? "Semua invoice terutang" : "All outstanding invoices"}</li>
                  </ul>
                </FlowNode>
                <FlowArrow />
                <FlowNode
                  lang={lang}
                  title={
                    isId
                      ? "Transfer file corporate secretarial"
                      : "Transfer Corporate Secretarial Files"
                  }
                >
                  <p>
                    {isId
                      ? "Pakai template ke CSP baru."
                      : "Official handover template to incoming CSP."}
                  </p>
                </FlowNode>
                <FlowArrow />
                <FlowNode
                  lang={lang}
                  title={
                    isId
                      ? "CSP baru lapor ke ACRA"
                      : "Incoming CSP Files with ACRA"
                  }
                >
                  <p>
                    {isId
                      ? "Untuk menghentikan company secretary lama."
                      : "To formally lodge cessation of predecessor company secretary."}
                  </p>
                </FlowNode>
              </Branch>
              <Branch label="Strike-off">
                <FlowNode lang={lang} title={isId ? "Pastikan tidak ada aset atau liabilitas" : "Ensure No Assets or Liabilities Remain"} />
                <FlowArrow />
                <FlowNode
                  lang={lang}
                  title={isId ? "Selesaikan kewajiban pajak IRAS" : "Settle IRAS Tax Obligations"}
                />
                <FlowArrow />
                <FlowNode
                  lang={lang}
                  title={isId ? "Tutup semua rekening bank" : "Close All Bank Accounts"}
                />
                <FlowArrow />
                <FlowNode
                  lang={lang}
                  title={isId ? "Ajukan strike-off ke ACRA" : "Lodge Strike-Off with ACRA"}
                >
                  <p>
                    {isId
                      ? "Penuhi kriteria ACRA dan pantau Gazette. Untuk aplikasi mulai 20 Oktober 2026, proses minimal 2 bulan setelah approval, bergantung objection; aplikasi lebih awal minimal 3 bulan. Status final mengikuti Final Gazette, bukan approval awal. Biaya jasa SOAS mengikuti kontrak; simpan riwayat setelah strike-off final."
                      : "Meet ACRA criteria and track Gazette notices. Applications from 20 October 2026 take at least 2 months after approval, subject to objections; earlier applications take at least 3 months. Final status follows the Final Gazette, not initial approval. SOAS fees follow the contract; retain history after final strike-off."}
                  </p>
                </FlowNode>
              </Branch>
            </Branches>
          </Flow>
        </div>

      </section>

      {/* ------------------------------------------------------------------ */}
      <section className="docs-section" id="annual-compliance" aria-labelledby="h-annual-compliance">
        <SectionHead
          icon={CalendarClock}
          title={isId ? "Kepatuhan tahunan (ART)" : "Annual Regulatory Compliance (ART)"}
          id="h-annual-compliance"
        />
        <p>
          {isId ? (
            <>
              Linimasa regulator untuk perusahaan non-listed menggunakan <strong>FYE</strong> (Financial Year End), dengan pengecualian sesuai kategori perusahaan. Notice bulanan, reminder mingguan dan billing mengikuti proses operasional SOAS.
            </>
          ) : (
            <>
              The regulatory timeline for non-listed companies uses <strong>FYE</strong> (Financial Year End), subject to company-category exemptions. Monthly notices, weekly reminders and billing follow SOAS operational processes.
            </>
          )}
        </p>

        <p><a href="#fye-alerts">{isId ? "Lihat alert otomatis berbasis FYE, reminder mingguan & handoff staf →" : "See FYE-based automatic alerts, weekly reminders & staff handoff →"}</a></p>

        <h3>{isId ? "Linimasa per tahun buku" : "Statutory Annual Timeline"}</h3>
        <div className="docs-canvas">
          <HFlow label={isId ? "Linimasa kepatuhan tahunan" : "Annual compliance timeline"}>
            <HStep
              time={isId ? "FYE − 1 bulan" : "FYE − 1 Month"}
              title={isId ? "Persiapan" : "Preparation"}
            >
              <ul>
                <li>{isId ? "Siapkan Annual Accounts & ECI" : "Prepare Annual Accounts & ECI"}</li>
                <li>{isId ? "Siapkan AGM" : "Initiate AGM preparations"}</li>
              </ul>
            </HStep>
            <HStep
              time="FYE"
              title={isId ? "Notice ke klien" : "Client Notice"}
            >
              <ul>
                <li>{isId ? "Minta dokumen transaksi tiap bulan" : "Request monthly transaction documents"}</li>
                <li>{isId ? "Reminder mingguan" : "Weekly automated cadence"}</li>
              </ul>
            </HStep>
            <HStep
              time={isId ? "FYE + 3 bulan" : "FYE + 3 Months"}
              title={isId ? "ECI ke IRAS" : "IRAS ECI Filing"}
              tone="deadline"
            >
              <p>{isId ? "Kecuali waiver: revenue ≤S$5 juta DAN ECI nihil, atau kategori khusus IRAS. ECI dikirim ke IRAS, bukan ACRA." : "Unless waived: revenue ≤S$5m AND nil ECI, or an IRAS-specific exclusion. ECI is filed with IRAS, not ACRA."}</p>
            </HStep>
            <HStep
              time={isId ? "FYE + 6 bulan" : "FYE + 6 Months"}
              title={isId ? "AGM" : "AGM Convening"}
              tone="deadline"
            >
              <p>
                {isId
                  ? "Jika wajib AGM: proxy, absensi, voting dan financial statements. Boleh diadakan lebih awal. Jika perlu tambahan waktu, ajukan EOT AGM 60 hari sebelum deadline terlewati. Private company dapat exempt atau dispense sesuai aturan ACRA."
                  : "Where an AGM is required: proxy, attendance, voting and financial statements. It may be held earlier. If more time is needed, request a 60-day AGM EOT before the deadline. Private companies may qualify for exemption or dispensation."}
              </p>
            </HStep>
            <HStep
              time={isId ? "FYE + 7 bulan" : "FYE + 7 Months"}
              title={isId ? "Annual Return ke ACRA" : "ACRA Annual Return (AR)"}
              tone="deadline"
            >
              <ul>
                <li>{isId ? "XBRL jika berlaku" : "XBRL financial statements if applicable"}</li>
                <li>{isId ? "Biaya filing SGD 60" : "SGD 60 statutory filing fee"}</li>
                <li>
                  {isId
                    ? "EOT AR 60 hari: ajukan sebelum deadline terlewati; S$200 dan perlu persetujuan. Overseas branch register dapat mengubah tenggat."
                    : "AR EOT: apply for 60 days before the deadline lapses; S$200 and approval required. An overseas branch register may change the deadline."}
                </li>
              </ul>
            </HStep>
            <HStep
              time={isId ? "30 November · YA terkait" : "30 November · Relevant YA"}
              title={isId ? "Form C-S / C-S (Lite) / C ke IRAS" : "IRAS Form C-S / C-S (Lite) / C"}
              tone="deadline"
            >
              <p>
                {isId
                  ? "Pilih formulir sesuai syarat IRAS. FY berakhir pada 2025 umumnya masuk YA 2026. Automa8e dan E-portal adalah alur kerja internal."
                  : "Select the form under IRAS eligibility rules. An FY ending in 2025 generally falls in YA 2026. Automa8e and E-Portal are internal workflows."}
              </p>
            </HStep>
          </HFlow>
        </div>

        <ReferenceLinks sources={["eci", "agm", "ar", "agmEot", "eot", "tax"]} />

        <h3>{isId ? "Pembukuan & billing" : "Bookkeeping Methodology & Billing"}</h3>
        <div className="docs-canvas">
          <Flow label={isId ? "Alur pembukuan dan billing" : "Bookkeeping and billing workflow"}>
            <FlowNode
              kind="decision"
              lang={lang}
              title={isId ? "Cara pembukuan?" : "Bookkeeping Method?"}
            />
            <FlowArrow plain />
            <Branches>
              <Branch label={isId ? "Manual" : "Manual"}>
                <FlowNode
                  lang={lang}
                  title={isId ? "Staf input transaksi" : "Manual Staff Entry"}
                >
                  <p>
                    {isId
                      ? "Coding data untuk diproses."
                      : "Ledger classification and coding for processing."}
                  </p>
                </FlowNode>
              </Branch>
              <Branch label={isId ? "Autonomous" : "Autonomous"}>
                <FlowNode
                  lang={lang}
                  title={isId ? "Otomatis (AI / sistem)" : "Automated (AI / System)"}
                >
                  <p>
                    {isId
                      ? "Klasifikasi entri & pembuatan akun oleh software Automa8e."
                      : "Entry classification & financial report generation by Automa8e."}
                  </p>
                </FlowNode>
              </Branch>
            </Branches>
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={
                isId
                  ? "Draft Annual Accounts, ECI, Financial Report, Tax Computation"
                  : "Draft Annual Accounts, ECI, Financial Report, Tax Computation"
              }
            />
            <FlowArrow />
            <FlowNode lang={lang} title={isId ? "Kirim draf & tagih bersamaan" : "Dispatch Drafts & Invoice Together"}>
              {isId ? "Billing ART berlaku saat draf dikirim, bukan setelah approval. Gunakan E-portal untuk review, komentar dan e-sign bila berlaku." : "ART billing is triggered when drafts are sent, rather than after approval. Use E-Portal for review, comments and e-sign where applicable."}
            </FlowNode>
            <FlowArrow />
            <FlowNode kind="external" lang={lang} title={isId ? "Klien review, komentar, e-sign" : "Client Review, Comments & E-Sign"} />
            <FlowArrow />
            <FlowNode lang={lang} title={isId ? "Finalisasi & submit ke instansi terkait" : "Finalize & File with the Relevant Agency"}>
              {isId ? "ECI / pajak final ke IRAS; AR dan XBRL bila berlaku ke ACRA. Catat tanggal, hasil dan bukti submission; tindak lanjuti revisi sebelum finalisasi." : "ECI / final tax to IRAS; AR and applicable XBRL to ACRA. Record filing dates, outcomes and evidence; resolve revisions before finalizing."}
            </FlowNode>
            <FlowArrow />
            <FlowNode kind="end" lang={lang} title={isId ? "Pantau collection" : "Track Collection"}>
              {isId ? "Pantau invoice lunas dan outstanding sampai pembayaran diterima." : "Track paid and outstanding invoices until payment is received."}
            </FlowNode>
          </Flow>
        </div>

        <h3>{isId ? "Perlakuan billing per jenis layanan" : "Billing Schedules by Service Line"}</h3>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>{isId ? "Layanan" : "Service Line"}</th>
                <th>{isId ? "Kapan ditagih" : "Invoicing Trigger"}</th>
                <th>{isId ? "Catatan" : "Terms & Notes"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Corporate Secretarial</td>
                <td>{isId ? "Setahun sekali, berulang" : "Annually recurring"}</td>
                <td>{isId ? "Tanpa perlu approval" : "Billed automatically without approval gate"}</td>
              </tr>
              <tr>
                <td>ART (Accounts, Report, Tax)</td>
                <td>{isId ? "Saat draf dikirim ke klien" : "Concurrently when drafts forwarded to client"}</td>
                <td>{isId ? "Paket atau item individual" : "Invoiced as full package or individual modular items"}</td>
              </tr>
              <tr>
                <td>Ad hoc</td>
                <td>{isId ? "Terpisah dari kontrak" : "Separately outside primary contract"}</td>
                <td>{isId ? "Semua layanan di luar kontrak" : "Billed per specific service engagement"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <DocsFyeAlerts lang={lang} />
      <DocsCommunicationFlow lang={lang} />

      <section className="docs-section" id="lead-reports" aria-labelledby="h-lead-reports">
        <SectionHead
          icon={FileSignature}
          title={isId ? "Laporan lead bulanan" : "Monthly Lead Pipeline Reporting"}
          id="h-lead-reports"
        />
        <p>
          {isId
            ? "Data dihasilkan per bulan. Lead yang masih berjalan membawa saldo dari bulan sebelumnya."
            : "Metrics compiled monthly. Work-in-progress enquiries carry forward opening balances from previous months."}
        </p>
        <div className="docs-canvas">
          <Flow label={isId ? "Laporan lead bulanan" : "Monthly lead reporting"}>
            <FlowNode kind="store" lang={lang} title="Leads" />
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={isId ? "Generate data bulanan" : "Generate Monthly Pipeline Data"}
            />
            <FlowArrow plain />
            <Branches>
              <Branch>
                <FlowNode lang={lang} title={isId ? "Total lead" : "Total Leads"} />
              </Branch>
              <Branch>
                <FlowNode lang={lang} title="Incorporated" />
              </Branch>
              <Branch>
                <FlowNode lang={lang} title="Onboarded" />
              </Branch>
              <Branch>
                <FlowNode lang={lang} title="Rejected" />
              </Branch>
              <Branch>
                <FlowNode
                  lang={lang}
                  title={isId ? "Work in progress" : "Work in Progress"}
                >
                  <p>
                    {isId
                      ? "Dibawa dari bulan sebelumnya."
                      : "Carried over from prior month balance."}
                  </p>
                </FlowNode>
              </Branch>
            </Branches>
          </Flow>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <DocsMonthlyFlow lang={lang} version={version} />

      <section className="docs-section" id="open-notes" aria-labelledby="h-open-notes">
        <SectionHead
          icon={HelpCircle}
          title={isId ? "Catatan terbuka" : "Open Notes & Ambiguities"}
          id="h-open-notes"
        />
        <p>
          {isId
            ? "Hal yang belum jelas atau belum lengkap di papan asli. Perlu konfirmasi sebelum diimplementasikan."
            : "Ambiguous or incomplete items on the original board. Requires confirmation prior to full implementation."}
        </p>

        <ul className="docs-open-list">
          <li>
            {isId ? (
              <>
                Terminasi oleh SOAS: kalimat <em>“template by …”</em> terpotong, prosedurnya belum ada.
              </>
            ) : (
              <>
                Termination by SOAS: the phrase <em>“template by …”</em> is truncated on the board; the procedure is not yet specified.
              </>
            )}
          </li>
          <li>
            {isId
              ? "Papan terbaru sudah menjelaskan reject ACRA: periksa, koreksi, minta persetujuan klien, lalu submit ulang. Kriteria keputusan KYC/KYB belum dirinci di papan; jalur koreksi dan penolakan final ditampilkan sebagai usulan operasional."
              : "The current board specifies ACRA rejection: review, correct, obtain client agreement, and resubmit. KYC/KYB decision criteria remain unspecified on the board; correction and final-rejection paths are shown as proposed operational handling."}
          </li>
          <li>
            {isId ? (
              <>
                Dokumen identitas tidak konsisten: Singaporean disebut minta FIN, sedangkan bagian dokumen menyebut NRIC
                untuk Singaporean/resident dan FIN. Dokumen ini memakai NRIC / FIN.
              </>
            ) : (
              <>
                Identity documentation discrepancy: Singaporeans are cited to provide FIN in one branch, whereas the document checklist specifies NRIC for Singaporeans/residents and FIN. This documentation adopts NRIC / FIN.
              </>
            )}
          </li>
          <li>
            {isId ? (
              <>
                Istilah <em>“IPPC”</em> mengacu pada <strong>Internal Policies, Procedures and Controls Policy</strong> (kebijakan pengendalian internal kepatuhan AML/CFT untuk CSP/SOAS). Frasa <em>“Who automate controller”</em> masih perlu konfirmasi lebih lanjut.
              </>
            ) : (
              <>
                The acronym <em>“IPPC”</em> refers to <strong>Internal Policies, Procedures and Controls Policy</strong> (internal AML/CFT compliance policy for CSPs/SOAS). The phrase <em>“Who automate controller”</em> remains open for confirmation.
              </>
            )}
          </li>
          <li>
            {isId ? (
              <>
                Papan terbaru menandai Client Management Database sebagai <em>“building by Francis, Brian and others”</em>; ini penanggung jawab, bukan bukti fitur sudah selesai.
              </>
            ) : (
              <>
                The current board labels Client Management Database <em>“building by Francis, Brian and others”</em>; this indicates ownership, not completion.
              </>
            )}
          </li>

        </ul>

        <p>
          <Network aria-hidden="true" size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
          {isId ? "Sumber:" : "Source:"}{" "}
          <a
            href="https://excalidraw.com/#json=8DicEGpCM5aGXcI92hugO,o_jx_Us29auWnZKrlvACGA"
            rel="noreferrer"
            target="_blank"
          >
            {isId ? "papan Excalidraw" : "Excalidraw board"}
          </a>
          .
        </p>
      </section>

      </article>
      </div>
    </div>
  );
}
