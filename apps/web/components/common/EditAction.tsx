import { Button } from "@codezee/sixtify-brahma";

type EditActionProps = {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
};

export function EditAction({
  disabled = false,
  loading = false,
  onClick,
}: Readonly<EditActionProps>) {
  return (
    <Button onClick={onClick} loading={loading} disabled={disabled}>
      Update
    </Button>
  );
}
