import { CalendarClock } from "lucide-react";
import { Branch, Branches, Flow, FlowArrow, FlowNode, type DocsLang } from "@/components/docs-flow";

export default function DocsManagementReport({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  return (
    <section className="docs-section" id="monthly-management-report" aria-labelledby="h-monthly-management-report">
      <div className="docs-section-head">
        <CalendarClock aria-hidden="true" size={20} />
        <h2 id="h-monthly-management-report">{isId ? "Monthly Report — Review bulanan manajemen" : "Monthly Report — Management Review"}</h2>
      </div>
      <p>{isId ? "Setiap bulan, rangkum pipeline lead, kepatuhan klien, progres pekerjaan staf dan penagihan agar manajemen tahu hasil yang tercapai, pekerjaan yang tertunda serta tindakan berikutnya. Bandingkan bulan sebelumnya dengan bulan berjalan; WIP yang belum selesai tetap dibawa dengan ID yang sama." : "Each month, summarise the lead pipeline, client compliance, staff work progress and collection so management can see outcomes, pending work and next actions. Compare the previous and current months; carry unfinished WIP forward under the same ID."}</p>
      <p>{isId ? "Alert deadline kepatuhan dipantau setiap hari, tanpa menunggu laporan bulanan. Laporan ini merangkum alert aktif, kewajiban yang mendekati jatuh tempo, yang terlambat dan tindak lanjutnya." : "Monitor compliance deadline alerts daily, without waiting for the monthly report. This report summarises active alerts, approaching deadlines, overdue obligations and follow-up actions."}</p>
      <div className="docs-canvas">
        <Flow label={isId ? "Flow laporan bulanan dan tindak lanjut manajemen" : "Monthly management reporting and follow-up workflow"}>
          <FlowNode kind="start" lang={lang} title={isId ? "Pilih bulan laporan & periode pembanding" : "Select the Reporting Month & Comparison Period"}>
            {isId ? "Tentukan bulan/tahun, tanggal batas laporan dan WIP awal dari akhir bulan sebelumnya. Gunakan tanggal kejadian untuk aktivitas bulanan dan status pada tanggal batas untuk posisi akhir periode." : "Set the month/year, reporting cut-off and opening WIP from the previous month-end. Use event dates for monthly activity and the status at the cut-off for period-end balances."}
          </FlowNode>
          <FlowArrow />
          <FlowNode kind="store" lang={lang} title={isId ? "Kumpulkan data & riwayat terkait" : "Collect Records & Related History"}>
            {isId ? "Gabungkan record lead, Client Database, kontrak, deadline berdasarkan FYE, pekerjaan staf, invoice dan pembayaran. Tautkan komunikasi Comm Hub serta dokumen Documa8e sebagai bukti." : "Combine lead records, the Client Database, contracts, FYE-based deadlines, staff jobs, invoices and payments. Link Comm Hub communication and Documa8e documents as evidence."}
          </FlowNode>
          <FlowArrow plain />
          <Branches>
            <Branch label={isId ? "Pipeline lead" : "Lead Pipeline"}>
              <FlowNode id="monthly-pipeline-summary" lang={lang} title={isId ? "Hitung lead & hasil konversi" : "Count Leads & Conversion Outcomes"}>
                <ul>
                  <li>{isId ? "WIP awal, lead baru dan total lead yang ditangani." : "Opening WIP, new leads and total leads handled."}</li>
                  <li>{isId ? "Incorporation selesai, onboarding selesai dan rejected/closed pada bulan tersebut." : "Completed incorporations, completed onboardings and rejected/closed leads in the month."}</li>
                  <li>{isId ? "WIP akhir, tahap tertunda, PIC dan tanggal follow-up." : "Closing WIP, pending stage, owner and next follow-up date."}</li>
                  <li>{isId ? "Jumlah kontrak bertanda tangan; kontrak yang masih menunggu tanda tangan." : "Signed contract count; contracts awaiting signature."}</li>
                </ul>
                <p>{isId ? "Pisahkan jenis layanan dari progres. Lead lama yang dibawa ke bulan ini tidak dihitung lagi sebagai lead baru; jumlah kontrak tidak dijumlahkan sebagai lead tambahan." : "Keep service type separate from progress. Carried-forward leads are not new leads; contract counts are not additional leads."}</p>
              </FlowNode>
            </Branch>
            <Branch label={isId ? "Kepatuhan & dokumen" : "Compliance & Documents"}>
              <FlowNode id="monthly-compliance-summary" lang={lang} title={isId ? "Daftar klien yang perlu tindakan" : "List Clients Requiring Action"}>
                <ul>
                  <li>{isId ? "FYE, kewajiban yang berlaku, deadline, status pelaksanaan AGM serta filing ECI, AR/XBRL atau pajak final." : "FYE, applicable obligations, deadlines, AGM completion and filing status for ECI, AR/XBRL or final tax."}</li>
                  <li>{isId ? "Jumlah klien yang perlu dinotifikasi, sudah dinotifikasi, dokumen lengkap dan outstanding." : "Clients requiring notice, clients notified, complete document sets and outstanding documents."}</li>
                  <li>{isId ? "Notice memakai template segera setelah FYE; reminder mingguan sampai ditindaklanjuti staf." : "Template notices immediately after FYE; weekly reminders until staff take over the follow-up."}</li>
                </ul>
                <a href="#fye-alerts">{isId ? "Lihat alert dan aturan deadline berdasarkan FYE →" : "See FYE-based alerts and deadline rules →"}</a>
              </FlowNode>
              <FlowArrow />
              <FlowNode id="monthly-compliance-deadline-alerts" lang={lang} title={isId ? "Pantau deadline & kirim alert kepatuhan" : "Monitor Deadlines & Send Compliance Alerts"}>
                <ul>
                  <li>{isId ? "Per kewajiban: tampilkan klien/UEN, FYE/FY/YA terkait, instansi, deadline yang berlaku, sisa hari atau hari terlambat, PIC dan tindakan berikutnya." : "For each obligation, show the client/UEN, relevant FYE/FY/YA, agency, applicable deadline, days remaining or overdue, owner and next action."}</li>
                  <li>{isId ? "Sebelum jatuh tempo: kirim alert ke PIC sesuai jadwal pengingat SOAS. Pada hari jatuh tempo dan setelah terlambat: tandai prioritas dan eskalasi ke supervisor/manajemen." : "Before the deadline, alert the owner according to the SOAS reminder schedule. On the due date and when overdue, flag priority and escalate to the supervisor/management."}</li>
                  <li>{isId ? "Jika perlu tindakan klien, kirim template via Comm Hub dan catat pengiriman serta hasil follow-up. Jangan menutup alert deadline hanya karena dokumen sudah lengkap atau staf mengambil alih reminder." : "If client action is needed, send a template through Comm Hub and record delivery and follow-up outcomes. Do not close a deadline alert merely because documents are complete or staff take over reminders."}</li>
                  <li>{isId ? "Perbarui deadline hanya untuk extension yang sudah disetujui; permohonan yang masih pending tidak mengubah deadline. Tutup alert kewajiban setelah penyelesaian/filing terkonfirmasi atau exemption/waiver yang berlaku tercatat, beserta buktinya." : "Revise deadlines only for approved extensions; a pending application does not change the deadline. Close an obligation's alert after completion/filing is confirmed or an applicable exemption/waiver is recorded, with evidence."}</li>
                </ul>
              </FlowNode>
            </Branch>
            <Branch label={isId ? "Pekerjaan & collection" : "Work & Collection"}>
              <FlowNode id="monthly-work-collection" lang={lang} title={isId ? "Pantau deliverables, PIC & pembayaran" : "Track Deliverables, Owners & Payments"}>
                <ul>
                  <li>{isId ? "Pekerjaan manual/otomatis, PIC, progres, deadline dan tanggal selesai." : "Manual/automated work, owner, progress, deadline and completion date."}</li>
                  <li>{isId ? "Hambatan dokumen, draf menunggu komentar/approval/e-sign dan pekerjaan lewat waktu." : "Missing documents, drafts awaiting comments/approval/e-sign and overdue work."}</li>
                  <li>{isId ? "Invoice terbit, lunas, belum dibayar dan jumlah outstanding per klien/deliverable." : "Issued, paid and unpaid invoices, with outstanding amounts by client/deliverable."}</li>
                </ul>
                <p>{isId ? "Invoice yang sudah terbit belum berarti pembayaran sudah diterima." : "An issued invoice does not mean payment has been received."}</p>
              </FlowNode>
            </Branch>
          </Branches>
          <FlowArrow />
          <FlowNode id="monthly-management-actions" lang={lang} title={isId ? "Manajemen review pengecualian & tetapkan tindakan" : "Management Reviews Exceptions & Assigns Actions"}>
            {isId ? "Tentukan PIC dan tanggal tindak lanjut untuk lead tertunda, dokumen kurang, risiko deadline, approval tertunda dan pembayaran outstanding. Jika staf sakit/berhalangan, alihkan pekerjaan dan catat serah terima." : "Assign an owner and follow-up date for pending leads, missing documents, deadline risks, pending approvals and outstanding payments. Reassign jobs and record the handover when staff are sick or unavailable."}
          </FlowNode>
          <FlowArrow />
          <FlowNode lang={lang} title={isId ? "Tindak lanjuti & perbarui hasil" : "Follow Up & Update Outcomes"}>
            {isId ? "Gunakan template melalui Comm Hub; catat semua komunikasi termasuk hasil telepon. Simpan dokumen/file di Documa8e, lalu perbarui progres, bukti approval/filing dan pembayaran yang benar-benar diterima." : "Use templates through Comm Hub; record all communication, including call outcomes. Store documents/files in Documa8e, then update progress, approval/filing evidence and payments actually received."}
          </FlowNode>
          <FlowArrow />
          <FlowNode kind="end" lang={lang} title={isId ? "Simpan laporan & bawa WIP ke bulan berikutnya" : "Save the Report & Carry WIP into the Next Month"}>
            {isId ? "Simpan snapshot beserta periode, tanggal pembuatan dan daftar tindakan agar laporan bulan lalu tetap dapat ditelusuri. WIP akhir menjadi WIP awal bulan berikutnya tanpa membuat ulang lead atau pekerjaan. Review mingguan dipakai untuk memantau tindakan di antara laporan bulanan." : "Save a snapshot with its period, generation date and action list so prior reports remain traceable. Closing WIP becomes next month's opening WIP without duplicating leads or jobs. Use weekly reviews to monitor actions between monthly reports."}
          </FlowNode>
        </Flow>
      </div>
      <div className="docs-cards">
        <div className="docs-card">
          <h3>{isId ? "Tampilan & filter laporan" : "Report View & Filters"}</h3>
          <p>{isId ? "Tampilkan jumlah record dan perbandingan previous/current month. Filter berdasarkan bulan/tahun, PIC, sumber lead, jenis layanan, status, deadline dan outstanding. Setiap angka mengarah ke daftar record terkait agar manajemen dapat menindaklanjuti." : "Show record counts and previous/current month comparisons. Filter by month/year, owner, lead source, service type, status, deadline and outstanding items. Each count links to the underlying record list for management follow-up."}</p>
        </div>
        <div className="docs-card">
          <h3>{isId ? "Rincian laporan terkait" : "Related Report Details"}</h3>
          <ul>
            <li><a href="#lead-reports">{isId ? "Laporan pipeline lead →" : "Lead pipeline report →"}</a></li>
            <li><a href="#monthly-reports">{isId ? "Laporan A–F: dokumen, progres, AR, pajak final, billing dan collection →" : "Reports A–F: documents, work progress, AR, final tax, billing and collection →"}</a></li>
            <li><a href="#work-in-progress">{isId ? "Flow WIP & Follow-up →" : "WIP & Follow-up workflow →"}</a></li>
          </ul>
        </div>
      </div>
      <p>{isId ? "Sumber: catatan CRM yang diberikan dan " : "Source: the supplied CRM notes and the "}<a href="https://excalidraw.com/#json=qgnrhk57d5i7Y_X05wpVN,ZFk8N9RLjw_-TSRdCXR7tA" target="_blank" rel="noreferrer">{isId ? "papan CRM terbaru" : "latest CRM board"}</a>.</p>
    </section>
  );
}
