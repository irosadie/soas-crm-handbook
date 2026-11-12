import { Workflow } from "lucide-react";
import { Branch, Branches, Flow, FlowArrow, FlowNode, type DocsLang } from "@/components/docs-flow";
import DocsReturnLoop from "@/components/docs-return-loop";

export default function DocsWipFlow({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  return (
    <section className="docs-section" id="work-in-progress" aria-labelledby="h-work-in-progress">
      <div className="docs-section-head">
        <Workflow aria-hidden="true" size={20} />
        <h2 id="h-work-in-progress">{isId ? "WIP — Lead yang masih diproses" : "WIP — Lead Processing & Follow-up"}</h2>
      </div>
      <p>{isId ? "WIP (Work In Progress) adalah progres lead yang belum selesai, bukan jenis layanan dan bukan tanda bahwa lead sudah menjadi klien. Lead incorporation maupun onboarding dapat tetap WIP selama masih menunggu informasi, pemeriksaan, pembayaran, approval atau kontrak. Bagian ini ditempatkan setelah Onboarding sebagai penjelasan jalur WIP, bukan tahap wajib setelah onboarding selesai." : "WIP (Work In Progress) is the progress of an unfinished lead, not a service type or confirmation of client activation. Incorporation and onboarding leads can remain WIP while awaiting information, screening, payment, approval or a contract. This section follows Onboarding to explain the WIP path; it is not a mandatory stage after completed onboarding."}</p>
      <div className="docs-canvas">
        <Flow label={isId ? "Flow WIP lead dan follow-up" : "WIP lead processing and follow-up workflow"}>
          <FlowNode kind="start" lang={lang} title={isId ? "Lead belum selesai / WIP bulan sebelumnya" : "Unfinished Lead / Previous Month WIP"}>
            {isId ? "Gunakan record lead yang sama; bawa pekerjaan yang belum selesai ke periode berikutnya." : "Keep the same lead record; carry unfinished work into the next reporting period."}
          </FlowNode>
          <FlowArrow />
          <FlowNode id="wip-assign-owner" lang={lang} title={isId ? "Tetapkan PIC & tindakan berikutnya" : "Assign an Owner & Next Action"}>
            {isId ? "Catat PIC, layanan yang diminati, tahap terakhir, hambatan dan tanggal follow-up. Staf merespons dalam 1 hari menggunakan template yang disediakan." : "Record the owner, requested service, latest stage, blocker and next follow-up date. Staff respond within 1 day using the provided template."}
          </FlowNode>
          <FlowArrow />
          <DocsReturnLoop fromId="wip-receive-update" toId="wip-assessment" label={isId ? "Setelah balasan atau dokumen diterima, kembali menilai lead dan menentukan tindakan berikutnya." : "After receiving a reply or documents, reassess the lead and determine the next action."}>
            <FlowNode id="wip-assessment" lang={lang} title={isId ? "Analisis informasi & klasifikasi sebelum menghubungi" : "Analyse Information & Classify Before Contacting"}>
              {isId ? "AI dapat mengekstrak informasi dan mengusulkan tipe layanan; staf juga dapat memilih atau mengoreksi secara manual. Gunakan template pertanyaan untuk melengkapi tujuan bisnis, aktivitas, shareholder/director dan kebutuhan dokumen." : "AI can extract information and suggest the service type; staff can also select or correct it manually. Use question templates to clarify the business purpose, activities, shareholders/directors and document requirements."}
            </FlowNode>
            <FlowArrow />
            <FlowNode kind="decision" lang={lang} title={isId ? "Apa tindakan berikutnya?" : "What Is the Next Action?"} />
            <FlowArrow plain />
            <Branches>
              <Branch label={isId ? "Siap dilanjutkan" : "Ready to Proceed"}>
                <FlowNode id="wip-resume-workflow" lang={lang} title={isId ? "Lanjutkan flow sesuai layanan" : "Continue the Relevant Service Workflow"}>
                  <p>{isId ? "Jika layanan sudah diketahui, langsung lanjutkan dari tahap yang sesuai; hindari meminta ulang data yang sudah valid." : "If the service is known, proceed directly from the appropriate stage; avoid requesting valid information again."}</p>
                  <ul>
                    <li><a href="#incorporation">{isId ? "Perusahaan baru → Incorporation" : "New company → Incorporation"}</a></li>
                    <li><a href="#onboarding">{isId ? "Perusahaan existing → Onboarding" : "Existing company → Onboarding"}</a></li>
                  </ul>
                </FlowNode>
                <FlowArrow />
                <FlowNode kind="store" lang={lang} title={isId ? "Perbarui progres sesuai hasil sebenarnya" : "Update Progress from the Actual Outcome"}>
                  {isId ? "Tetap WIP sampai proses terkait selesai. Catat hasil incorporated/onboarded dan kontrak bertanda tangan setelah syarat flow terpenuhi; baru tautkan record klien di Client Database." : "Remain WIP until the relevant process is complete. Record incorporation/onboarding outcomes and signed contracts once the workflow conditions are met; then link the client record in the Client Database."}
                </FlowNode>
              </Branch>
              <Branch label={isId ? "Perlu informasi / follow-up" : "Information / Follow-up Needed"}>
                <FlowNode id="wip-follow-up" lang={lang} title={isId ? "Follow-up memakai template melalui Comm Hub" : "Follow Up Using Templates through Comm Hub"}>
                  {isId ? "Minta informasi atau dokumen yang kurang melalui email, telepon, pesan atau WhatsApp. Catat semua komunikasi pada lead, termasuk hasil telepon. Simpan semua dokumen/file ke Documa8e dengan tanggal dan tautan ke lead." : "Request missing information or documents by email, phone, message or WhatsApp. Record all communication against the lead, including call outcomes. Store every document/file in Documa8e with its date and lead link."}
                </FlowNode>
                <FlowArrow />
                <FlowNode id="wip-receive-update" lang={lang} title={isId ? "Terima balasan atau lanjutkan follow-up" : "Receive Updates or Continue Follow-up"}>
                  <p>{isId ? "Jika ada balasan, verifikasi dokumen dan nilai ulang. Jika belum ada balasan, tetap WIP, catat hambatan dan jadwalkan follow-up berikutnya. Eskalasi ke supervisor bila terhambat atau PIC perlu diganti." : "When a reply arrives, verify documents and reassess. With no reply, keep the lead WIP, record the blocker and schedule the next follow-up. Escalate to a supervisor if blocked or the owner needs replacement."}</p>
                  <a href="#wip-assessment">{isId ? "Kembali ke analisis lead ↑" : "Return to lead assessment ↑"}</a>
                </FlowNode>
              </Branch>
              <Branch label={isId ? "Tidak dilanjutkan (Do Not Proceed)" : "Do Not Proceed (Closed - Lost)"}>
                <FlowNode id="wip-closed" kind="end" lang={lang} title={isId ? "Tutup lead — Tidak dilanjutkan" : "Close Lead — Do Not Proceed"} />
                <FlowArrow plain />
                <FlowNode id="wip-closed-note" kind="note" lang={lang} title={isId ? "Catatan & Alasan Penutupan" : "Closure Reasons & WIP Exclusion"}>
                  <p>{isId ? "Catat alasan, tanggal keputusan, dan PIC. Status ini langsung mengeluarkan lead dari listing kerja WIP aktif agar antrean operasional tetap bersih dan tidak mengotori saldo carry-forward. Klasifikasi alasan:" : "Record the closure reason, decision date, and owner. This status immediately removes the lead from the active WIP working list to keep operational queues clean and prevent carry-forward pollution. Categorize as either:"}</p>
                  <ul>
                    <li>
                      <strong>{isId ? "1. Hilang Kontak / Unresponsive:" : "1. Lost Contact / Unresponsive:"}</strong>{" "}
                      {isId ? "Tidak ada respon setelah follow-up berulang via Comm Hub melebihi batas waktu wajar. Riwayat tersimpan dan dapat di-reaktivasi jika prospek kembali kontak." : "No response after repeated follow-ups via Comm Hub beyond the reasonable grace period. History is preserved and the lead can be reactivated if the prospect reconnects."}
                    </li>
                    <li>
                      <strong>{isId ? "2. Tidak Tertarik / Batal (Not Interested / Withdrawn):" : "2. Not Interested / Withdrawn:"}</strong>{" "}
                      {isId ? "Prospek menyatakan batal atau memilih vendor lain. Catat alasan dan langsung ditutup tanpa jadwal follow-up berkala." : "Prospect explicitly cancels or chooses another provider. Record specific feedback and close immediately without recurring follow-ups."}
                    </li>
                  </ul>
                  <p>{isId ? "Aturan tampilan: Lead Do Not Proceed / Closed - Lost tidak ditampilkan di listing WIP operasional, namun tetap tersimpan di riwayat pipeline untuk laporan rekapitulasi." : "Display rule: Leads marked Do Not Proceed / Closed - Lost are hidden from the active WIP listing, but retained in pipeline history for recap reporting."}</p>
                </FlowNode>
              </Branch>
            </Branches>
          </DocsReturnLoop>
        </Flow>
      </div>
      <div className="docs-cards">
        <div className="docs-card" id="wip-list-controls">
          <h3>{isId ? "Daftar & filter WIP" : "WIP Listing & Filters"}</h3>
          <p>{isId ? "Tampilkan hanya lead WIP yang masih aktif pada daftar kerja, dengan jumlah hasil. Status Tidak Dilanjutkan (Do Not Proceed / Closed - Lost) otomatis disembunyikan dan tidak ditampilkan di listing WIP lagi agar antrean kerja dan saldo carry-forward tidak terdistorsi. Filter berdasarkan PIC, sumber (website/email/recommendation/others), jenis layanan, tahap, hambatan dan tanggal follow-up agar pekerjaan tertunda cepat ditemukan." : "Display only active WIP leads in the working list, with an accurate result count. Leads marked Do Not Proceed (Closed - Lost) are strictly excluded and no longer displayed in the WIP listing so work queues and carry-forward balances stay accurate. Filter by owner, source (website/email/recommendation/others), service type, stage, blocker and follow-up date to find pending work quickly."}</p>
        </div>
        <div className="docs-card" id="wip-period-reporting">
          <h3>{isId ? "Review mingguan & laporan bulanan" : "Weekly Review & Monthly Reporting"}</h3>
          <p>{isId ? "Laporkan WIP dari bulan sebelumnya, lead baru, incorporated, onboarded, rejected/closed, jumlah kontrak bertanda tangan dan WIP akhir bulan. Bawa WIP yang belum selesai ke bulan berikutnya dengan ID yang sama; jangan dihitung sebagai lead baru. Supervisor meninjau hambatan, tindak lanjut lewat waktu dan kebutuhan pengalihan PIC." : "Report opening WIP from the previous month, new leads, incorporated, onboarded, rejected/closed, signed contract counts and closing WIP. Carry unfinished WIP into the next month under the same ID; do not count it as a new lead. Supervisors review blockers, overdue follow-ups and owner handovers."}</p>
          <a href="#lead-reports">{isId ? "Laporan pipeline lead →" : "Lead pipeline reporting →"}</a>
        </div>
        <div className="docs-card">
          <h3>{isId ? "WIP deliverables setelah menjadi klien" : "Deliverable WIP after Client Activation"}</h3>
          <p>{isId ? "Pekerjaan ART/Corporate Secretarial yang belum selesai dilacak per klien dan deliverable: PIC, deadline, kelengkapan dokumen, progres, approval/e-sign, billing dan pembayaran. Jika staf berhalangan, supervisor menunjuk pengganti dan mencatat serah terima. Pekerjaan ini tidak membuka ulang lead yang sudah selesai." : "Track unfinished ART/Corporate Secretarial work by client and deliverable: owner, deadline, document completeness, progress, approval/e-sign, billing and payment. If staff are unavailable, the supervisor assigns a replacement and records the handover. This work does not reopen a completed lead."}</p>
          <a href="#monthly-reports">{isId ? "Laporan progres pekerjaan & deliverables A–F →" : "Work progress & deliverable reports A–F →"}</a>
        </div>
      </div>
      <p>{isId ? "Sumber alur dan carry-forward WIP: " : "Workflow and WIP carry-forward source: "}<a href="https://excalidraw.com/#json=qgnrhk57d5i7Y_X05wpVN,ZFk8N9RLjw_-TSRdCXR7tA" target="_blank" rel="noreferrer">{isId ? "papan CRM terbaru" : "latest CRM board"}</a>{isId ? "; detail template, komunikasi, dokumen dan monitoring mengikuti catatan CRM yang diberikan." : "; template, communication, document and monitoring details follow the supplied CRM notes."}</p>
    </section>
  );
}
