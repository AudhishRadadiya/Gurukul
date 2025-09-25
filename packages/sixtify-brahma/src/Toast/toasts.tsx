import { toast as reactToast, type ToastOptions } from "react-toastify";
import { Toast } from "./Toast";
import type { ToastArgs, ToastsTypeFunctions, ToastType } from "./types";

// eslint-disable-next-line sonarjs/function-return-type
function createToast(
  { title, description, href, linkText }: ToastArgs,
  type: ToastType,
  options?: ToastOptions
) {
  const toastId = `${type}-${title}`;

  if (!reactToast.isActive(toastId)) {
    return reactToast(
      <Toast
        title={title}
        description={description}
        href={href}
        linkText={linkText}
        type={type}
      />,
      { ...options, icon: false, type, toastId }
    );
  }

  return toastId;
}

export const toasts: ToastsTypeFunctions = {
  info: (toast, options?) => createToast(toast, "info", options),
  success: (toast, options?) => createToast(toast, "success", options),
  warning: (toast, options?) => createToast(toast, "warning", options),
  error: (toast, options?) => createToast(toast, "error", options),
};
