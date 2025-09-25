export type SupportedFileType =
  | "image/png"
  | "image/jpeg"
  | "image/jpg"
  | "application/pdf"
  | "application/zip"
  | "application/msword"
  | "application/x-zip-compressed"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.ms-excel";

export const SUPPORTED_FILE_TYPES: SupportedFileType[] = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/zip",
  "application/msword",
  "application/x-zip-compressed",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export const isFileSizeValid = (file: File, maxSizeMB: number) => {
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;

  return file.size <= maxSizeInBytes;
};

export const isFileTypeValid = (file: File, fileTypes: SupportedFileType[]) => {
  return fileTypes.includes(file.type as SupportedFileType);
};

export function isImageDomainValid(url: string) {
  const parsedUrl = new URL(url);

  return parsedUrl.hostname === "sixtify.s3.amazonaws.com";
}
