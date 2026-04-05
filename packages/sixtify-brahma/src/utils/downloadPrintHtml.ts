import html2canvas from "html2canvas";

let isPrinting = false;

export const downloadPrintHtml = async (
  element: HTMLElement | null,
  action: "image" | "print",
  filename = "section"
) => {
  if (!element) {
    return;
  }

  const canvas = await html2canvas(element, { scale: 2 });

  const imgData = canvas.toDataURL("image/png");

  if (action === "image") {
    const link = document.createElement("a");

    link.href = imgData;
    link.download = `${filename}.png`;
    link.click();
  } else {
    if (isPrinting) {
      return;
    }
    isPrinting = true;

    const iframe = document.createElement("iframe");

    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;

    if (!doc) {
      isPrinting = false;

      return;
    }

    doc.body.innerHTML = "";
    doc.body.style.margin = "0";
    doc.body.style.display = "block";
    doc.body.style.alignItems = "center";

    const style = document.createElement("style");

    style.innerHTML = "@page { margin: 0; }";
    doc.head.appendChild(style);

    const img = new Image();

    img.src = imgData;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";

    img.onload = () => {
      doc.body.appendChild(img);

      const printWindow = iframe.contentWindow;

      if (!printWindow) {
        return;
      }

      const afterPrint = () => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        isPrinting = false;
        printWindow.removeEventListener("afterprint", afterPrint);
      };

      printWindow.addEventListener("afterprint", afterPrint);

      printWindow.focus();
      printWindow.print();
    };
  }
};
