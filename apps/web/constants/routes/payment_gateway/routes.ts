import { API, LIST } from "@web/constants/routes/common";

export const PAYMENT_GATEWAY_BASE_URL = `${API}/payment_gateway` as const;

export const PAYMENT_GATEWAY_ROUTES = {
  get: (paymentGatewayId: string) =>
    `${PAYMENT_GATEWAY_BASE_URL}/${paymentGatewayId}` as const,

  listing: `${PAYMENT_GATEWAY_BASE_URL}/${LIST}` as const,

  patch: (paymentGatewayId: string) =>
    `${PAYMENT_GATEWAY_BASE_URL}/${paymentGatewayId}`,

  post: `${PAYMENT_GATEWAY_BASE_URL}` as const,
} as const;
