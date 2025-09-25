"use client";

import {
  ActionButtons,
  Button,
  ContentBox,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DonorAddressBreadcrumbs } from "@web/components/Address/DonorAddress/DonorAddressBreadcrumbs";
import { DonorAddressList } from "@web/components/Address/DonorAddress/DonorAddressList/DonorAddressList";
import { useEditAllInActiveDonorAddress } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useEditAllInActiveDonorAddress";
import type { GetDonorAddressPDFApiSuccessResponse } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddressExport";
import { useGetDonorAddressExport } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddressExport";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { StatusAutocomplete } from "@web/components/common/Autocomplete/StatusAutocomplete";
import { ALL } from "@web/components/common/hooks/constant";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import { onError } from "@web/utils/errors";

export type DonorAddressValues = {
  status: Status;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const formMethods = useForm<DonorAddressValues>({
    defaultValues: {
      status: ALL,
    },
  });

  const { control, watch } = formMethods;

  const status = watch("status");

  const queryClient = useQueryClient();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { mutate: getDonorAddressExport } = useGetDonorAddressExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({ data, message }: GetDonorAddressPDFApiSuccessResponse) => {
        window.open(data.url, "_blank");
        toasts.success({ title: message });
      },
    },
    status,
  });

  const { mutate: editAllInActiveDonorAddress } =
    useEditAllInActiveDonorAddress({
      options: {
        onError: (error) => onError(error),
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: donorAddressKeys.listing(),
          });

          toasts.success({ title: data.message });
        },
      },
    });

  return (
    <FormProvider {...formMethods}>
      <Stack gap="10px">
        <DonorAddressBreadcrumbs />

        <ContentBox>
          <PadBox padding={{ padding: "10px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">
                {t("common.donor.label", {
                  label: t("address.label"),
                })}
              </Typography>

              <Stack direction="row" gap="20px">
                <Button
                  variant="outlined"
                  onClick={() => {
                    editAllInActiveDonorAddress({
                      address_book_ids: selectedRows,
                    });
                  }}
                  disabled={!selectedRows.length}
                >
                  {t("allInactive.label")}
                </Button>

                <ActionButtons
                  buttons={[
                    {
                      dataCy: "export",
                      dataPTag: "export",
                      endIcon: <ExpandMoreIcon />,
                      key: "right",
                      label: t("export.label"),
                      menuItems: [
                        {
                          dataCy: "xls",
                          dataPTag: "xls",
                          key: "xls",
                          label: t("common.file.label", {
                            label: t("excel.label"),
                          }),
                          onClick: () => {
                            getDonorAddressExport("excel");
                          },
                        },
                        {
                          dataCy: "pfd",
                          dataPTag: "pfd",
                          key: "pfd",
                          label: t("common.file.label", {
                            label: t("pdf.label"),
                          }),
                          onClick: () => {
                            getDonorAddressExport("pdf");
                          },
                        },
                      ],
                      menuPlacement: "left",
                      size: "small",
                      variant: "outlined",
                    },
                  ]}
                />

                <StatusAutocomplete
                  name="status"
                  control={control}
                  closeText="Close"
                />
              </Stack>
            </Stack>
          </PadBox>

          <DonorAddressList setSelectedRows={setSelectedRows} status={status} />
        </ContentBox>
      </Stack>
    </FormProvider>
  );
}
