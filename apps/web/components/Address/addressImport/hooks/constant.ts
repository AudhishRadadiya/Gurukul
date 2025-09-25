import type { AddressImportDetails } from "@web/components/Address/addressImport/hooks/useAddressImport";

export const SAMPLE_FILE =
  // eslint-disable-next-line sonarjs/no-clear-text-protocols
  "http://15.206.89.254:5001/api/upload/excel/AddressUpload.xlsx";

export const addressFieldLabels: Record<keyof AddressImportDetails, string> = {
  address: "Address",
  alternet_mobile_no: "Alternet Mobile No",
  anniversary_date: "Anniversary Date",
  birth_date: "Birth Date",
  city: "City",
  contact_no: "Contact No",
  district: "District",
  email_id: "Email",
  error: "Error",
  first_name: "First Name",
  landmark: "Landmark",
  middle_name: "Middle Name",
  pan_no: "Pan No",
  pincode: "Pin Code",
  surname: "Surname",
  taluko: "Taluko",
  village: "Village",
};
