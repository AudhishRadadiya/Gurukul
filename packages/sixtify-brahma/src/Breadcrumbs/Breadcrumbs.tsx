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
import { useGetDeviceType } from "../utils/hooks/useGetDeviceType";
import type { OnAction } from "../utils/types";

type BreadcrumbItem = {
  icon?: ReactNode;
  text?: string;
  onClick?: OnAction;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: BreadcrumbProps) => {
  const theme = useTheme();

  const { isMobile } = useGetDeviceType();

  const { butterflyBlue, black } = theme.palette.app.color;

  const textSx = {
    fontSize: isMobile ? "12px" : "14px",
    lineHeight: 1.4,
    wordBreak: "break-word",
  };

  return (
    <MuiBreadcrumbs
      sx={{
        display: "flex",
        flexWrap: "wrap",
        maxWidth: "100%",
        whiteSpace: "normal",
        "& .MuiBreadcrumbs-ol": {
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          // rowGap: "4px",
        },
        "& .MuiBreadcrumbs-li": {
          whiteSpace: "normal",
        },
        "& .MuiBreadcrumbs-separator": {
          color: black[900],
          fontSize: isMobile ? "11px" : "16px",
          marginLeft: isMobile ? "4px" : "8px",
          marginRight: isMobile ? "4px" : "8px",
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
              sx={{
                alignItems: "center",
                display: "inline-flex",
                flexWrap: "wrap",
                maxWidth: "100%",
              }}
              onClick={(e) => {
                e.preventDefault();

                onClick();
              }}
              href="#"
            >
              {icon && (
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    color: butterflyBlue[900],
                    padding: isMobile ? "4px" : "0px",
                  }}
                >
                  {icon}
                </IconButton>
              )}
              {text && <Typography sx={textSx}>{text}</Typography>}
            </Link>
          );
        }

        return (
          <Box
            key={uuidv4()}
            sx={{
              alignItems: "center",
              display: "inline-flex",
              flexWrap: "wrap",
              maxWidth: "100%",
            }}
          >
            {icon && (
              <IconButton
                size={isMobile ? "small" : "medium"}
                sx={{
                  color: butterflyBlue[900],
                  padding: isMobile ? "4px" : "0px",
                }}
              >
                {icon}
              </IconButton>
            )}
            {text && (
              <Typography color="primary" sx={textSx}>
                {text}
              </Typography>
            )}
          </Box>
        );
      })}
    </MuiBreadcrumbs>
  );
};
