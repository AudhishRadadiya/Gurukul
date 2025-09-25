import { Avatar, Box, Stack, Typography } from "@mui/material";
import type { ModifyCellObj } from "../utils";
import { getCellValue } from "../utils/helper";

type EmployeeCellProps = {
  row: Record<string, string | ModifyCellObj | boolean | undefined>;
  minWidth: number | string;
  maxWidth: number | string;
};

export const EmployeeCell = ({
  row,
  minWidth,
  maxWidth,
}: EmployeeCellProps) => {
  const avatar = getCellValue(row.avatar, "avatar");

  const name = getCellValue(row.name, "name");

  const employee_code = getCellValue(row.employee_code, "employee_code");

  const computedMinWidth = minWidth === "auto" ? maxWidth : minWidth;

  const computedMaxWidth = maxWidth === "auto" ? minWidth : maxWidth;

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="10px"
      sx={{
        minWidth: computedMinWidth,
        maxWidth: computedMaxWidth,
      }}
    >
      <Avatar src={avatar} alt={name} sx={{ width: 28, height: 28 }} />

      <Box
        sx={{
          maxWidth: "calc(100% - 28px - 10px)",
          minWidth: 0,
        }}
      >
        <Typography
          variant="body2"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
            lineHeight: "16px",
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            lineHeight: "15px",
          }}
        >
          {employee_code}
        </Typography>
      </Box>
    </Stack>
  );
};
