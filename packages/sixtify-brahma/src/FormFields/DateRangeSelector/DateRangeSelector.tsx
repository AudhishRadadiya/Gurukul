import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  IconButton,
  ListItemButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { useMemo, useState, type MouseEvent } from "react";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { PadBox } from "../../PadBox";
import { formatDate } from "../../utils";
import { DateRangePicker } from "../DateRangePicker";
import type { OnAction } from "../../utils/types";

type DateRangeOption = {
  title: string;
  onClick: OnAction;
};

type DateRangeSelectorProps<T extends FieldValues> = {
  name: Path<T>;
  watch: UseFormWatch<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
};

export function DateRangeSelector<T extends FieldValues>({
  name,
  watch,
  control,
  setValue,
}: Readonly<DateRangeSelectorProps<T>>) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const [showCustom, setShowCustom] = useState(false);

  const dateField = watch(name);

  function castDateRangeToPathValue(dateField: string[]) {
    return dateField as PathValue<T, Path<T>>;
  }

  function setRange(days: number) {
    if (!showCustom) {
      const fromDate = DateTime.now()
        .minus({ days: 1 + days })
        .toISODate();

      const toDate = DateTime.now().minus({ days: 1 }).toISODate();

      setValue(name, castDateRangeToPathValue([fromDate, toDate]));

      setAnchorEl(null);
    }
  }

  const defaultRanges: DateRangeOption[] = [
    { title: "Last 7 days", onClick: () => setRange(7) },
    { title: "Last 14 days", onClick: () => setRange(14) },
    { title: "Last 30 days", onClick: () => setRange(30) },
    { title: "Custom", onClick: () => setShowCustom(true) },
  ];

  useMemo(() => {
    if (showCustom && Array.isArray(dateField)) {
      setValue(name, castDateRangeToPathValue(dateField));
    }
  }, [showCustom, name]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
    setShowCustom(false);
  }

  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="body2">
        {formatDate(dateField[0] ?? "", "dd MMM yyyy")} -
        {formatDate(dateField[1] ?? "", "dd MMM yyyy")}
      </Typography>

      <IconButton component="div" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      {!!anchorEl && (
        <Popover
          open={true}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <PadBox padding={{ padding: "8px" }}>
            {showCustom ? (
              <DateRangePicker name={name} control={control} />
            ) : (
              defaultRanges.map((item) => (
                <ListItemButton
                  key={item.title}
                  sx={{ width: "100%", textAlign: "center" }}
                  onClick={item.onClick}
                >
                  {item.title}
                </ListItemButton>
              ))
            )}
          </PadBox>
        </Popover>
      )}
    </Stack>
  );
}
