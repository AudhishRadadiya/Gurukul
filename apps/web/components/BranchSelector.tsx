import { Autocomplete } from "@codezee/sixtify-brahma";
import _first from "lodash/first";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { useGetBranchOptions } from "@web/components/common/Autocomplete/hooks/useGetBranchOptions";
import { useBranch } from "@web/context/BranchContext";

type BranchFormValues = {
  branchId: string;
};

type BranchSelectorProps = {
  onBranchChange?: (branchIds: string) => void;
};

export const BranchSelector = ({ onBranchChange }: BranchSelectorProps) => {
  const { branchIds, setBranchIds } = useBranch();

  const { data: branchOptions, isLoading } = useGetBranchOptions({
    isUserWise: true,
  });

  const { control, setValue, watch } = useForm<BranchFormValues>({
    defaultValues: {
      branchId: branchIds || "",
    },
  });

  const watchedBranchId = watch("branchId");

  useMemo(() => {
    const hasOptions = branchOptions && branchOptions.length > 0;

    if (hasOptions) {
      const hasNoSelection = !watchedBranchId || watchedBranchId.length === 0;

      // If we have saved branchIds in context, use it
      if (branchIds && branchIds.length > 0 && hasNoSelection) {
        // Check if the saved branchId exists in options
        const savedBranchExists = branchOptions.some(
          (option) => option.value === branchIds
        );

        if (savedBranchExists) {
          setValue("branchId", branchIds);

          return;
        }
      }

      // If no selection, select first branch
      if (hasNoSelection) {
        const firstBranchValue = _first(branchOptions);

        if (firstBranchValue) {
          setValue("branchId", firstBranchValue.value);
        }
      }
    }
  }, [branchOptions, watchedBranchId, branchIds]);

  // Notify parent component when branch changes
  useEffect(() => {
    if (watchedBranchId && watchedBranchId.length > 0) {
      setBranchIds(watchedBranchId);

      if (onBranchChange) {
        onBranchChange(watchedBranchId);
      }
    }
  }, [watchedBranchId]);

  if (isLoading) {
    return null;
  }

  return (
    <Autocomplete<BranchFormValues>
      control={control}
      clearIcon={false}
      options={branchOptions}
      sx={{ width: "200px" }}
      name="branchId"
    />
  );
};
