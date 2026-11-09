export type OptionsType = {
  disabled?: boolean;
  label: string;
  value: string | number;
};

export type StringValueOptionsType = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type BooleanOptionsType = Omit<OptionsType, "value"> & {
  value: string | boolean;
};
