import type { OptionsType } from "@web/types/options";

export function usePaymentGatewayOptions() {
  const paymentGatewayOptions: OptionsType[] = [
    { label: "cashfree", value: "cashfree" },
    { label: "ccavenue", value: "ccavenue" },
    { label: "razorpay", value: "razorpay" },
  ] as const;

  return { paymentGatewayOptions };
}
