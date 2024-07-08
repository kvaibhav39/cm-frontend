import * as Yup from "yup";
import "yup-phone-lite";

export const verifierDetailsSchema = (isCheckTypeVerification) =>
  Yup.object().shape({
    isVerifierAPersonOr3rdParty: Yup.boolean().required(),
    verifierName: Yup.string()
      .max(50, "Should not exceed 50 characters")
      .when("isVerifierAPersonOr3rdParty", {
        is: true,
        then: (schema) =>
          schema.required("Field is required").typeError("Field is required"),
      }),
    verifierTitle: Yup.string()
      .max(50, "Should not exceed 50 characters")
      .when("isVerifierAPersonOr3rdParty", {
        is: true,
        then: (schema) =>
          schema.required("Field is required").typeError("Field is required"),
      }),

    verifierContactDetails: Yup.string()
      .phone("*", "Please enter a valid phone number")
      .when("isVerifierAPersonOr3rdParty", {
        is: true,
        then: (schema) =>
          schema.required("Field is required").typeError("Field is required"),
      }),
    dateOfVerification: Yup.string()
      .required("Field is required")
      .typeError("Field is required"),
    verifierParty: Yup.string()
      .max(50, "Name should not exceed 50 characters")
      .when("isVerifierAPersonOr3rdParty", {
        is: false,
        then: (schema) =>
          schema.required("Field is required").typeError("Field is required"),
      }),
  });
