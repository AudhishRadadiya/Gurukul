import { type RatingProps as MuiRatingProps } from "@mui/material";
import {
  type ControllerRenderProps,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

export type RatingProps<P extends FieldValues> = UseControllerProps<P> &
  Omit<MuiRatingProps, keyof ControllerRenderProps<P>> & {
    label?: string;
    loading?: boolean;
    required?: boolean;
    direction?: "row" | "column";
  };
