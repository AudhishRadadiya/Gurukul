import { API, LIST, OPTION } from "@web/constants/routes/common";

export const USER_BASE_URL = `${API}/user` as const;

export const USER_ROUTES = {
  checkDemo: `${USER_BASE_URL}/check-demo` as const,

  delete: (addressTypeId: string) => `${USER_BASE_URL}/${addressTypeId}`,

  get: (addressTypeId: string) => `${USER_BASE_URL}/${addressTypeId}`,

  listing: `${USER_BASE_URL}/${LIST}`,

  options: `${USER_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (addressTypeId: string) => `${USER_BASE_URL}/${addressTypeId}`,

  permittedUserOptions:
    `${USER_BASE_URL}/${LIST}/${OPTION}/have-permission-users` as const,

  post: USER_BASE_URL,

  reportUserOptions: `${USER_BASE_URL}/${LIST}/${OPTION}/for-report` as const,
} as const;
