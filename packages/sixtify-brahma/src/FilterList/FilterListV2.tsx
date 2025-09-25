/* eslint-disable sonarjs/no-nested-functions */
/* eslint-disable sonarjs/no-nested-conditional */
/* eslint-disable sonarjs/function-return-type */
/* eslint-disable no-use-before-define */
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import { isEmpty } from "lodash";
import _isEmpty from "lodash/isEmpty";
import _isEqual from "lodash/isEqual";
import _isNil from "lodash/isNil";
import _omitBy from "lodash/omitBy";
import { DateTime } from "luxon";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { FilterIconAction } from "../Actions";
import { Button } from "../Button";
import { FilterPill } from "../Chips/FilterPill";
import { dateFormats } from "../FormFields";
import { SwitchField } from "../FormFields/SwitchField";
import { PadBox } from "../PadBox";
import { toasts } from "../Toast";
import { Tooltip } from "../Tooltip";
import { isoDateRegex, monthYearRegex } from "../utils";
import {
  FilterPopUpDateRangeWrapper,
  FilterPopupWrapper,
} from "./FilterPopupWrapper";
import type { FilterListType } from "./FilterTypeWrapper";
import { getFilterPopupComponent } from "./GetFilterPopupComponent";
import { getFormValue } from "./getFormData";

export type FilterListV2Props = {
  filterListItems: FilterListType[];
  isDisabled?: boolean;
  filterListData?: FieldValues;
  onApply: (data: FieldValues, isPopup?: boolean, key?: string) => void;
  onChange: (data: FieldValues, isPopup: boolean) => void;
  onClear: () => void;
  resetFormBasedOnFields?: string;
};

export function formatFilterData(
  data: FieldValues,
  filterListItems: FilterListType[]
): Record<string, FieldValues> {
  return Object.fromEntries(
    Object.entries(data).flatMap(([key, value]) => {
      if (value) {
        const config = filterListItems.find((item) => item.key === key);

        const formattedValue =
          config?.monthYearFormat && typeof value === "string"
            ? DateTime.fromISO(value).toFormat("yyyy-MM")
            : value;

        return [[key, formattedValue]];
      }

      return [];
    })
  );
}

export const FilterListV2 = ({
  filterListItems,
  isDisabled = false,
  filterListData,
  onApply,
  onClear,
  onChange,
}: FilterListV2Props) => {
  const theme = useTheme();

  const { iron, slate } = theme.palette.app.color;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const filterPopupAnchorElm = useRef<HTMLDivElement | null>(null);

  const dateRangeAnchorRef = useRef<HTMLDivElement | null>(null);

  const [openFilterPopup, setOpenFilterPopup] = useState(false);

  const [datePickerPopup, setDatePickerPopup] = useState(false);

  const [currentFilter, setCurrentFilter] = useState<null | FilterListType>(
    null
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleDateRange = (filter: FilterListType) => {
    setCurrentFilter(filter);
    setDatePickerPopup(true);
  };

  const defaultValues: FieldValues = useMemo(() => {
    return filterListItems.reduce<FieldValues>((acc, item) => {
      if (item.multiSelect || item.type === "dateRange") {
        acc[item.key] = item.value || null;
      } else if (item.type === "switch") {
        acc[item.key] = item.value || false;
      } else if (item.isDefaultCurrentDate && item.type === "date") {
        acc[item.key] = item.value || DateTime.now().toISODate();
      } else {
        acc[item.key] = item.value || null;
      }

      return acc;
    }, {});
  }, [filterListData]);

  const baseSchema = z.object(
    (() => {
      const shape: Record<string, z.ZodTypeAny> = {};

      filterListItems.forEach((item) => {
        if (item.multiSelect || item.type === "dateRange") {
          shape[item.key] = z.array(z.string()).nullable().optional();
        } else if (item.type === "switch") {
          shape[item.key] = z.boolean().nullable().optional();
        } else {
          shape[item.key] = z.string().nullable().optional();
        }
      });

      return shape;
    })()
  );

  const validationSchema = baseSchema.superRefine((data, ctx) => {
    filterListItems.forEach((item) => {
      if (item.required && !data[item.key]?.length) {
        ctx.addIssue({
          path: [item.key],
          message: `${item.label} is required`,
          code: z.ZodIssueCode.custom,
        });
      }
    });
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, dirtyFields },
    watch,
  } = useForm({
    values: defaultValues,
    resolver: zodResolver(validationSchema),
    mode: "all",
  });

  const company_id = watch("company_id");

  const business_unit_id = watch("business_unit_id");

  const department_id = watch("department_id");

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseFilterPopup = () => {
    if (currentFilter?.key) {
      setValue(`${currentFilter?.key}`, filterListData?.[currentFilter.key]);
    }
    setOpenFilterPopup(false);
  };

  const handleCloseDatePickerPopup = () => {
    if (currentFilter?.key) {
      setValue(`${currentFilter?.key}`, filterListData?.[currentFilter.key]);
    }
    setDatePickerPopup(false);
  };

  const handlerReset = () => {
    reset();
    onClear();
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onSubmit = (data: FieldValues) => {
    setOpenFilterPopup(false);
    setCurrentFilter(null);

    const filteredData = _omitBy(
      formatFilterData(data, filterListItems),
      (v) => _isNil(v) || _isEmpty(v)
    );

    onApply(filteredData, openFilterPopup, currentFilter?.key);

    handleClose();
  };

  const handleDateRangeSubmit = () => {
    setDatePickerPopup(false);
  };

  const getFilterItem = (key: string) => {
    return filterListItems.find((item) => item.key === key);
  };

  const handleDelete = (key: string) => {
    const item = getFilterItem(key);

    if (item?.required) {
      return toasts.error({
        title: "This is a required custom filter field and cannot be removed.",
      });
    }

    setValue(`${key}`, null);

    const newData = { ...filterListData };

    delete newData[key];

    onApply(newData, true, key);
  };

  const formData = useWatch({ control });

  const currentFilterValue = currentFilter?.key
    ? currentFilter.key === "switch"
      ? watch(currentFilter.key)
        ? "true"
        : "false"
      : watch(currentFilter.key)
    : null;

  useEffect(() => {
    onChange(formData, openFilterPopup);
  }, [formData, onChange]);

  useMemo(() => {
    if (company_id !== filterListData?.company_id && !openFilterPopup) {
      filterListItems.forEach((item) => {
        if (item.isDefaultCurrentDate && item.type === "date") {
          return;
        }

        setValue(`${item.key}`, null);
      });

      setValue("company_id", company_id);
    }
  }, [company_id]);

  useMemo(() => {
    if (
      !_isEqual(business_unit_id, filterListData?.business_unit_id) &&
      !openFilterPopup
    ) {
      setValue("business_unit_location_id", null);
    }
  }, [business_unit_id]);

  useMemo(() => {
    if (
      !_isEqual(department_id, filterListData?.department_id) &&
      !openFilterPopup
    ) {
      setValue("sub_department_id", null);
    }
  }, [department_id]);

  const open = Boolean(anchorEl);

  const shouldFormSubmit = useMemo(() => {
    return (
      isEmpty(dirtyFields) ||
      Object.keys(formData).every((key) => !formData[key])
    );
  }, [formData, dirtyFields]);

  function formatKeyValue(keyValue: string | string[]) {
    if (Array.isArray(keyValue)) {
      return keyValue.join(", ");
    }

    if (monthYearRegex.test(keyValue)) {
      return DateTime.fromFormat(keyValue, "yyyy-MM").toFormat("MMM yyyy");
    }

    if (isoDateRegex.test(keyValue)) {
      return DateTime.fromFormat(keyValue, "yyyy-MM-dd").toFormat("dd-MM-yyyy");
    }

    return keyValue;
  }

  const renderChips = (data: FieldValues) => {
    return Object.entries(data).map(([key, value]) => {
      if (typeof value !== "boolean" && !value) {
        return;
      }

      const item = getFilterItem(key);

      const keyValue = item && getFormValue(value, item);

      const formattedValue = formatKeyValue(
        typeof keyValue === "object"
          ? JSON.stringify(keyValue)
          : String(keyValue)
      );

      if (typeof value !== "boolean" && !formattedValue) {
        return;
      }

      return (
        <FilterPill
          ref={filterPopupAnchorElm}
          key={key}
          label={
            <Tooltip
              // eslint-disable-next-line sonarjs/no-base-to-string
              toolTipLabel={`${formattedValue}`}
              // eslint-disable-next-line sonarjs/no-base-to-string
            >{`${item?.label}: ${formattedValue}`}</Tooltip>
          }
          onDelete={() => handleDelete(key)}
          onClick={(e: { currentTarget: HTMLDivElement | null }) => {
            if (
              key === "company_id" &&
              filterListItems?.some(({ required }) => required)
            ) {
              return;
            }

            setOpenFilterPopup(true);
            filterPopupAnchorElm.current = e.currentTarget;

            const item = getFilterItem(key);

            if (item) {
              setCurrentFilter(item);
            }
          }}
        />
      );
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          sx={{
            maxWidth: {
              xs: "40vw",
              md: "45vw",
              lg: "57vw",
            },
          }}
        >
          {filterListData &&
            Object.values(filterListData).some((value) => value) && (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    minWidth: "60px",
                    marginTop: "8px",
                  }}
                >
                  Filters:
                </Typography>

                <Stack
                  direction="row"
                  gap="5px"
                  marginTop="3px"
                  alignItems="center"
                  sx={{ flexWrap: "wrap", maxWidth: "100%" }}
                >
                  {renderChips(filterListData)}
                </Stack>
              </>
            )}
        </Stack>

        <Stack direction="row" alignItems="flex-start">
          {filterListData &&
            Object.values(filterListData).some((value) => value) && (
              <Button
                onClick={() => handlerReset()}
                variant="text"
                sx={{ minWidth: "100px" }}
              >
                Clear Filter
              </Button>
            )}

          {!isDisabled && <FilterIconAction onClick={handleClick} />}
        </Stack>
      </Stack>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!shouldFormSubmit) {
            handleSubmit((data) => {
              onSubmit(data);
            })();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();

            if (!isPopupOpen && !shouldFormSubmit) {
              handleSubmit((data) => {
                onSubmit(data);
              })();
            }
          }
        }}
      >
        <Drawer
          open={open}
          onClose={(_event, reason) => {
            if (reason === "backdropClick") {
              return;
            }
            handleClose();
          }}
          anchor="right"
          sx={{
            zIndex: theme.zIndex.drawer + 2,
            "& .MuiPaper-root": {
              width: "350px",
            },
          }}
        >
          <Stack
            alignItems="flex-end"
            sx={{
              background: iron[600],
            }}
          >
            <PadBox padding={{ padding: "10px 30px" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                alignItems="center"
              >
                <Typography variant="h6">Filter</Typography>

                <IconButton
                  onClick={() => {
                    reset();
                    handleClose();
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Stack>
            </PadBox>

            <Divider sx={{ width: "100%" }} />
          </Stack>

          <Stack flexGrow={1} sx={{ overflowX: "hidden" }}>
            {filterListItems.map((filter) =>
              filter.type === "switch" ? (
                <Stack
                  key={filter.key}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="80%"
                  sx={{ padding: "10px 5px 10px 20px ", margin: "auto" }}
                >
                  <Typography variant="body2">{filter.label}</Typography>

                  <SwitchField control={control} name={filter.key} />
                </Stack>
              ) : (
                <Accordion
                  defaultExpanded={
                    !!filterListData?.[filter.key] ||
                    !!defaultValues?.[filter.key] ||
                    filter.required
                  }
                  disabled={filter.isDisabled}
                  key={filter.key}
                  sx={{
                    "&.MuiAccordion-root.Mui-expanded": {
                      margin: "0 !important",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      flexDirection: "row-reverse",
                      "& MuiAccordionSummary-root.Mui-expanded": {
                        marginRight: "10px",
                        transform: "rotate(-90deg)",
                      },
                      "&.Mui-expanded": {
                        minHeight: "40px",
                        paddingY: "5px",
                      },
                      "& .MuiAccordionSummary-content.Mui-expanded": {
                        margin: "0px",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width="90%"
                    >
                      <Stack direction="row" alignItems="center" gap="5px">
                        <Typography variant="body2">{filter.label}</Typography>

                        {filter.required && (
                          <Typography color="error">*</Typography>
                        )}
                      </Stack>

                      <Typography variant="body2">{filter.menuInfo}</Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      background: slate[600],
                      borderRadius: "5px",
                      padding: "0px",
                    }}
                  >
                    <PadBox
                      padding={{
                        paddingLeft: "15px",
                        paddingY: "5px",
                        paddingRight: "15px",
                      }}
                    >
                      {filter.type === "dateRange" ? (
                        <Stack
                          direction="row"
                          alignItems="center"
                          gap="10px"
                          onClick={(e) => {
                            handleDateRange(filter);
                            dateRangeAnchorRef.current = e.currentTarget;
                          }}
                        >
                          <Box
                            sx={{
                              border: "1px solid black",
                              borderRadius: "5px",
                              width: "150px",
                              p: 1,
                            }}
                          >
                            <Typography variant="body2">
                              {Array.isArray(watch(filter.key)) &&
                              watch(filter.key)[0]
                                ? DateTime.fromISO(
                                    watch(filter.key)[0]
                                  ).toFormat(dateFormats.dateWithEuropean)
                                : "Start Date"}
                            </Typography>
                          </Box>

                          <Typography>~</Typography>

                          <Box
                            sx={{
                              border: "1px solid black",
                              borderRadius: "5px",
                              width: "150px",
                              p: 1,
                            }}
                          >
                            <Typography variant="body2">
                              {Array.isArray(watch(filter.key)) &&
                              watch(filter.key)[1]
                                ? DateTime.fromISO(
                                    watch(filter.key)[1]
                                  ).toFormat(dateFormats.dateWithEuropean)
                                : "End Date"}
                            </Typography>
                          </Box>
                        </Stack>
                      ) : (
                        <Box>
                          {
                            getFilterPopupComponent({
                              selectedFilter: filter,
                              control,
                              errors,
                              setIsPopupOpen,
                            })[filter.type]
                          }
                        </Box>
                      )}
                    </PadBox>
                  </AccordionDetails>
                </Accordion>
              )
            )}
          </Stack>

          <Divider
            sx={{ width: "100%", position: "absolute", bottom: "70px" }}
          />
          <Stack height="70px">
            <PadBox padding={{ padding: "10px" }}>
              <Stack
                direction="row"
                gap="10px"
                sx={{ position: "absolute", bottom: "15px" }}
              >
                <Button
                  type="submit"
                  disabled={shouldFormSubmit}
                  variant="contained"
                  onClick={() => {
                    handleSubmit(onSubmit)();
                  }}
                >
                  Apply
                </Button>
                <Button
                  type="button"
                  onClick={() => handlerReset()}
                  disabled={Object.keys(formData).every(
                    (key) => !formData[key]
                  )}
                  variant="outlined"
                >
                  Reset
                </Button>
              </Stack>
            </PadBox>
          </Stack>
        </Drawer>
      </form>

      {currentFilter && (
        <FilterPopupWrapper
          open={openFilterPopup}
          onClose={handleCloseFilterPopup}
          onApply={() => {
            handleSubmit(onSubmit)();
          }}
          control={control}
          errors={errors}
          reset={reset}
          anchorEl={filterPopupAnchorElm.current}
          filterItem={currentFilter}
          currentFilterValue={currentFilterValue}
        />
      )}

      {currentFilter && (
        <FilterPopUpDateRangeWrapper
          open={datePickerPopup}
          onClose={handleCloseDatePickerPopup}
          onApply={() => {
            handleDateRangeSubmit();
          }}
          control={control}
          errors={errors}
          anchorEl={dateRangeAnchorRef.current}
          filterItem={currentFilter}
        />
      )}
    </Box>
  );
};
