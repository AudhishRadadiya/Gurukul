import { useGetDeviceType, type ButtonProps } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";

type ButtonLayoutProviderProps = {
  isLabelCollapsed?: boolean;
  label: string;
  onClick: () => void;
} & Omit<ButtonProps, "onClick">;

export const ButtonLayoutProvider = ({
  isLabelCollapsed,
  label,
  onClick,
  ...rest
}: ButtonLayoutProviderProps) => {
  const { layout } = useGetDeviceType();

  const isMobile = isLabelCollapsed || layout === "mobile";

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      {...(isMobile
        ? {
            children: <Add fontSize="small" />,
            sx: {
              borderRadius: "6px",
              height: "36px",
              minWidth: "36px",
              width: "36px",
            },
          }
        : {
            children: label,
            startIcon: <Add />,
          })}
      {...rest}
    />
  );
};
