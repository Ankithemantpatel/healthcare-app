import { type FC } from "react";
import { sharedUiCopy, type PrescriptionRecord } from "shared";
import { useAppSelector } from "shared/redux/hooks";

const buildPrescriptionBlock = (record: PrescriptionRecord) => {
  const medicines = record.medicines
    .map((medicine) => `<li>${medicine}</li>`)
    .join("");

  return `
    <section class="record-card">
      <div class="record-header">
        <div>
          <div class="clinic-name">${sharedUiCopy.healthRecords.document.clinicName}</div>
          <div class="clinic-sub">${sharedUiCopy.healthRecords.document.clinicSub}</div>
        </div>
        <div class="record-meta-top">
          <div><strong>${sharedUiCopy.healthRecords.document.prescriptionIdLabel}:</strong> ${record.id}</div>
          <div><strong>${sharedUiCopy.healthRecords.document.dateLabel}:</strong> ${record.date}</div>
        </div>
      </div>
      <h1>${sharedUiCopy.healthRecords.document.title}</h1>
      <p><strong>${sharedUiCopy.healthRecords.document.consultantLabel}:</strong> ${record.doctor}</p>
      <p><strong>${sharedUiCopy.healthRecords.document.diagnosisLabel}:</strong> ${record.diagnosis}</p>
      <h2>${sharedUiCopy.healthRecords.document.prescribedMedicinesLabel}</h2>
      <ul>${medicines}</ul>
      <h2>${sharedUiCopy.healthRecords.document.clinicalNotesLabel}</h2>
      <p class="notes">${record.notes}</p>
      <div class="record-footer">
        <div class="signature">${sharedUiCopy.healthRecords.document.signaturePrefix} ${record.doctor}</div>
        <div class="stamp">${sharedUiCopy.healthRecords.document.stampText}</div>
      </div>
    </section>
  `;
};

const buildDocumentHtml = (records: PrescriptionRecord[]) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${sharedUiCopy.healthRecords.document.pageTitle}</title>
      <style>
        body { font-family: Inter, Arial, sans-serif; color: #0f172a; background: #e2e8f0; margin: 0; padding: 24px; }
        .record-card { background: white; border: 2px solid #0f766e; border-radius: 14px; overflow: hidden; margin: 0 auto 24px; max-width: 920px; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12); }
        .record-header { background: linear-gradient(90deg, #0f766e, #0369a1); color: #ecfeff; padding: 20px 24px; display: flex; justify-content: space-between; gap: 16px; }
        .clinic-name { font-size: 24px; font-weight: 800; }
        .clinic-sub { font-size: 12px; margin-top: 4px; opacity: 0.95; }
        .record-meta-top { font-size: 12px; line-height: 1.8; text-align: right; }
        h1 { margin: 20px 24px 8px; font-size: 24px; }
        h2 { margin: 20px 24px 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; color: #0f766e; }
        p { margin: 8px 24px; line-height: 1.7; }
        ul { margin: 8px 24px 0 44px; line-height: 1.8; }
        .notes { margin-bottom: 20px; }
        .record-footer { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin: 24px; }
        .signature { width: 240px; border-top: 1px solid #334155; padding-top: 6px; font-size: 12px; }
        .stamp { border: 1px dashed #0f766e; color: #0f766e; padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
      </style>
    </head>
    <body>
      ${records.map((record) => buildPrescriptionBlock(record)).join("")}
    </body>
  </html>
`;

const downloadHtmlDocument = (
  records: PrescriptionRecord[],
  fileName: string,
) => {
  const blob = new Blob([buildDocumentHtml(records)], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const HealthRecords: FC = () => {
  const records = useAppSelector((state) => state.healthRecords.items);
  const status = useAppSelector((state) => state.healthRecords.status);
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="px-4 pb-10 pt-32 text-slate-200">
        {sharedUiCopy.healthRecords.unauthenticatedMessage}
      </div>
    );
  }

  return (
    <main className="relative px-4 pb-10 pt-32">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="glass-panel p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">
                {sharedUiCopy.healthRecords.eyebrow}
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-white">
                {sharedUiCopy.healthRecords.title}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-200/90">
                {sharedUiCopy.healthRecords.description}
              </p>
            </div>
            {records.length > 0 ? (
              <button
                type="button"
                onClick={() =>
                  downloadHtmlDocument(
                    records,
                    `${sharedUiCopy.healthRecords.document.browserFilePrefix}-${user.id}.html`,
                  )
                }
                className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/20"
              >
                {sharedUiCopy.healthRecords.downloadAll}
              </button>
            ) : null}
          </div>
        </section>

        {status === "loading" ? (
          <section className="glass-panel p-6 text-slate-200">
            {sharedUiCopy.healthRecords.loading}
          </section>
        ) : null}

        {status !== "loading" && records.length === 0 ? (
          <section className="glass-panel p-6 text-slate-300">
            {sharedUiCopy.healthRecords.empty}
          </section>
        ) : null}

        <section className="grid gap-4">
          {records.map((record) => (
            <article key={record.id} className="glass-panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
                    {record.date}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {record.diagnosis}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {sharedUiCopy.healthRecords.consultantLabel}:{" "}
                    {record.doctor}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    downloadHtmlDocument(
                      [record],
                      `${sharedUiCopy.healthRecords.document.browserRecordPrefix}-${record.id}.html`,
                    )
                  }
                  className="rounded-lg border border-cyan-300/25 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/50 hover:bg-white/10"
                >
                  {sharedUiCopy.healthRecords.downloadOne}
                </button>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {sharedUiCopy.healthRecords.prescribedMedicines}
                  </p>
                  <ul className="mt-3 space-y-2 text-slate-200">
                    {record.medicines.map((medicine) => (
                      <li
                        key={`${record.id}-${medicine}`}
                        className="rounded-lg border border-cyan-300/15 bg-slate-950/40 px-3 py-2"
                      >
                        {medicine}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {sharedUiCopy.healthRecords.doctorNotes}
                  </p>
                  <div className="mt-3 rounded-xl border border-cyan-300/15 bg-slate-950/40 p-4 text-slate-200">
                    {record.notes}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default HealthRecords;
