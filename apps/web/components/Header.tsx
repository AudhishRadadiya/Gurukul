import { AppBar, UserProfileMenu } from "@codezee/sixtify-brahma";
import { Close, Logout, Menu } from "@mui/icons-material";
import { IconButton, Stack, useTheme } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export const Header = ({
  isDrawerOpen = false,
  setIsDrawerOpen,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}) => {
  const theme = useTheme();

  const router = useRouter();

  const { red } = theme.palette.app.color;

  const { data } = useSession();

  const onClick = () => {
    signOut();
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
        </Stack>

        <UserProfileMenu
          userDetails={{
            avatar: data?.user.avatar ?? "",
            email: data?.user.email ?? "",
            name: data?.user.login_name ?? "",
          }}
          menuItems={menulist}
        />
      </Stack>
    </AppBar>
  );
};
