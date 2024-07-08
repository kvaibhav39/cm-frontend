import * as Yup from "yup";

export const familyValidationSchema = Yup.object().shape({
  fathersFirstName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  fathersMiddleName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  fathersLastName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  mothersFirstName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  mothersMiddleName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  mothersLastName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  mothersFirstName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  spouseFirstName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  spouseMiddleName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  spouseLastName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  mothersLastName: Yup.string().nullable().max(50, "Should not exceed 50 characters"),
  mothersMaidenNameExists: Yup.boolean(),
  mothersMaidenName: Yup.mixed().when("mothersMaidenNameExists", {
    is: true,
    then: Yup.string()
      .required("Mother's maiden name is required")
      .typeError("Mother's maiden name is required'")
      .max(50, "Should not exceed 50 characters"),
  }),
});
