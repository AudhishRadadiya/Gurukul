export const LIST_ROLES = "list-roles";
export const ADD_ROLES = "add-roles";
export const EDIT_ROLES = "edit-roles";

export const rolesPage = {
  [ADD_ROLES]: "Add Roles",
  [EDIT_ROLES]: "Edit Roles",
  [LIST_ROLES]: "Roles List",
} as const;

export type RolesPageType = keyof typeof rolesPage;

export const RolesPageEnums: RolesPageType[] = Object.keys(
  rolesPage
) as RolesPageType[];
