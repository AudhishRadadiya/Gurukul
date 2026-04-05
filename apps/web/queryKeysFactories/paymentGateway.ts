export const paymentGatewayKeys = {
  add: () => [...paymentGatewayKeys.all, "add"] as const,

  all: ["payment-gateway"] as const,

  edit: (paymentGatewayId: string) =>
    [...paymentGatewayKeys.all, "edit", paymentGatewayId] as const,

  get: (paymentGatewayId: string) =>
    [...paymentGatewayKeys.all, "get", paymentGatewayId] as const,

  listing: (body: object = {}) => {
    return [...paymentGatewayKeys.all, "listing", body] as const;
  },
} as const;
