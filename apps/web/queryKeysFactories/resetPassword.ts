export const resetPasswordKeys = {
  all: ["reset-password"],

  post: (userId: string) => [...resetPasswordKeys.all, "get", userId] as const,
} as const;
