import { Box, IconButton, Stack } from "@mui/material";
import React, { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { FilterPill } from "../Chips/FilterPill";
import { SvgFilterList } from "../Svgs/SvgFilterList";
import { Tooltip } from "../Tooltip";
import { formatFilterData } from "./FilterListV2";
import { FilterPopup } from "./FilterPopup";
import { FilterPopupWrapper } from "./FilterPopupWrapper";
import type { FilterListType } from "./FilterTypeWrapper";
import { FilterTypeWrapper } from "./FilterTypeWrapper";
import { getFormValue } from "./getFormData";

export type FilterListProps = {
  filterListItems: FilterListType[];
};
export const FilterList = ({ filterListItems }: FilterListProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const filterPopupAnchorElm = useRef<HTMLDivElement | null>(null);

  const [openFilterPopup, setOpenFilterPopup] = useState(false);

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [currentFilter, setCurrentFilter] = useState<null | FilterListType>(
    null
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (data: FieldValues) => {
    setOpenFilterPopup(false);
    setCurrentFilter(null);
    handleClose();

    const filteredData = formatFilterData(data, filterListItems);

    setFilterListData(filteredData);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilterPopup = () => {
    setOpenFilterPopup(false);
  };

  const handleFilterItemClick = (filter: FilterListType) => {
    setOpenFilterPopup(true);
    setAnchorEl(null);
    setCurrentFilter(filter);
  };

  const handlerReset = () => {
    reset();
    setFilterListData(undefined);
  };

  const handleDelete = (key: string) => {
    setValue(`${key}`, null);
    setFilterListData((prevData) => {
      const newData = { ...prevData };

      delete newData[key];

      return newData;
    });
  };

  const getFilterItem = (key: string) => {
    return filterListItems.find((item) => item.key === key);
  };

  const currentFilterValue = currentFilter?.key
    ? watch(currentFilter.key)
    : null;

  const open = Boolean(anchorEl);

  const renderChips = (data: FieldValues) => {
    return Object.entries(data).map(([key, value]) => {
      if (!value) {
        return;
      }

      const item = getFilterItem(key);

      const keyValue = item && getFormValue(value, item);

      return (
        <FilterPill
          ref={filterPopupAnchorElm}
          key={key}
          label={
            <Tooltip
              toolTipLabel={`${keyValue}`}
            >{`${item?.label}: ${keyValue}`}</Tooltip>
          }
          onDelete={() => handleDelete(key)}
          onClick={(e: { currentTarget: HTMLDivElement | null }) => {
            setOpenFilterPopup(true);
            filterPopupAnchorElm.current = e.currentTarget;

            const item = getFilterItem(key);

            if (item) {
              setCurrentFilter(item);
              handleFilterItemClick(item);
            }
          }}
        />
      );
    });
  };

  return (
    <Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        {filterListData && renderChips(filterListData)}
        <IconButton
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={filterPopupAnchorElm as any}
          onClick={handleClick}
          sx={{ height: "40px" }}
        >
          <SvgFilterList />
        </IconButton>
        <Button onClick={() => handlerReset()} variant="text">
          Clear Filter
        </Button>
      </Stack>
      <FilterPopup
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onApply={() => {
          handleSubmit(onSubmit)();
        }}
      >
        {filterListItems.map((filter) => (
          <Box
            key={filter.key}
            onClick={() =>
              filter.type !== "switch" && handleFilterItemClick(filter)
            }
          >
            <FilterTypeWrapper filter={filter} control={control} />
          </Box>
        ))}
      </FilterPopup>

      {currentFilter && currentFilter.type !== "switch" && (
        <FilterPopupWrapper
          open={openFilterPopup}
          onClose={handleCloseFilterPopup}
          onApply={() => {
            handleSubmit(onSubmit)();
          }}
          control={control}
          currentFilterValue={currentFilterValue}
          anchorEl={filterPopupAnchorElm.current}
          filterItem={currentFilter}
          errors={errors}
        />
      )}
    </Stack>
  );
};
