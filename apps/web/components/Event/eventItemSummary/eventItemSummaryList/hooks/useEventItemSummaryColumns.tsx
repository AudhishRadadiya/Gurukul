import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Divider, Stack, Typography } from "@mui/material";
import type { ColDef } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventItemSummary } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useGetEventItemSummary";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
  AgDataWithActions,
} from "@web/types/agGrid";
import { formatToIndianNumber } from "@web/utils/helper";

type EventItemSummaryColumns = {
  dynamicVariantTypes: string[];
  loading: boolean;
};

const RADIO_OPTIONS_TYPE = 3;

const CHECKBOX_OPTIONS_TYPE = 4;

export const useEventItemSummaryColumns = ({
  dynamicVariantTypes,
}: AgColumnsArgs<EventItemSummaryColumns>) => {
  const variantColumns: ColDef<AgDataWithActions<EventItemSummary>>[] =
    dynamicVariantTypes.map((variantType) => {
      const fieldName = "event_items" as const;

      return {
        autoHeight: true,
        cellRenderer: ({ data }: CustomCellRendererProps<EventItemSummary>) => {
          const { event_items } = data ?? {};

          if (!event_items) {
            return "-";
          }

          const eventItem = event_items.find(
            ({ title }) => title === variantType
          );

          const { kind, selected_values, total_amount, type, value } =
            eventItem || {};

          const selectedValues = Array.isArray(selected_values)
            ? selected_values
            : [];

          if (
            type &&
            [RADIO_OPTIONS_TYPE, CHECKBOX_OPTIONS_TYPE].includes(type) &&
            !_isEmpty(selectedValues)
          ) {
            return (
              <Stack>
                {selectedValues.map(
                  ({ amount, label, left_qty, total_qty }, index) => (
                    <Box key={`${label}-${index}`}>
                      <PadBox padding={{ padding: "5px 8px" }}>
                        <Stack
                          direction="row"
                          gap="12px"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack direction="column">
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600 }}
                            >
                              {label}
                            </Typography>

                            <Stack direction="row" gap="2px">
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: 600 }}
                              >
                                Total:
                              </Typography>
                              <Typography variant="caption">
                                {total_qty}
                              </Typography>
                            </Stack>
                          </Stack>

                          <Stack direction="column">
                            <Typography variant="caption">
                              {`₹${formatToIndianNumber(amount)}`}
                            </Typography>

                            <Stack direction="row" gap="2px">
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: 600 }}
                              >
                                Left:
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                              >
                                {left_qty}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </PadBox>

                      {index !== selectedValues.length - 1 && (
                        <Divider sx={{ mt: 0.75 }} />
                      )}
                    </Box>
                  )
                )}
              </Stack>
            );
          }

          if (kind === "event_item") {
            return total_amount ?? "-";
          }

          return value ?? "-";
        },
        field: fieldName,
        filter: false,
        headerName: variantType,
        minWidth: 180,
        sortable: false,
        wrapText: true,
      };
    });

  const column: AgColumnsWithActions<EventItemSummary> = [
    {
      field: "event_name",
      headerName: t("common.event.label"),
      minWidth: 150,
      sortable: false,
    },
    ...variantColumns,
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "total",
      filter: "agNumberColumnFilter",
      headerName: t("amount.label"),
      minWidth: 150,
      sortable: false,
    },
  ];

  return { column };
};
