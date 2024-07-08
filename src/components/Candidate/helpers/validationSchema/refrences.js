import * as Yup from "yup";
import "yup-phone-lite";

export const referenceValidationSchema = (
  refCount,
  minNoOfRefrees,
  reasonForLessNoOfReference
) => {
  return Yup.object().shape(
    {
      noOfProfessionalReference: Yup.number().required(
        "Number of Professional Reference is required"
      ),
      reasonForLessNoOfReference: Yup.string().when(
        "reasonForLessNoOfReference",
        {
          is: () => {
            if (
              refCount < minNoOfRefrees &&
              reasonForLessNoOfReference === ""
            ) {
              return true;
            } else {
              return false;
            }
          },
          then: (schema) =>
            schema.required("Field is required").typeError("Field is required"),
        }
      ),
      references: Yup.array().of(
        Yup.object().shape({
          fullName: Yup.string().required("Full Name is required"),          
          title: Yup.string().required("Title is required"),
          companyName: Yup.string().required("Company Name is required"),
          professionalRelationshipId: Yup.number()
            .transform((value) => (isNaN(value) ? "" : value))
            .typeError("Please select proper relationship")
            .required("Professional Relationship is required"),
          city: Yup.string(),
          countryId: Yup.number()
            .transform((value) => (isNaN(value) ? "" : value))
            .typeError("Please select proper country")
            .required("Country is required"),
          email: Yup.string()
            .email("Please provide a valid email address")
            .required("Email is required"),
          referencePhoneNumber: Yup.string()
            .phone("*", "Please enter a valid phone number")
            .required("A phone number is required"),
          referencePhoneCountryCode: Yup.string().nullable(),
          additionalComments: Yup.string(),
        })
      ),
    },
    [["reasonForLessNoOfReference", "reasonForLessNoOfReference"]]
  );
};
