import * as Yup from "yup";

export const addOperationsUsersSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Field is required!")
    .typeError("Field is required!"),
  userEmail: Yup.string()
    .email("Please provide a valid email address")
    .required("Field is required!")
    .typeError("Field is required!"),
  subRole: Yup.number()
    .required("Field is required!")
    .typeError("Field is required!"),
});
