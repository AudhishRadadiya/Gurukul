import BlurOffRoundedIcon from "@mui/icons-material/BlurOffRounded";
import BlurOnRoundedIcon from "@mui/icons-material/BlurOnRounded";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";

type GroupingIconsProps = {
  groupedIndex: number;
  isGrouped: boolean;
  loading: boolean;
};

export const GroupingIcons = ({
  groupedIndex,
  isGrouped,
  loading,
}: GroupingIconsProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const [open, setOpen] = useState(false);

  const clickBlockRef = useRef(false);

  const handleClick = (el: HTMLElement | null) => {
    clickBlockRef.current = true;
    setOpen(false);
    el?.blur?.();
    setTimeout(() => (clickBlockRef.current = false), 250);
  };

  return (
    <Box>
      {isGrouped && !loading ? (
        <Tooltip
          title="Ungroup"
          arrow
          open={open}
          placement="top-start"
          onOpen={() => {
            if (!clickBlockRef.current) {
              setOpen(true);
            }
          }}
          onClose={() => setOpen(false)}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            onMouseEnter={() => {
              if (!clickBlockRef.current) {
                setOpen(true);
              }
            }}
            onMouseLeave={() => setOpen(false)}
            onClick={(e) => handleClick(e.currentTarget as HTMLElement)}
          >
            <BlurOffRoundedIcon />

            <Typography color={iron[400]} variant="caption">
              ({groupedIndex + 1}){" "}
            </Typography>
          </Stack>
        </Tooltip>
      ) : (
        <Tooltip
          title="Grouping"
          arrow
          placement="top-start"
          open={open}
          onOpen={() => {
            if (!clickBlockRef.current) {
              setOpen(true);
            }
          }}
          onClose={() => setOpen(false)}
        >
          <Box
            onMouseEnter={() => {
              if (!clickBlockRef.current) {
                setOpen(true);
              }
            }}
            onMouseLeave={() => setOpen(false)}
            onClick={(e) => handleClick(e.currentTarget as HTMLElement)}
          >
            <BlurOnRoundedIcon />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};
