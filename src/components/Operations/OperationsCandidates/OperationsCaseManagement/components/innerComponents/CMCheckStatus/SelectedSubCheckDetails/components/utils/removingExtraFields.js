export const removingExtraFields = (validationErrors,categoryInputValues,actionLogCategoriesInputs) => {
  //when there's no validationErrors Object.keys() wont get looped over, so there can be a case
  //where 'extraFields' gets left behind in values , so we will take finalObj as
  //values when there's no validationErrors so that Object.keys() is able to loop and remove the extraFields
  let finalObj =
    validationErrors && Object.keys(validationErrors).length
      ? validationErrors
      : categoryInputValues;

  //removing field containing '-extrafields' from categoryInputValues & validationErrors
  //so that payload donot contain any extrafields if any dropdown with no extrafields gets selected
  Object.keys(finalObj).forEach((key) => {
    // Check if the key contains 'extraFields'
    if (key.includes("-extraFields")) {
      // Extract the base field name (e.g., select_comment)
      const extractedFieldName = key.split("-extraFields")[0];

      actionLogCategoriesInputs?.forEach((catDetails) => {
        if (catDetails?.categoryInputName === extractedFieldName) {
          //checking if the selected dropdown value contains any extra fields or not
          let ifPresent = catDetails?.actionLogCategoryInputFieldsL1Data?.find(
            (catInputDetails) =>
              categoryInputValues[extractedFieldName] === catInputDetails?.id &&
              catInputDetails?.categoryInputFieldL2
          );

          //if the id selected has no extra fields then we will delete the '-extraFields' field
          if (!ifPresent) {
            delete categoryInputValues[key];
            delete validationErrors[key];
          } else {
            let extraFieldsArr = ifPresent?.categoryInputFieldL2;

            // Function to keep only specified keys in an object
            const keepOnlyKeys = (obj, keysToKeep) => {
              Object.keys(obj).forEach((key) => {
                if (!keysToKeep.includes(key)) {
                  delete obj[key];
                }
              });
            };

            // Keep only specified keys in obj
            keepOnlyKeys(
              categoryInputValues && categoryInputValues[key]
                ? categoryInputValues[key]
                : {},
              extraFieldsArr?.map((item) => item.fieldName)
            );

            // Keep only specified keys in obj
            keepOnlyKeys(
              validationErrors && validationErrors[key]
                ? validationErrors[key]
                : {},
              extraFieldsArr?.map((item) => item.fieldName)
            );

            //if such a id is present then we will add an extra 'label' field
            categoryInputValues[key].label =
              ifPresent?.categoryInputFieldLabelName;
          }
        }
      });
    }
  });
};
