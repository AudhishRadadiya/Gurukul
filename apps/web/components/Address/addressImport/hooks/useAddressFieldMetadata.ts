import type { AddressFieldMetaData } from "@web/components/Address/addressImport/AddressImport";

export const useAddressFieldMetadata = () => {
  const importAddressFieldMetadata: AddressFieldMetaData[] = [
    {
      data_type: "string",
      db_field_name: "address",
      template_field_name: "Address",
    },
    {
      data_type: "string",
      db_field_name: "alternet_mobile_no",
      template_field_name: "Alternet Mobile No",
    },
    {
      data_type: "string",
      db_field_name: "anniversary_date",
      template_field_name: "Anniversary Date",
    },
    {
      data_type: "string",
      db_field_name: "birth_date",
      template_field_name: "Birth Date",
    },
    { data_type: "string", db_field_name: "city", template_field_name: "City" },
    {
      data_type: "string",
      db_field_name: "contact_no",
      template_field_name: "Contact No",
    },
    {
      data_type: "string",
      db_field_name: "district",
      template_field_name: "District",
    },
    {
      data_type: "string",
      db_field_name: "email_id",
      template_field_name: "Email",
    },
    {
      data_type: "string",
      db_field_name: "first_name",
      template_field_name: "First Name",
    },
    {
      data_type: "string",
      db_field_name: "landmark",
      template_field_name: "Landmark",
    },
    {
      data_type: "string",
      db_field_name: "middle_name",
      template_field_name: "Middle Name",
    },
    {
      data_type: "string",
      db_field_name: "pan_no",
      template_field_name: "Pan No",
    },
    {
      data_type: "string",
      db_field_name: "pincode",
      template_field_name: "Pin Code",
    },
    {
      data_type: "string",
      db_field_name: "surname",
      template_field_name: "Surname",
    },
    {
      data_type: "string",
      db_field_name: "taluko",
      template_field_name: "Taluko",
    },
    {
      data_type: "string",
      db_field_name: "village",
      template_field_name: "Village",
    },
  ];

  return { importAddressFieldMetadata };
};
