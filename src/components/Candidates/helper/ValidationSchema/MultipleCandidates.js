import * as Yup from "yup";
import "yup-phone-lite";

export const MultipleCandidatesSchema = Yup.array().of(
  Yup.object().shape({
    candidateName: Yup.string()
      .required("Candidate name is required")
      .max(50, "Candidate name should not exceed 50 characters"),
    // .matches(
    //   /^[a-zA-Z0-9\s]*$/,
    //   "Candidate name should not contain special characters"
    // ),
    candidateEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    candidatePhone: Yup.string()
      .phone("*", "Please enter a valid phone number")
      .required("A phone number is required"),
    hiringCountryName: Yup.string().required("Hiring country name is required"),
    hrTeamName: Yup.string().required("Team name is required"),
    packageName: Yup.string().required("Package name is required"),
    customFields: Yup.array(),
  })
);
