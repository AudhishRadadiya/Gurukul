"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  PadBox,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddPaymentGatewayDialog } from "@web/components/settings/paymentGateway/dialog/AddPaymentGatewayDialog";
import { PaymentGatewayList } from "@web/components/settings/paymentGateway/paymentGatewayList/PaymentGatewayList";
import { PAYMENT_GATEWAY_PERMISSION } from "@web/constants/permission/settings/paymentGateway/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { paymentGatewayKeys } from "@web/queryKeysFactories/paymentGateway";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const reloadPaymentGateways = async () => {
    await queryClient.invalidateQueries({
      queryKey: paymentGatewayKeys.listing(),
    });
  };

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddPaymentGatewayDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          reloadPaymentGateways();
        }}
      />
    ),
  };

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
            >
              {t("payment.gateway.menu.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(PAYMENT_GATEWAY_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("payment.gateway.menu.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <PaymentGatewayList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
