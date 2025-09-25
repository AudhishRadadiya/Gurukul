import { useQuery } from "@tanstack/react-query";

import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { authKeys } from "@web/queryKeysFactories/auth";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

import { useAxios } from "./useAxios";

type UseGetAccessToken = {
  refreshToken: string;
};

export function useRefreshAccessTokenFn() {
  const { axios } = useAxios();

  const fetchAccessToken = async ({ refreshToken }: UseGetAccessToken) => {
    const { data } = await axios.post<
      ApiSuccessResponse<{ access_token: string }>
    >(
      AUTH_ROUTES.accessToken,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    return data.data;
  };

  return { fetchAccessToken };
}

export function useGetAccessToken({ refreshToken }: UseGetAccessToken) {
  const { fetchAccessToken } = useRefreshAccessTokenFn();

  return useQuery({
    enabled: !!refreshToken,
    queryFn: () => fetchAccessToken({ refreshToken }),
    queryKey: authKeys.refreshToken(refreshToken),
  });
}
