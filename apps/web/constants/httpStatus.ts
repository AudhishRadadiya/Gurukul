export const HttpStatus = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  MethodNotAllowed: 405,
  InternalServerError: 500,
} as const;

export type HttpCodes = typeof HttpStatus;

export type HttpCodeNumbers = HttpCodes[keyof HttpCodes];
