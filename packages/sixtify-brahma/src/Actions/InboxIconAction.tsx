import type { IconButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import { InboxIcon } from "../Svgs";
import { Tooltip } from "../Tooltip";

export type InboxIconActionProps = IconButtonProps & {
  disabled?: boolean;
};

export const InboxIconAction = (props: InboxIconActionProps) => {
  return (
    <IconButton {...props} sx={{ padding: "10px" }}>
      <Tooltip toolTipLabel="Inbox">
        <InboxIcon disabled={props.disabled} />
      </Tooltip>
    </IconButton>
  );
};
