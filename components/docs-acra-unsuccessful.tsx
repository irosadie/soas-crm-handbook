import { Branch, Branches, FlowArrow, FlowNode, type DocsLang } from "@/components/docs-flow";

export default function DocsAcraUnsuccessful({ lang }: { lang: DocsLang }) {
  const isId = lang === "id";
  return <>
    <FlowNode kind="decision" lang={lang} title={isId ? "Apa tindak lanjut menurut keputusan ACRA?" : "What Does the ACRA Outcome Allow?"}>
      {isId ? "Periksa pemberitahuan ACRA untuk membedakan permintaan perbaikan yang boleh diajukan ulang dari penolakan final." : "Check ACRA's notification to distinguish correctable applications that allow resubmission from final rejection."}
    </FlowNode>
    <FlowArrow plain />
    <Branches>
      <Branch label={isId ? "Boleh diajukan ulang" : "Resubmission Allowed"}>
        <FlowNode lang={lang} title={isId ? "Perbaiki sesuai catatan ACRA" : "Correct the Application as Requested by ACRA"}>
          {isId ? "Staf segera menindaklanjuti catatan ACRA, memperbaiki data dan melengkapi dokumen yang diminta, misalnya mengganti nama perusahaan yang tidak tersedia." : "Staff promptly address ACRA's comments, correct the information and supply requested documents, such as replacing an unavailable company name."}
        </FlowNode>
        <FlowArrow />
        <FlowNode id="acra-revision-consent" lang={lang} title={isId ? "Minta persetujuan klien & ajukan ulang" : "Obtain Client Approval & Resubmit"}>
          <p>{isId ? "Setelah klien menyetujui perbaikan, kembali ke Submit Application to ACRA. Evaluasi setiap hasil baru: lanjut jika Approved, perbaiki lagi jika resubmission diizinkan, atau akhiri proses jika Rejected." : "After the client approves the corrections, return to Submit Application to ACRA. Assess each new outcome: proceed if Approved, correct again if resubmission is allowed, or end the process if Rejected."}</p>
          <a href="#incorporation-submit">{isId ? "Kembali ke pengajuan ACRA ↑" : "Return to ACRA Submission ↑"}</a>
        </FlowNode>
      </Branch>
      <Branch label="Rejected">
        <FlowNode id="incorporation-rejected" kind="end" lang={lang} title={isId ? "Aplikasi ditolak — proses berakhir" : "Application Rejected — Process Ends"} />
        <FlowArrow plain />
        <FlowNode id="incorporation-rejection-note" kind="note" lang={lang} title={isId ? "Catatan" : "Note"}>
          {isId ? "Pengajuan ini tidak dapat diajukan ulang sesuai keputusan ACRA. Catat keputusan dan alasan yang tersedia; ACRA dapat tidak menjelaskan alasannya secara lengkap. Beri tahu klien, simpan riwayat, dan tutup proses tanpa aktivasi klien dari pengajuan ini." : "This application cannot be resubmitted under ACRA's decision. Record the outcome and any available reasons; ACRA may not disclose the full reasons. Inform the client, retain the history and close the process without client activation from this application."}
        </FlowNode>
      </Branch>
    </Branches>
  </>;
}
