"use client";

import { AuthMethodSelectionForm } from "@web/components/auth/forms/AuthMethodSelectionForm";
import { GoogleAuthSetupForm } from "@web/components/auth/forms/GoogleAuthSetupForm";
import { GoogleAuthVerifyForm } from "@web/components/auth/forms/GoogleAuthVerifyForm";
import { LoginForm } from "@web/components/auth/forms/LoginForm";
import { MobileNumberForm } from "@web/components/auth/forms/MobileNumberForm";
import { OTPForm } from "@web/components/auth/forms/OTPForm";
import type {
  GoogleAuthFormFieldValues,
  LoginFormFieldValues,
  MobileNumberFormFieldValues,
  OTPFormFieldValues,
} from "@web/components/auth/sign-in/hooks/authSchema";
import { useAuthFlow } from "@web/components/auth/sign-in/hooks/useAuthFlow";
import { usePostSendOtp } from "@web/components/auth/sign-in/hooks/usePostSendOtp";
import { usePostVerifyGoogleAuth } from "@web/components/auth/sign-in/hooks/usePostVerifyGoogleAuth";
import { usePostVerifyOtp } from "@web/components/auth/sign-in/hooks/usePostVerifyOtp";
import type { ApiErrorResponse } from "@web/types/apiResponse";

import type { LoginResponse } from "./hooks/usePostSignin";
import { usePostSignin } from "./hooks/usePostSignin";

export const SignInForm = () => {
  const {
    authFlowData,
    currentState,
    error,
    handleBack,
    proceedWithNextAuth,
    setAuthFlowData,
    setCurrentState,
    setError,
    setUserCredentials,
    userCredentials,
  } = useAuthFlow();

  const handleLoginSuccess = async (data: LoginResponse) => {
    const { is_google_auth, is_google_auth_generate, is_otp, user } = data;

    if (!user?.user_id) {
      setError("Login failed");

      return;
    }

    setUserCredentials((prev) => ({
      ...prev,
      ...user,
    }));

    const requiresOTP = is_otp ?? false;

    const requiresGoogleAuth = is_google_auth ?? false;

    const requiresGoogleAuthSetup = is_google_auth_generate ?? false;

    setAuthFlowData({
      requiresGoogleAuth,
      requiresGoogleAuthSetup,
      requiresOTP,
      user_id: user.user_id,
    });

    if (requiresOTP && requiresGoogleAuth) {
      setCurrentState("AUTH_METHOD_SELECTION");
    } else if (requiresOTP) {
      setCurrentState("MOBILE_NUMBER_ENTRY");
    } else if (requiresGoogleAuthSetup) {
      setCurrentState("GOOGLE_AUTH_SETUP");
    } else if (requiresGoogleAuth) {
      setCurrentState("GOOGLE_AUTH_VERIFY");
    } else {
      proceedWithNextAuth({ ...userCredentials, ...user });
    }

    setError("");
  };

  const { isPending: isLoginPending, mutate: loginMutate } = usePostSignin({
    options: {
      onError: (error: ApiErrorResponse<LoginFormFieldValues>) => {
        setError(error.response?.data?.message || "Login failed");
      },
      onSuccess: (data: LoginResponse) => {
        handleLoginSuccess(data);
      },
    },
  });

  const { isPending: isGoogleAuthPending, mutate: verifyGoogleAuthMutate } =
    usePostVerifyGoogleAuth({
      options: {
        onError: (error: ApiErrorResponse) => {
          setError(error.response?.data?.message || "Verification failed");
        },
        onSuccess: (data) => {
          if (!data?.user) {
            setError("Invalid code");

            return;
          }

          handleLoginSuccess({ user: { ...userCredentials, ...data.user } });
        },
      },
    });

  const { isPending: isSendOtpPending, mutate: sendOtpMutate } = usePostSendOtp(
    {
      options: {
        onError: (error: ApiErrorResponse) => {
          setError(error.response?.data?.message || "Failed to send OTP");
        },
        onSuccess: () => {
          setCurrentState("OTP");
        },
      },
    }
  );

  const { isPending: isVerifyOtpPending, mutate: verifyOtpMutate } =
    usePostVerifyOtp({
      options: {
        onError: (error: ApiErrorResponse) => {
          setError(error.response?.data?.message || "Failed to send OTP");
        },
        onSuccess: (data) => {
          if (!data?.user) {
            setError("Invalid code");

            return;
          }

          handleLoginSuccess({ user: { ...userCredentials, ...data.user } });
        },
      },
    });

  const onLoginSubmit = (formValues: LoginFormFieldValues) => {
    setError("");
    setUserCredentials((prev) => ({
      ...prev,
      ...formValues,
    }));
    loginMutate(formValues);
  };

  const onAuthMethodSelect = (method: "OTP" | "GOOGLE_AUTH") => {
    if (method === "OTP") {
      setCurrentState("MOBILE_NUMBER_ENTRY");
    } else {
      const { requiresGoogleAuthSetup } = authFlowData;

      setCurrentState(
        requiresGoogleAuthSetup ? "GOOGLE_AUTH_SETUP" : "GOOGLE_AUTH_VERIFY"
      );
    }
  };

  const onOtpSubmit = (formValues: OTPFormFieldValues) => {
    setError("");
    verifyOtpMutate({
      ...formValues,
      user_id: userCredentials.user_id,
    });
  };

  const onMobileNumberSubmit = (formValues: MobileNumberFormFieldValues) => {
    setError("");
    setUserCredentials((prev) => ({
      ...prev,
      ...formValues,
    }));

    sendOtpMutate({
      ...formValues,
      user_id: userCredentials.user_id,
    });
  };

  const onGoogleAuthSubmit = (formValues: GoogleAuthFormFieldValues) => {
    setError("");
    verifyGoogleAuthMutate({
      ...formValues,
      user_id: userCredentials.user_id,
    });
  };

  switch (currentState) {
    case "AUTH_METHOD_SELECTION":
      return (
        <AuthMethodSelectionForm
          onSelect={onAuthMethodSelect}
          onBack={handleBack}
          error={error}
          hasOTP={authFlowData.requiresOTP}
          hasGoogleAuth={authFlowData.requiresGoogleAuth}
        />
      );

    case "MOBILE_NUMBER_ENTRY":
      return (
        <MobileNumberForm
          onSubmit={onMobileNumberSubmit}
          onBack={handleBack}
          error={error}
          isLoading={isSendOtpPending}
        />
      );

    case "OTP":
      return (
        <OTPForm
          onSubmit={onOtpSubmit}
          onBack={handleBack}
          error={error}
          isLoading={isVerifyOtpPending}
        />
      );

    case "GOOGLE_AUTH_SETUP":
      return (
        <GoogleAuthSetupForm
          setError={setError}
          onBack={handleBack}
          onContinue={() => setCurrentState("GOOGLE_AUTH_VERIFY")}
          error={error}
          userId={userCredentials.user_id}
        />
      );

    case "GOOGLE_AUTH_VERIFY":
      return (
        <GoogleAuthVerifyForm
          onSubmit={onGoogleAuthSubmit}
          onBack={handleBack}
          error={error}
          isLoading={isGoogleAuthPending}
        />
      );

    case "LOGIN":
      return (
        <LoginForm
          onSubmit={onLoginSubmit}
          error={error}
          isLoading={isLoginPending}
        />
      );
  }
};
