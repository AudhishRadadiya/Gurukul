import type { DonationImportDetails } from "@web/components/Donation/donationImport/hooks/useDonationImport";

export const SAMPLE_FILE =
  // eslint-disable-next-line sonarjs/no-clear-text-protocols
  "http://15.206.89.254:5001/api/upload/excel/Import_Doantion_Sample.xlsx";

export const donationFieldLabels: Record<keyof DonationImportDetails, string> =
  {
    aadhar_no: "Aadhar No.",
    address: "Address",
    amount: "Amount",
    atg: "80G",
    bank_name: "Bank Name",
    cheque_no: "Cheque No.",
    city: "City",
    contact_no: "Contact Number",
    date: "Date",
    donation_mode: "Donation Mode",
    donation_type: "Donation Type",
    driving_licence_no: "Driving Licence No.",
    elector_number: "Elector Number",
    email: "Email",
    error: "Error",
    event_name: "Event Name",
    organize_remark: "Organize Remark",
    pan_no: "Pan No.",
    passport_number: "Passport No.",
    prasad: "Prasad",
    receipt_name: "Receipt Name",
    remark: "Remark",
    state: "State",
    zip_code: "Zip Code",
  };
