export const exportOtpKeys = {
  all: ["export-otp"],

  send: () => [...exportOtpKeys.all, "send"],
} as const;
