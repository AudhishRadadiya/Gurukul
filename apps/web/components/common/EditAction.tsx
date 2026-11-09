import { Button, type ButtonProps } from "@codezee/sixtify-brahma";

type EditActionProps = {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  size?: ButtonProps["size"];
};

export function EditAction({
  disabled = false,
  loading = false,
  onClick,
  size,
}: Readonly<EditActionProps>) {
  return (
    <Button onClick={onClick} loading={loading} disabled={disabled} size={size}>
      Update
    </Button>
  );
}
