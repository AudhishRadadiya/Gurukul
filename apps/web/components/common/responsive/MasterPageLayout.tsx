import type { DialogTypes } from "@codezee/sixtify-brahma";
import {
  Button,
  ContentBox,
  PadBox,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

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

  return (
    <Stack gap={layout === "mobile" ? "6px" : "10px"}>
      {breadcrumbs}

      <ContentBox>
        <PadBox padding={{ padding: layout === "mobile" ? "6px" : "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">{title}</Typography>

            {layout === "mobile" ? (
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
