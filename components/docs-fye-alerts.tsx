import { BellRing } from "lucide-react";
import { Branch, Branches, Flow, FlowArrow, FlowNode, type DocsLang } from "@/components/docs-flow";
import DocsReturnLoop from "@/components/docs-return-loop";
import { ReferenceLinks } from "@/components/docs-reference";

type AlertRow = { trigger: [string, string]; recipient: [string, string]; action: [string, string] };
const alertRows: AlertRow[] = [
  { trigger: ["FYE −1 bulan", "FYE −1 month"], recipient: ["Staf SOAS", "SOAS staff"], action: ["Mulai persiapan Annual Accounts, ECI dan AGM yang berlaku. Persiapan satu bulan sebelum FYE berasal dari papan SOAS; bukan tanggal wajib regulator.", "Begin preparation for applicable Annual Accounts, ECI and AGM work. Preparation one month before FYE is from the SOAS board; it is not a statutory deadline."] },
  { trigger: ["Segera setelah FYE", "Immediately after FYE"], recipient: ["Klien", "Client"], action: ["Kirim notice awal melalui Comm Hub: kewajiban yang perlu dilakukan klien dan dokumen transaksi yang harus diserahkan untuk pembukuan serta akun/ECI.", "Send the initial notice through Comm Hub describing the client's compliance actions and transaction documents required for bookkeeping and accounts/ECI."] },
  { trigger: ["Setiap bulan, berdasarkan FYE klien", "Every month, based on the client's FYE"], recipient: ["Klien & staf SOAS", "Client & SOAS staff"], action: ["Sistem membuat notice pengumpulan dokumen melalui Comm Hub dan laporan bulanan. Tampilkan klien yang perlu dinotifikasi, sudah dinotifikasi, dokumen lengkap dan masih outstanding.", "Generate document-collection notices through Comm Hub and the monthly report. Show clients requiring notice, already notified, with complete documents and still outstanding."] },
  { trigger: ["Setiap minggu selama dokumen outstanding", "Every week while documents are outstanding"], recipient: ["Klien; ditindaklanjuti staf bila diambil alih", "Client; staff follow up after takeover"], action: ["Ulangi reminder mingguan melalui Comm Hub sampai staf mengambil alih untuk menelepon. Handoff menghentikan reminder otomatis terkait, tetapi pekerjaan tetap outstanding sampai dokumen lengkap.", "Repeat weekly reminders through Comm Hub until staff take over by phone. Handoff stops the related automatic reminders, but the work stays outstanding until documents are complete."] },
  { trigger: ["Draf siap untuk klien", "Drafts ready for the client"], recipient: ["Klien melalui E-portal", "Client through E-Portal"], action: ["Kirim draf untuk review, komentar, approval dan e-sign bila berlaku; kirim dokumen AGM/AR/XBRL yang berlaku sekaligus. Billing ART mengikuti pengiriman draf.", "Send drafts for review, comments, approval and e-sign where applicable; bundle applicable AGM/AR/XBRL documents. ART invoicing follows draft dispatch."] },
];

export default function DocsFyeAlerts({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  const index = isId ? 0 : 1;
  return (
    <section className="docs-section" id="fye-alerts" aria-labelledby="h-fye-alerts">
      <div className="docs-section-head"><BellRing size={20} aria-hidden="true" /><h2 id="h-fye-alerts">{isId ? "Alert kepatuhan berdasarkan FYE" : "FYE-Based Compliance Alerts"}</h2></div>
      <p>{isId ? "Rancangan alert otomatis pada papan Excalidraw: FYE setiap klien menjadi dasar persiapan, notice, permintaan dokumen, dan tracking kepatuhan. Notice bulanan dan reminder mingguan adalah proses SOAS; deadline filing tetap mengikuti aturan ACRA/IRAS." : "The Excalidraw board's automatic-alert design uses each client's FYE to drive preparation, notices, document requests and compliance tracking. Monthly notices and weekly reminders are SOAS processes; filing deadlines still follow ACRA/IRAS rules."}</p>
      <div className="docs-policy-note"><strong>{isId ? "Input: klien + FYE + tahun buku + kewajiban yang berlaku" : "Inputs: Client + FYE + Financial Year + Applicable Obligations"}</strong><p>{isId ? "Tentukan ECI/waiver, status AGM, AR/XBRL dan YA pajak final. Jika EOT disetujui, gunakan deadline baru untuk kewajiban yang disetujui saja. Reminder mingguan otomatis untuk permintaan terkait berhenti saat staf mengambil alih; monitoring bulanan dan deadline tetap berjalan." : "Determine ECI/waiver, AGM status, AR/XBRL and the final-tax YA. If an EOT is approved, use the revised deadline only for the approved obligation. Weekly reminders stop on staff takeover; monthly monitoring and deadline tracking continue."}</p><a href="#official-rules">{isId ? "Lihat aturan FYE, deadline dan extension →" : "See FYE, deadline and extension rules →"}</a></div>
      <p><a href="#communication">{isId ? "Alur komunikasi: Comm Hub untuk notice/reminder, E-portal untuk review & e-sign →" : "Communication flow: Comm Hub for notices/reminders, E-Portal for review & e-sign →"}</a></p>
      <h3>{isId ? "Pemicu, penerima & tindakan" : "Triggers, Recipients & Actions"}</h3>
      <div className="docs-table-wrap"><table className="docs-table docs-deadline-table"><thead><tr><th scope="col">{isId ? "Pemicu" : "Trigger"}</th><th scope="col">{isId ? "Penerima" : "Recipient"}</th><th scope="col">{isId ? "Tindakan" : "Action"}</th></tr></thead><tbody>{alertRows.map(row => <tr key={row.trigger[1]}><th scope="row">{row.trigger[index]}</th><td>{row.recipient[index]}</td><td>{row.action[index]}</td></tr>)}</tbody></table></div>
      <h3>{isId ? "Isi alert per kewajiban" : "Alert Content by Obligation"}</h3>
      <p>{isId ? "Notice memberi tahu klien apa yang harus dikerjakan, bukan hanya menampilkan tanggal. Untuk non-listed biasa, dasar jadwal di bawah mengikuti aturan resmi; frekuensi notice dan reminder tetap mengikuti tabel di atas." : "Notices tell clients what to do, rather than merely displaying dates. For an ordinary non-listed company, the schedule below follows official rules; notice and reminder frequency follows the table above."}</p>
      <div className="docs-table-wrap"><table className="docs-table docs-deadline-table"><thead><tr><th scope="col">{isId ? "Kewajiban" : "Obligation"}</th><th scope="col">{isId ? "Dasar jadwal" : "Schedule Basis"}</th><th scope="col">{isId ? "Tugas yang disampaikan & dipantau" : "Actions Communicated & Tracked"}</th></tr></thead><tbody>
        <tr><th scope="row">Annual Accounts & ECI</th><td>{isId ? "Persiapan FYE −1 bulan; ECI ≤3 bulan setelah FYE jika wajib filing." : "Prepare at FYE −1 month; ECI within 3 months after FYE where filing is required."}</td><td>{isId ? "Serahkan dokumen transaksi; lengkapi dokumen outstanding; review draf akun dan perhitungan ECI; approval/e-sign bila berlaku. Staf memantau kesiapan dan filing IRAS atau waiver ECI yang berlaku." : "Provide transaction documents; resolve outstanding documents; review draft accounts and ECI computation; approve/e-sign where applicable. Staff track readiness and IRAS filing or the applicable ECI waiver."}</td></tr>
        <tr><th scope="row">AGM</th><td>{isId ? "Persiapan FYE −1 bulan; AGM ≤6 bulan setelah FYE jika wajib." : "Prepare at FYE −1 month; AGM within 6 months after FYE if required."}</td><td>{isId ? "Hubungi shareholder, siapkan proxy, absensi, voting dan Director Report/financial statements. Pantau pelaksanaan AGM atau catat exemption/dispensation; gunakan deadline baru hanya jika EOT AGM disetujui." : "Contact shareholders and prepare proxy forms, attendance, voting and the Director Report/financial statements. Track the AGM or record exemption/dispensation; use a revised deadline only after AGM EOT approval."}</td></tr>
        <tr><th scope="row">AR & XBRL</th><td>{isId ? "AR ≤7 bulan setelah FYE; sesuaikan kategori perusahaan dan EOT AR yang disetujui." : "AR within 7 months after FYE; adjust for company category and approved AR EOT."}</td><td>{isId ? "Siapkan AR dan XBRL bila berlaku; minta review dan e-sign dokumen dalam satu paket AGM/AR/XBRL. Pantau dokumen yang belum ditandatangani dan submission ACRA selesai/belum." : "Prepare AR and applicable XBRL; request review and e-sign of the AGM/AR/XBRL document bundle. Track unsigned documents and whether ACRA submission is complete."}</td></tr>
        <tr><th scope="row">Form C-S / C-S (Lite) / C</th><td>{isId ? "30 November pada YA terkait, dipetakan dari FY/FYE klien." : "30 November of the relevant YA, mapped from the client's FY/FYE."}</td><td>{isId ? "Siapkan pajak final melalui Automa8e, kirim lewat E-portal untuk review/approval dan e-sign bila berlaku; staf memantau filing IRAS serta billing layanan terkait." : "Prepare final tax through Automa8e, send through E-Portal for review/approval and e-sign where applicable; staff track IRAS filing and related service billing."}</td></tr>
      </tbody></table></div>
      <p><a href="#annual-compliance">{isId ? "Lihat linimasa kepatuhan tahunan →" : "See the annual compliance timeline →"}</a></p>
      <h3>{isId ? "Loop reminder & pengambilalihan staf" : "Reminder Loop & Staff Takeover"}</h3>
      <div className="docs-canvas">
        <Flow label={isId ? "Flow alert FYE dan reminder mingguan" : "FYE alert and weekly reminder workflow"}>
          <FlowNode kind="start" lang={lang} title={isId ? "Baca FYE dan tahun buku setiap klien" : "Read Each Client's FYE and Financial Year"} />
          <FlowArrow />
          <FlowNode lang={lang} title={isId ? "Siapkan pekerjaan FYE −1 bulan" : "Prepare Work One Month Before FYE"}>{isId ? "Annual Accounts, ECI dan persiapan AGM bila berlaku." : "Annual Accounts, ECI and AGM preparation where applicable."}</FlowNode>
          <FlowArrow />
          <FlowNode lang={lang} title={isId ? "Notice awal via Comm Hub segera setelah FYE" : "Initial Comm Hub Notice Immediately After FYE"} />
          <FlowArrow />
          <FlowNode lang={lang} title={isId ? "Generate notice & laporan setiap bulan" : "Generate Notices & Reports Every Month"}>{isId ? "Minta dokumen transaksi dan pantau kewajiban yang berlaku per klien." : "Request transaction documents and track each client's applicable obligations."}</FlowNode>
          <FlowArrow />
          <DocsReturnLoop fromId="alert-next-week" toId="alert-documents-complete" label={isId ? "Setiap minggu cek ulang kelengkapan dokumen dan handoff staf. Ulangi reminder hanya jika masih outstanding dan belum diambil alih." : "Each week, reassess document completeness and staff handoff. Repeat reminders only if still outstanding without staff takeover."}>
          <FlowNode id="alert-documents-complete" kind="decision" lang={lang} title={isId ? "Dokumen sudah lengkap?" : "Documents Complete?"} />
          <FlowArrow plain />
          <Branches>
            <Branch label={isId ? "Lengkap" : "Complete"}>
              <FlowNode lang={lang} title={isId ? "Lanjutkan pembukuan & pemrosesan" : "Proceed to Bookkeeping & Processing"}>{isId ? "Tandai pengumpulan dokumen selesai. Tindak lanjut draf, approval/e-sign dan filing dipantau terpisah." : "Mark document collection complete. Track drafts, approval/e-sign and filing separately."}</FlowNode>
            </Branch>
            <Branch label="Outstanding">

                <FlowNode kind="decision" lang={lang} title={isId ? "Staf sudah mengambil alih?" : "Staff Taken Over?"} />
                <FlowArrow plain />
                <Branches>
                  <Branch label={isId ? "Belum" : "Not Yet"}>
                    <FlowNode id="alert-weekly-reminder" lang={lang} title={isId ? "Kirim reminder mingguan via Comm Hub" : "Send Weekly Reminder via Comm Hub"} />
                    <FlowArrow />
                    <FlowNode id="alert-next-week" lang={lang} title={isId ? "Evaluasi lagi minggu berikutnya" : "Reassess the Following Week"}>{isId ? "Jika masih outstanding dan belum ada handoff, kembali ke reminder mingguan. Jika dokumen lengkap, lanjut ke pemrosesan." : "If still outstanding without a handoff, return to the weekly reminder. If complete, proceed to processing."}</FlowNode>
                  </Branch>
                  <Branch label={isId ? "Sudah" : "Yes"}>
                    <FlowNode lang={lang} title={isId ? "Hentikan reminder otomatis; staf menelepon" : "Stop Automatic Reminders; Staff Call"}>{isId ? "Catat PIC, handoff dan hasil telepon di Comm Hub. Status tetap outstanding sampai dokumen lengkap; hasil telepon dan progres tetap masuk laporan bulanan." : "Record the PIC, handoff and call outcome in Comm Hub. Keep outstanding status until documents are complete; include call outcomes and progress in monthly reporting."}</FlowNode>
                  </Branch>
                </Branches>
            </Branch>
          </Branches>
          </DocsReturnLoop>
        </Flow>
      </div>
      <p>{isId ? "Kelengkapan dokumen menutup reminder untuk permintaan yang sudah selesai. Review draf, filing dan collection tetap dipantau sampai masing-masing selesai. Ini penjabaran kontrol operasional dari alur di papan." : "Document completeness closes reminders for the completed request. Draft review, filing and collection remain tracked until each is complete. This elaborates the board's operational controls."}</p>
      <h3>{isId ? "Apa yang harus terlihat dalam laporan bulanan" : "What the Monthly Report Must Show"}</h3>
      <div className="docs-cards docs-report-cards">
        <div className="docs-card"><h4>{isId ? "Pengumpulan dokumen" : "Document Collection"}</h4><p>{isId ? "Daftar klien dan FYE; jumlah yang perlu dinotifikasi, sudah dinotifikasi, dokumen lengkap dan outstanding. Pisahkan kondisi dokumen dari jumlah notice yang dikirim." : "Client list and FYE; counts requiring notice, already notified, complete and outstanding. Distinguish document status from notice counts."}</p></div>
        <div className="docs-card"><h4>{isId ? "Progres & kepatuhan" : "Progress & Compliance"}</h4><p>{isId ? "PIC, status lengkap/belum, progres manual atau autonomous, tanggal selesai, upload Documa8e, draf review/e-sign, AGM/AR/XBRL, ECI/pajak final, serta submission selesai/belum ke instansi terkait." : "PIC, completeness, manual or autonomous work progress, completion dates, Documa8e uploads, draft review/e-sign, AGM/AR/XBRL, ECI/final tax, and whether filing with the relevant agency is complete."}</p></div>
        <div className="docs-card"><h4>{isId ? "Billing & collection" : "Billing & Collection"}</h4><p>{isId ? "Deliverables A–D yang perlu ditagih, invoice sudah terbit/belum, dan pembayaran sudah diterima/belum. Selesai pekerjaan tidak otomatis berarti invoice sudah lunas." : "A–D deliverables requiring billing, invoices issued or pending, and payments collected or outstanding. Completed work does not automatically mean a paid invoice."}</p></div>
      </div>
      <p><a href="#monthly-reports">{isId ? "Lanjut ke laporan bulanan A–F →" : "Continue to Monthly Reports A–F →"}</a></p>
      <ReferenceLinks sources={["board"]} />
    </section>
  );
}
