export const userPermissionsKeys = {
  add: (userId: string) => [...userPermissionsKeys.all, "add", userId] as const,

  all: ["user-permission"],

  edit: (roleId: string) =>
    [...userPermissionsKeys.all, "edit", roleId] as const,

  get: (roleId: string) => [...userPermissionsKeys.all, "get", roleId] as const,

  getPermissionModules: () =>
    [...userPermissionsKeys.all, "get-permission-modules"] as const,

  listing: (body: object = {}) =>
    [...userPermissionsKeys.all, "listing", body] as const,
} as const;
