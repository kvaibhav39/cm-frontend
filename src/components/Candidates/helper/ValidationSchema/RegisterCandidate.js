import * as Yup from "yup";
import "yup-phone-lite";

export const CandidateRegisterSchema = (
  collectCandidateRegistrationEmail,
  collectCandidateRegistrationPhoneNo
) =>
  Yup.object().shape(
    {
      candidateName: Yup.string()
        .required("Candidate name is required")
        .max(50, "Candidate name should not exceed 50 characters"),
      // .matches(
      //   /^[a-zA-Z0-9\s]*$/,
      //   "Candidate name should not contain special characters"
      // ),
      candidateEmail: Yup.string()
        .email("Invalid email format")
        .when("candidateEmail", {
          is: () => {
            return collectCandidateRegistrationEmail;
          },
          then: (schema) => schema.required("Email is required"),
        }),
      candidatePhone: Yup.string()
        .phone("*", "Please enter a valid phone number")
        .when("candidatePhone", {
          is: () => {
            return collectCandidateRegistrationPhoneNo;
          },
          then: (schema) => schema.required("Phone is required"),
        }),
      hiringCountryId: Yup.string().required("Hiring country is required"),
      hrTeamId: Yup.string().required("Team is required"),
      customFields: Yup.array().of(
        Yup.object().shape({
          customFieldId: Yup.number().integer().required(),
          customFieldTypeId: Yup.number().integer().required(),
          customFieldValueId: Yup.number()
            .nullable()
            .when(["customFieldTypeId", "isMandatory"], {
              is: (customFieldTypeId, isMandatory) => {
                //to access isMandatory here , we have added it in initialValues.
                //So for different custom fields , we will have different
                //isMandatory which results in dynamic 'required' fields
                if (customFieldTypeId === 2 && isMandatory) {
                  return true;
                }
                return false;
              },
              then: (schema) => schema.integer().required("Field is required"),
            }),
          customFieldResponseText: Yup.string().when(
            ["customFieldTypeId", "isMandatory"],
            {
              is: (customFieldTypeId, isMandatory) => {
                if (customFieldTypeId === 1 && isMandatory) {
                  return true;
                }
                return false;
              },
              then: (schema) => schema.required("Field is required"),
            }
          ),
        })
      ),
    },
    [
      ["candidateEmail", "candidateEmail"],
      ["candidatePhone", "candidatePhone"],
    ]
  );
