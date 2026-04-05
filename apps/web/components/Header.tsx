import { AppBar, UserProfileMenu } from "@codezee/sixtify-brahma";
import { Close, Logout, Menu } from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { BranchSelector } from "@web/components/BranchSelector";
import { DONATION_ENTRY_PREFERENCES_KEY } from "@web/components/Donation/donationEntry/addDonationEntry/AddDonationEntry";
import {
  drawerMenuItems,
  type DrawerMenuItemsKeys,
} from "@web/components/Drawer/hooks/useDrawerMenuItems";
import {
  REPORT_ROUTES_WITH_BRANCH_SELECTOR,
  ROUTES_WITHOUT_BRANCH_SELECTOR,
  ROUTES_WITH_BRANCH_SELECTOR,
} from "@web/components/user/hooks/constant";
import { useBranch } from "@web/context/BranchContext";

export const Header = ({
  isDrawerOpen = false,
  setIsDrawerOpen,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}) => {
  const theme = useTheme();

  const router = useRouter();

  const { setBranchIds } = useBranch();

  const DonationEntryStoredPreferences = localStorage.getItem(
    DONATION_ENTRY_PREFERENCES_KEY
  );

  const handleBranchChange = (selectedBranchIds: string) => {
    setBranchIds(selectedBranchIds);
  };

  const { red } = theme.palette.app.color;

  const { data } = useSession();

  const onClick = () => {
    signOut();

    if (DonationEntryStoredPreferences) {
      localStorage.removeItem(DONATION_ENTRY_PREFERENCES_KEY);
    }
  };

  const menulist = [
    {
      icon: <Logout fontSize="small" />,
      key: "change-password",
      label: t("change.password.menu.label"),
      onClick: () => {
        router.push("/change-password");
      },
    },
    {
      icon: <Logout fontSize="small" />,
      key: "signOut",
      label: "Sign Out",
      onClick: () => onClick(),
      sx: {
        color: `${red[700]}`,
      },
    },
  ];

  const currentPathname = usePathname();

  const searchParams = useSearchParams();

  const menuKey = currentPathname?.split("/")[1] as DrawerMenuItemsKeys;

  const headerTitleItems: Record<DrawerMenuItemsKeys, string> = drawerMenuItems;

  // Check if current route should exclude BranchSelector
  const shouldExcludeBranchSelector = ROUTES_WITHOUT_BRANCH_SELECTOR.some(
    (route) => {
      const pathnameMatches = currentPathname?.startsWith(route.pathname);

      const queryParamMatches =
        searchParams.get(route.queryParam) === route.queryValue;

      return pathnameMatches && queryParamMatches;
    }
  );

  const shouldShowBranchSelector =
    !shouldExcludeBranchSelector &&
    (ROUTES_WITH_BRANCH_SELECTOR.includes(menuKey) ||
      currentPathname == REPORT_ROUTES_WITH_BRANCH_SELECTOR);

  return (
    <AppBar drawerOpen={isDrawerOpen}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Stack gap="24px" direction="row" alignItems="center">
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            edge="start"
          >
            {isDrawerOpen ? <Close /> : <Menu />}
          </IconButton>

          <Typography variant="h6" color="primary">
            {headerTitleItems[menuKey] || "Home"}
          </Typography>
        </Stack>

        <Stack direction="row" gap={2} alignItems="center">
          {shouldShowBranchSelector && (
            <BranchSelector onBranchChange={handleBranchChange} />
          )}

          <UserProfileMenu
            userDetails={{
              avatar: data?.user.avatar ?? "",
              name: data?.user.login_name ?? "",
            }}
            menuItems={menulist}
          />
        </Stack>
      </Stack>
    </AppBar>
  );
};
