import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { HttpStatus } from "@web/constants/httpStatus";
import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import { rawAxios } from "@web/utils/axios";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ session, token, trigger, user }) {
      if (user) {
        token.user = user;
      }

      if (trigger === "update" && session.user) {
        token.user = {
          ...token.user,
          ...session.user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...token.user,
      };

      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (credentials) {
          try {
            const { data, status } = await rawAxios.post<
              ApiSuccessResponse<{
                user: {
                  access_token: string;
                  enable_two_factor: boolean;
                  expired_at: string;
                  login_name: string;
                  token: string;
                  user_id: string;
                };
              }>
            >(
              AUTH_ROUTES.login,
              {
                login_name: credentials.login_name,
                password: credentials.password,
              },
              {}
            );

            if (status === HttpStatus.Ok) {
              return {
                ...data.data.user,
              };
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log("error in signin -> ", e);

            return null;
          }
        }

        return null;
      },
      credentials: {
        login_name: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      name: "Credentials",
    }),
  ],
};
