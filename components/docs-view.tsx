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
import { DocsV11Overview, DocsV11LeadFlow, DocsV11Incorporation, DocsV11Screening, DocsV11Onboarding, DocsV11Contracts, DocsV11LeadReport, DocsV11RecordModel, DocsV11OpenNotes } from "@/components/docs-v11-flows";
import DocsMonthlyFlow from "@/components/docs-monthly-flow";
import DocsFyeAlerts from "@/components/docs-fye-alerts";
import DocsCommunicationFlow from "@/components/docs-communication-flow";
import DocsGlobalSearch from "@/components/docs-global-search";
import DocsReturnLoop from "@/components/docs-return-loop";
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
    if (version === "1.0") return navSections[lang];
    return navSections[lang].flatMap(section => {
      if (section.id === "incorporation") return [section, { id: "identity-screening", label: isId ? "Identitas & screening" : "Identity & Screening" }];
      if (section.id === "onboarding") return [section, { id: "service-contracts", label: isId ? "Layanan & kontrak" : "Services & Contracts" }];
      return [section];
    });
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
      <div className="docs-page">
      <aside className="docs-sidebar">
        <nav className="docs-toc" aria-label={isId ? "Daftar isi" : "Table of contents"}>
          <p className="docs-toc-label">{isId ? "DAFTAR ISI" : "ON THIS PAGE"}</p>
          {sections.map((section, index) => <a key={section.id} href={`#${section.id}`} onClick={() => setActiveSection(section.id)} aria-current={activeSection === section.id ? "location" : undefined}><span className="docs-toc-number">{String(index + 1).padStart(2, "0")}</span>{section.label}</a>)}
        </nav>
        <div className="docs-sidebar-footer"><span>ACRA · IRAS · SOAS</span><small>{isId ? "Rujukan diperiksa 10 Nov 2026" : "Sources checked 10 Nov 2026"}</small></div>
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
      {version === "1.0" ? (
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
                ? "Masuk dari website, email, dan referral. Jenis layanan: incorporation / onboarding; progres: in progress, rejected, atau selesai."
                : "Inbound via website, email, and referrals. Service types: incorporation / onboarding; progress: in progress, rejected, or completed."}
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
      ) : <DocsV11Overview lang={lang} />}

      {/* ------------------------------------------------------------------ */}
      <DocsGlossary lang={lang} />
      <DocsRules lang={lang} />

      {version === "1.0" ? (
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
            <Branches>
              <Branch>
                <FlowNode kind="external" lang={lang} title="Website" />
              </Branch>
              <Branch>
                <FlowNode kind="external" lang={lang} title="Email" />
              </Branch>
              <Branch>
                <FlowNode kind="external" lang={lang} title="Referral" />
              </Branch>
            </Branches>
            <FlowArrow />
            <FlowNode kind="store" lang={lang} title="Leads">
              <p>{isId ? "Simpan detail lead & statusnya." : "Store lead details & pipeline status."}</p>
            </FlowNode>
            <FlowArrow />
            <FlowNode kind="decision" lang={lang} title={isId ? "Jenis layanan & progres lead" : "Service Type & Lead Progress"} />
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

          </Flow>
        </div>
      </section>
      ) : <DocsV11LeadFlow lang={lang} />}

      {/* ------------------------------------------------------------------ */}
      {version === "1.0" ? (
      <section className="docs-section" id="incorporation" aria-labelledby="h-incorporation">
        <SectionHead
          icon={Building2}
          title={isId ? "Incorporation (perusahaan baru)" : "Incorporation (New Company Formation)"}
          id="h-incorporation"
        />
        <p>
          {isId
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
                isId
                  ? "Kumpulkan data formulir incorporation ACRA"
                  : "Collect ACRA Incorporation Form Data"
              }
            >
              <ul>
                <li>
                  {isId
                    ? "Jumlah shareholder & director (menentukan jumlah KYC)"
                    : "Shareholder & director headcounts (determines KYC volume)"}
                </li>
              </ul>
            </FlowNode>
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
                  {isId
                    ? "Biaya jasa + ACRA fee + GST"
                    : "Professional service fee + ACRA fee + GST"}
                </li>
                <li>
                  {isId
                    ? "Klien wajib bayar sebelum incorporation dimulai"
                    : "Client must settle payment before filing begins"}
                </li>
              </ul>
            </FlowNode>
            <FlowArrow />
            <FlowNode
              kind="decision"
              lang={lang}
              title={isId ? "Tipe shareholder?" : "Shareholder Type?"}
            />
            <FlowArrow plain />
            <Branches>
              <Branch label={isId ? "Individual" : "Individual"}>
                <Branches>
                  <Branch label={isId ? "Singaporean / resident" : "Singaporean / Resident"}>
                    <FlowNode
                      lang={lang}
                      title={isId ? "Minta NRIC / FIN" : "Request NRIC / FIN"}
                    />
                  </Branch>
                  <Branch label={isId ? "Foreigner" : "Foreigner"}>
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
              <Branch label={isId ? "Corporate" : "Corporate"}>
                <Branches>
                  <Branch label={isId ? "Perusahaan Singapura" : "Singapore Entity"}>
                    <FlowNode
                      lang={lang}
                      title={
                        isId
                          ? "Ambil dari Business Profile"
                          : "Extract from Business Profile"
                      }
                    />
                  </Branch>
                  <Branch label={isId ? "Perusahaan asing" : "Foreign Entity"}>
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
                  {isId
                    ? "Berlaku juga untuk individu di balik corporate shareholder"
                    : "Applies also to individuals behind corporate shareholders"}
                </li>
                <li>
                  {isId
                    ? "Proses dokumen: Passport, NRIC, FIN"
                    : "Process documents: Passport, NRIC, FIN"}
                </li>
                <li>
                  {isId
                    ? "IPPC (istilah sesuai papan)"
                    : "IPPC (undefined term on the board)"}
                </li>
              </ul>
            </FlowNode>
            <FlowArrow />
            <DocsReturnLoop
              fromId="acra-revision-consent"
              toId="incorporation-submit"
              label={isId ? "Setelah klien menyetujui perbaikan, kembali ke tahap pengajuan ACRA. Ulangi jika ditolak lagi; lanjutkan hanya setelah ACRA menyetujui." : "After the client approves the corrections, return to ACRA submission. Repeat if rejected again; proceed only after ACRA approval."}
            >
            <FlowNode
              id="incorporation-submit"
              lang={lang}
              title={
                isId
                  ? "Ajukan aplikasi ke ACRA melalui corpora8e"
                  : "Submit Application to ACRA through corpora8e"
              }
            >
              {isId ? "Jika pengajuan online tidak tersedia, siapkan data dan serahkan ke SOAS untuk pengajuan manual. Tetap pantau hasil pengajuan." : "If online submission is unavailable, prepare the data and hand it to SOAS for manual filing. Continue tracking the filing outcome."}
            </FlowNode>
            <FlowArrow />
            <FlowNode
              kind="decision"
              lang={lang}
              title={isId ? "Aplikasi disetujui ACRA?" : "Application Approved by ACRA?"}
            />
            <FlowArrow plain />
            <Branches>
              <Branch label={isId ? "Ditolak" : "Rejected"}>
                <FlowNode lang={lang} title={isId ? "Tinjau alasan penolakan & perbaiki aplikasi" : "Review Rejection Reasons & Correct Application"}>
                  {isId ? "Misalnya nama sudah dipakai perusahaan lain." : "For example, the proposed company name is already in use."}
                </FlowNode>
                <FlowArrow />
                <FlowNode id="acra-revision-consent" lang={lang} title={isId ? "Minta persetujuan klien atas perbaikan" : "Obtain Client Approval of the Corrections"}>
                  <p>{isId ? "Setelah klien menyetujui perbaikan, kembali ke tahap pengajuan aplikasi dan tunggu keputusan ACRA. Jika ditolak lagi, ulangi perbaikan, persetujuan klien, dan pengajuan hingga disetujui ACRA." : "Once the client approves the corrections, return to application submission and await ACRA’s decision. If rejected again, repeat the correction, client approval, and submission steps until ACRA approves the application."}</p>
                  <a href="#incorporation-submit">{isId ? "Kembali ke pengajuan ACRA ↑" : "Return to ACRA Submission ↑"}</a>
                </FlowNode>
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
                  ? "Notifikasi ke shareholder"
                  : "Shareholder Notification"
              }
            >
              <ul>
                <li>First Director meeting</li>
                <li>
                  {isId
                    ? "Kirim Business Profile & Constitution"
                    : "Transmit Business Profile & Constitution"}
                </li>
              </ul>
            </FlowNode>
            <FlowArrow />
            <FlowNode
              lang={lang}
              title={
                isId
                  ? "Klien mengisi form layanan SOAS"
                  : "Client Selects SOAS Service Package"
              }
            >
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
      ) : <DocsV11Incorporation lang={lang} />}
      {version === "1.1" && <DocsV11Screening lang={lang} />}

      {/* ------------------------------------------------------------------ */}
      {version === "1.0" ? (
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
            <FlowNode lang={lang} title={isId ? "Ambil Business Profile perusahaan" : "Retrieve Company Business Profile"} />
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
                  <FlowNode lang={lang} title={isId ? "Pilih layanan SOAS" : "Select SOAS Services"}>
                    {isId ? "Pilih paket atau item Corporate Secretarial / ART. Layanan di luar kontrak ditagih terpisah sebagai ad hoc." : "Select Corporate Secretarial / ART packages or individual items. Out-of-contract services are billed separately as ad hoc."}
                  </FlowNode>
                  <FlowArrow />
                  <FlowNode lang={lang} title={isId ? "Tanda tangan kontrak layanan" : "Sign Service Contract"}>
                    {isId ? "Siapkan kontrak sesuai layanan yang dipilih. Pantau kontrak yang belum ditandatangani dan kirim pengingat. Perubahan layanan membutuhkan kontrak baru." : "Prepare the contract for the selected services. Track unsigned contracts and send reminders. Service changes require a new contract."}
                  </FlowNode>
                  <FlowArrow label={isId ? "Kontrak sudah ditandatangani" : "Contract signed"} />
                  <FlowNode kind="end" lang={lang} title={isId ? "Resmi menjadi klien SOAS" : "Officially Onboarded as SOAS Client"} />
                </Branch>
              </Branches>
            </DocsReturnLoop>
          </Flow>
        </div>
        <p>{isId ? "Catatan: papan sumber belum merinci tindak lanjut hasil KYC/KYB yang gagal. Jalur koreksi dan penolakan final di atas merupakan usulan penanganan operasional; kriteria keputusan perlu ditetapkan oleh tim SOAS." : "Note: the source board does not detail failed KYC/KYB handling. The correction and final-rejection paths above are proposed operational handling; SOAS must define the decision criteria."}</p>
      </section>
      ) : <DocsV11Onboarding lang={lang} />}
      {version === "1.1" && <DocsV11Contracts lang={lang} />}

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
            <FlowNode kind="store" lang={lang} title={isId ? "Klien" : "Client Record"} />
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
      {version === "1.1" && <DocsV11RecordModel lang={lang} />}
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

      {version === "1.0" ? (
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
      ) : <DocsV11LeadReport lang={lang} />}

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

        {version === "1.1" && <DocsV11OpenNotes lang={lang} />}
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
                Istilah <em>“IPPC”</em> dan <em>“Who automate controller”</em> tidak dijelaskan.
              </>
            ) : (
              <>
                The acronym <em>“IPPC”</em> and the phrase <em>“Who automate controller”</em> are left undefined on the canvas.
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
