import { API } from "@web/constants/routes/common";

export const AUTH_BASE_URL = `${API}/auth`;

export const AUTH_ROUTES = {
  accessToken: `${AUTH_BASE_URL}/generate-access-token` as const,

  forgetPassword: `${AUTH_BASE_URL}/forget-password` as const,

  getUserAccess: () => `${AUTH_BASE_URL}/permission` as const,

  login: `${AUTH_BASE_URL}/login` as const,

  otpVerify: `${AUTH_BASE_URL}/otp/verify` as const,

  resetPassword: `${AUTH_BASE_URL}/reset-password` as const,

  sendOtp: `${AUTH_BASE_URL}/otp/send` as const,

  twoFactorEnable: (userId: string) =>
    `${AUTH_BASE_URL}/two_factor/enable/${userId}` as const,

  twoFactorVerify: `${AUTH_BASE_URL}/two_factor/verify` as const,
};
