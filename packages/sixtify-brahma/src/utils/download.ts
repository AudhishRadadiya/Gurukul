import { saveAs } from "file-saver";

export const downloadFile = async (url: string, baseFileName: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    return;
  }

  const blob = await response.blob();

  saveAs(blob, baseFileName);
};
