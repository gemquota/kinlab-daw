import { create } from "zustand";
import { persist } from "zustand/middleware";

type ExportFormat = "png" | "svg" | "csv" | "json";

interface ExportStore {
  format: ExportFormat;
  imageWidth: number;
  imageHeight: number;
  imageScale: number;
  transparentBackground: boolean;
  includeGrid: boolean;
  includeLegend: boolean;
  csvPrecision: number;
  csvDelimiter: string;
  includeMetadata: boolean;
  svgStyle: "inline" | "external";

  setFormat: (format: ExportFormat) => void;
  setImageSize: (width: number, height: number) => void;
  setImageScale: (scale: number) => void;
  setTransparentBackground: (transparent: boolean) => void;
  setIncludeGrid: (include: boolean) => void;
  setIncludeLegend: (include: boolean) => void;
  setCsvPrecision: (precision: number) => void;
  setCsvDelimiter: (delimiter: string) => void;
  setIncludeMetadata: (include: boolean) => void;
  setSvgStyle: (style: "inline" | "external") => void;
}

export const useExportStore = create<ExportStore>()(
  persist(
    (set) => ({
      format: "png",
      imageWidth: 1920,
      imageHeight: 1080,
      imageScale: 2,
      transparentBackground: false,
      includeGrid: true,
      includeLegend: true,
      csvPrecision: 6,
      csvDelimiter: ",",
      includeMetadata: true,
      svgStyle: "inline",

      setFormat: (format) => set({ format }),
      setImageSize: (width, height) => set({ imageWidth: width, imageHeight: height }),
      setImageScale: (scale) => set({ imageScale: Math.max(1, Math.min(4, scale)) }),
      setTransparentBackground: (transparent) => set({ transparentBackground: transparent }),
      setIncludeGrid: (include) => set({ includeGrid: include }),
      setIncludeLegend: (include) => set({ includeLegend: include }),
      setCsvPrecision: (precision) => set({ csvPrecision: Math.max(0, Math.min(15, precision)) }),
      setCsvDelimiter: (delimiter) => set({ csvDelimiter: delimiter }),
      setIncludeMetadata: (include) => set({ includeMetadata: include }),
      setSvgStyle: (style) => set({ svgStyle: style }),
    }),
    { name: "kinlab-export" },
  ),
);
