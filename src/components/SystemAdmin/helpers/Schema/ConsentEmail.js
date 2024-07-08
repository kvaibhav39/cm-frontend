import * as Yup from "yup";

export const consentEmailSchema = Yup.object().shape({
  packageId: Yup.number(),
});
