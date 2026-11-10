import type { ReactNode } from "react";
import { BookOpenCheck } from "lucide-react";
import { Branch, Branches, Flow, FlowArrow, FlowNode, type DocsLang, type NodeKind } from "@/components/docs-flow";
import DocsReturnLoop from "@/components/docs-return-loop";

type Copy = [string, string];
type Step = [string, string, string?, string?];
type LangProps = { lang: DocsLang };
const copy = (lang: DocsLang, value: Copy) => value[lang === "id" ? 0 : 1];

function Node({ lang, step, kind = "process", id }: LangProps & { step: Step; kind?: NodeKind; id?: string }) {
  return <FlowNode lang={lang} kind={kind} id={id} title={step[lang === "id" ? 0 : 1]}>{step[lang === "id" ? 2 : 3]}</FlowNode>;
}
function Steps({ lang, steps, startId }: LangProps & { steps: Step[]; startId?: string }) {
  return steps.map((step, index) => <div className="docs-v11-step" key={step[1]}>{index > 0 && <FlowArrow />}<Node lang={lang} step={step} id={index === 0 ? startId : undefined} /></div>);
}
function Section({ lang, id, title, time, children }: LangProps & { id: string; title: Copy; time: string; children: ReactNode }) {
  return <section className="docs-section" id={id} aria-labelledby={`h-${id}`}><div className="docs-section-head"><BookOpenCheck size={20} aria-hidden="true" /><h2 id={`h-${id}`}>{copy(lang, title)}</h2></div><p className="docs-meeting-source">{copy(lang, ["Dasar revisi: meeting Mr Lau", "Revision source: Mr Lau meeting"])} · {time} · v1.1</p>{children}</section>;
}
function Canvas({ children, label }: { children: ReactNode; label: string }) {
  return <div className="docs-canvas"><Flow label={label}>{children}</Flow></div>;
}

export function DocsV11Overview({ lang }: LangProps) {
  const changes: Copy[] = [
    ["Lead: ekstraksi, klasifikasi, respons sesuai layanan dan target 24 jam.", "Leads: extraction, classification, service-specific response and a 24-hour target."],
    ["Incorporation: data minimum → quotation → pembayaran → data lengkap & screening → bundel tanda tangan → filing.", "Incorporation: minimum data → quotation → payment → full data & screening → signature bundle → filing."],
    ["Identitas: individual/corporate/mixed, wakil corporate, risk assessment dan alert expiry.", "Identity: individual/corporate/mixed, corporate representatives, risk assessment and expiry alerts."],
    ["Onboarding: handover CSP lama dan tindak lanjut perubahan appointment/alamat.", "Onboarding: previous-CSP handover and follow-up on appointment/address changes."],
    ["Kontrak: review dan countersign SOAS, layanan belum dipilih, frekuensi ART dan billing.", "Contracts: SOAS review/countersign, unselected services, ART frequency and billing."],
    ["WIP: saldo awal + masuk − keluar = saldo akhir, dengan histori per periode.", "WIP: opening + incoming − outgoing = closing, with period history."],
  ];
  return <Section lang={lang} id="overview" title={["Ringkasan · versi 1.1", "Overview · Version 1.1"]} time="00:02:47–00:57:43">
    <p className="docs-version-banner">{copy(lang, ["Flow 1.1 memperbarui rancangan proses bisnis dari meeting; versi 1.0 tetap tersedia sebagai arsip.", "Flow 1.1 updates the business-process design from the meeting; version 1.0 remains available as an archive."])} <a href="/docs/v1.0">{copy(lang, ["Buka versi 1.0 →", "Open version 1.0 →"])}</a></p>
    <div className="docs-cards docs-report-cards">{changes.map((item, i) => <div className="docs-card" key={i}><strong>{String(i + 1).padStart(2, "0")}</strong><p>{copy(lang, item)}</p></div>)}</div>
    <p>{copy(lang, ["Cakupan: rancangan flow CRM SOAS. Corpora8e diposisikan sebagai platform layanan CSP, termasuk incorporation dan pengelolaan layanan terkait. Diagram ini menjelaskan proses yang dituju; bukan bukti pengiriman, screening, pembayaran atau filing otomatis sudah berjalan.", "Scope: SOAS CRM process design. Corpora8e is positioned as a CSP-service platform, including incorporation and related service management. These diagrams describe intended processes; they do not establish that automated messaging, screening, payment or filing is operational."])}</p>
  </Section>;
}

export function DocsV11LeadFlow({ lang }: LangProps) {
  return <Section lang={lang} id="end-to-end-flow" title={["Alur lead, respons & routing", "Lead Intake, Response & Routing"]} time="00:02:47–00:06:48; 00:42:01–00:44:33">
    <Canvas label="Lead routing v1.1">
      <Node lang={lang} kind="start" step={["Lead dari website, email atau referral", "Lead from Website, Email or Referral"]} /><FlowArrow />
      <Steps lang={lang} steps={[
        ["Ekstrak informasi & simpan sumber lead", "Extract Information & Retain Lead Source", "Simpan pesan asli, kontak, waktu diterima, sumber dan PIC; tandai data yang belum diketahui.", "Retain the original message, contact, receipt time, source and PIC; flag unknown information."],
        ["Identifikasi jenis enquiry dari deskripsi", "Identify Enquiry Type from the Description", "Klasifikasi otomatis mengusulkan incorporation, onboarding atau kebutuhan lain. Hasil yang ambigu masuk review staf; jangan memaksa pilihan yang salah.", "Automatic classification proposes incorporation, onboarding or another need. Ambiguous results go to staff review; do not force an incorrect category."],
        ["Respons awal melalui Comm Hub", "Initial Response through Comm Hub", "Gunakan template sesuai layanan; minta informasi berikutnya yang relevan. Untuk enquiry belum jelas, kirim acknowledgement dan pertanyaan klarifikasi. Catat hasil pengiriman, bukan hanya draft.", "Use a service-specific template and request relevant next information. For unclear enquiries, acknowledge receipt and ask for clarification. Record delivery outcomes, not just drafts."],
        ["Pantau target respons & eskalasi", "Monitor Response Target & Escalation", "Usulan target operasional: segera, paling lambat 24 jam sejak diterima. Jika belum berhasil dibalas, alert PIC/escalation; SLA dan jam kerja masih perlu konfirmasi SOAS.", "Proposed operational target: promptly, within 24 hours of receipt. If no reply is successfully sent, alert the PIC/escalate; SOAS must confirm the SLA and working hours."],
      ]} /><FlowArrow />
      <Node lang={lang} kind="decision" step={["Jalur tindak lanjut?", "Which Follow-Up Route?"]} /><FlowArrow plain />
      <Branches>
        <Branch label="Incorporation"><Node lang={lang} step={["Data quotation minimum", "Minimum Quotation Data", "Lanjut ke flow incorporation; tetap dalam pipeline sampai syarat konversi terpenuhi.", "Continue to incorporation; remain in the pipeline until conversion requirements are met."]} /></Branch>
        <Branch label="Onboarding"><Node lang={lang} step={["Business Profile & CSP sebelumnya", "Business Profile & Previous CSP", "Lanjut screening, handover dan kontrak onboarding.", "Continue to onboarding screening, handover and contract."]} /></Branch>
        <Branch label={copy(lang, ["Belum jelas / kebutuhan lain", "Unclear / Other Need"])}><Node lang={lang} step={["Staf klarifikasi & track WIP", "Staff Clarify & Track WIP", "Catat permintaan, balasan, next action, PIC dan tanggal follow-up. Tolak hanya dengan keputusan dan alasan tercatat.", "Record requests, replies, next action, PIC and follow-up date. Reject only with a recorded decision and reason."]} /></Branch>
      </Branches>
    </Canvas>
    <p><a href="#lead-reports">{copy(lang, ["Rekonsiliasi seluruh perpindahan lead pada laporan WIP →", "Reconcile all lead movements in the WIP report →"])}</a></p>
  </Section>;
}

export function DocsV11Incorporation({ lang }: LangProps) {
  return <Section lang={lang} id="incorporation" title={["Incorporation · dari quotation sampai aktivasi", "Incorporation · Quotation to Activation"]} time="00:07:34–00:11:24; 00:21:31–00:35:40">
    <Canvas label="Incorporation v1.1">
      <Node lang={lang} kind="start" step={["Lead membutuhkan perusahaan baru", "Lead Needs a New Company"]} /><FlowArrow />
      <Steps lang={lang} steps={[
        ["Kumpulkan data minimum untuk quotation", "Collect Minimum Data for Quotation", "Kontak, struktur individual/corporate/mixed, jumlah shareholder/director dan layanan yang dibutuhkan. Full ACRA form belum diperlukan untuk tahap quotation.", "Contact, individual/corporate/mixed structure, shareholder/director headcounts and required services. A full ACRA form is not required for quotation."],
        ["Hitung & tawarkan fee", "Calculate & Offer Fees", "Pisahkan biaya jasa, biaya pengajuan ACRA dan GST bila berlaku; rincian mengikuti struktur dan lingkup layanan. Catatan internal staf bukan naskah untuk klien.", "Separate service charges, ACRA filing fees and GST where applicable; price according to structure and service scope. Internal staff instructions are not client-facing copy."],
        ["Konfirmasi quotation & pembayaran di muka", "Confirm Quotation & Upfront Payment", "Jika quotation belum disetujui atau pembayaran belum terkonfirmasi, tetap WIP dengan PIC/follow-up. Pembayaran tidak sama dengan approval screening atau izin mengaktifkan layanan.", "Until the quotation is accepted and payment confirmed, remain WIP with a PIC/follow-up. Payment is not screening approval or permission to activate services."],
        ["Kumpulkan data lengkap & lakukan KYC/KYB/CDD", "Collect Full Data & Perform KYC/KYB/CDD", "Lengkapi form dan dokumen; ikuti flow Identitas & Screening. Koreksi dikembalikan untuk pemeriksaan ulang, penolakan final menghentikan jalur. Lanjut hanya setelah SOAS menyetujui screening.", "Complete forms and evidence using Identity & Screening. Corrections return for reassessment; final rejection ends the route. Proceed only after SOAS screening approval."],
        ["Siapkan satu bundel dokumen & pilihan layanan", "Prepare One Document Bundle & Service Selection", "Gabungkan application/director consent forms, draf dokumen First Director Meeting yang sesuai, serta service contract untuk layanan pilihan klien. Koordinasikan versi dan penanda tangan agar tidak bolak-balik.", "Bundle application/director consent forms, appropriate First Director Meeting drafts and the service contract for selected services. Coordinate versions and signatories to minimise repeated exchanges."],
        ["Review, approval & tanda tangan sesuai dokumen", "Review, Approval & Signatures as Required", "Klien review/menandatangani di E-portal; SOAS review dan countersign kontrak. Lengkapi bukti tanda tangan yang diperlukan untuk filing. Persiapan draf bukan penyelenggaraan rapat formal sebelum perusahaan terbentuk.", "The client reviews/signs in E-Portal; SOAS reviews and countersigns the contract. Obtain signature evidence required for filing. Draft preparation does not mean holding a formal meeting before incorporation."],
      ]} /><FlowArrow />
      <DocsReturnLoop fromId="acra-revision-consent" toId="incorporation-submit" label={copy(lang, ["Setelah koreksi disetujui, submit ulang ke ACRA; ulangi bila ditolak lagi.", "After correction approval, resubmit to ACRA; repeat if rejected again."])}>
        <Node lang={lang} id="incorporation-submit" step={["Submit application form ke ACRA", "Submit Application Form to ACRA", "Gunakan fasilitas filing yang tersedia melalui platform CSP; bila tidak tersedia, SOAS melakukan filing manual. Simpan referensi pengajuan dan hasilnya.", "Use available filing facilities through the CSP platform; otherwise SOAS files manually. Record submission references and outcomes."]} /><FlowArrow />
        <Node lang={lang} kind="decision" step={["ACRA menyetujui?", "ACRA Approved?"]} /><FlowArrow plain />
        <Branches>
          <Branch label={copy(lang, ["Ditolak", "Rejected"])}><Node lang={lang} id="acra-revision-consent" step={["Periksa alasan, koreksi & minta persetujuan klien", "Review Reasons, Correct & Obtain Client Agreement", "Tanggapi seluruh alasan ACRA, bukan hanya nama perusahaan. Jika perlu, minta informasi tambahan dan tanda tangan ulang atas dokumen yang berubah; kembali ke submit.", "Address all ACRA reasons, not only company names. Request further information and re-sign changed documents where needed; return to submission."]} /></Branch>
          <Branch label={copy(lang, ["Disetujui", "Approved"])}>
            <Node lang={lang} kind="store" step={["Simpan hasil approval & dokumen final", "Store Approval Outcome & Final Documents", "UEN dan tanggal incorporation berasal dari hasil ACRA; simpan Business Profile, Constitution, FYE dan data terverifikasi.", "Use ACRA outcomes for the UEN and incorporation date; retain the Business Profile, Constitution, FYE and verified particulars."]} /><FlowArrow />
            <Node lang={lang} step={["Finalisasi dan distribusi paket perusahaan", "Finalise & Distribute the Company Bundle", "Finalisasi dokumen First Director Meeting sesuai tahap yang sah; lengkapi tanda tangan pasca-approval bila perlu. Kirim Business Profile, Constitution dan dokumen final ke pihak yang relevan.", "Finalise First Director Meeting documents at the appropriate stage; obtain post-approval signatures where needed. Send the Business Profile, Constitution and final records to relevant parties."]} /><FlowArrow />
            <Node lang={lang} kind="end" step={["Aktifkan klien setelah syarat terpenuhi", "Activate Client After Requirements Are Met", "Approval ACRA, screening SOAS dan kontrak pilihan layanan yang ditandatangani kedua pihak harus tercatat. Item belum dipilih/belum ditandatangani tetap ditrack; jangan menganggap semua paket sudah diambil.", "Record ACRA approval, SOAS screening approval and a selected-service contract signed by both parties. Track unselected/unsigned items separately; do not assume all packages were taken."]} />
          </Branch>
        </Branches>
      </DocsReturnLoop>
    </Canvas>
    <p><a href="#identity-screening">{copy(lang, ["Detail identitas & screening →", "Identity & screening details →"])}</a> · <a href="#service-contracts">{copy(lang, ["Kontrak & billing →", "Contracts & billing →"])}</a></p>
  </Section>;
}

export function DocsV11Screening({ lang }: LangProps) {
  return <Section lang={lang} id="identity-screening" title={["Identitas, screening & pembaruan dokumen", "Identity, Screening & Document Renewal"]} time="00:11:27–00:20:25">
    <Canvas label="Identity and risk assessment v1.1">
      <Node lang={lang} kind="start" step={["Petakan seluruh pihak terkait", "Map All Relevant Parties"]} /><FlowArrow />
      <Branches>
        <Branch label="Individual"><Node lang={lang} step={["Identitas individu & bukti alamat", "Individual Identity & Address Evidence", "NRIC, passport atau dokumen FIN/pass sesuai orangnya; catat jenis, nomor dokumen dan pemiliknya.", "NRIC, passport or FIN/pass documents as applicable; record the type, document number and holder."]} /></Branch>
        <Branch label="Corporate"><Node lang={lang} step={["Entitas, UEN/registrasi & wakil yang ditunjuk", "Entity, UEN/Registration & Appointed Representative", "Ambil Business Profile/registrasi dan bukti otorisasi wakil; tautkan identitas individu wakil serta beneficial owner yang relevan. Dokumen asing mengikuti persyaratan verifikasi yang berlaku.", "Obtain business registration/profile and representative authority; link the individual's identity and relevant beneficial owners. Foreign evidence follows applicable verification requirements."]} /></Branch>
        <Branch label="Mixed"><Node lang={lang} step={["Jalankan kedua jalur untuk setiap pihak", "Apply Both Routes to Each Relevant Party", "Struktur campuran bukan salah satu pilihan eksklusif individual atau corporate. Kelengkapan dinilai per individu/entitas dan relasinya.", "A mixed structure is not an exclusive individual-or-corporate choice. Assess completeness for each person/entity and relationship."]} /></Branch>
      </Branches><FlowArrow />
      <DocsReturnLoop fromId="screening-corrections" toId="screening-run" label={copy(lang, ["Lengkapi koreksi dan kembali ke screening untuk penilaian ulang SOAS.", "Complete corrections and return to screening for SOAS reassessment."])}>
      <Steps lang={lang} startId="screening-run" steps={[
        ["Isi template KYC/KYB dan lakukan worldwide screening", "Complete KYC/KYB Templates & Worldwide Screening", "Gunakan template/proses yang sudah tersedia; koordinasikan dengan David/tim compliance. Simpan hasil dan evidence; provider serta aturan penilaiannya belum ditetapkan oleh transkrip.", "Use existing templates/processes; coordinate with David/compliance. Retain results and evidence; the transcript does not specify the provider or assessment rules."],
        ["Risk assessment: low / medium / high", "Risk Assessment: Low / Medium / High", "Catat level, alasan, PIC/reviewer dan tindak lanjut yang diwajibkan kebijakan SOAS. Level risiko bukan approval otomatis.", "Record the level, rationale, PIC/reviewer and follow-up required by SOAS policy. Risk level is not automatic approval."],
      ]} /><FlowArrow />
      <Node lang={lang} kind="decision" step={["Keputusan SOAS?", "SOAS Decision?"]} /><FlowArrow plain />
      <Branches>
        <Branch label={copy(lang, ["Koreksi / info kurang", "Correction / Missing Information"])}><Node lang={lang} id="screening-corrections" step={["Minta kekurangan lalu ulangi pemeriksaan", "Request Missing Items & Reassess", "Tetap pending; kembali ke template/screening terdampak dan reviewer. Jangan lanjut hanya karena klien membalas.", "Remain pending; return to affected templates/screening and review. A client reply alone does not clear screening."]} /></Branch>
        <Branch label={copy(lang, ["Penolakan final", "Final Rejection"])}><Node lang={lang} kind="end" step={["Hentikan jalur & catat alasan", "End the Route & Record Reasons"]} /></Branch>
        <Branch label={copy(lang, ["Disetujui", "Approved"])}><Node lang={lang} kind="store" step={["Simpan approval & lanjut ke flow asal", "Retain Approval & Return to Originating Flow", "Incorporation/onboarding meneruskan proses setelah clearance; evidence dan keputusan tetap terhubung ke klien dan pihak yang diperiksa.", "Incorporation/onboarding continues after clearance; link evidence and decisions to the client and screened parties."]} /></Branch>
      </Branches>
      </DocsReturnLoop>
    </Canvas>
    <h3>{copy(lang, ["Loop expiry passport & kartu pass/FIN", "Passport & Pass/FIN Card Expiry Loop"])}</h3>
    <Canvas label="Identity document expiry v1.1"><DocsReturnLoop fromId="identity-renewal-complete" toId="identity-expiry-record" label={copy(lang, ["Setelah pengganti diverifikasi, pantau tanggal expiry yang baru.", "After verifying the replacement, monitor its new expiry date."])}><Steps lang={lang} startId="identity-expiry-record" steps={[
      ["Simpan expiry per dokumen", "Store Expiry per Document", "Catat passport expiry dan expiry kartu pass/FIN bila ada; bedakan nomor FIN dengan masa berlaku kartunya. Jangan memberi expiry NRIC secara otomatis.", "Record passport and pass/FIN-card expiry where applicable; distinguish the FIN number from card validity. Do not automatically assign NRIC expiry."],
      ["Pantau tanggal & kirim permintaan pembaruan", "Monitor Dates & Request Renewal", "Alert sebelum/saat expiry menurut jadwal SOAS yang dikonfirmasi, melalui Comm Hub dengan PIC. Semua individu termasuk wakil corporate masuk monitoring; interval reminder belum diputuskan di meeting.", "Alert before/at expiry using the confirmed SOAS schedule, via Comm Hub with a PIC. Monitor all individuals including corporate representatives; the meeting does not fix reminder intervals."],
      ["Verifikasi dokumen baru & simpan histori", "Verify Replacement & Retain History", "Validasi pengganti, nilai kebutuhan screening ulang, perbarui expiry dan tutup permintaan hanya setelah diverifikasi. Dokumen lama tetap tercatat di histori; tanpa pengganti, tetap outstanding/escalation.", "Verify replacements, assess reassessment needs, update expiry and close only after verification. Retain prior-document history; without a replacement, keep outstanding/escalate."],
    ]} /><FlowArrow /><Node lang={lang} id="identity-renewal-complete" kind="store" step={["Kembali memantau expiry berikutnya", "Resume Monitoring the Next Expiry"]} /></DocsReturnLoop></Canvas>
  </Section>;
}

export function DocsV11Onboarding({ lang }: LangProps) {
  return <Section lang={lang} id="onboarding" title={["Onboarding · perusahaan existing pindah CSP", "Onboarding · Existing Company Transfers CSP"]} time="00:35:48–00:41:31">
    <Canvas label="Onboarding v1.1"><Node lang={lang} kind="start" step={["Perusahaan existing meminta onboarding", "Existing Company Requests Onboarding"]} /><FlowArrow />
      <Steps lang={lang} steps={[
        ["Dapatkan Business Profile & identifikasi CSP lama", "Obtain Business Profile & Identify Previous CSP", "Klien menyediakan atau mengotorisasi pengambilan profile; catat provider sebelumnya dan kontak handover.", "The client supplies or authorises retrieval of the profile; record the former provider and handover contact."],
        ["KYC/KYB/CDD & keputusan SOAS", "KYC/KYB/CDD & SOAS Decision", "Ikuti flow Identitas & Screening, termasuk wakil corporate dan risk assessment. Koreksi → pemeriksaan ulang; penolakan final → hentikan; hanya approval SOAS yang melanjutkan.", "Follow Identity & Screening, including corporate representatives and risk assessment. Corrections → reassessment; final rejection → stop; only SOAS approval proceeds."],
        ["Pilih layanan, review & tanda tangan kontrak", "Select Services, Review & Sign Contract", "Klien dan SOAS menandatangani kontrak yang disepakati. Catat item belum dipilih/belum ditandatangani dan tanggal efektif appointment/layanan.", "The client and SOAS sign the agreed contract. Track unselected/unsigned items and effective appointment/service dates."],
        ["Minta handover berkas dari CSP sebelumnya", "Request Records from the Previous CSP", "Dengan otorisasi yang diperlukan, minta corporate secretarial files, registers, minutes/resolutions dan dokumen relevan sesuai checklist SOAS. Berkas fisik maupun digital harus dicatat.", "With required authority, request corporate secretarial files, registers, minutes/resolutions and relevant records using the SOAS checklist. Record both physical and digital files."],
        ["Rekonsiliasi berkas diterima & kekurangan", "Reconcile Received & Missing Records", "Catat daftar diminta/diterima/diverifikasi, lokasi penyimpanan dan PIC. Kekurangan dikembalikan untuk follow-up CSP/klien; jangan menyatakan handover lengkap sebelum diverifikasi.", "Track requested/received/verified records, storage location and PIC. Follow up missing items with the CSP/client; do not declare handover complete before verification."],
        ["Tinjau perubahan akibat appointment/onboarding", "Review Appointment/Onboarding Changes", "Identifikasi perubahan company secretary, appointment lain, alamat atau particulars. Tindak lanjuti filing ACRA yang relevan; simpan submission/result dan Business Profile terbaru. Bukan aturan bahwa setiap transfer otomatis wajib mendaftarkan SOAS sebagai CSP baru.", "Identify company-secretary/other appointments, address or particulars changes. Follow up relevant ACRA filings; retain submissions/results and the updated Business Profile. Do not assume every transfer automatically requires registering SOAS as the new CSP."],
      ]} /><FlowArrow />
      <Node lang={lang} kind="end" step={["Aktifkan klien & track pekerjaan outstanding", "Activate Client & Track Outstanding Work", "Aktifkan sesuai clearance, kontrak dan tanggal efektif. Handover serta perubahan filing punya status/PIC sendiri; outstanding tidak otomatis dianggap selesai saat klien diaktifkan.", "Activate according to clearance, contract and effective dates. Handover and filing changes have their own statuses/PICs; client activation does not mark outstanding work complete."]} />
    </Canvas>
    <p><a href="#identity-screening">{copy(lang, ["Jalur koreksi / penolakan screening →", "Screening correction / rejection routes →"])}</a></p>
  </Section>;
}

export function DocsV11Contracts({ lang }: LangProps) {
  const rows: [Copy, Copy, Copy, Copy][] = [
    [["Corporate Secretarial", "Corporate Secretarial"], ["Paket / item pilihan", "Selected Package / Item"], ["Tahunan", "Annual"], ["Jadwal retainer/renewal sesuai kontrak; track recurring invoice dan collection.", "Contract retainer/renewal schedule; track recurring invoices and collection."]],
    [["ART", "ART"], ["Paket / item pilihan", "Selected Package / Item"], ["Bulanan / kuartalan / tahunan", "Monthly / Quarterly / Annual"], ["Periode pekerjaan, deliverables dan tarif mengikuti kontrak; invoice terkait draf/deliverable sesuai kesepakatan.", "Work periods, deliverables and rates follow the contract; invoice the relevant draft/deliverable as agreed."]],
    [["Ad hoc", "Ad Hoc"], ["Scope di luar kontrak", "Out-of-Contract Scope"], ["Per pesanan", "Per Order"], ["Quotation/otorisasi tersendiri, invoice dan collection terpisah.", "Separate quotation/authority, invoice and collection."]],
  ];
  return <Section lang={lang} id="service-contracts" title={["Layanan, kontrak & frekuensi billing", "Services, Contracts & Billing Frequency"]} time="00:31:43–00:35:40; 00:52:28–00:57:43">
    <Canvas label="Service contract v1.1"><Steps lang={lang} steps={[
      ["Catat layanan ditawarkan & pilihan klien", "Record Offered Services & Client Selection", "Pisahkan Corporate Secretarial, ART dan ad hoc; tandai offered/not selected, selected/unsigned, signed/active dan terminated. Layanan ART yang belum dipilih tetap punya follow-up PIC.", "Separate Corporate Secretarial, ART and ad hoc; track offered/not selected, selected/unsigned, signed/active and terminated. Unselected ART services retain a follow-up PIC."],
      ["Definisikan scope, periode, fee & deliverables", "Define Scope, Period, Fees & Deliverables", "Simpan paket atau item, frekuensi, tanggal efektif, penanggung jawab, kewajiban yang dicakup, jadwal invoice dan syarat pembayaran. Kontrak bukan sekadar label aktif.", "Retain package or item, frequency, effective dates, owner, covered obligations, invoice schedule and payment terms. A contract is more than an active label."],
      ["Review dan tanda tangan kedua pihak", "Review & Sign by Both Parties", "Klien menandatangani; SOAS review/countersign. Simpan versi serta bukti penanda tangan. Kontrak belum lengkap tetap outstanding dan diingatkan; scope berubah → kontrak/versi baru yang disetujui.", "The client signs; SOAS reviews/countersigns. Retain the version and signatory evidence. Incomplete contracts stay outstanding with reminders; scope changes → a newly agreed contract/version."],
      ["Bentuk pekerjaan dan billing dari kontrak aktif", "Create Work & Billing from the Active Contract", "Tautkan pekerjaan dan invoice ke item kontrak/periode; jangan menganggap kepatuhan tertentu otomatis termasuk semua paket. Pantau deliverable, status filing dan collection masing-masing.", "Link work and invoices to contract items/periods; do not assume every package covers every obligation. Track deliverables, filing and collection separately."],
    ]} /></Canvas>
    <div className="docs-table-wrap"><table className="docs-table docs-deadline-table"><thead><tr>{[copy(lang, ["Layanan", "Service"]), copy(lang, ["Pilihan", "Selection"]), copy(lang, ["Periode", "Frequency"]), copy(lang, ["Billing & kontrol", "Billing & Controls"])].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{copy(lang, cell)}</th> : <td key={j}>{copy(lang, cell)}</td>)}</tr>)}</tbody></table></div>
    <p>{copy(lang, ["Flow ART berkala: transaksi & dokumen → pembukuan bulanan/kuartalan → GST bila termasuk layanan dan berlaku → annual accounts/report/tax. Pekerjaan berkala dan tahunan tetap terhubung ke tahun buku serta kontrak yang sama; cakupan GST dan frekuensi filing mengikuti kondisi klien, bukan otomatis karena memilih paket.", "Recurring ART flow: transactions & evidence → monthly/quarterly bookkeeping → GST where covered and applicable → annual accounts/report/tax. Recurring and annual work remain linked to the financial year and contract; GST scope and filing frequency follow the client's circumstances, not merely a package choice."])}</p>
    <p>{copy(lang, ["Approval biasa dan formal e-sign dibedakan menurut dokumen; keduanya menyimpan siapa, kapan, versi dan hasil. Dokumen yang memerlukan tanda tangan formal tetap melalui E-portal dengan evidence, bukan digantikan balasan chat.", "Distinguish ordinary approval from formal e-sign according to the document; retain who, when, version and outcome for both. Documents requiring formal signatures use E-Portal evidence rather than a chat reply."])}</p>
    <p><a href="#monthly-reports">{copy(lang, ["Laporan deliverables, billing & collection A–F →", "Deliverable, billing & collection reports A–F →"])}</a></p>
  </Section>;
}

export function DocsV11LeadReport({ lang }: LangProps) {
  const columns: Copy[] = [["Periode", "Period"], ["WIP awal", "Opening WIP"], ["Masuk WIP", "Incoming WIP"], ["Incorporated", "Incorporated"], ["Onboarded", "Onboarded"], ["Rejected", "Rejected"], ["WIP akhir", "Closing WIP"]];
  return <Section lang={lang} id="lead-reports" title={["Laporan lead & rekonsiliasi WIP", "Lead Reporting & WIP Reconciliation"]} time="00:42:01–00:44:33">
    <p>{copy(lang, ["Gunakan histori perpindahan pada periode yang dipilih, bukan sekadar menghitung status terkini. WIP mencakup lead yang masih diproses SOAS–klien; data/dokumen/pembayaran/kontrak yang belum selesai tetap ditindaklanjuti.", "Use movement history within the selected period rather than counting current statuses alone. WIP includes leads still being processed between SOAS and the client; follow up outstanding data/documents/payment/contracts."])}</p>
    <div className="docs-policy-note"><strong>{copy(lang, ["Saldo awal WIP + masuk WIP − keluar WIP = saldo akhir WIP", "Opening WIP + Incoming WIP − Outgoing WIP = Closing WIP"])}</strong><p>{copy(lang, ["Keluar dipisahkan menjadi incorporated, onboarded dan rejected. Saldo akhir menjadi saldo awal periode berikutnya. Total enquiry baru dan pending respons boleh ditampilkan terpisah; jangan dihitung dua kali sebagai masuk WIP.", "Split outgoing movements into incorporated, onboarded and rejected. Closing becomes the next period's opening. Show new enquiries and pending responses separately; do not double count them as incoming WIP."])}</p></div>
    <div className="docs-table-wrap"><table className="docs-table"><caption>{copy(lang, ["Ilustrasi rekonsiliasi, bukan data klien nyata", "Illustrative Reconciliation, Not Actual Client Data"])}</caption><thead><tr>{columns.map(c => <th scope="col" key={c[1]}>{copy(lang, c)}</th>)}</tr></thead><tbody><tr><th scope="row">2026-10</th><td>12</td><td>20</td><td>8</td><td>5</td><td>3</td><td>16</td></tr><tr><th scope="row">2026-11</th><td>16</td><td>10</td><td>4</td><td>3</td><td>2</td><td>17</td></tr></tbody></table></div>
    <Canvas label="WIP movement reporting v1.1"><Steps lang={lang} steps={[
      ["Catat event masuk/keluar beserta tanggal efektif", "Record Incoming/Outgoing Events & Effective Dates", "Simpan lead ID, status asal/tujuan, alasan, waktu dan PIC. Definisi usulan: masuk WIP saat diterima untuk diproses; hasil sukses mengikuti syarat flow dan kontrak, bukan saat draft dibuka.", "Retain lead ID, old/new status, reason, time and PIC. Proposed definition: enter WIP when accepted for processing; successful outcomes follow workflow/contract conditions, not opening a draft."],
      ["Tutup periode & rekonsiliasi pergerakan", "Close the Period & Reconcile Movements", "Ambil saldo awal dan semua event dalam periode. Hitung total baru, incorporated, onboarded, rejected, pending respons dan WIP sesuai definisi masing-masing.", "Use opening balances and all events in the period. Calculate new enquiries, incorporated, onboarded, rejected, pending responses and WIP under their respective definitions."],
      ["Periksa selisih, buka detail & carry forward", "Investigate Differences, Drill Down & Carry Forward", "Setiap total dapat ditelusuri ke lead/event. Reopen/koreksi periode harus tercatat sebagai movement/adjustment yang terpisah; tidak mengubah histori diam-diam.", "Trace every total to its leads/events. Record reopenings/period corrections as separate movements/adjustments; never silently rewrite history."],
    ]} /></Canvas>
  </Section>;
}

export function DocsV11RecordModel({ lang }: LangProps) {
  return <div className="docs-policy-note docs-record-model"><strong>{copy(lang, ["Model record yang menghubungkan proses", "Records Connecting the Process"])}</strong><p>{copy(lang, ["Lead & movement history → client record → pihak/identitas/expiry → kontrak & item layanan → task per FY/periode → komunikasi/evidence → submission/deliverable → invoice/payment/collection. Gunakan relasi ID, PIC, tanggal efektif dan histori versi; status hubungan klien, kesiapan dokumen, status pekerjaan, filing dan pembayaran adalah dimensi yang berbeda.", "Lead & movement history → client record → parties/identity/expiry → contract & service items → FY/period tasks → communication/evidence → submissions/deliverables → invoices/payments/collection. Use linked IDs, PICs, effective dates and version history; client relationship, document readiness, work, filing and payment statuses are distinct dimensions."])}</p><p>{copy(lang, ["Ini rancangan hubungan data untuk flow 1.1. Handbook tidak membuat database atau integrasi CRM baru. Konversi lead dan handover yang belum selesai harus tetap bisa ditelusuri dalam laporan.", "This is the data-relationship design for flow 1.1. The handbook does not create a new database or CRM integration. Lead conversion and incomplete handovers must remain traceable in reports."])}</p></div>;
}

export function DocsV11OpenNotes({ lang }: LangProps) {
  return <div className="docs-policy-note"><strong>{copy(lang, ["Keputusan meeting yang masih perlu dikonfirmasi", "Meeting Decisions Still Requiring Confirmation"])}</strong><ul>
    <li>{copy(lang, ["Target 24 jam: usulan interpretasi konteks respons segera; konfirmasi jam kerja, kanal dan eskalasi. Ucapan transkrip tentang minimum/maksimum tidak konsisten.", "24-hour target: proposed interpretation of the prompt-response context; confirm working hours, channels and escalation. Transcript wording on minimum/maximum is inconsistent."])}</li>
    <li>{copy(lang, ["David/tim compliance: template KYC/KYB, screening provider, kriteria risiko dan reviewer; interval alert expiry serta aturan verifikasi pengganti belum ditentukan.", "David/compliance: KYC/KYB templates, screening provider, risk criteria and reviewer; expiry-alert intervals and replacement verification rules are not yet specified."])}</li>
    <li>{copy(lang, ["Tim secretarial: isi/tahap sah bundel First Director Meeting dan signatures, checklist handover, serta perubahan appointment/particulars yang perlu diajukan ke ACRA.", "Secretarial team: contents/appropriate stage of First Director Meeting bundles and signatures, handover checklist and appointment/particulars changes requiring ACRA follow-up."])}</li>
    <li>{copy(lang, ["SOAS: matriks ART monthly/quarterly/annual, GST sesuai cakupan, fee, tanggal invoice/pembayaran, syarat aktivasi, serta definisi event masuk/keluar WIP.", "SOAS: monthly/quarterly/annual ART matrix, applicable GST scope, fees, invoice/payment dates, activation requirements and WIP incoming/outgoing event definitions."])}</li>
  </ul></div>;
}
