import { rawAxios } from "@web/utils/axios";
import type { AxiosInstance } from "axios";

export function useAxios(): { axios: AxiosInstance } {
  return {
    axios: rawAxios,
  };
}
