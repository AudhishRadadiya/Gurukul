import {
  CheckBox,
  FormContainer,
  FormGridLayout,
  FormSection,
  RadioGroupField,
  TextField,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import {
  DeleteOutline as DeleteOutlineIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  pastStudentDetailsDefaultValues,
  type AddressBookFormFieldValues,
} from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { AddressTypeAutocomplete } from "@web/components/common/Autocomplete/AddressTypeAutocomplete";
import { ClassMateAutocomplete } from "@web/components/common/Autocomplete/ClassMateAutocomplete";
import { CommonMasterTypeParametersAutocomplete } from "@web/components/common/Autocomplete/CommonMasterTypeParametersAutocomplete";
import { CATEGORY, GURUKUL } from "@web/components/common/hooks/constant";
import { errorMessages } from "@web/utils/helper";

type PastStudentFromFieldsProps = {
  loading?: boolean;
};

export const PastStudentFromFields = ({
  loading = false,
}: PastStudentFromFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddressBookFormFieldValues>();

  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const { isNarrowMobile } = useGetDeviceType();

  const { append, fields, remove } = useFieldArray({
    control,
    name: "past_student_details",
  });

  return (
    <FormSection>
      <FormContainer>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight={700} variant="h5">
            {t("common.past.student")}
          </Typography>
          <IconButton
            aria-label={t("common.add")}
            disabled={loading}
            onClick={() => append(pastStudentDetailsDefaultValues)}
          >
            <AddCircleIcon color="primary" />
          </IconButton>
        </Stack>

        {fields.map((field, index) => {
          const rowErrors = errors.past_student_details?.[index];

          return (
            <Stack
              key={field.id}
              gap={2}
              direction="row"
              sx={{
                border: "1px solid",
                borderColor: iron[800],
                borderRadius: 2,
                px: 2,
                py: 1.5,
              }}
            >
              <Stack gap={2} sx={{ flex: 1, minWidth: 0 }}>
                <FormGridLayout columns={3}>
                  <AddressTypeAutocomplete
                    label={t("common.address.type")}
                    name={`past_student_details.${index}.address_type_id`}
                    loading={loading}
                    control={control}
                    required
                    error={!!rowErrors?.address_type_id}
                    helperText={errorMessages(
                      rowErrors?.address_type_id?.message
                    )}
                  />

                  <CommonMasterTypeParametersAutocomplete
                    label={t("common.category.1")}
                    name={`past_student_details.${index}.category_1_parameters_id`}
                    loading={loading}
                    control={control}
                    optionsKey={CATEGORY}
                  />

                  <CommonMasterTypeParametersAutocomplete
                    label={t("common.category.2")}
                    name={`past_student_details.${index}.category_2_parameters_id`}
                    loading={loading}
                    control={control}
                    optionsKey={CATEGORY}
                  />
                </FormGridLayout>

                <FormGridLayout columns={3}>
                  <CommonMasterTypeParametersAutocomplete
                    label={t("common.gurukul")}
                    name={`past_student_details.${index}.gurukul_parameters_id`}
                    loading={loading}
                    control={control}
                    optionsKey={GURUKUL}
                  />

                  <TextField
                    name={`past_student_details.${index}.ssc_year`}
                    type="number"
                    loading={loading}
                    control={control}
                    label={t("common.ssc.year")}
                  />

                  <CommonMasterTypeParametersAutocomplete
                    label={t("common.ssc.gurukul")}
                    name={`past_student_details.${index}.ssc_gurukul`}
                    loading={loading}
                    control={control}
                    optionsKey={GURUKUL}
                  />
                </FormGridLayout>

                <Stack
                  direction="row"
                  gap={{ md: "10px", xs: 1.5 }}
                  justifyContent={{ md: "space-between", xs: "flex-start" }}
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ width: "100%" }}
                >
                  <Stack
                    direction="row"
                    gap="10px"
                    alignItems="center"
                    sx={{ flexShrink: 0 }}
                  >
                    <Typography fontSize={{ md: 15, xs: 14 }}>
                      {t("common.is.vip")}
                    </Typography>

                    <CheckBox
                      name={`past_student_details.${index}.is_vip`}
                      control={control}
                      size="small"
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    gap="10px"
                    alignItems="center"
                    sx={{ flexShrink: 0 }}
                  >
                    <RadioGroupField
                      name={`past_student_details.${index}.patrika`}
                      control={control}
                      label={t("common.patrika")}
                      loading={loading}
                      isHorizontal={!isNarrowMobile}
                      options={[
                        {
                          disabled: false,
                          label: "Yes",
                          values: true,
                        },
                        {
                          disabled: false,
                          label: "No",
                          values: false,
                        },
                      ]}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    gap="10px"
                    alignItems="center"
                    sx={{ flexShrink: 0 }}
                  >
                    <RadioGroupField
                      name={`past_student_details.${index}.leave_in`}
                      type="number"
                      label={t("common.leave.in")}
                      control={control}
                      loading={loading}
                      isHorizontal={!isNarrowMobile}
                      options={[
                        {
                          disabled: false,
                          label: t("common.school.label"),
                          values: 1,
                        },
                        {
                          disabled: false,
                          label: t("common.hostel.label"),
                          values: 2,
                        },
                      ]}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    gap="10px"
                    alignItems="center"
                    sx={{ flexShrink: 0 }}
                  >
                    <RadioGroupField
                      name={`past_student_details.${index}.medium`}
                      type="number"
                      label={t("common.medium")}
                      control={control}
                      loading={loading}
                      isHorizontal={!isNarrowMobile}
                      options={[
                        {
                          disabled: false,
                          label: t("common.gujarati.label"),
                          values: 1,
                        },
                        {
                          disabled: false,
                          label: t("common.english.label"),
                          values: 2,
                        },
                      ]}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    gap="10px"
                    alignItems="center"
                    sx={{ flexShrink: 0 }}
                  >
                    <Typography fontSize={{ md: 15, xs: 14 }}>
                      {t("common.is.past.student")}
                    </Typography>

                    <CheckBox
                      name={`past_student_details.${index}.is_past_student`}
                      control={control}
                      size="small"
                    />
                  </Stack>
                </Stack>

                <FormGridLayout columns={3}>
                  <ClassMateAutocomplete
                    name={`past_student_details.${index}.class_mate`}
                    loading={loading}
                    control={control}
                  />
                </FormGridLayout>
              </Stack>

              <IconButton
                aria-label={t("common.delete")}
                disabled={loading || fields.length === 1}
                onClick={() => remove(index)}
                sx={{ alignSelf: "start", flexShrink: 0 }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
          );
        })}
      </FormContainer>
    </FormSection>
  );
};
