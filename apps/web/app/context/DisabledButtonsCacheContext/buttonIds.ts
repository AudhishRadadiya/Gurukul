export const buttonIds = {
  onEdit: "onEdit",
  onSubmit: "onSubmit",
} as const;

export type ButtonId = keyof typeof buttonIds;
