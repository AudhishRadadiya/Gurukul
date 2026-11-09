import ClearIcon from "@mui/icons-material/Clear";
import type { PopoverProps } from "@mui/material";
import {
  Box,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { isFunction, sortBy } from "lodash";
import { useEffect, useState, type PropsWithChildren } from "react";
import { Button } from "../Button";
import { PadBox } from "../PadBox";
import type {
  AmountFilterCurrentValue,
  FilterCurrentValue,
  FilterListType,
} from "./FilterTypeWrapper";
import type { OnAction } from "../utils/types";

type FilterPopupProps = PropsWithChildren<PopoverProps> & {
  onApply?: OnAction;
  showFooter?: boolean;
  showDivider?: boolean;
  title?: string;
  required?: boolean;
  background?: boolean;
  filterItem?: FilterListType;
  currentFilterValue?: FilterCurrentValue;
  reset?: OnAction;
};

const getSnapshotValue = (
  value: FilterCurrentValue,
  filterItem?: FilterListType
  // eslint-disable-next-line sonarjs/function-return-type
): FilterCurrentValue => {
  if (!value) {
    return value;
  }

  if (filterItem?.type === "amountFilter") {
    return { ...(value as AmountFilterCurrentValue) };
  }

  if (filterItem?.multiSelect) {
    return sortBy(value as string[]);
  }

  return value;
};

const isFilterValueChanged = (
  current: FilterCurrentValue,
  initial: FilterCurrentValue,
  filterItem?: FilterListType
): boolean => {
  if (filterItem?.type === "amountFilter") {
    return JSON.stringify(current) !== JSON.stringify(initial);
  }

  if (filterItem?.multiSelect) {
    return (
      JSON.stringify(sortBy(current as string[])) !== JSON.stringify(initial)
    );
  }

  return current !== initial;
};

export const FilterPopup = ({
  open,
  anchorEl,
  onClose,
  children,
  onApply,
  showDivider = false,
  showFooter = true,
  title,
  required,
  filterItem,
  reset,
  background = false,
  currentFilterValue,
}: FilterPopupProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const [initialValue, setInitialValue] = useState<FilterCurrentValue>(null);

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (open) {
      if (!initialValue && !!currentFilterValue) {
        const changedValue = getSnapshotValue(currentFilterValue, filterItem);

        setInitialValue(changedValue);
      }
    } else {
      setInitialValue(null);
    }

    if (!!currentFilterValue && !!initialValue) {
      const isChanged = isFilterValueChanged(
        currentFilterValue,
        initialValue,
        filterItem
      );

      setIsDisabled(!isChanged);
    }
  }, [
    open,
    currentFilterValue,
    initialValue,
    filterItem,
    filterItem?.multiSelect,
    filterItem?.type,
  ]);

  const handleApply = () => {
    setInitialValue(null);

    if (isFunction(onApply)) {
      onApply();
    }
  };

  const handleClose = () => {
    setInitialValue(null);

    if (isFunction(reset)) {
      reset();
    }

    if (isFunction(onClose)) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={(_event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        handleClose();
      }}
      sx={{ "& .MuiPaper-root": { minWidth: "300px" } }}
    >
      {showDivider && (
        <Stack alignItems="flex-end">
          <PadBox padding={{ padding: "8px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <Stack direction="row" alignItems="center" gap="5px">
                <Typography variant="h6">{title}</Typography>

                {required && (
                  <Typography variant="h6" color="error">
                    *
                  </Typography>
                )}
              </Stack>

              <IconButton onClick={handleClose}>
                <ClearIcon />
              </IconButton>
            </Stack>
          </PadBox>
          <Divider sx={{ width: "100%" }} />
        </Stack>
      )}

      <Box
        sx={{
          background: background ? slate[600] : "transparent",
          borderRadius: "5px",
          maxWidth: "300px",
        }}
      >
        {children}
      </Box>

      {showFooter && (
        <PadBox padding={{ padding: "10px" }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={handleApply}
              disabled={isDisabled}
              variant="text"
              sx={{ maxWidth: "40px" }}
            >
              Apply
            </Button>
          </Box>
        </PadBox>
      )}
    </Popover>
  );
};
