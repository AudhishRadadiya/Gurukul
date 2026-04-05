import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { SigninApiSuccessResponse } from "@web/components/auth/sign-in/hooks/usePostSignin";
import { HttpStatus } from "@web/constants/httpStatus";
import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
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
        if (!credentials) {
          return null;
        }

        // Case 1: already have token (skip API call)
        if (credentials?.token) {
          return {
            login_name: credentials?.login_name,
            token: credentials?.token,
            user_id: credentials?.user_id,
            user_type: credentials?.user_type,
          };
        }

        // Case 2: no token yet → login with API
        try {
          const { data, status } =
            await rawAxios.post<SigninApiSuccessResponse>(AUTH_ROUTES.login, {
              login_name: credentials.login_name,
              password: credentials.password,
            });

          if (status === HttpStatus.Ok && data?.data?.user) {
            return {
              ...data.data.user,
            };
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Error in signin -> ", err);
        }

        return null;
      },
      credentials: {
        login_name: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
        user_id: { label: "User Id", type: "text" },
        user_type: { label: "User Type", type: "text" },
      },
      name: "Credentials",
    }),
  ],
};
