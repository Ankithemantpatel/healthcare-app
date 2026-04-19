import React from "react";
import {
  ActivityIndicator,
  Alert,
  NativeModules,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import { sharedUiCopy, type PrescriptionRecord } from "shared";
import type { SharedStyles } from "./types";

export const HealthRecordsScreenView = ({
  records,
  status,
  styles,
}: {
  records: PrescriptionRecord[];
  status: string;
  styles: SharedStyles;
}) => {
  const buildPrescriptionBlock = (record: PrescriptionRecord) => {
    const medicines = record.medicines
      .map((medicine) => `<li>${medicine}</li>`)
      .join("");

    return `
      <div class="letterhead">
        <div class="letterhead-top">
          <div class="hospital-name">${sharedUiCopy.healthRecords.document.clinicName}</div>
          <div class="hospital-sub">${sharedUiCopy.healthRecords.document.clinicSub}</div>
        </div>
        <div class="doc-row">
          <div><strong>${sharedUiCopy.healthRecords.document.prescriptionIdLabel}:</strong> ${record.id}</div>
          <div><strong>${sharedUiCopy.healthRecords.document.dateLabel}:</strong> ${record.date}</div>
        </div>
        <div class="title">${sharedUiCopy.healthRecords.document.title}</div>
        <div class="meta"><strong>${sharedUiCopy.healthRecords.document.consultantLabel}:</strong> ${record.doctor}</div>
        <div class="meta"><strong>${sharedUiCopy.healthRecords.document.diagnosisLabel}:</strong> ${record.diagnosis}</div>
        <div class="section">${sharedUiCopy.healthRecords.document.prescribedMedicinesLabel}</div>
        <ul>${medicines}</ul>
        <div class="section">${sharedUiCopy.healthRecords.document.clinicalNotesLabel}</div>
        <div class="notes">${record.notes}</div>
        <div class="footer">
          <div class="signature-line">${sharedUiCopy.healthRecords.document.signaturePrefix} ${record.doctor}</div>
          <div class="stamp">${sharedUiCopy.healthRecords.document.stampText}</div>
        </div>
      </div>
    `;
  };

  const wrapPrescriptionHtml = (content: string) => {
    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${sharedUiCopy.healthRecords.document.pageTitle}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; color: #0f172a; padding: 28px; }
            .letterhead { border: 2px solid #0f766e; border-radius: 10px; overflow: hidden; }
            .letterhead-top { background: linear-gradient(90deg, #0f766e, #0369a1); color: #ecfeff; padding: 18px 20px; }
            .hospital-name { font-size: 24px; font-weight: 800; letter-spacing: 0.4px; }
            .hospital-sub { font-size: 12px; opacity: 0.95; margin-top: 4px; }
            .doc-row { display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding: 14px 20px; font-size: 12px; }
            .title { font-size: 19px; font-weight: 800; margin: 18px 20px 6px; color: #0f172a; }
            .meta { margin: 0 20px 8px; font-size: 13px; line-height: 1.6; }
            .section { margin: 16px 20px 0; font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; color: #0f766e; font-weight: 700; }
            ul { margin: 8px 20px 0 40px; line-height: 1.6; }
            .notes { margin: 8px 20px 0; line-height: 1.6; }
            .footer { margin: 24px 20px 18px; display: flex; justify-content: space-between; align-items: flex-end; }
            .signature-line { width: 220px; border-top: 1px solid #334155; padding-top: 6px; font-size: 12px; }
            .stamp { border: 1px dashed #0f766e; color: #0f766e; padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
  };

  const buildPrescriptionHtml = (record: PrescriptionRecord) => {
    return wrapPrescriptionHtml(buildPrescriptionBlock(record));
  };

  const buildMergedHtml = (allRecords: PrescriptionRecord[]) => {
    const blocks = allRecords.map((record) => buildPrescriptionBlock(record));
    return wrapPrescriptionHtml(
      blocks
        .map(
          (block, index) =>
            `<div style="page-break-after:${index < blocks.length - 1 ? "always" : "auto"};">${block}</div>`,
        )
        .join(""),
    );
  };

  const convertHtmlToPdf = async (html: string, fileName: string) => {
    const htmlToPdf = NativeModules.HtmlToPdf as
      | {
          convert: (options: {
            html: string;
            fileName: string;
            directory: string;
            base64: boolean;
          }) => Promise<{ filePath?: string }>;
        }
      | undefined;

    if (!htmlToPdf || typeof htmlToPdf.convert !== "function") {
      throw new Error("Native HtmlToPdf module is not available");
    }

    return htmlToPdf.convert({
      html,
      fileName,
      directory: "Documents",
      base64: false,
    });
  };

  const sharePdf = async (filePath: string) => {
    const fileUrl = filePath.startsWith("file://")
      ? filePath
      : `file://${filePath}`;

    await Share.share({
      url: fileUrl,
      title: sharedUiCopy.healthRecords.shareTitle,
    });
  };

  const handleDownloadRecord = async (record: PrescriptionRecord) => {
    try {
      const file = await convertHtmlToPdf(
        buildPrescriptionHtml(record),
        `${sharedUiCopy.healthRecords.document.singleFilePrefix}-${record.id}`,
      );
      if (!file.filePath) {
        throw new Error("No output path");
      }
      await sharePdf(file.filePath);
    } catch (error) {
      Alert.alert(
        sharedUiCopy.healthRecords.exportFailureTitle,
        `${sharedUiCopy.healthRecords.exportSingleFailurePrefix} ${String(error)}`,
      );
    }
  };

  const handleDownloadAll = async () => {
    if (records.length === 0) {
      return;
    }
    try {
      const file = await convertHtmlToPdf(
        buildMergedHtml(records),
        `${sharedUiCopy.healthRecords.document.allFilePrefix}-${Date.now()}`,
      );
      if (!file.filePath) {
        throw new Error("No output path");
      }
      await sharePdf(file.filePath);
    } catch (error) {
      Alert.alert(
        sharedUiCopy.healthRecords.exportFailureTitle,
        `${sharedUiCopy.healthRecords.exportAllFailurePrefix} ${String(error)}`,
      );
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.panelHeader}>
        <Text style={styles.sectionTitle}>
          {sharedUiCopy.healthRecords.title}
        </Text>
        <Text style={styles.sectionCopy}>
          {sharedUiCopy.healthRecords.description}
        </Text>
      </View>
      {records.length > 0 ? (
        <Pressable onPress={handleDownloadAll} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            {sharedUiCopy.healthRecords.downloadAll}
          </Text>
        </Pressable>
      ) : null}
      {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
      {records.length === 0 && status !== "loading" ? (
        <View style={styles.panel}>
          <Text style={styles.sectionCopy}>
            {sharedUiCopy.healthRecords.empty}
          </Text>
        </View>
      ) : null}
      {records.map((record) => (
        <View key={record.id} style={styles.panel}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionHeadline}>{record.diagnosis}</Text>
            <Pressable onPress={() => handleDownloadRecord(record)}>
              <Text style={styles.linkText}>
                {sharedUiCopy.healthRecords.downloadOne}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.sectionCopy}>
            {sharedUiCopy.healthRecords.consultantLabel}: {record.doctor} •{" "}
            {record.date}
          </Text>
          <Text style={styles.fieldLabel}>
            {sharedUiCopy.healthRecords.prescribedMedicines}
          </Text>
          {record.medicines.map((medicine) => (
            <Text key={`${record.id}-${medicine}`} style={styles.sectionCopy}>
              • {medicine}
            </Text>
          ))}
          <Text style={styles.fieldLabel}>
            {sharedUiCopy.healthRecords.doctorNotes}
          </Text>
          <Text style={styles.sectionCopy}>{record.notes}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
