"use client";

import { useEffect, useState } from "react";
import { glossaryTargetId } from "@/lib/docs-search";
import { BookA, ExternalLink, Scale, Search } from "lucide-react";
import { glossaryEntries, referenceCheckedAt, referenceRules, referenceSources, type SourceKey } from "@/data/docs-reference";
import { Flow, FlowArrow, FlowNode, type DocsLang } from "@/components/docs-flow";

export function ReferenceLinks({ sources }: { sources: SourceKey[] }) {
  return <div className="docs-reference-links">{sources.map(key => <a key={key} href={referenceSources[key].url} target="_blank" rel="noreferrer">{referenceSources[key].title}<ExternalLink size={11} aria-hidden="true" /></a>)}</div>;
}

export function DocsGlossary({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  const [query, setQuery] = useState("");
  const [agency, setAgency] = useState("all");
  useEffect(() => {
    const reveal = (event: Event) => { setQuery((event as CustomEvent<string>).detail); setAgency("all"); };
    window.addEventListener("docs:reveal-glossary", reveal);
    return () => window.removeEventListener("docs:reveal-glossary", reveal);
  }, []);
  const normalized = query.trim().toLocaleLowerCase();
  const entries = glossaryEntries.filter(entry => (agency === "all" || entry.agency.includes(agency)) && `${entry.term} ${entry.full} ${entry.agency} ${entry.meaning[lang]} ${entry.rule[lang]}`.toLocaleLowerCase().includes(normalized));
  return (
    <section className="docs-section" id="glossary" aria-labelledby="h-glossary">
      <div className="docs-section-head"><BookA size={20} aria-hidden="true" /><h2 id="h-glossary">{isId ? "Kamus istilah" : "Glossary"}</h2></div>
      <p>{isId ? "Cari singkatan, pahami artinya, lalu lihat instansi dan aturan terkait. Label SOAS menunjukkan istilah atau kebijakan internal." : "Look up an abbreviation, understand its meaning, and find the responsible agency and related rules. SOAS labels identify internal terms or policies."}</p>
      <div className="docs-glossary-toolbar">
        <label className="docs-search"><Search size={16} aria-hidden="true" /><span className="sr-only">{isId ? "Cari istilah" : "Search glossary"}</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={isId ? "Cari ECI, FYE, annual return…" : "Search ECI, FYE, annual return…"} type="search" /></label>
        <label className="docs-agency-filter"><span>{isId ? "Instansi" : "Agency"}</span><select aria-label={isId ? "Instansi" : "Agency"} value={agency} onChange={e => setAgency(e.target.value)}><option value="all">{isId ? "Semua" : "All"}</option><option>ACRA</option><option>IRAS</option><option>SOAS</option></select></label>
      </div>
      <p className="docs-result-count" role="status">{entries.length} / {glossaryEntries.length} {isId ? "istilah" : "terms"}</p>
      <div className="docs-table-wrap"><table className="docs-table docs-glossary-table"><caption className="sr-only">{isId ? "Arti istilah, instansi dan aturan" : "Terms, agencies and rules"}</caption><thead><tr><th scope="col">{isId ? "Istilah" : "Term"}</th><th scope="col">{isId ? "Arti" : "Meaning"}</th><th scope="col">{isId ? "Instansi" : "Agency"}</th><th scope="col">{isId ? "Aturan & sumber" : "Rule & Source"}</th></tr></thead><tbody>{entries.map(entry => <tr key={entry.term} id={glossaryTargetId(entry.term)}><th scope="row"><strong>{entry.term}</strong><small>{entry.full}</small></th><td>{entry.meaning[lang]}</td><td><span className={`docs-agency docs-agency-${entry.agency === "SOAS" ? "internal" : entry.agency === "IRAS" ? "iras" : "acra"}`}>{entry.agency}</span></td><td>{entry.rule[lang]}<ReferenceLinks sources={entry.sources} /></td></tr>)}</tbody></table></div>
      {entries.length === 0 ? <div className="docs-glossary-empty"><p>{isId ? "Tidak ada istilah yang cocok." : "No matching terms."}</p><button type="button" onClick={() => { setQuery(""); setAgency("all"); }}>{isId ? "Tampilkan semua istilah" : "Show all terms"}</button></div> : null}
    </section>
  );
}

export function DocsRules({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  return (
    <section className="docs-section" id="official-rules" aria-labelledby="h-official-rules">
      <div className="docs-section-head"><Scale size={20} aria-hidden="true" /><h2 id="h-official-rules">{isId ? "Aturan baku ACRA & IRAS" : "ACRA & IRAS Rules"}</h2></div>
      <p>{isId ? "Rujukan untuk local companies Singapura. Tenggat bergantung kategori perusahaan, FYE dan exemption; lihat cakupan pada tiap aturan." : "Reference for Singapore local companies. Deadlines depend on company category, FYE and exemptions; check the scope of each rule."}</p>
      <p className="docs-verified">{isId ? "Sumber resmi diperiksa" : "Official sources checked"}: <time dateTime={referenceCheckedAt}>10 November 2026</time></p>
      <nav className="docs-rule-shortcuts" aria-label={isId ? "Langsung ke aturan" : "Rule shortcuts"}>
        <a href="#rule-fye">{isId ? "FYE: minimum & maksimum" : "FYE: Minimum & Maximum"}</a>
        <a href="#fye-deadlines">{isId ? "Batas AGM & AR" : "AGM & AR Deadlines"}</a>
        <a href="#rule-eot">{isId ? "Cara mengajukan extension" : "How to Apply for an Extension"}</a>
      </nav>
      <div className="docs-policy-note"><strong>{isId ? "Aturan regulator dan proses SOAS" : "Regulatory Rules and SOAS Processes"}</strong><p>{isId ? "ACRA mengatur registrasi dan pelaporan perusahaan; IRAS mengatur pajak. Paket ART, reminder mingguan, billing saat draf dikirim dan biaya terminasi S$100 adalah ketentuan operasional/kontrak SOAS dari Excalidraw. Ketentuan ini tidak menggantikan deadline regulator." : "ACRA governs company registration and reporting; IRAS governs tax. ART packages, weekly reminders, billing upon draft dispatch and the S$100 termination fee are SOAS operational/contract terms from Excalidraw. They do not replace regulatory deadlines."}</p><ReferenceLinks sources={["board"]} /></div>
      <div className="docs-rule-list">{referenceRules.map((rule, index) => <section className="docs-rule" id={`rule-${rule.id}`} key={rule.id} aria-labelledby={`h-rule-${rule.id}`}><div className="docs-rule-heading"><span className="docs-rule-number">{String(index + 1).padStart(2, "0")}</span><h3 id={`h-rule-${rule.id}`}>{rule.title[lang]}</h3><span className="docs-agency">{rule.agency}</span></div><p className="docs-rule-scope">{rule.scope[lang]}</p><ul>{rule.points.map((point, i) => <li key={i}>{point[lang]}</li>)}</ul><ReferenceLinks sources={rule.sources} />{rule.id === "fye" ? <FyeDeadlines lang={lang} /> : null}{rule.id === "eot" ? <ExtensionProcedure lang={lang} /> : null}</section>)}</div>
      <h3>{isId ? "Contoh: FYE 31 Desember 2025" : "Example: FYE 31 December 2025"}</h3>
      <p>{isId ? "Ilustrasi perusahaan non-listed tanpa overseas branch register, tanpa exemption dan tanpa EOT; FY normal 12 bulan. Filing menggunakan Bizfile (ACRA) dan myTax Portal (IRAS)." : "Illustration for a non-listed company without an overseas branch register, exemptions or EOT, with a normal 12-month FY. File through Bizfile (ACRA) and myTax Portal (IRAS)."}</p>
      <div className="docs-table-wrap"><table className="docs-table"><thead><tr><th>{isId ? "Kewajiban" : "Obligation"}</th><th>{isId ? "Instansi" : "Agency"}</th><th>{isId ? "Batas akhir" : "Deadline"}</th></tr></thead><tbody><tr><td>ECI</td><td>IRAS</td><td>{isId ? "31 Maret 2026" : "31 March 2026"}</td></tr><tr><td>AGM</td><td>ACRA</td><td>{isId ? "30 Juni 2026" : "30 June 2026"}</td></tr><tr><td>Annual Return</td><td>ACRA</td><td>{isId ? "31 Juli 2026" : "31 July 2026"}</td></tr><tr><td>Form C-S / C-S (Lite) / C · YA 2026</td><td>IRAS</td><td>30 November 2026</td></tr></tbody></table></div>
      <ReferenceLinks sources={["eci", "agm", "ar", "tax"]} />
    </section>
  );
}

function FyeDeadlines({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  return (
    <div id="fye-deadlines">
      <h4>{isId ? "AGM & AR dihitung dari FYE" : "Calculate AGM & AR Deadlines from FYE"}</h4>
      <p>{isId ? "Angka di bawah adalah batas paling lambat, bukan waktu tunggu wajib. Untuk FY berakhir pada/setelah 31 Agustus 2018; status AGM exempt/dispensed tetap mengikuti syarat ACRA." : "These are latest deadlines, not mandatory waiting periods. For FYs ending on/after 31 August 2018; AGM exemption/dispensation remains subject to ACRA conditions."}</p>
      <div className="docs-table-wrap"><table className="docs-table docs-deadline-table"><thead><tr><th scope="col">{isId ? "Kategori perusahaan" : "Company Category"}</th><th scope="col">{isId ? "AGM paling lambat" : "Latest AGM"}</th><th scope="col">{isId ? "AR paling lambat" : "Latest AR"}</th></tr></thead><tbody>
        <tr><th scope="row">Non-listed</th><td>FYE +6 {isId ? "bulan" : "months"}</td><td>FYE +7 {isId ? "bulan" : "months"}</td></tr>
        <tr><th scope="row">Listed</th><td>FYE +4 {isId ? "bulan" : "months"}</td><td>FYE +5 {isId ? "bulan" : "months"}</td></tr>
        <tr><th scope="row">{isId ? "Non-listed, share capital + overseas branch register" : "Non-listed, share capital + overseas branch register"}</th><td>FYE +6 {isId ? "bulan" : "months"}</td><td>FYE +8 {isId ? "bulan" : "months"}</td></tr>
        <tr><th scope="row">Listed, share capital + overseas branch register</th><td>FYE +4 {isId ? "bulan" : "months"}</td><td>FYE +6 {isId ? "bulan" : "months"}</td></tr>
      </tbody></table></div>
      <p>{isId ? "Contoh non-listed biasa, FYE 31 Desember 2025: AGM paling lambat 30 Juni 2026 dan AR 31 Juli 2026. Jika AGM diadakan 15 Mei 2026, batas AR tetap 31 Juli 2026. AR diajukan setelah AGM bila AGM wajib; exemption/dispensation bukan exemption AR." : "Example for an ordinary non-listed company, FYE 31 December 2025: AGM by 30 June 2026 and AR by 31 July 2026. If the AGM is on 15 May 2026, the AR deadline remains 31 July 2026. File AR after the AGM where an AGM is required; AGM exemption/dispensation is not an AR exemption."}</p>
      <ReferenceLinks sources={["agm", "ar"]} />
    </div>
  );
}

function ExtensionProcedure({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  return (
    <div className="docs-extension-procedure">
      <h4>{isId ? "Langkah pengajuan di Bizfile" : "Bizfile Application Steps"}</h4>
      <ol>
        <li>{isId ? "Direktur, company secretary, atau CSP yang ditunjuk login sebagai Business User melalui Corppass; pilih perusahaan/UEN yang benar." : "A director, company secretary or appointed CSP logs in as a Business User through Corppass; select the correct company/UEN."}</li>
        <li>{isId ? "Buka Manage → Apply for extension of time → Extension of Time for AGM (S175) / AR (S197). Pilih listed/non-listed dan tipe AGM, AR atau keduanya." : "Open Manage → Apply for extension of time → Extension of Time for AGM (S175) / AR (S197). Select listed/non-listed and AGM, AR or both."}</li>
        <li>{isId ? "Siapkan UEN, FYE, alasan keterlambatan dan PDF pendukung (misalnya surat direktur atau korespondensi auditor). Jika FYE perlu diperbaiki, lakukan sebelum permohonan EOT." : "Prepare the UEN, FYE, delay reasons and supporting PDFs, such as a director's letter or auditor correspondence. Correct the FYE before applying if needed."}</li>
        <li>{isId ? "Periksa kewajiban yang dipilih dan biaya, lalu submit dan bayar. Simpan acknowledgement dan receipt. ACRA mencantumkan waktu proses hingga 14 hari kerja; beberapa kasus lebih lama." : "Review selected obligations and fees, then submit and pay. Retain the acknowledgement and receipt. ACRA lists processing of up to 14 working days; some cases take longer."}</li>
        <li>{isId ? "Pantau Bizfile inbox untuk keputusan approval. Catat deadline AGM dan AR yang disetujui secara terpisah; receipt/acknowledgement saja belum membuktikan extension disetujui." : "Monitor the Bizfile inbox for approval. Record approved AGM and AR deadlines separately; a receipt/acknowledgement alone does not establish extension approval."}</li>
      </ol>
      <div className="docs-canvas"><Flow label={isId ? "Flow extension AGM dan AR" : "AGM and AR extension flow"}>
        <FlowNode kind="start" lang={lang} title={isId ? "Perlu tambahan waktu" : "More Time Required"} />
        <FlowArrow />
        <FlowNode lang={lang} title={isId ? "Ajukan sebelum deadline terkait" : "Apply Before the Relevant Deadline"}>{isId ? "Disarankan minimal 14 hari kerja sebelumnya." : "Preferably at least 14 working days ahead."}</FlowNode>
        <FlowArrow />
        <FlowNode lang={lang} title={isId ? "Pilih AGM / AR / keduanya, submit & bayar" : "Select AGM / AR / Both, Submit & Pay"} />
        <FlowArrow />
        <FlowNode lang={lang} title={isId ? "Tunggu keputusan ACRA" : "Await ACRA's Decision"}>{isId ? "Jika ditolak atau masih menunggu, deadline belum berubah." : "If rejected or still pending, the deadline has not changed."}</FlowNode>
        <FlowArrow label={isId ? "Hanya setelah approval" : "Only after approval"} />
        <FlowNode kind="end" lang={lang} title={isId ? "Gunakan deadline baru yang disetujui" : "Use the Approved New Deadline"} />
      </Flow></div>
      <h4>{isId ? "Contoh extension 60 hari" : "60-Day Extension Example"}</h4>
      <p>{isId ? "Ilustrasi penjumlahan 60 hari, bukan jaminan approval: AGM 30 Juni 2026 → 29 Agustus 2026; AR 31 Juli 2026 → 29 September 2026, jika masing-masing disetujui penuh 60 hari. Gunakan tanggal pada persetujuan ACRA; jangan mengganti dengan +2 bulan kalender." : "Illustrative 60-day arithmetic, not guaranteed approval: AGM 30 June 2026 → 29 August 2026; AR 31 July 2026 → 29 September 2026, if each receives a full 60-day approval. Use ACRA's approved dates, rather than adding 2 calendar months."}</p>
      <p>{isId ? "Jika masih butuh waktu, ajukan further EOT sebelum deadline berjalan dengan alasan pendukung yang kuat; ACRA tidak menjamin persetujuan lanjutan. Jika deadline sudah lewat, online EOT tidak tersedia: hubungi ACRA melalui panduan resmi dan tindak lanjuti kewajiban yang terlambat." : "If more time is needed, apply for a further EOT before the current deadline with strong supporting reasons; further approval is not guaranteed. If overdue, online EOT is unavailable: contact ACRA through its official guide and address the overdue obligations."}</p>
    </div>
  );
}
