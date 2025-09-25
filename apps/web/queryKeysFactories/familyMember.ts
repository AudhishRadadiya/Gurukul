export const familyMember = {
  all: ["family-member"] as const,

  listing: (body: object = {}) => {
    return [...familyMember.all, "listing", body] as const;
  },
} as const;
