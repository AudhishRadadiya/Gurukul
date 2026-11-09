import { useState } from "react";

import type { UseGetAddressBookPdfRequest } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookPdf";
import type { ExportModule } from "@web/constants/export";
import { ExportType } from "@web/constants/export";
import { useSendExportOtp } from "@web/hooks/useSendExportOtp";
import { onError } from "@web/utils/errors";

type UsePrintAddressBookDialogArgs = {
  exportModule: ExportModule;
  onPrint: (data: UseGetAddressBookPdfRequest) => void;
  onPrintSuccess?: () => void;
};

export function usePrintAddressBookDialog({
  exportModule,
  onPrint,
  onPrintSuccess,
}: UsePrintAddressBookDialogArgs) {
  const [showOtpForm, setShowOtpForm] = useState(false);

  const [otpError, setOtpError] = useState("");

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

  const resetPrintState = () => {
    setShowOtpForm(false);
    setOtpError("");
  };

  const handlePrintInit = () => {
    setShowOtpForm(false);
    setOtpError("");
  };

  const handleMaskSelect = () => {
    onPrint({
      is_masked: true,
    });

    onPrintSuccess?.();

    resetPrintState();
  };

  const handleOriginalSelect = () => {
    sendExportOtp({
      export_type: ExportType.PDF,
      module: exportModule,
    });
  };

  const handleOtpSubmit = (otpValues: { code: number | null }) => {
    setOtpError("");

    onPrint({
      code: otpValues.code,
      is_masked: false,
    });
  };

  return {
    handleMaskSelect,
    handleOriginalSelect,
    handleOtpSubmit,
    handlePrintInit,
    isPendingSendExportOtp,
    otpError,
    resetPrintState,
    showOtpForm,
  };
}
