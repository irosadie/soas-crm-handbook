import { MessagesSquare } from "lucide-react";
import { Branch, Branches, Flow, FlowArrow, FlowNode, type DocsLang } from "@/components/docs-flow";
import { ReferenceLinks } from "@/components/docs-reference";

export default function DocsCommunicationFlow({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  return (
    <section className="docs-section" id="communication" aria-labelledby="h-communication">
      <div className="docs-section-head"><MessagesSquare size={20} aria-hidden="true" /><h2 id="h-communication">{isId ? "Komunikasi: Comm Hub & E-portal" : "Communication: Comm Hub & E-Portal"}</h2></div>
      <p>{isId ? "Papan meminta Communication Hub untuk mendapatkan informasi dari klien dan E-portal untuk korespondensi draf, review, komentar serta tanda tangan. Alur berikut menjabarkan koordinasi komunikasi tersebut untuk intake dan alert kepatuhan berbasis FYE." : "The board calls for Communication Hub to obtain client information and E-Portal for draft correspondence, review, comments and signatures. The flow below elaborates this coordination for intake and FYE-based compliance alerts."}</p>
      <div className="docs-cards docs-report-cards">
        <div className="docs-card"><h4>Comm Hub</h4><p>{isId ? "Pusat percakapan dan tindak lanjut: permintaan data/dokumen, notice FYE, reminder, balasan klien dan catatan PIC. Setiap percakapan dikaitkan dengan lead/klien serta FY dan kewajiban terkait." : "Conversation and follow-up workspace: information/document requests, FYE notices, reminders, client replies and PIC notes. Link each conversation to the lead/client and relevant FY and obligation."}</p></div>
        <div className="docs-card"><h4>E-portal</h4><p>{isId ? "Tempat klien mengakses paket draf yang benar, memberi komentar, menyetujui dan e-sign bila berlaku. Notifikasi/tautan dapat dikoordinasikan lewat Comm Hub; balasan chat saja tidak dianggap sebagai approval atau tanda tangan." : "The client accesses the correct draft bundle, comments, approves and e-signs where applicable. Coordinate notifications/links through Comm Hub; a chat reply alone does not count as approval or a signature."}</p></div>
        <div className="docs-card"><h4>{isId ? "Telepon oleh staf" : "Staff Phone Follow-Up"}</h4><p>{isId ? "Saat staf mengambil alih, hentikan reminder mingguan otomatis terkait. Catat PIC, waktu telepon, hasil dan tindak lanjut di Comm Hub; dokumen outstanding tetap terbuka sampai diverifikasi lengkap." : "On staff takeover, stop the related automatic weekly reminders. Record the PIC, call time, outcome and next action in Comm Hub; outstanding documents remain open until verified complete."}</p></div>
      </div>
      <h3>{isId ? "Alur komunikasi & pembaruan status" : "Communication & Status Update Flow"}</h3>
      <div className="docs-canvas"><Flow label={isId ? "Flow komunikasi Comm Hub dan E-portal" : "Comm Hub and E-Portal communication workflow"}>
        <FlowNode kind="start" lang={lang} title={isId ? "Intake atau alert FYE membutuhkan tindak lanjut" : "Intake or FYE Alert Requires Follow-Up"} />
        <FlowArrow />
        <FlowNode lang={lang} title={isId ? "Buka percakapan terkait di Comm Hub" : "Open the Related Comm Hub Conversation"}>{isId ? "Bawa konteks lead/klien, PIC, tahun buku, kewajiban, deadline dan daftar item outstanding." : "Include lead/client, PIC, financial year, obligation, deadline and outstanding items."}</FlowNode>
        <FlowArrow />
        <FlowNode kind="decision" lang={lang} title={isId ? "Tindak lanjut apa yang diperlukan?" : "What Follow-Up Is Required?"} />
        <FlowArrow plain />
        <Branches>
          <Branch label={isId ? "Informasi / dokumen" : "Information / Documents"}>
            <FlowNode lang={lang} title={isId ? "Kirim permintaan, notice atau reminder via Comm Hub" : "Send Request, Notice or Reminder via Comm Hub"}>{isId ? "Jelaskan apa yang harus klien berikan dan kewajiban yang dituju." : "Explain what the client must provide and which obligation it supports."}</FlowNode>
            <FlowArrow />
            <FlowNode kind="external" lang={lang} title={isId ? "Klien membalas atau menyerahkan dokumen" : "Client Replies or Provides Documents"} />
            <FlowArrow />
            <FlowNode lang={lang} title={isId ? "Staf verifikasi kelengkapan" : "Staff Verify Completeness"}>{isId ? "Balasan diterima belum berarti dokumen lengkap. Perbarui item yang masih kurang; dokumen yang siap diteruskan ke proses digitalisasi/Documa8e dan pembukuan." : "A received reply does not establish completeness. Update remaining missing items; ready documents proceed to digitisation/Documa8e and bookkeeping."}</FlowNode>
          </Branch>
          <Branch label={isId ? "Review / approval / e-sign" : "Review / Approval / E-Sign"}>
            <FlowNode lang={lang} title={isId ? "Koordinasikan notifikasi E-portal lewat Comm Hub" : "Coordinate E-Portal Notification through Comm Hub"}>{isId ? "Arahkan klien ke paket dan versi draf yang benar. Dokumen AGM/AR/XBRL yang berlaku dikirim sekaligus." : "Direct the client to the correct draft bundle and version. Send applicable AGM/AR/XBRL documents together."}</FlowNode>
            <FlowArrow />
            <FlowNode kind="external" lang={lang} title={isId ? "Klien review, komentar, approval & e-sign di E-portal" : "Client Reviews, Comments, Approves & E-Signs in E-Portal"} />
            <FlowArrow />
            <FlowNode lang={lang} title={isId ? "Catat hasil dan tindak lanjut di Comm Hub" : "Record Outcome & Next Action in Comm Hub"}>{isId ? "Komentar/revisi dikembalikan ke PIC. Status approval atau e-sign mengikuti bukti E-portal; billing ART mengikuti pengiriman draf." : "Return comments/revisions to the PIC. Approval/e-sign status follows E-Portal evidence; ART invoicing follows draft dispatch."}</FlowNode>
          </Branch>
        </Branches>
        <FlowArrow />
        <FlowNode kind="store" lang={lang} title={isId ? "Perbarui tugas, riwayat komunikasi & laporan bulanan" : "Update Tasks, Communication History & Monthly Reports"}>{isId ? "Pantau dokumen, draf, filing dan collection secara terpisah. Jika belum ada respons dan masih outstanding, ikuti loop reminder/handoff pada bagian Alert FYE." : "Track documents, drafts, filing and collection separately. If there is no response and items remain outstanding, follow the reminder/handoff loop in FYE-Based Alerts."}</FlowNode>
      </Flow></div>
      <p><a href="#fye-alerts">{isId ? "Lihat pemicu notice, reminder dan handoff staf →" : "See notice triggers, reminders and staff handoff →"}</a></p>
      <p>{isId ? "Catatan implementasi: alur di atas adalah rancangan koordinasi. Comm Hub di aplikasi saat ini masih preview percakapan; pengiriman pesan nyata, scheduler alert dan sinkronisasi E-portal belum terhubung." : "Implementation note: the flow above is a coordination design. The current application's Comm Hub is a conversation preview; live messaging, alert scheduling and E-Portal synchronisation are not connected."}</p>
      <ReferenceLinks sources={["board"]} />
    </section>
  );
}
