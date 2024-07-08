import * as Yup from "yup";

export const createOrgInitialSchema = Yup.object().shape({
  loginEmail: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .when("isVendor", {
      is: (isVendor) => !isVendor,
      then: (schema) =>
        schema.required("Email is required").typeError("Email is required"),
    }),
  userName: Yup.string()
    .min(3, "It's too short")
    .max(255)
    .when("isVendor", {
      is: (isVendor) => !isVendor,
      then: (schema) =>
        schema
          .required("Full name is required")
          .typeError("Full name is required"),
    }),
  phoneNumber: Yup.string()
    .phone("*", "Please enter a valid phone number")
    .when("isVendor", {
      is: (isVendor) => !isVendor,
      then: (schema) =>
        schema
          .required("A phone number is required")
          .typeError("A phone number is required"),
    }),
  hrOrganizationName: Yup.string()
    .max(255)
    .required("Organization name is required"),
  industriesId: Yup.array()
    .min(1, "Minimun of 1 is industry required")
    .max(3, "Maximum 3 industries are allowed")
    .required("Please select any industry"),
  hrTeamName: Yup.string().max(255).required("Team name is required"),
});
