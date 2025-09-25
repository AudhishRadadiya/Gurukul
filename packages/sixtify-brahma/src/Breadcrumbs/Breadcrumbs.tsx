import {
  Box,
  IconButton,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  useTheme,
} from "@mui/material";
import type { ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

type BreadcrumbItem = {
  icon?: ReactNode;
  text?: string;
  onClick?: () => void;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: BreadcrumbProps) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  return (
    <MuiBreadcrumbs
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
        whiteSpace: "nowrap",
        "& .MuiBreadcrumbs-ol": {
          display: "flex",
          flexWrap: "nowrap",
        },
        "& .MuiBreadcrumbs-li": {
          whiteSpace: "nowrap",
        },
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {items.map((item) => {
        const { icon, text, onClick } = item;

        if (onClick) {
          return (
            <Link
              key={uuidv4()}
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
              onClick={(e) => {
                e.preventDefault();

                onClick();
              }}
              href="#"
            >
              {icon && (
                <IconButton
                  sx={{
                    color: butterflyBlue[900],
                  }}
                >
                  {icon}
                </IconButton>
              )}
              {text && <Typography>{text}</Typography>}
            </Link>
          );
        }

        return (
          <Box key={uuidv4()}>
            {icon && (
              <IconButton
                sx={{
                  color: butterflyBlue[900],
                }}
              >
                {icon}
              </IconButton>
            )}
            {text && <Typography>{text}</Typography>}
          </Box>
        );
      })}
    </MuiBreadcrumbs>
  );
};
