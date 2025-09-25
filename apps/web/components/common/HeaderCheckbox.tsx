import { CheckBox } from "@codezee/sixtify-brahma";

type HeaderCheckboxProps = {
  isIndeterminate: boolean;
};

export function HeaderCheckbox({
  isIndeterminate,
  ...props
}: Readonly<HeaderCheckboxProps>) {
  return (
    <CheckBox
      name="checkAll"
      size="small"
      indeterminate={isIndeterminate}
      {...props}
    />
  );
}
