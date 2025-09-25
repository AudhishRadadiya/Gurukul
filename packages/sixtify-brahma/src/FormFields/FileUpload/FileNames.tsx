import { AttachFile, VisibilityOutlined } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { IconButton, Stack, Typography } from "@mui/material";
import _drop from "lodash/drop";
import _join from "lodash/join";
import _last from "lodash/last";
import _split from "lodash/split";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDialogActions, type DialogRenderer } from "../../utils";
import { ViewFilePreviewDialog } from "./Dialogs/ViewFilePreviewDialog";

type FileNamesProps = {
  fileNames: string[];
  onDelete: (index: number) => void;
  previewEnabled?: boolean;
};

export const FileNames = ({
  fileNames,
  previewEnabled = false,
  onDelete,
}: FileNamesProps) => {
  const [selectedFile, setSelectedFile] = useState<string>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const names: string[] = useMemo(() => {
    if (fileNames && Array.isArray(fileNames)) {
      return fileNames.map((url: string) => {
        const imageName = _join(
          _drop(_split(_last(_split(url, "/")), "_")),
          "_"
        );

        return imageName;
      });
    }

    return [];
  }, [fileNames]);

  const handlePreviewClick = (name: string) => {
    setSelectedFile(name);
    onDialogOpen("viewAttachment");
  };

  const dialogRenderer: DialogRenderer = {
    viewAttachment: selectedFile && (
      <ViewFilePreviewDialog
        open={openedDialog === "viewAttachment"}
        onClose={onDialogClose}
        fileName={selectedFile}
      />
    ),
  };

  return (
    <Stack gap="5px" maxHeight="120px" overflow="auto">
      {names.map((name: string, index: number) => (
        <Stack
          key={uuidv4()}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            gap="5x"
            alignItems="center"
            maxWidth="80%"
            overflow="hidden"
          >
            <AttachFile />

            <Typography maxWidth="100%" textOverflow="clip">
              {name}
            </Typography>
          </Stack>

          <Stack direction="row">
            {previewEnabled && (
              <IconButton
                onClick={() =>
                  fileNames[index] && handlePreviewClick(fileNames[index])
                }
              >
                <VisibilityOutlined />
              </IconButton>
            )}

            <IconButton onClick={() => onDelete(index)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Stack>
        </Stack>
      ))}

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
