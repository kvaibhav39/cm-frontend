import * as Yup from "yup";

export const identityValidationSchema = (identityDocumentTypeLists) => {
  return Yup.object().shape({
    birthCountryId: Yup.number()
      .required("Field is required!")
      .typeError("Please select proper country")
      .transform((value) => (isNaN(value) ? "" : value)),
    primaryNationalityId: Yup.number()
      .required("Field is required!")
      .typeError("Please select proper country")
      .transform((value) => (isNaN(value) ? "" : value)),
    residenceCountryId: Yup.number()
      .required("Field is required!")
      .typeError("Please select proper country")
      .transform((value) => (isNaN(value) ? "" : value)),
    identityDocumentType: Yup.string()
      .nullable()
      .when("_", {
        is: () => {
          return Boolean(identityDocumentTypeLists?.length);
        },
        then: (schema) =>
          schema.required("Field is required!").typeError("Field is required!"),
        otherwise: (schema) => schema,
      }),
    identityDocumentNumber: Yup.string()
      .nullable()
      .max(50, "Should not exceed 50 characters")
      .when("_", {
        is: () => {
          return Boolean(identityDocumentTypeLists?.length);
        },
        then: (schema) =>
          schema.required("Field is required!").typeError("Field is required!"),
        otherwise: (schema) => schema,
      }),
  });
};
