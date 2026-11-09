import { toasts, Tooltip } from "@codezee/sixtify-brahma";
import { Language, CopyAll, Link } from "@mui/icons-material";
import { Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type {
  EventMasterDetail,
  LinksType,
} from "@web/components/settings/event-master/EventMasterList/hooks/useGetActiveEventMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";
import { dateFormat } from "@web/utils/date";
import { handleCopyToClipboard } from "@web/utils/helper";

export const useEventMasterColumns = () => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<EventMasterDetail> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return (
          <Tooltip toolTipLabel={value}>
            <Typography variant="body2">{value}</Typography>
          </Tooltip>
        );
      },
      field: "event_master_name",
      headerName: t("common.name.label", {
        label: t("common.event.label"),
      }),
      minWidth: 200,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return (
          <Tooltip toolTipLabel={value}>
            <Typography variant="body2">{value ?? "-"}</Typography>
          </Tooltip>
        );
      },
      field: "event_contact_detail_name",
      headerName: "Event Contact Detail Name",
      minWidth: 200,
    },
    {
      field: "location",
      headerName: t("location.label"),
      minWidth: 200,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "start_date",
      filter: "agDateColumnFilter",
      headerName: t("startDate.label"),
      minWidth: 130,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "end_date",
      filter: "agDateColumnFilter",
      headerName: t("endDate.label"),
      minWidth: 130,
    },
    {
      field: "trust_names",
      headerName: t("trustNames.label"),
      minWidth: 130,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return (
          <Tooltip toolTipLabel={value}>
            <Typography variant="body2">{value ?? "-"}</Typography>
          </Tooltip>
        );
      },
      field: "description",
      headerName: t("description.label"),
      minWidth: 200,
    },
    {
      field: "is_send_sms",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isSendSMS.label"),
    },
    {
      field: "is_need_reminder",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isNeedReminder.label"),
    },
    {
      field: "is_active",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isActive.label"),
    },
    {
      field: "is_online",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isOnline.label"),
    },
    {
      field: "branch_name",
      minWidth: 200,
    },
    {
      autoHeight: true,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (!_isEmpty(value)) {
          return (
            <Stack direction="column" gap={1} py={0.5}>
              {value.map((item: LinksType) => {
                const { branch_name, link, quick_link } = item;

                return (
                  <Stack
                    direction="row"
                    gap={1}
                    key={`${branch_name}-${link}-${quick_link}`}
                  >
                    <Typography variant="body2">{branch_name}</Typography>

                    {!!link && (
                      <>
                        <Typography
                          variant="body2"
                          onClick={() => {
                            handleCopyToClipboard(link);

                            window.open(link, "_blank");
                          }}
                          sx={{
                            "&:hover": {
                              textDecoration: "underline",
                            },
                            color: butterflyBlue[50],
                            cursor: "pointer",
                          }}
                        >
                          <Language
                            fontSize="small"
                            sx={{
                              "&:hover": {
                                fill: butterflyBlue[50],
                              },
                              fill: butterflyBlue[900],
                            }}
                          />
                        </Typography>

                        <CopyAll
                          fontSize="small"
                          sx={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleCopyToClipboard(link);

                            toasts.success({
                              title: t("common.copied.to.clipboard.message"),
                            });
                          }}
                        />
                      </>
                    )}

                    {!!quick_link && (
                      <>
                        <Typography
                          variant="body2"
                          onClick={() => {
                            handleCopyToClipboard(quick_link);

                            window.open(quick_link, "_blank");
                          }}
                          sx={{
                            "&:hover": {
                              textDecoration: "underline",
                            },
                            color: butterflyBlue[50],
                            cursor: "pointer",
                          }}
                        >
                          <Link
                            fontSize="small"
                            sx={{
                              "&:hover": {
                                fill: butterflyBlue[50],
                              },
                              fill: butterflyBlue[900],
                            }}
                          />
                        </Typography>

                        <CopyAll
                          fontSize="small"
                          sx={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleCopyToClipboard(quick_link);

                            toasts.success({
                              title: t(
                                "common.copied.to.clipboard.quick.link.message"
                              ),
                            });
                          }}
                        />
                      </>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          );
        }

        return AG_GRID_CELL_DEFAULT_VALUE;
      },
      cellStyle: {
        alignItems: "flex-start",
        display: "flex",
      },
      field: "links",
      headerName: "Links",
      minWidth: 250,
      wrapText: true,
    },
  ];

  return { column };
};
