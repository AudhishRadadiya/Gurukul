export const LIST_USER_PERMISSIONS = "list-user-permissions";
export const ADD_USER_PERMISSIONS = "add-user-permissions";
export const EDIT_USER_PERMISSIONS = "edit-user-permissions";

export const userPermissionsPage = {
  [ADD_USER_PERMISSIONS]: "Add User Permissions",
  [EDIT_USER_PERMISSIONS]: "Edit User Permissions",
  [LIST_USER_PERMISSIONS]: "User Permissions",
} as const;

export type UserPermissionsType = keyof typeof userPermissionsPage;

export const userPermissionsPageEnums: UserPermissionsType[] = Object.keys(
  userPermissionsPage
) as UserPermissionsType[];
