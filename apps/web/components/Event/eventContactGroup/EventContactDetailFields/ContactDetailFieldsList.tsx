import { CheckBox, GridProvider, TextField } from "@codezee/sixtify-brahma";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { IconButton, InputAdornment, Stack } from "@mui/material";
import { t } from "i18next";
import {
  type Control,
  type FieldArrayWithId,
  type FieldErrors,
} from "react-hook-form";

import type { EventContactGroupFormFieldValues } from "@web/components/Event/eventContactGroup/Dialogs/EventContactGroupForm";
import { contactDetailItemDefaultValues } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/constant";
import { errorMessages } from "@web/utils/helper";

type ContactDetailFieldsListProps = {
  append: (
    value: EventContactGroupFormFieldValues["contact_detail"][number]
  ) => void;
  control: Control<EventContactGroupFormFieldValues>;
  errors: FieldErrors<EventContactGroupFormFieldValues>;
  fields: FieldArrayWithId<
    EventContactGroupFormFieldValues,
    "contact_detail",
    "id"
  >[];
  loading?: boolean;
  remove: (index: number) => void;
};

export const ContactDetailFieldsList = ({
  append,
  control,
  errors,
  fields,
  loading = false,
  remove,
}: ContactDetailFieldsListProps) => {
  const { contact_detail } = errors;

  return (
    <Stack gap="10px">
      <Stack direction="row" justifyContent="flex-end">
        <IconButton
          aria-label={t("common.add")}
          onClick={() => append(contactDetailItemDefaultValues)}
          sx={{ mt: "8px" }}
        >
          <AddCircleIcon color="primary" />
        </IconButton>
      </Stack>

      <GridProvider gap="15px" columns={5}>
        {fields.map((field, index) => (
          <Stack direction="row" gap="10px" alignItems="start" key={field.id}>
            <CheckBox
              control={control}
              name={`contact_detail.${index}.selected`}
              sx={{ mt: "8px" }}
              size="small"
              loading={loading}
              disabled={loading || index <= 0}
            />

            <TextField
              name={`contact_detail.${index}.mobile_no`}
              control={control}
              loading={loading}
              characterType="string-number-hyphens"
              letterCase="mixed"
              disabled={loading}
              label={t("contactNumber.label")}
              placeholder={t("contactNumber.label")}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      marginRight: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                  >
                    <IconButton
                      aria-label={t("common.delete")}
                      disabled={index <= 0}
                      edge="start"
                      onClick={() => remove(index)}
                      size="small"
                      sx={{ p: "2px" }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  "& .MuiInputAdornment-positionEnd": {
                    paddingLeft: "4px",
                    paddingRight: 0,
                  },
                  "& .MuiOutlinedInput-input": {
                    paddingRight: "4px",
                  },
                },
              }}
              error={!!contact_detail?.[index]?.mobile_no}
              helperText={errorMessages(
                contact_detail?.[index]?.mobile_no?.message
              )}
            />
          </Stack>
        ))}
      </GridProvider>
    </Stack>
  );
};
