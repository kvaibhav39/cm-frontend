import * as Yup from "yup";

export const addressValidationSchema = Yup.object({
  addresses: Yup.array().of(
    Yup.object().shape({
      streetAddressLine1: Yup.string()
        .required("Street/Address is required")
        .max(200, "Should not exceed 50 characters"),
      cityTownDistrict: Yup.string()
        .required("City/Town/District is required")
        .max(200, "Should not exceed 50 characters"),
      stateProvince: Yup.string().when("countryId", {
        is: (countryId) => {
          if (countryId === 101 || countryId === 132) {
            return false;
          }
          return true;
        },
        then: (schema) => schema.required("State/Province is required"),
      }),
      countryId: Yup.number()
        .transform((value) => (isNaN(value) ? "" : value))
        .typeError("Please select proper country")
        .required("Country is required"),
      // fromDate: Yup.date()
      //   .when("toDate", (v) => {
      //     return (
      //       v && Yup.date().max(v, "From date can't be greater than To date")
      //     );
      //   })
      //   .required("From date is required")
      //   .typeError("From date is required"),
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
      // toDate: Yup.date()
      //   .when("fromDate", (v) => {
      //     return (
      //       v &&
      //       Yup.date()
      //         .min(v, "To date can't be smaller than From date")
      //         .required("To date is required")
      //         .typeError("To date is required")
      //     );
      //   })
      //   .required("To date is required")
      //   .typeError("To date is required"),
    })
  ),
});
