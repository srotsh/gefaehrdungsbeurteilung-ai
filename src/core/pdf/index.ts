import "server-only";
import * as React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToStream as _renderToStream,
  renderToBuffer as _renderToBuffer,
} from "@react-pdf/renderer";

/**
 * @flow/pdf — Wiederverwendbare PDF-Primitives.
 *
 * Apps bringen ihre eigenen Document-Templates und nutzen diese Primitives
 * als Bausteine: LetterheadHeader, FooterWithPageNumbers, SignatureLines,
 * Watermark.
 */

export { Document, Page, View, Text, StyleSheet };

const baseStyles = StyleSheet.create({
  letterhead: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
  },
  letterheadLeft: { fontSize: 10, color: "#0f172a", lineHeight: 1.3 },
  letterheadRight: { fontSize: 9, color: "#64748b", textAlign: "right" },
  footer: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 30,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: "#cbd5e1",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#94a3b8",
  },
  signatures: {
    marginTop: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
  },
  sigBlock: {
    flex: 1,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#0f172a",
    fontSize: 9,
    color: "#475569",
  },
  watermark: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 60,
    color: "#fda4af",
    opacity: 0.18,
    transform: "rotate(-30deg)",
  },
});

export interface LetterheadProps {
  firmName: string;
  firmAddress?: string;
  firmContact?: string;
  documentTitle: string;
  documentSubtitle?: string;
  date?: string;
}

export function LetterheadHeader(props: LetterheadProps) {
  return React.createElement(
    View,
    { style: baseStyles.letterhead },
    React.createElement(
      View,
      { style: baseStyles.letterheadLeft },
      React.createElement(Text, { style: { fontWeight: "bold" } }, props.firmName),
      props.firmAddress
        ? React.createElement(Text, null, props.firmAddress)
        : null,
      props.firmContact
        ? React.createElement(Text, null, props.firmContact)
        : null
    ),
    React.createElement(
      View,
      { style: baseStyles.letterheadRight },
      React.createElement(Text, { style: { fontSize: 11, color: "#0f172a", fontWeight: "bold" } }, props.documentTitle),
      props.documentSubtitle
        ? React.createElement(Text, null, props.documentSubtitle)
        : null,
      props.date ? React.createElement(Text, null, props.date) : null
    )
  );
}

export interface FooterProps {
  appName?: string;
  pageNumber?: number;
  totalPages?: number;
  customNote?: string;
}

export function FooterWithPageNumbers(props: FooterProps) {
  return React.createElement(
    View,
    { style: baseStyles.footer, fixed: true },
    React.createElement(
      Text,
      null,
      props.customNote ?? `Erstellt mit ${props.appName ?? "Flow"}`
    ),
    React.createElement(
      Text,
      { render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
          `Seite ${pageNumber} / ${totalPages}` }
    )
  );
}

export interface SignatureSlotProps {
  label: string;
  name?: string;
}

export function SignatureLines(props: { left: SignatureSlotProps; right: SignatureSlotProps }) {
  return React.createElement(
    View,
    { style: baseStyles.signatures },
    React.createElement(
      View,
      { style: baseStyles.sigBlock },
      React.createElement(Text, null, `${props.left.label}${props.left.name ? ` (${props.left.name})` : ""}`)
    ),
    React.createElement(
      View,
      { style: baseStyles.sigBlock },
      React.createElement(Text, null, `${props.right.label}${props.right.name ? ` (${props.right.name})` : ""}`)
    )
  );
}

export interface WatermarkProps {
  text?: string;
}

export function Watermark(props: WatermarkProps) {
  return React.createElement(
    View,
    { style: baseStyles.watermark, fixed: true },
    React.createElement(Text, null, props.text ?? "ENTWURF")
  );
}

/**
 * Render-Helpers — Apps wrappen ihre Document-Komponenten:
 * ```ts
 * const buffer = await renderToBuffer(<MyDocument data={...} />);
 * ```
 */
export const renderToBuffer = _renderToBuffer;
export const renderToStream = _renderToStream;
