import { Link, Typography } from "@mui/material";
import { HoverBox } from "./Toaster.styled";
import type { ToastLink } from "./types";

export type ToastFooterLinkProps = Readonly<ToastLink>;

export function ToastFooterLink({ href, linkText }: ToastFooterLinkProps) {
  return (
    <Link
      href={href}
      underline="none"
      target={href?.startsWith("http") ? "_blank" : "_self"}
    >
      <HoverBox>
        <Typography>{linkText ?? href}</Typography>
      </HoverBox>
    </Link>
  );
}
