import type { OptionsType } from "@web/types/options";

export type UserTypeOptionsKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function useGetDonationReportTypeOptions() {
  const donationReportTypeOptions: OptionsType[] = [
    { label: "Donation Cash", value: 1 },
    {
      label: "Donation With Cash Address",
      value: 2,
    },
    { label: "Donation Cheque", value: 3 },
    { label: "Yearly Summary", value: 4 },
    { label: "Yearly Detail", value: 5 },
    { label: "Cancel Receipt", value: 6 },
    {
      label: "Donation Receipt No Wise",
      value: 7,
    },
    {
      label: "Donation Receipt No Wise With Address",
      value: 8,
    },
    {
      label: "Yearly Trust Wise Summary",
      value: 9,
    },
    {
      label: "Yearly Summary Branch Wise",
      value: 10,
    },
  ];

  return { donationReportTypeOptions };
}
