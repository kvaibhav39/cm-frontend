import * as Yup from "yup";

export const additionalEmailSettingsSchema = (emailReceiversParams) => {
  let hrSchema = Yup.array()
    .nullable()
    .test({
      name: "hr",
      test: (hr) => hr === null || (Array.isArray(hr) && hr.length > 0),
      message: "Field is required",
      exclusive: true,
    });

  let opsSchema = Yup.array()
    .nullable()
    .test({
      name: "ops",
      test: (ops) => ops === null || (Array.isArray(ops) && ops.length > 0),
      message: "Field is required",
      exclusive: true,
    });

  let otherSchema = Yup.array()
    .nullable()
    .of(
      Yup.string().email("Invalid email address").required("Field is required")
    );

  let settingsSchema = {};

  emailReceiversParams.forEach((param) => {
    settingsSchema[param?.value] = Yup.object().shape({
      hr: hrSchema,
      ops: opsSchema,
      other: otherSchema,
    });
  });

  return Yup.object().shape({
    emailCategoryId: Yup.number()
      .typeError("Field is required!")
      .required("Field is required!"),
    frequency: Yup.array().of(
      Yup.object().shape({
        value: Yup.number()
          .integer("Please enter a valid number")
          .min(1, "Value must be greater than 0!")
          .nullable()
          .typeError("Field is required!")
          .required("Field is required!"),
        unit: Yup.number()
          .nullable()
          .typeError("Field is required!")
          .required("Field is required!"),
      })
    ),
    ...settingsSchema,
  });
};
