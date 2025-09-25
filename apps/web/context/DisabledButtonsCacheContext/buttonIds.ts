export const buttonIds = {
  onSubmit: "onSubmit",
  onEdit: "onEdit",
} as const;

export type ButtonId = keyof typeof buttonIds;
