import type { ReactNode } from "react";

type PermissionGuardProps = {
  canAccess: boolean;
  children: ReactNode;
};

export const PermissionGuard = ({
  canAccess,
  children,
}: PermissionGuardProps) => {
  return canAccess ? <> {children} </> : null;
};
