export const uploadKeys = {
  add: (body: object = {}) => [...uploadKeys.all, "file", body],

  all: ["upload"] as const,
};
