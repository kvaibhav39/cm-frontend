import * as Yup from "yup";

export const educationValidationSchema = Yup.object({
  qualifications: Yup.array().of(
    Yup.object().shape({
      nameOfSchoolCollegeUniversity: Yup.string()
        .required("Name of School/College/University is required")
        .max(200, "Should not exceed 50 characters"),
      // apartmentNoUnitNoBuildingName:
      //   Yup.string().required("Field is required"),
      streetAddressLine1: Yup.string()
        .required("Address Line 1 is required")
        .max(200, "Should not exceed 50 characters"),
      cityTownDistrict: Yup.string()
        .required("City/Town/District is required")
        .max(50, "Should not exceed 50 characters"),
      stateProvince: Yup.string().when("countryId", {
        is: (countryId) => {
          if (countryId === 101 || countryId === 132) {
            return false;
          }
          return true;
        },
        then: (schema) => schema.required("State/ Province is required"),
      }),
      countryId: Yup.number().required("Country is required"),
      qualificationTypeId: Yup.number()
        .required("Type Of Qualification is required")
        .typeError("Type Of Qualification is required"),
      // qualificationTypeOthers: Yup.string()
      //   .required("Field is required")
      //   .typeError("Field is required"),
      specilization: Yup.string()
        .required("Specialization is required")
        .max(200, "Should not exceed 50 characters"),
      educationTypeId: Yup.number()
        .nullable()
        .required("Education Type is required")
        .typeError("Education Type is required"),
      certificateNo: Yup.string()
        .required("Certificate No is required")
        .max(50, "Should not exceed 50 characters"),
      gradePercentageGpaScore: Yup.string()
        .required("Grade/Percentage/GPA Score is required")
        .max(50, "Should not exceed 50 characters"),
      studentEnrollmentNo: Yup.string()
        .required("Student No/Enrollment No is required")
        .max(50, "Should not exceed 50 characters"),
      titleOfQualification: Yup.string()
        .required("Title of Qualification is required")
        .max(50, "Should not exceed 50 characters"),
      fromDate: Yup.string().required("From Date is required"),
      toDate: Yup.date()
        .when("fromDate", (v) => {
          if (!v) return;
          return Yup.date()
            .min(v, "To date can't be smaller than From date")
            .required("To Date is required")
            .typeError("To Date is required");
        })
        .required("To Date is required")
        .typeError("To Date is required"),
      qualificationTypeOthers: Yup.string().when("qualificationTypeId", {
        is: (qualificationTypeId) => {
          if (qualificationTypeId === 8) {
            return true;
          }
          return false;
        },
        then: (schema) => schema.required("Other Qualification is required"),
      }),
      otherEducationType: Yup.string()
        .nullable()
        .when("educationTypeId", {
          is: (educationTypeId) => {
            if (educationTypeId === 3) {
              return true;
            }
            return false;
          },
          then: (schema) =>
            schema
              .required("Other Education Type is required")
              .typeError("Other Education Type is required"),
        }),
    })
  ),
});
