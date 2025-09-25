import React, { forwardRef } from "react";
import { Chip } from "../Chips";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import { useTheme } from "@mui/material";

type FilterPillProps = {
  onDelete?: () => void;
  label: React.ReactNode;
  onClick?: (e: { currentTarget: HTMLDivElement | null }) => void;
};

export const FilterPill = forwardRef<HTMLDivElement, FilterPillProps>(
  ({ onDelete, label, onClick }, ref) => {
    const theme = useTheme();

    const { black, sapphireBlue, iron } = theme.palette.app.color;

    return (
      <Chip
        ref={ref}
        label={label}
        variant="filled"
        deleteIcon={onDelete && <ClearIcon />}
        sx={{
          maxWidth: "200px",
          borderRadius: "20px",
          color: black[900],
          backgroundColor: `${sapphireBlue[400]} !important`,
          "&:hover": {
            backgroundColor: sapphireBlue[500],
          },
          "& .MuiChip-deleteIcon": {
            color: iron[800],
            "&:hover": {
              color: iron[900],
              backgroundColor: sapphireBlue[400],
            },
          },
        }}
        onDelete={onDelete}
        onClick={onClick}
      />
    );
  }
);

FilterPill.displayName = "FilterPill";
