import { Box } from "@mui/material";

// Define logo size variants
type LogoSize = "small" | "medium" | "large";

type AppLogoProps = {
  alt?: string;
  size?: LogoSize;
  src?: string;
};

const sizeConfig = {
  large: {
    height: 180,
    width: 180,
  },
  medium: {
    height: 100,
    width: 100,
  },
  small: {
    height: 70,
    width: 70,
  },
};

export const AppLogo = ({
  alt = "Company Logo",
  size = "medium",
  src = "/images/image.png",
}: AppLogoProps) => {
  const sizeStyles = sizeConfig[size];

  return <Box component="img" src={src} alt={alt} sx={sizeStyles} />;
};
