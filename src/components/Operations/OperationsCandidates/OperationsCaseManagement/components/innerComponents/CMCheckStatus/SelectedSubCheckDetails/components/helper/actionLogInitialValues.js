import { INPUT_TYPES } from "../../../../../../../../../../store/constant";

export const actionLogInitialValues = (actionLogCategoriesInputs) => {
  let categoryInputFields = {};

  const getInputValues = (id) => {
    switch (id) {
      case INPUT_TYPES.TEXTBOX:
      case INPUT_TYPES.DATE_TIME:
      case INPUT_TYPES.DATE:
      case INPUT_TYPES.TEXT_AREA:
      case INPUT_TYPES.EMAIL_INPUT:
      case INPUT_TYPES.PHONE_INPUT:
        return "";

      case INPUT_TYPES.DROPDOWN:
      case INPUT_TYPES.CURRENCY_DROPDOWN:
        return null;
    }
  };

  actionLogCategoriesInputs?.forEach((catDetails) => {
    //defining schema for category input fields
    categoryInputFields[catDetails?.categoryInputName] = getInputValues(
      catDetails?.categoryInputTypeId
    );

    //checking for extra fields
    if (catDetails?.actionLogCategoryInputFieldsL1Data) {
      catDetails?.actionLogCategoryInputFieldsL1Data.forEach(
        (catInputDetails) => {
          //if extra fields are present then we will define their schema
          if (catInputDetails?.categoryInputFieldL2) {
            let extraFieldsInitialValues = {};

            //looping over extra fields & defining their schema
            catInputDetails?.categoryInputFieldL2.forEach((extraFieldData) => {
              extraFieldsInitialValues[
                extraFieldData?.label || "Please respond" + catInputDetails?.id
              ] = getInputValues(extraFieldData?.fieldTypeId);
            });

            //storing extra fields schema
            categoryInputFields[
              `${catDetails?.categoryInputName}-extraFields`
            ] = extraFieldsInitialValues;
          }
        }
      );
    }
  });

  return categoryInputFields;
};
