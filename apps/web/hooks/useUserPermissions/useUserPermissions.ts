import { useSession } from "next-auth/react";

import { MENU_PERMISSION } from "@web/hooks/useUserPermissions/menuPermissionsPath";
import { useGetUserAccessControl } from "@web/hooks/useUserPermissions/useGetUserAccessControl";

export const useUserPermissions = () => {
  const { data: sessionData, status } = useSession();

  const isAuthenticated = status === "authenticated" && !!sessionData?.user;

  const { data: userAccessControl, isFetching } = useGetUserAccessControl({
    enabled: isAuthenticated,
  });

  const validateAccess = (modules: string): boolean => {
    if (!userAccessControl || !modules) {
      return false;
    }

    const pathParts = modules.split(".");

    // TODO: Bhavik fix this any type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentLevel: any = userAccessControl.modules;

    for (const part of pathParts) {
      if (
        !currentLevel ||
        typeof currentLevel !== "object" ||
        !(part in currentLevel)
      ) {
        return false;
      }
      currentLevel = currentLevel[part];
    }

    return currentLevel === true;
  };

  return { loading: isFetching, permissions: MENU_PERMISSION, validateAccess };
};
