import { type CellValue, type Row, type Worksheet, Workbook } from "exceljs";
import type { FieldValues } from "react-hook-form";
import * as XLSX from "xlsx";

type ExcelReaderOptions = Partial<{
  headerRowIndex: number;
  sheetIndex: number;
}>;

/**
 * Converts a File object to ArrayBuffer
 */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (!(event.target?.result instanceof ArrayBuffer)) {
          reject(new Error("Failed to read file as ArrayBuffer"));

          return;
        }
        resolve(event.target.result);
      };

      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsArrayBuffer(file);
    }
  });
};

/**
 * Extracts headers from the worksheet
 */
const extractHeaders = (
  worksheet: Worksheet,
  headerRowIndex: number
): string[] => {
  const headerRow = worksheet.getRow(headerRowIndex);

  if (!headerRow?.values) {
    throw new Error("Header row is undefined or empty");
  }

  return Array.isArray(headerRow.values)
    ? headerRow.values
        .slice(1)
        .map((header: CellValue) =>
          header instanceof Date ? header.toISOString() : String(header)
        )
    : [];
};

/**
 * Extracts data rows from the worksheet
 */
const extractRows = <T extends FieldValues>(
  worksheet: Worksheet,
  headers: (keyof T)[],
  headerRowIndex: number
): T[] => {
  const rows: T[] = [];

  worksheet.eachRow((row: Row, rowNumber: number) => {
    if (rowNumber <= headerRowIndex) {
      return;
    }

    const rowData: T = {} as T;

    headers.forEach((header, index) => {
      rowData[header] = row.getCell(index + 1).value as T[keyof T];
    });

    rows.push(rowData);
  });

  return rows;
};

export const readExcelFile = async <T extends FieldValues>(
  file: File,
  options: ExcelReaderOptions = {}
): Promise<{ rows: T[]; titles: string[] }> => {
  const { headerRowIndex = 1, sheetIndex = 0 } = options;

  const arrayBuffer = await readFileAsArrayBuffer(file);

  const workbook = new Workbook();

  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[sheetIndex];

  if (!worksheet) {
    throw new Error(`Sheet at index ${sheetIndex} not found`);
  }

  const headers = extractHeaders(worksheet, headerRowIndex);

  const rows: T[] = extractRows(worksheet, headers, headerRowIndex);

  return { rows, titles: headers };
};

export const readExcel = async <T extends FieldValues>(file: File) => {
  const data = await file.arrayBuffer();

  const workbook = XLSX.read(data, { type: "array" });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("No sheets found in Excel file.");
  }

  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }

  const rows: T[] = XLSX.utils.sheet_to_json<T>(worksheet);

  const titles = Object.keys(rows[0] ?? {});

  return { rows, titles };
};
