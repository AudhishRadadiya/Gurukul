import type { TOptions } from "i18next";
import i18next from "i18next";

export const translate = (key: string, options?: TOptions): string => {
  return i18next.t(key, options);
};
