import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { SvgKeyBoard } from "../Svgs/SvgKeyBoard";
import { Tooltip } from "../Tooltip";

export type KeyBoardIconActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const KeyBoardIconAction = (props: KeyBoardIconActionProps) => {
  return (
    <IconButton {...props} sx={{ padding: "10px" }}>
      <Tooltip toolTipLabel="Keyboard Shortcuts">
        <SvgKeyBoard />
      </Tooltip>
    </IconButton>
  );
};
