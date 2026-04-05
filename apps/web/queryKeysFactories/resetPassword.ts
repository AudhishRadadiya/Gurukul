export const resetPasswordKeys = {
  all: ["reset-password"],

  post: () => [...resetPasswordKeys.all, "get"] as const,
} as const;
