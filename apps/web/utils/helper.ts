import { t } from "i18next";
import { isArray, isEmpty, isObject, omitBy, pickBy, replace } from "lodash";
import type {
  FieldNamesMarkedBoolean,
  FieldValues,
  Path,
  SetValueConfig,
  UseFormClearErrors,
} from "react-hook-form";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resetDependentFields = <T extends Record<string, any>>({
  clearErrors,
  dependentFieldsMap,
  dirtyFields,
  fieldName,
  fieldValue,
  setValue,
}: {
  clearErrors?: UseFormClearErrors<T>;
  dependentFieldsMap: Partial<Record<keyof T, Path<T>[]>>;
  dirtyFields: Partial<
    Record<
      keyof T,
      | boolean
      | boolean[]
      | Record<string, unknown>
      | Record<string, unknown>[]
      | undefined
    >
  >;
  fieldName: keyof T;
  fieldValue: T[keyof T] | null;
  setValue: (field: Path<T>, value: null, options?: SetValueConfig) => void;
}) => {
  const dependentFields = dependentFieldsMap[fieldName];

  if ((!fieldValue || dirtyFields[fieldName]) && dependentFields) {
    dependentFields.forEach((dependentField) => {
      setValue(dependentField, null, { shouldDirty: true });

      if (clearErrors) {
        clearErrors(dependentField);
      }
    });
  }
};

export const digitMaxLimit = 1e9;

export const filterChangedFormFields = <T extends FieldValues>(
  allFields: T,
  dirtyFields: Partial<
    Record<keyof T, boolean | boolean[] | Record<string, unknown>>
  >
): Partial<T> => {
  const changedFieldValues = Object.keys(pickBy(dirtyFields)).reduce(
    (acc, currentField) => {
      return {
        ...acc,
        [currentField]: allFields[currentField],
      };
    },
    {} as Partial<T>
  );

  return changedFieldValues;
};

export const filterNestedChangedFormFields = <T extends FieldValues>(
  allFields: T,
  dirtyFields: FieldNamesMarkedBoolean<T>
): Partial<T> => {
  const getChangedFields = (
    dirty: FieldNamesMarkedBoolean<T> | boolean,
    all: T
  ): Partial<T> => {
    if (typeof dirty === "boolean") {
      return dirty ? (all as Partial<T>) : {};
    }

    return (
      all &&
      Object.keys(all).reduce((acc, currentField) => {
        const dirtyValue =
          dirty[currentField as keyof FieldNamesMarkedBoolean<T>];

        const allFieldValue = all?.[currentField as keyof T];

        if (Array.isArray(dirtyValue) && allFieldValue) {
          acc[currentField as keyof T] = dirtyValue
            .map((dirtyItem, index) => {
              const allItem = (allFieldValue as T)[index];

              if (typeof dirtyItem === "boolean") {
                return dirtyItem ? allItem : {};
              }

              return isObject(dirtyItem)
                ? getChangedFields(
                    dirtyItem as FieldNamesMarkedBoolean<T>,
                    allItem
                  )
                : {};
            })
            .filter((item) => {
              // Filter out empty objects and empty arrays
              if (item === undefined || item == null) {
                return false;
              }

              if (isObject(item)) {
                // Iterate over the keys and remove keys with empty arrays
                const typedItem = item as Record<string, unknown>;

                // eslint-disable-next-line sonarjs/no-nested-functions
                const filteredKeys = Object.keys(item).filter((key) => {
                  return !(
                    Array.isArray(typedItem[key]) && typedItem[key].length === 0
                  );
                });

                return filteredKeys.length > 0;
              }

              return !(Array.isArray(item) && item.length === 0);
            }) as T[keyof T];
        } else if (isObject(dirtyValue)) {
          const nestedChangedFields = getChangedFields(
            dirtyValue as FieldNamesMarkedBoolean<T>,
            allFieldValue as T
          );

          if (!isEmpty(nestedChangedFields)) {
            acc[currentField as keyof T] = nestedChangedFields as T[keyof T];
          }
        } else if (dirtyValue) {
          acc[currentField as keyof T] = allFieldValue;
        }

        return acc;
      }, {} as Partial<T>)
    );
  };

  return getChangedFields(dirtyFields, allFields);
};

type Obj = { [key: string]: string | null };

export const removeEmptyStrings = (obj: Obj): Obj =>
  omitBy(obj, (value) => value == "");

export const Debounce_Delay = 500; //milliseconds

export const filterSearchParams = (searchText: string | null) => {
  if (searchText) {
    return {
      search: {
        filter: searchText,
      },
    };
  }

  return { search: {} };
};

type Primitive = string | number | boolean | null | undefined;

type CleanObject<T> = {
  [P in keyof T]: T[P] extends Primitive
    ? T[P]
    : T[P] extends object
      ? CleanObject<T[P]>
      : T[P];
};

export const removeNegationValues = <T extends object>(
  obj: T
): Partial<CleanObject<T>> => {
  const result: Partial<CleanObject<T>> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const cleaned = removeNegationValues(value);

      if (Object.keys(cleaned).length > 0) {
        result[key as keyof T] = cleaned as CleanObject<T>[keyof T];
      }
    } else if (Array.isArray(value)) {
      const cleaned = value
        .map((item) => removeNegationValues(item))
        .filter((item) => Object.keys(item).length);

      if (cleaned.length) {
        result[key as keyof T] = cleaned as CleanObject<T>[keyof T];
      }
    } else if (value !== null && value !== undefined && value !== "") {
      result[key as keyof T] = value as CleanObject<T>[keyof T];
    }
  }

  return result;
};

export const getQueryString = (queryParams: Record<string, boolean>) => {
  const filteredParams: Record<string, string> = {};

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value != undefined && value != null) {
      filteredParams[key] = value.toString();
    }
  });

  return new URLSearchParams(filteredParams).toString();
};

export const validateMaxDigit = (
  ctx: z.RefinementCtx,
  fieldName: (string | number)[] | string,
  value?: number | null
) => {
  if (value && value >= digitMaxLimit) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t("value.maximum.allowedLimit", { maxLimit: 999999999 }),
      path: isArray(fieldName) ? fieldName : [fieldName],
    });
  }
};

export const formatToIndianNumber = (num: number | null) => {
  if (num) {
    return replace(num.toLocaleString("en-IN"), /,/g, ",");
  }

  return num;
};

export const toRoundNumber = (value: number) => {
  return value >= 0 ? Math.round(value) : 0;
};

export const errorMessages = (messageKey?: string) => {
  return messageKey && t(messageKey);
};
