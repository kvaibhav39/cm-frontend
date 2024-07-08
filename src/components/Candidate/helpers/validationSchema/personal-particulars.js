import * as Yup from "yup";
import "yup-phone-lite";

const nickNameRequiredSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name is required")
    .max(50, "Should not exceed 50 characters"),
  lastName: Yup.string().max(50, "Should not exceed 50 characters"),
});

const formerNameRequiredSchema = Yup.object().shape({
  formerName: Yup.string()
    .required("Field is required!")
    .typeError("Field is required!")
    .max(50, "Should not exceed 50 characters"),
  formerNameDateChange: Yup.string()
    .typeError("Please select date")
    .required("Field is required!"),
});

const otherNameRequiredSchema = Yup.object().shape({
  otherName: Yup.string()
    .required("Field is required!")
    .typeError("Field is required!")
    .max(50, "Should not exceed 50 characters"),
  pinyinName: Yup.string()
    .nullable()
    .max(50, "Should not exceed 50 characters")
    .when("otherNameLanguageId", {
      is: (otherNameLanguageId) => otherNameLanguageId === 185,
      then: (schema) =>
        schema
          .required("Pinyin name is required")
          .typeError("Pinyin name is required"),
    }),

  otherNameLanguageId: Yup.number()
    .typeError("Please select language")
    .required("Field is required!"),
});

export const personalPerticularsValidationSchema = (vendorUser) =>
  Yup.object().shape(
    {
      lastName: Yup.string()
        .required("Last Name is required")
        .max(50, "Should not exceed 50 characters"),
      firstName: Yup.string()
        .required("First Name is required")
        .max(50, "Should not exceed 50 characters"),
      dateOfBirth: Yup.string()
        .required("Date of birth is required")
        .typeError("Date of birth is required"),
      countryOfBirthId: Yup.number()
        .required("Place of birth is required")
        .typeError("Place of birth is required"),
      gender: Yup.string().required("Gender is required"),
      personalParticularNumber: Yup.array().of(
        Yup.object().shape(
          {
            mobileNumber: Yup.string()
              .phone("*", "Please enter a valid phone number")
              .when("mobileNumber", {
                is: () => {
                  return !vendorUser;
                },
                then: (schema) => schema.required("A phone number is required"),
              }),
          },
          [["mobileNumber", "mobileNumber"]]
        )
      ),
      personalEmail: Yup.string()
        .email("Please provide a valid email address")
        .when("personalEmail", {
          is: () => {
            return !vendorUser;
          },
          then: (schema) =>
            schema.required("Personal email address is required"),
        }),
      nickNameExists: Yup.boolean(),
      otherNameExists: Yup.boolean(),
      formerNameExists: Yup.boolean(),
      nickName: Yup.mixed().when("nickNameExists", {
        is: true,
        then: Yup.array().of(nickNameRequiredSchema),
      }),
      formerNames: Yup.mixed().when("formerNameExists", {
        is: true,
        then: Yup.array().of(formerNameRequiredSchema),
      }),
      otherNames: Yup.mixed().when("otherNameExists", {
        is: true,
        then: Yup.array().of(otherNameRequiredSchema),
      }),
      DINNumberExists: Yup.boolean(),
      DINNumber: Yup.mixed().when("DINNumberExists", {
        is: true,
        then: Yup.string()
          .required("DIN number is required")
          .typeError("DIN number is required")
          .max(50, "Should not exceed 50 characters"),
      }),
      driverLicenseNumberExists: Yup.boolean(),
      driverLicenseNumber: Yup.mixed().when("driverLicenseNumberExists", {
        is: true,
        then: Yup.string()
          .required("Driving license number is required")
          .typeError("Driving license number is required")
          .max(50, "Should not exceed 50 characters"),
      }),
      driverLicenseFrontCopy: Yup.mixed().when("driverLicenseNumberExists", {
        is: true,
        then: Yup.string()
          .required("Driving license's front side is required")
          .typeError("Driving license's front side is required"),
      }),
      driverLicenseBackCopy: Yup.mixed().when("driverLicenseNumberExists", {
        is: true,
        then: Yup.string()
          .required("Driving license's back side is required")
          .typeError("Driving license's back side is required"),
      }),
    },
    [["personalEmail", "personalEmail"]]
  );
