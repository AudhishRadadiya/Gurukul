import { Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

export const FormContainer = ({ children }: PropsWithChildren) => {
  return <Stack gap="30px">{children}</Stack>;
};
