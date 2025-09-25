import { useMemo } from "react";

import type { DonationFieldMetaData } from "@web/components/Donation/donationImport/DonationImport";

export const useDonationFieldMetadata = () => {
  const importDonationFieldMetadata: DonationFieldMetaData[] = useMemo(
    () => [
      {
        data_type: "string",
        db_field_name: "aadhar_no",
        template_field_name: "Aadhar No.",
      },
      {
        data_type: "string",
        db_field_name: "address",
        template_field_name: "Address",
      },
      {
        data_type: "number",
        db_field_name: "amount",
        template_field_name: "Amount",
      },
      {
        data_type: "boolean",
        db_field_name: "atg",
        template_field_name: "80G",
      },
      {
        data_type: "string",
        db_field_name: "bank_name",
        template_field_name: "Bank Name",
      },
      {
        data_type: "string",
        db_field_name: "cheque_no",
        template_field_name: "Cheque No.",
      },
      {
        data_type: "string",
        db_field_name: "city",
        template_field_name: "City",
      },
      {
        data_type: "string",
        db_field_name: "contact_no",
        template_field_name: "Contact Number",
      },
      {
        data_type: "string",
        db_field_name: "date",
        template_field_name: "Date",
      },
      {
        data_type: "string",
        db_field_name: "donation_mode",
        template_field_name: "Donation Mode",
      },
      {
        data_type: "string",
        db_field_name: "donation_type",
        template_field_name: "Donation Type",
      },
      {
        data_type: "string",
        db_field_name: "driving_licence_no",
        template_field_name: "Driving Licence No.",
      },
      {
        data_type: "string",
        db_field_name: "elector_number",
        template_field_name: "Elector Number",
      },
      {
        data_type: "string",
        db_field_name: "email",
        template_field_name: "Email",
      },
      {
        data_type: "string",
        db_field_name: "event_name",
        template_field_name: "Event Name",
      },
      {
        data_type: "string",
        db_field_name: "organize_remark",
        template_field_name: "Organize Remark",
      },
      {
        data_type: "string",
        db_field_name: "pan_no",
        template_field_name: "Pan No.",
      },
      {
        data_type: "string",
        db_field_name: "passport_number",
        template_field_name: "Passport No.",
      },
      {
        data_type: "boolean",
        db_field_name: "prasad",
        template_field_name: "Prasad",
      },
      {
        data_type: "string",
        db_field_name: "receipt_name",
        template_field_name: "Receipt Name",
      },
      {
        data_type: "string",
        db_field_name: "remark",
        template_field_name: "Remark",
      },
      {
        data_type: "string",
        db_field_name: "state",
        template_field_name: "State",
      },
      {
        data_type: "string",
        db_field_name: "zip_code",
        template_field_name: "Zip Code",
      },
    ],
    []
  );

  return { importDonationFieldMetadata };
};
