import type { AxiosError, AxiosInstance } from "axios";
import _isNil from "lodash/isNil";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

import { HttpStatus } from "@web/constants/httpStatus";
import { useRefreshAccessTokenFn } from "@web/hooks/useRefreshAccessToken";
import { rawAxiosPrivate } from "@web/utils/axios";

export function useAxiosPrivate(): { axiosPrivate: AxiosInstance } {
  const { data: session, update: updateSession } = useSession();

  const { fetchAccessToken } = useRefreshAccessTokenFn();

  const accessToken = session?.user.token;

  const refreshToken = session?.user.token;

  useEffect(() => {
    const requestInterceptor = rawAxiosPrivate.interceptors.request.use(
      (config) => {
        if (
          config.headers.Authorization === "" ||
          _isNil(config.headers.Authorization)
        ) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = rawAxiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (
          error.response?.status === HttpStatus.Unauthorized &&
          refreshToken &&
          originalRequest
        ) {
          try {
            const { access_token: newAccessToken } = await fetchAccessToken({
              refreshToken,
            });

            if (newAccessToken) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              await updateSession({
                user: {
                  ...session?.user,
                  access_token: newAccessToken,
                },
              });

              return rawAxiosPrivate(originalRequest);
            }

            signOut();
          } catch {
            return signOut();
          }
        }

        if (error.status === HttpStatus.Forbidden) {
          await signOut({ callbackUrl: "/auth/sign-in" });

          return;
        }

        return Promise.reject(error);
      }
    );

    return () => {
      rawAxiosPrivate.interceptors.request.eject(requestInterceptor);
      rawAxiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);

  return {
    axiosPrivate: rawAxiosPrivate,
  };
}
