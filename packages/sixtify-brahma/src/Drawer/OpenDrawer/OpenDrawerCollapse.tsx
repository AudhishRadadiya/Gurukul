import { Collapse, type CollapseProps } from "@mui/material";
import type { PropsWithChildren } from "react";

export const OpenDrawerCollapse = ({
  children,
  ...rest
}: PropsWithChildren<CollapseProps>) => {
  return (
    <Collapse timeout="auto" unmountOnExit {...rest}>
      {children}
    </Collapse>
  );
};
