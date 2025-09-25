export const useFileDownload = () => {
  const downloadFile = async (fileUrl: string, fileName: string) => {
    const response = await fetch(fileUrl);

    const blobData = await response.blob();

    const blob = new Blob([blobData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    link.click();
  };

  return { downloadFile };
};
