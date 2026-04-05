import { signIn } from "next-auth/react";
import { useQueryState } from "nuqs";
import { useState } from "react";

import type { LoginUser } from "@web/components/auth/sign-in/hooks/usePostSignin";

export type AuthFlowData = {
  requiresGoogleAuth: boolean;
  requiresGoogleAuthSetup: boolean;
  requiresOTP: boolean;
  user_id?: string;
};

export type AuthFlowState =
  | "LOGIN"
  | "AUTH_METHOD_SELECTION"
  | "MOBILE_NUMBER_ENTRY"
  | "OTP"
  | "GOOGLE_AUTH_SETUP"
  | "GOOGLE_AUTH_VERIFY";

const defaultUserCredentials = {
  expired_at: "",
  login_name: "",
  password: "",
  token: "",
  user_id: "",
};

export const useAuthFlow = () => {
  const [callBackUrl] = useQueryState("callbackUrl", { defaultValue: "/" });

  const [error, setError] = useState("");

  const [currentState, setCurrentState] = useState<AuthFlowState>("LOGIN");

  const [userCredentials, setUserCredentials] = useState<LoginUser>(
    defaultUserCredentials
  );

  const [authFlowData, setAuthFlowData] = useState<AuthFlowData>({
    requiresGoogleAuth: false,
    requiresGoogleAuthSetup: false,
    requiresOTP: false,
  });

  const mapNextAuthError = (error: string): string => {
    const errorMap: Record<string, string> = {
      AccessDenied: "Access denied. Please contact support.",
      CredentialsSignin: "Invalid credentials provided.",
      SessionRequired: "Session expired. Please login again.",
    };

    return errorMap[error] ?? "Authentication failed. Please try again.";
  };

  const proceedWithNextAuth = async (credentials: LoginUser) => {
    try {
      setError("");

      const loginName = credentials.login_name || userCredentials?.login_name;

      const password = credentials.password || userCredentials?.password;

      if (!loginName || !password) {
        setError("Missing login credentials");

        return;
      }

      const signInData = {
        callbackUrl: callBackUrl,
        login_name: loginName,
        password,
        redirect: false,
        token: credentials.token,
        user_type: credentials.user_type,
      };

      const result = await signIn("credentials", signInData);

      if (result?.error) {
        setError(mapNextAuthError(result.error));
      } else if (result?.ok) {
        const redirectUrl = (result.url ?? callBackUrl) || "/dashboard";

        window.location.href = redirectUrl;

        return;
      } else {
        setError("Authentication process failed. Please try again.");
      }
      // eslint-disable-next-line sonarjs/no-ignored-exceptions
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const resetToLogin = () => {
    setCurrentState("LOGIN");
    setUserCredentials(defaultUserCredentials);
    setError("");
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleBack = () => {
    const { requiresGoogleAuth, requiresGoogleAuthSetup, requiresOTP } =
      authFlowData;

    switch (currentState) {
      case "AUTH_METHOD_SELECTION":
        resetToLogin();
        break;

      case "MOBILE_NUMBER_ENTRY":
        // If both methods available, go back to selection, otherwise go to login
        if (requiresOTP && requiresGoogleAuth) {
          setCurrentState("AUTH_METHOD_SELECTION");
        } else {
          resetToLogin();
        }
        break;

      case "OTP":
        // If OTP is enabled, go back to mobile entry, otherwise handle selection
        if (requiresOTP && requiresGoogleAuth) {
          setCurrentState("MOBILE_NUMBER_ENTRY");
        } else if (requiresOTP) {
          setCurrentState("MOBILE_NUMBER_ENTRY");
        } else {
          resetToLogin();
        }
        break;

      case "GOOGLE_AUTH_SETUP":
        if (requiresOTP && requiresGoogleAuth) {
          setCurrentState("AUTH_METHOD_SELECTION");
        } else if (requiresOTP) {
          setCurrentState("OTP");
        } else {
          resetToLogin();
        }
        break;

      case "GOOGLE_AUTH_VERIFY":
        if (requiresGoogleAuthSetup) {
          setCurrentState("GOOGLE_AUTH_SETUP");
        } else if (requiresOTP && requiresGoogleAuth) {
          setCurrentState("AUTH_METHOD_SELECTION");
        } else if (requiresOTP) {
          setCurrentState("OTP");
        } else {
          resetToLogin();
        }
        break;

      default:
        resetToLogin();
        break;
    }
    setError("");
  };

  return {
    // State
    authFlowData,
    currentState,
    error,
    // Actions
    handleBack,

    proceedWithNextAuth,
    setAuthFlowData,
    setCurrentState,
    setError,
    setUserCredentials,
    userCredentials,
  };
};
