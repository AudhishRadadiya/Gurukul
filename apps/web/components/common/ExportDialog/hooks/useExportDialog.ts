import type { FilterModel } from "ag-grid-community";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import type { ExportModule } from "@web/constants/export";
import { ExportType } from "@web/constants/export";
import { useSendExportOtp } from "@web/hooks/useSendExportOtp";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

export type PendingExportData = {
  body: {
    endRow: number;
    externalFilter: FieldValues;
    filterModel: FilterModel;
    startRow: number;
  };
  fileType: FilType;
};

type UseExportDialogOptions = {
  exportModule: ExportModule;
  onExport: (data: { body: GetListArgsAg2; fileType: FilType }) => void;
  onExportSuccess?: () => void;
};

export function useExportDialog({
  exportModule,
  onExport,
  onExportSuccess,
}: UseExportDialogOptions) {
  const [showOtpForm, setShowOtpForm] = useState(false);

  const [otpError, setOtpError] = useState("");

  const [pendingExportData, setPendingExportData] =
    useState<PendingExportData | null>(null);

  const { isPending: isPendingSendExportOtp, mutate: sendExportOtp } =
    useSendExportOtp({
      options: {
        onError: (error) => {
          onError(error);
          setOtpError(error.response?.data?.message || "Failed to send OTP");
        },
        onSuccess: () => {
          setShowOtpForm(true);
          setOtpError("");
        },
      },
    });

  const resetExportState = () => {
    setShowOtpForm(false);
    setPendingExportData(null);
    setOtpError("");
  };

  const handleExport = (fileType: FilType, exportBody: GetListArgsAg2) => {
    setPendingExportData({
      body: exportBody as PendingExportData["body"],
      fileType,
    });
    setShowOtpForm(false);
    setOtpError("");
  };

  const handleMaskSelect = () => {
    if (!pendingExportData) {
      return;
    }

    onExport({
      ...pendingExportData,
      body: {
        ...pendingExportData.body,
        externalFilter: {
          ...pendingExportData.body.externalFilter,
          is_masked: true,
        },
      },
    });

    onExportSuccess?.();

    resetExportState();
  };

  const handleOriginalSelect = () => {
    if (!pendingExportData) {
      return;
    }

    const exportType =
      pendingExportData.fileType === "excel"
        ? ExportType.EXCEL
        : ExportType.PDF;

    sendExportOtp({
      export_type: exportType,
      module: exportModule,
    });
  };

  const handleOtpSubmit = (otpValues: { code: number | null }) => {
    if (!pendingExportData) {
      return;
    }

    setOtpError("");

    onExport({
      ...pendingExportData,
      body: {
        ...pendingExportData.body,
        externalFilter: {
          ...pendingExportData.body.externalFilter,
          code: otpValues.code,
          is_masked: false,
        },
      },
    });
  };

  return {
    handleExport,
    handleMaskSelect,
    handleOriginalSelect,
    handleOtpSubmit,
    isPendingSendExportOtp,
    otpError,
    pendingExportData,
    resetExportState,
    showOtpForm,
  };
}
