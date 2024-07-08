import * as Yup from "yup";
import "yup-phone-lite";

export const updateProfileSchema = Yup.object().shape({
  userName: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    .phone("*", "Please enter a valid phone number")
    .required("A phone number is required"),
});
