export const familyMember = {
  all: ["family-member"] as const,

  export: () => {
    return [...familyMember.all, "export"] as const;
  },

  listing: (body: object = {}) => {
    return [...familyMember.all, "listing", body] as const;
  },
} as const;
