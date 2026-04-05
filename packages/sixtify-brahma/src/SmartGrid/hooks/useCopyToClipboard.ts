import { useCallback, useEffect } from "react";
import type { OnAction } from "../../utils/types";

type UseCopyToClipboardArgs = {
  enabled: boolean;
  getCellSelectionData: () => string[][];
  hasSelection: boolean;
  triggerCopyFlash: OnAction;
};

export const useCopyToClipboard = ({
  enabled,
  getCellSelectionData,
  hasSelection,
  triggerCopyFlash,
}: UseCopyToClipboardArgs) => {
  const copyToClipboard = useCallback(
    async (data: string[][]) => {
      if (!data || data.length === 0) {
        return;
      }

      try {
        // Convert data to TSV format (Tab-Separated Values)
        // This is the format Excel expects for copying tabular data
        const tsvData = data
          .map((row) =>
            row
              .map((cell) => {
                // Escape cells containing tabs, newlines, or quotes
                const cellStr = String(cell ?? "");

                if (
                  cellStr.includes("\t") ||
                  cellStr.includes("\n") ||
                  // eslint-disable-next-line quotes
                  cellStr.includes('"')
                ) {
                  // Wrap in quotes and escape existing quotes
                  // eslint-disable-next-line quotes
                  return `"${cellStr.replace(/"/g, '""')}"`;
                }

                return cellStr;
              })
              .join("\t")
          )
          .join("\n");

        // Use the Clipboard API if available
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(tsvData);
          triggerCopyFlash(); // Trigger flash animation on successful copy
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");

          textArea.value = tsvData;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          // eslint-disable-next-line sonarjs/deprecation
          document.execCommand("copy");
          triggerCopyFlash(); // Trigger flash animation on successful copy

          document.body.removeChild(textArea);
        }
        // eslint-disable-next-line sonarjs/no-ignored-exceptions
      } catch {
        // Silently fail for clipboard operations
      }
    },
    [triggerCopyFlash]
  );

  const handleCopy = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !hasSelection) {
        return;
      }

      // Check for Ctrl+C (Windows/Linux) or Cmd+C (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        const data = getCellSelectionData();

        if (data.length > 0) {
          event.preventDefault();
          copyToClipboard(data);
        }
      }
    },
    [enabled, hasSelection, getCellSelectionData, copyToClipboard]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    document.addEventListener("keydown", handleCopy);

    return () => {
      document.removeEventListener("keydown", handleCopy);
    };
  }, [enabled, handleCopy]);

  return { copyToClipboard };
};
