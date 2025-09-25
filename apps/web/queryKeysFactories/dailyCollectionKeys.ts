export const dailyCollectionKeys = {
  all: ["daily-collection"] as const,

  generate: () => [...dailyCollectionKeys.all, "generate"] as const,

  post: () => [...dailyCollectionKeys.all, "post"] as const,
} as const;
