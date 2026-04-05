import { userPermissionsKeys } from "@web/queryKeysFactories/userPermissions";

export const authKeys = {
  all: ["auth"] as const,

  clientIp: () => [...authKeys.all, "client-ip"] as const,

  forgetPassword: () => [...authKeys.all, "forget-password"] as const,

  getUserAccess: () => [...userPermissionsKeys.all, "get-user-access"],

  login: (requestBody: object = {}) =>
    [...authKeys.all, "login", requestBody] as const,

  otpVerify: () => [...authKeys.all, "otp-verify"] as const,

  refreshToken: (refreshToken: string) =>
    [...authKeys.all, "refresh-token", refreshToken] as const,

  resetPassword: () => [...authKeys.all, "reset-password"] as const,

  sendOtp: () => [...authKeys.all, "send-otp"] as const,

  twoFactorEnable: () => [...authKeys.all, "two-factor-enable"] as const,

  twoFactorVerify: () => [...authKeys.all, "two-factor-verify"] as const,
};
