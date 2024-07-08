import * as Yup from "yup";

export const professionalValidationSchema = Yup.object({
  qualifications: Yup.array().of(
    Yup.object().shape({
      professionalQualificationTitle: Yup.string()
        .required("Professional Qualification Title is required")
        .max(50, "Should not exceed 50 characters"),
      qualifyingInstituteBodyName: Yup.string()
        .required("Qualifying Institute Body Name is required")
        .max(50, "Should not exceed 50 characters"),
      countryId: Yup.number()
        .required("Country is required")
        .typeError("Country is required"),
      statusProfessionalQualificationId: Yup.number()
        .required("Status of Your Professional Qualification is required")
        .typeError("Status of Your Professional Qualification is required"),
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
        then: (schema) => schema.required("State/Province is required"),
      }),
      dateOfAccreditation: Yup.string()
        .required("Date of Accreditation is required")
        .typeError("Date of Accreditation is required"),
      fromDate: Yup.string()
        .required("From Date is required")
        .typeError("From Date is required"),
      // fromDate: Yup.string().when("statusProfessionalQualificationId", {
      //   is: (statusProfessionalQualificationId) => {
      //     if (statusProfessionalQualificationId === 5) {
      //       return true;
      //     }
      //     return false;
      //   },
      //   then: (schema) =>
      //     schema.required("Field is required").typeError("Field is required"),
      // }),
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
      // toDate: Yup.date().when("statusProfessionalQualificationId", {
      //   is: (statusProfessionalQualificationId) => {
      //     if (statusProfessionalQualificationId === 5) {
      //       return true;
      //     }
      //     return false;
      //   },
      //   then: Yup.date()
      //     .when("fromDate", (v) => {
      //       if (!v) return;
      //       return Yup.date()
      //         .min(v, "To date can't be smaller than From date")
      //         .required("Field is required")
      //         .typeError("Field is required");
      //     })
      //     .required("Field is required")
      //     .typeError("Field is required"),
      // }),
      otherProffesionalQualificationStatus: Yup.string().when(
        "statusProfessionalQualificationId",
        {
          is: (statusProfessionalQualificationId) => {
            if (statusProfessionalQualificationId === 4) {
              return true;
            }
            return false;
          },
          then: (schema) =>
            schema
              .required("Other Professional Qualification Status is required")
              .typeError("Other Professional Qualification Status is required"),
        }
      ),
    })
  ),
});
