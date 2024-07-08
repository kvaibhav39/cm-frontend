import * as Yup from "yup";

export const customFieldsSchema = Yup.object().shape({
  fieldName: Yup.string()
    .required("Field is required!")
    .typeError("Field is required!"),
  fieldDescription: Yup.string(),
  fieldCategory: Yup.number()
    .typeError("Field is required!")
    .required("Field is required!"),
  fieldType: Yup.number()
    .required("Field is required!")
    .typeError("Field is required!"),
  isMandatory: Yup.boolean().typeError("Field is required!"),
});
