import * as Yup from "yup";

export const customEmailSchema = Yup.object().shape({
  emailSubject: Yup.string()
    .required("Field is required!")
    .typeError("Field is required!"),
  fieldCategory: Yup.number()
    .typeError("Field is required!")
    .required("Field is required!"),
});
