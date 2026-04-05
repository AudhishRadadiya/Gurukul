export const locationKeys = {
  all: ["location"] as const,

  cityOptions: () => [...locationKeys.all, "city-options"] as const,

  getLocation: (pincode: string) =>
    [...locationKeys.all, "get", pincode] as const,

  stateOptions: () => [...locationKeys.all, "state-options"] as const,
} as const;
