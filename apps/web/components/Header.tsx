import { AppBar, UserProfileMenu } from "@codezee/sixtify-brahma";
import { Close, Logout, Menu } from "@mui/icons-material";
import { Box, IconButton, Stack, useTheme } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { BranchSelector } from "@web/components/BranchSelector";
import { DONATION_ENTRY_PREFERENCES_KEY } from "@web/components/Donation/donationEntry/addDonationEntry/AddDonationEntry";
import { useBranch } from "@web/context/BranchContext";

import { HeaderBreadcrumbs } from "./Header/HeaderBreadcrumbs";
import { useShouldShowBranchSelector } from "./Header/useShouldShowBranchSelector";

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

  const shouldShowBranchSelector = useShouldShowBranchSelector();

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

  return (
    <AppBar drawerOpen={isDrawerOpen}>
      <Stack
        direction="row"
        alignItems={{ sm: "center", xs: "flex-start" }}
        width="100%"
        gap={{ sm: 1.5, xs: 0.5 }}
        py={{ sm: 0, xs: 0.5 }}
      >
        <IconButton
          color="primary"
          aria-label="open drawer"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          edge="start"
          sx={{ flexShrink: 0 }}
        >
          {isDrawerOpen ? <Close /> : <Menu />}
        </IconButton>

        <Stack
          direction="row"
          flexWrap={{ sm: "nowrap", xs: "wrap" }}
          alignItems="center"
          justifyContent="space-between"
          flex={1}
          minWidth={0}
          gap={{ sm: 2, xs: 1 }}
          pr={{ md: 1, sm: 0.5, xs: 0.5 }}
        >
          <Box
            sx={{
              flex: 1,
              maxWidth: { sm: "none", xs: "calc(100% - 48px)" },
              minWidth: 0,
              order: 1,
              overflow: "hidden",
            }}
          >
            <HeaderBreadcrumbs />
          </Box>

          {shouldShowBranchSelector && (
            <Box
              sx={{
                flex: { sm: "0 0 auto", xs: "1 1 100%" },
                minWidth: 0,
                order: { sm: 2, xs: 3 },
                width: { md: "200px", sm: "160px", xs: "100%" },
              }}
            >
              <BranchSelector onBranchChange={handleBranchChange} />
            </Box>
          )}

          <Box
            sx={{
              flexShrink: 0,
              ml: { sm: 0, xs: "auto" },
              order: { sm: 3, xs: 2 },
            }}
          >
            <UserProfileMenu
              userDetails={{
                avatar: data?.user.avatar ?? "",
                name: data?.user.login_name ?? "",
              }}
              menuItems={menulist}
            />
          </Box>
        </Stack>
      </Stack>
    </AppBar>
  );
};
