import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Button } from "../Button";
import { ContentBox } from "../ContentBox";
import { PadBox } from "../PadBox";
import type { DialogTypes } from "../utils";
import { useGetDeviceType } from "../utils/hooks/useGetDeviceType";

type MasterPageLayoutProps = {
  breadcrumbs: ReactNode;
  btnLabel?: string;
  dialogKey: DialogTypes;
  dialogRenderer?: Record<string, ReactNode>;
  list: ReactNode;
  onDialogOpen: (key: DialogTypes) => void;
  openedDialog?: DialogTypes;
  title: string;
};

export const MasterPageLayout = ({
  breadcrumbs,
  btnLabel,
  dialogKey = "add",
  dialogRenderer,
  list,
  onDialogOpen,
  openedDialog,
  title,
}: MasterPageLayoutProps) => {
  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  return (
    <Stack gap={isMobile ? "6px" : "10px"}>
      {breadcrumbs}

      <ContentBox>
        <PadBox padding={{ padding: isMobile ? "6px" : "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">{title}</Typography>

            {isMobile ? (
              <Button
                variant="outlined"
                onClick={() => {
                  onDialogOpen(dialogKey);
                }}
                sx={{
                  borderRadius: "6px",
                  height: "36px",
                  minWidth: "36px",
                  padding: 0,
                  width: "36px",
                }}
              >
                <Add fontSize="small" />
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  onDialogOpen(dialogKey);
                }}
                startIcon={<Add />}
              >
                {btnLabel}
              </Button>
            )}
          </Stack>
        </PadBox>

        {list}
      </ContentBox>

      {dialogRenderer && openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
