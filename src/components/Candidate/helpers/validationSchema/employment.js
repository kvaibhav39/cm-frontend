import moment from "moment";
import * as Yup from "yup";
import "yup-phone-lite";

export const bonusDataSchema = Yup.object().shape({
  bonusCurrencyId: Yup.number()
    .typeError("Please select bonus currency")
    .required("Currency is required"),
  bonusAmount: Yup.number()
    .min(1, "Please enter a positive amount")
    .max(Number.MAX_SAFE_INTEGER, "Please enter a practical amount")
    .required("Bonus Amount is required")
    .typeError("Bonus Amount is required"),
  bonusTypeId: Yup.number()
    .required("Bonus Type is required")
    .typeError("Bonus Type is required"),
  otherBonusTypeName: Yup.string().when("bonusTypeId", {
    is: (bonusTypeId) => {
      if (bonusTypeId === 3) {
        return true;
      }
      return false;
    },
    then: (schema) =>
      schema
        .required("Other Bonus Type is required")
        .typeError("Other Bonus Type is required"),
    otherwise: Yup.string().nullable(),
  }),
});

export const emplomentValidationSchema = (checkGap) => {
  return Yup.object({
    employments: Yup.array().of(
      Yup.object().shape({
        jobTitle: Yup.string()
          .required("Job Title is required")
          .typeError("Job Title is required")
          .max(50, "Should not exceed 50 characters"),
        reasonForLeaving: Yup.number()
          .required("Reason For Leaving is required")
          .typeError("Reason For Leaving is required"),
        otherReasonForLeaving: Yup.string().when("reasonForLeaving", {
          is: (reasonForLeaving) => {
            if (reasonForLeaving === 8) {
              return true;
            }
            return false;
          },
          then: (schema) =>
            schema
              .required("Other Reason For Leaving is required")
              .typeError("Other Reason For Leaving is required"),
          otherwise: Yup.string().nullable(),
        }),
        companyName: Yup.string()
          .required("Company Name is required")
          .max(50, "Should not exceed 50 characters"),
        fromDate: Yup.string()
          .required("From Date is required")
          .typeError("From Date is required"),
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
        cessationDate: Yup.string()
          .nullable()
          .when("canContactEmployer", {
            is: (canContactEmployer) => {
              if (!canContactEmployer) {
                return true;
              }
              return false;
            },
            then: (schema) =>
              schema
                .required("Cessation Date is required")
                .typeError("Cessation Date is required"),
          }),
        reasonOfChoosingLateCessationDate: Yup.string().when(
          ["cessationDate", "canContactEmployer"],
          {
            is: (cessationDate, canContactEmployer) => {
              let currentDate = moment();
              let tempCessationDate = moment(cessationDate);
              let diff = tempCessationDate.diff(currentDate, "days");

              if (diff >= 30 && !canContactEmployer) {
                return true;
              } else {
                return false;
              }
            },
            then: (schema) =>
              schema
                .required("Reason Of Choosing Late Cessation Date is required")
                .typeError(
                  "Reason Of Choosing Late Cessation Date is required"
                ),
          }
        ),
        employerStreetAddressLine1: Yup.string()
          .required("Address Line 1 is required")
          .max(200, "Should not exceed 50 characters"),
        employerCityTownDistrict: Yup.string()
          .required("City/Town/District is required")
          .max(50, "Should not exceed 50 characters"),
        employerCountryId: Yup.number()
          .typeError("Please select country")
          .required("Country is required"),
        employerPhoneNumber: Yup.string()
          .phone("*", "Please enter a valid phone number")
          .required("A phone number is required"),
        employmentStatusId: Yup.number()
          .typeError("Please select employment status")
          .required("Employment Status is required"),
        employerStateProvince: Yup.string().when("employerCountryId", {
          is: (employerCountryId) => {
            if (employerCountryId === 101 || employerCountryId === 132) {
              return false;
            }
            return true;
          },
          then: (schema) => schema.required("State/ Province is required"),
        }),
        employmentTypeId: Yup.number()
          .typeError("Please select employment type")
          .required("Employment Type is required"),
        wasBonusReceived: Yup.boolean(),
        bonus: Yup.mixed().when("wasBonusReceived", {
          is: true,
          then: Yup.array().of(bonusDataSchema),
        }),
        wasResignationRequested: Yup.boolean()
          .nullable()
          .when("reasonForLeaving", {
            is: (reasonForLeaving) => {
              if (reasonForLeaving === 5) {
                return true;
              }
              return false;
            },
            then: (schema) => schema.typeError("Field is required"),
          }),
        reasonOfResignationRequested: Yup.mixed().when(
          "wasResignationRequested",
          {
            is: true,
            then: Yup.string()
              .required("Resignation Reason is required")
              .typeError("Resignation Reason is required"),
          }
        ),
        supervisorName: Yup.string().nullable(),
        supervisorTitle: Yup.string().nullable(),
        supervisorEmail: Yup.string()
          .email("Please provide a valid email address")
          .nullable(),
        hrName: Yup.string().nullable(),
        hrTitle: Yup.string().nullable(),
        hrEmail: Yup.string()
          .email("Please provide a valid email address")
          .nullable(),
        salaryAmount: Yup.number()
          .required("Salary Amount is required")
          .min(1, "Salary can't be less than or equal zero.")
          .max(Number.MAX_SAFE_INTEGER, "Please enter a practical amount"),
        salaryCurrencyId: Yup.number()
          .typeError("Please select salary currency")
          .required("Salary Currency is required"),
        salaryFrequencyId: Yup.number()
          .typeError("Please select salary frequency")
          .required("Salary Frequency is required"),
        otherSalaryFrequency: Yup.string()
          .nullable()
          .when("salaryFrequencyId", {
            is: (salaryFrequencyId) => {
              if (salaryFrequencyId === 6) {
                return true;
              }
              return false;
            },
            then: (schema) =>
              schema
                .required("Other Salary Frequency is required")
                .typeError("Other Salary Frequency is required"),
          }),
        wasOnPayrollOfAgency: Yup.boolean(),
        agencyName: Yup.mixed().when("wasOnPayrollOfAgency", {
          is: true,
          then: Yup.string()
            .required("Agency Name is required")
            .typeError("Agency Name is required"),
        }),
        agencyStreetAddressLine1: Yup.mixed().when("wasOnPayrollOfAgency", {
          is: true,
          then: Yup.string()
            .required("Agency Street Address Line 1 is required")
            .typeError("Agency Street Address Line 1 is required"),
        }),
        agencyCityTownDistrict: Yup.mixed().when("wasOnPayrollOfAgency", {
          is: true,
          then: Yup.string()
            .required("Agency City Town District is required")
            .typeError("Agency City Town District is required"),
        }),
        agencyCountryId: Yup.mixed().when("wasOnPayrollOfAgency", {
          is: true,
          then: Yup.number()
            .typeError("Please select country")
            .required("Agency Country is required"),
        }),
        agencyStateProvince: Yup.mixed().when("wasOnPayrollOfAgency", {
          is: true,
          then: Yup.string()
            .nullable()
            .when("agencyCountryId", {
              is: (agencyCountryId) => {
                if (agencyCountryId === 101 || agencyCountryId === 132) {
                  return false;
                }
                return true;
              },
              then: (schema) =>
                schema
                  .required("Agency State Province is required")
                  .typeError("Field is required"),
            }),
        }),
      })
    ),
    employmentsGaps: Yup.array().of(
      Yup.object().shape(
        {
          reasonOfGapId: Yup.number()
            .nullable()
            .when("reasonOfGapId", {
              is: checkGap,
              then: (schema) =>
                schema
                  .required("Field is required")
                  .typeError("Field is required"),
            }),
          additionalComments: Yup.string().when("reasonOfGapId", {
            is: (reasonOfGapId) => {
              if (reasonOfGapId === 3) {
                return true;
              }
              return false;
            },
            then: (schema) =>
              schema
                .required("Additional Comment is required")
                .typeError("Additional Comment is required"),
          }),
        },
        [["reasonOfGapId", "reasonOfGapId"]]
      )
    ),
  });
};
