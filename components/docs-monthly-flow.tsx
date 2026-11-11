import { CalendarClock } from "lucide-react";
import { Branch, Branches, Flow, FlowArrow, FlowNode, type DocsLang } from "@/components/docs-flow";

export default function DocsMonthlyFlow({ lang, version = "1.0" }: { lang: DocsLang; version?: "1.0" | "1.1" | "1.2" }) {
  const isId = lang === "id";
  const reports = [
    ["A", "Pengumpulan dokumen", "Document Collection", "Daftar klien yang harus dinotifikasi, jumlah sudah dinotifikasi, dokumen lengkap dan outstanding. Notice segera setelah FYE, permintaan dokumen bulanan dan reminder mingguan melalui Comm Hub sampai staf mengambil alih lewat telepon; catat hasil follow-up di percakapan terkait. Pantau kesiapan akun dan ECI dalam 3 bulan setelah FYE jika wajib filing; cek waiver ECI.", "List clients requiring notice, notified counts, complete and outstanding documents. Send notice immediately after FYE, request documents monthly, and remind weekly through Comm Hub until staff take over by phone; record follow-up outcomes in the related conversation. Track accounts and ECI readiness within 3 months after FYE where filing is required; check ECI waivers."],
    ["B", "Progres pekerjaan", "Work Progress", "Cek kelengkapan, digitalisasi dan upload ke Documa8e. Jalur manual: assign staf, catat progres serta tanggal selesai. Jalur autonomous: ekstraksi, pembukuan dan pemrosesan Automa8e untuk akun, schedule dan ECI. Keduanya mengirim draf untuk review, komentar, approval dan e-sign bila berlaku, dengan billing saat pengiriman. Pantau submission selesai atau belum beserta instansi yang benar.", "Check completeness, digitize and upload to Documa8e. Manual route: assign staff and track progress and completion dates. Autonomous route: Automa8e extraction, bookkeeping and processing for accounts, schedules and ECI. Both send drafts for review, comments, approval and e-sign where applicable, invoicing on dispatch. Track filing completion and the appropriate agency."],
    ["C", "AGM, Annual Return & XBRL", "AGM, Annual Return & XBRL", "Daftar perusahaan yang perlu AGM, notifikasi shareholder dan prosedur proxy, absensi, voting serta Director Report. Siapkan AR dan tentukan XBRL full / simplified / exempt. Kirim dokumen AGM, AR dan XBRL yang berlaku sekaligus untuk approval dan e-sign, lalu catat submission ACRA. Untuk non-listed, AR umumnya ≤7 bulan setelah FYE. EOT AR 60 hari memerlukan permohonan sebelum deadline, biaya S$200 dan persetujuan ACRA.", "List companies requiring an AGM, notify shareholders, and prepare proxy, attendance, voting and Director Report procedures. Prepare AR and determine full / simplified / exempt XBRL. Send applicable AGM, AR and XBRL documents together for approval and e-sign, then record ACRA submission. For non-listed companies, AR is generally due within 7 months after FYE. A 60-day AR EOT requires an application before the deadline, a S$200 fee and ACRA approval."],
    ["D", "Pajak final Form C-S / C-S (Lite) / C", "Final Tax Form C-S / C-S (Lite) / C", "Siapkan melalui Automa8e dan E-portal untuk review/approval internal, lalu file Form C-S / C-S (Lite) / C ke IRAS paling lambat 30 November pada YA terkait. Catat hasil submission.", "Prepare through Automa8e and E-Portal for internal review/approval, then file Form C-S / C-S (Lite) / C with IRAS by 30 November of the relevant YA. Record the filing outcome."],
    ["E", "Billing deliverables", "Deliverable Billing", "Laporan A–D ditagih bila layanan terkait berlaku, sebagai paket tahunan atau item individual. ART ditagih ketika draf dikirim. Corporate Secretarial ditagih tahunan dan berulang tanpa approval; layanan di luar kontrak adalah ad hoc dan ditagih terpisah.", "Bill A–D deliverables where the service applies, as annual packages or individual items. ART is invoiced when drafts are dispatched. Corporate Secretarial is billed annually and recurrently without approval; out-of-contract work is ad hoc and billed separately."],
    ["F", "Billing & collection", "Billing & Collection", "Pantau invoice yang sudah diterbitkan, lunas dan belum tertagih hingga pembayaran diterima. Bedakan invoice terbit dari dana yang sudah diterima.", "Track issued, paid and outstanding invoices until payment is received. Distinguish invoice issuance from funds collected."],
  ];
  return (
    <section className="docs-section" id="monthly-reports" aria-labelledby="h-monthly-reports">
      <div className="docs-section-head">
        <CalendarClock aria-hidden="true" size={20} />
        <h2 id="h-monthly-reports">{isId ? "Laporan bulanan A–F & kontrol layanan" : "Monthly Reports A–F & Service Controls"}</h2>
      </div>
      <p>{isId ? "Laporan operasional klien ini berbeda dari laporan pipeline lead. Alur ini menjelaskan proses operasional yang diminta papan terbaru." : "These client operational reports are separate from lead pipeline reporting. They describe the operational processes requested by the current board."}</p>
      <div className="docs-cards docs-report-cards">
        {reports.map(([key, idTitle, enTitle, idBody, enBody]) => (
          <div className="docs-card" key={key}>
            <h3>{key}. {isId ? idTitle : enTitle}</h3>
            <p>{key === "E" && version === "1.1" ? (isId ? "Tautkan invoice ke kontrak, item layanan dan periode monthly/quarterly/annual yang disepakati. Trigger pengiriman draf/deliverable dan syarat pembayaran mengikuti kontrak. Corporate Secretarial tetap ditagih tahunan secara berulang; ad hoc ditagih terpisah. Pantau hasil collection, bukan hanya invoice dibuat." : "Link invoices to the contract, service item and agreed monthly/quarterly/annual period. Draft/deliverable dispatch triggers and payment terms follow the contract. Corporate Secretarial remains annually recurring; ad hoc is invoiced separately. Track collection outcomes, not just invoice creation.") : (isId ? idBody : enBody)}</p>
          </div>
        ))}
      </div>
      {version === "1.1" && <p><a href="#service-contracts">{isId ? "Matriks kontrak: pekerjaan bulanan/kuartalan, GST yang berlaku dan output tahunan →" : "Contract matrix: monthly/quarterly work, applicable GST and annual outputs →"}</a></p>}
      <h3>{isId ? "Kontrol pembayaran & perubahan kontrak" : "Payment & Contract Change Controls"}</h3>
      <div className="docs-canvas">
        <Flow label={isId ? "Kontrol layanan dan pembayaran" : "Service and payment controls"}>
          <FlowNode kind="start" lang={lang} title={isId ? "Klien memilih atau mengubah layanan" : "Client Selects or Changes Services"} />
          <FlowArrow />
          <FlowNode kind="decision" lang={lang} title={isId ? "Layanan termasuk kontrak?" : "Service Covered by Contract?"} />
          <FlowArrow plain />
          <Branches>
            <Branch label={isId ? "Paket / item kontrak" : "Contract Package / Item"}>
              <FlowNode lang={lang} title={isId ? "Simpan pilihan & kontrak bertanda tangan" : "Store Selection & Signed Contract"}>
                {isId ? "Perubahan layanan membutuhkan kontrak baru; simpan versi, tanggal perubahan dan tanda tangan. Pantau dan ingatkan kontrak yang belum ditandatangani." : "Service changes require a new contract; retain versions, change dates and signatures. Track and remind unsigned contracts."}
              </FlowNode>
            </Branch>
            <Branch label={isId ? "Di luar kontrak" : "Outside Contract"}>
              <FlowNode lang={lang} title={isId ? "Pesanan ad hoc & billing terpisah" : "Ad Hoc Order & Separate Billing"}>
                {isId ? "Contoh: beli Business Profile, ubah company particulars dan filing ACRA untuk memperbarui Business Profile." : "Examples: purchase a Business Profile, change company particulars and file with ACRA to update the Business Profile."}
              </FlowNode>
            </Branch>
          </Branches>
          <FlowArrow />
          <FlowNode lang={lang} title={isId ? "E-Invoicing & konfirmasi pembayaran" : "E-Invoicing & Payment Confirmation"}>
            {version === "1.2" ? (isId ? "Incorporation: biaya jasa + biaya ACRA + biaya KYC/KYB wajib dilunasi sebelum filing ke ACRA. ART: terbitkan invoice bersama draf, kemudian pantau pembayaran sebelum melanjutkan layanan terkait." : "Incorporation: service fee + ACRA fee + KYC/KYB fee must be settled before filing with ACRA. ART: issue the invoice with drafts, then track payment before proceeding with the related service.") : (isId ? "Papan meminta pembayaran jasa sebelum pekerjaan dilanjutkan. Incorporation: jasa + ACRA fee + GST dibayar di muka. ART: terbitkan invoice bersama draf, kemudian pantau pembayaran sebelum melanjutkan layanan terkait." : "The board requires service payment before proceeding. Incorporation: collect service fee + ACRA fee + GST upfront. ART: issue the invoice with drafts, then track payment before proceeding with the related service.")}
          </FlowNode>
        </Flow>
      </div>
      <p>{isId ? "FYE dipilih perusahaan; FY pertama tidak boleh melebihi 18 bulan tanpa persetujuan Registrar. Catatan papan tentang FY pertama kurang dari 12 bulan adalah preferensi, bukan kewajiban umum. Lihat Aturan ACRA & IRAS untuk detail." : "The company chooses its FYE; the first FY cannot exceed 18 months without Registrar approval. The board’s first-FY-below-12-months note is a preference, not a general obligation. See ACRA & IRAS Rules for details."}</p>
    </section>
  );
}
