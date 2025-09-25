import { ActionButtons } from "@codezee/sixtify-brahma";

import { useActionButton } from "@web/components/common/DataExport/hooks/useActionButton";
import type { FilType } from "@web/types/shared-types";

type DataExportProps = {
  onExport: (fileType: FilType) => void;
};

export const DataExport = ({ onExport }: DataExportProps) => {
  const { actionButtons } = useActionButton(onExport);

  return <ActionButtons buttons={actionButtons} />;
};
