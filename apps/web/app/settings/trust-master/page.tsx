"use client";

import { ContentBox, PadBox, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import type { ReactNode } from "react";

import { ADD_TRUST_MASTER } from "@web/app/settings/trust-master/hooks/constant";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddTrustMaster } from "@web/components/settings/trust-master/AddTrustMaster/AddTrustMaster";
import { TrustMasterList } from "@web/components/settings/trust-master/TrustMasterList/TrustMasterList";
import { TRUST_MASTER_PERMISSION } from "@web/constants/permission/settings/trustMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

const trustMasterPage = {
  [ADD_TRUST_MASTER]: "Add Trust Master",
};

type TrustMasterPageType = keyof typeof trustMasterPage;

const trustMasterPageRenderer: Record<TrustMasterPageType, ReactNode> = {
  [ADD_TRUST_MASTER]: <AddTrustMaster />,
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const [page] = useQueryState("page");

  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const queryPage = page === ADD_TRUST_MASTER ? ADD_TRUST_MASTER : null;

  const selectedAddTrustMasterPage = Object.keys(trustMasterPage).includes(
    queryPage ?? ""
  );

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        {!selectedAddTrustMasterPage && (
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
                {t("common.master.label", {
                  label: t("trust.label"),
                })}
              </Typography>

              <PermissionGuard
                canAccess={validateAccess(TRUST_MASTER_PERMISSION.CREATE)}
              >
                <ButtonLayoutProvider
                  variant="outlined"
                  onClick={() => {
                    router.push("/settings/trust-master?page=add-trust-master");
                  }}
                  label={t("common.button.add", {
                    label: t("trust.label"),
                  })}
                />
              </PermissionGuard>
            </Stack>
          </PadBox>
        )}

        {selectedAddTrustMasterPage ? (
          queryPage && trustMasterPageRenderer[queryPage]
        ) : (
          <Box sx={{ overflow: "hidden", width: "100%" }}>
            <TrustMasterList />
          </Box>
        )}
      </ContentBox>
    </Stack>
  );
}
