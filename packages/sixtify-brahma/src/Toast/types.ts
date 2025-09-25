import type { ToastOptions, TypeOptions } from "react-toastify";

export type ToastType = Exclude<TypeOptions, "default">;
export type ToastBody = { title: string; description?: string };
export type ToastLink = { href?: string; linkText?: string };
export type ToastArgs = ToastBody & ToastLink;

export type ToastsTypeFunctions = {
  [K in ToastType]: (
    _toast: ToastArgs,
    _options?: Omit<ToastOptions, "type">
  ) => string | number;
};
