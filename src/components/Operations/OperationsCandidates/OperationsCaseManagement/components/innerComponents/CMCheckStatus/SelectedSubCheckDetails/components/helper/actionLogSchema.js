import * as Yup from "yup";
import { INPUT_TYPES } from "../../../../../../../../../../store/constant";
import "yup-phone-lite";

export const actionLogSchema = (actionLogCategoriesInputs) => {
  const categoryInputFields = {};

  const getInputSchema = (id, isMandatory) => {
    const commonStringSchema = Yup.string().typeError("Field is required");
    const commonNumberSchema = Yup.number()
      .nullable()
      .typeError("Field is required");

    switch (id) {
      case INPUT_TYPES.TEXTBOX:
      case INPUT_TYPES.DATE_TIME:
      case INPUT_TYPES.DATE:
      case INPUT_TYPES.TEXT_AREA:
        return isMandatory
          ? commonStringSchema.required("Field is required")
          : Yup.string();

      case INPUT_TYPES.DROPDOWN:
      case INPUT_TYPES.CURRENCY_DROPDOWN:
        return isMandatory
          ? commonNumberSchema.required("Field is required")
          : Yup.number().nullable();

      case INPUT_TYPES.PHONE_INPUT:
        return isMandatory
          ? Yup.string()
              .phone("*", "Please enter a valid phone number")
              .required("A phone number is required")
          : Yup.string().phone("*", "Please enter a valid phone number");

      case INPUT_TYPES.EMAIL_INPUT:
        return isMandatory
          ? Yup.string()
              .email("Please provide a valid email address")
              .required("Field is required")
          : Yup.string().email("Please provide a valid email address");

      default:
        return null;
    }
  };

  actionLogCategoriesInputs?.forEach((catDetails) => {
    //defining schema for category input fields
    categoryInputFields[catDetails?.categoryInputName] = getInputSchema(
      catDetails?.categoryInputTypeId,
      catDetails?.isMandatory
    );

    let extraFieldsSchema = {};

    //checking for extra fields
    catDetails?.actionLogCategoryInputFieldsL1Data?.forEach(
      (catInputDetails) => {
        //if extra fields are present then we will define their schema
        if (catInputDetails?.categoryInputFieldL2) {
          let getExtraFields = {};
          //looping over extra fields & defining their schema
          catInputDetails?.categoryInputFieldL2.forEach((extraFieldData) => {
            extraFieldData.fieldName =
              extraFieldData?.label || "Please respond" + catInputDetails?.id;
            getExtraFields[
              extraFieldData?.label || "Please respond" + catInputDetails?.id
            ] = getInputSchema(
              extraFieldData?.fieldTypeId,
              catDetails?.isMandatory
            );
          });

          extraFieldsSchema = { ...extraFieldsSchema, ...getExtraFields };
        }
      }
    );

    //storing extra fields schema
    categoryInputFields[`${catDetails?.categoryInputName}-extraFields`] =
      Yup.object().shape(extraFieldsSchema);
  });

  return Yup.object().shape(categoryInputFields);
};
